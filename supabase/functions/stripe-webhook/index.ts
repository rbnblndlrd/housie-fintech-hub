
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2023-10-16",
});

const endpointSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") || "";

serve(async (req) => {
  const signature = req.headers.get("stripe-signature");
  
  if (!signature) {
    return new Response("No signature provided", { status: 400 });
  }

  try {
    const body = await req.text();
    const event = stripe.webhooks.constructEvent(body, signature, endpointSecret);

    console.log(`Received webhook event: ${event.type}`);

    // Create Supabase service client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log(`Checkout completed for session: ${session.id}`);

        // Get booking from metadata
        const bookingId = session.metadata?.booking_id;
        if (!bookingId) {
          console.error("No booking_id found in session metadata");
          break;
        }

        // Update booking status to paid and confirmed
        const { error: updateError } = await supabase
          .from("bookings")
          .update({
            payment_status: "paid",
            status: "confirmed",
            updated_at: new Date().toISOString(),
          })
          .eq("id", bookingId);

        if (updateError) {
          console.error("Error updating booking:", updateError);
          break;
        }

        // Get booking details for fee calculation
        const { data: booking, error: bookingError } = await supabase
          .from("bookings")
          .select(`
            *,
            provider:provider_profiles(
              id,
              user_id,
              business_name
            )
          `)
          .eq("id", bookingId)
          .single();

        if (bookingError || !booking) {
          console.error("Error fetching booking:", bookingError);
          break;
        }

        // Calculate HOUSIE fee (6%) and provider payout (94%)
        const totalAmount = booking.total_amount || 0;
        const houseFee = totalAmount * 0.06;
        const providerPayout = totalAmount * 0.94;

        console.log(`Booking ${bookingId}: Total=${totalAmount}, HOUSIE Fee=${houseFee}, Provider Payout=${providerPayout}`);

        // Create notification for customer
        await supabase.from("notifications").insert({
          user_id: booking.customer_id,
          title: "Paiement confirmé",
          message: "Votre paiement a été traité avec succès. Votre réservation est confirmée!",
          type: "payment_success",
          booking_id: bookingId,
        });

        // Create notification for provider
        if (booking.provider?.user_id) {
          await supabase.from("notifications").insert({
            user_id: booking.provider.user_id,
            title: "Nouvelle réservation",
            message: `Vous avez reçu une nouvelle réservation confirmée. Montant: ${providerPayout.toFixed(2)}$ CAD`,
            type: "booking_received",
            booking_id: bookingId,
          });
        }

        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`Payment failed for intent: ${paymentIntent.id}`);

        // Find booking by payment intent and update status
        const { error: updateError } = await supabase
          .from("bookings")
          .update({
            payment_status: "failed",
            status: "cancelled",
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_payment_intent_id", paymentIntent.id);

        if (updateError) {
          console.error("Error updating failed payment:", updateError);
        }

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(`Webhook error: ${error.message}`, { status: 400 });
  }
});
