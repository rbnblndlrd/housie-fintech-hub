
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { type, count = 10 } = await req.json()

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    if (type === 'users') {
      const testUsers = []
      for (let i = 0; i < count; i++) {
        testUsers.push({
          email: `testuser_${Date.now()}_${i}@example.com`,
          full_name: `Test User ${i + 1}`,
          phone: `+1-555-${String(Math.floor(Math.random() * 9000) + 1000)}`,
          city: ['Montreal', 'Quebec', 'Gatineau', 'Sherbrooke'][Math.floor(Math.random() * 4)],
          province: 'QC',
          postal_code: `H${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)} ${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}`,
          user_role: Math.random() > 0.7 ? 'provider' : 'seeker',
          subscription_tier: 'free'
        })
      }

      const { data, error } = await supabaseClient
        .from('users')
        .insert(testUsers)
        .select()

      if (error) throw error

      return new Response(
        JSON.stringify({ success: true, created: data.length }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (type === 'bookings') {
      // First get some users to create bookings for
      const { data: users } = await supabaseClient
        .from('users')
        .select('id')
        .limit(20)

      if (!users || users.length < 2) {
        throw new Error('Need at least 2 users to create test bookings')
      }

      const testBookings = []
      for (let i = 0; i < count; i++) {
        const customerIndex = Math.floor(Math.random() * users.length)
        let providerIndex = Math.floor(Math.random() * users.length)
        // Ensure customer and provider are different
        while (providerIndex === customerIndex) {
          providerIndex = Math.floor(Math.random() * users.length)
        }

        const futureDate = new Date()
        futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 30) + 1)

        testBookings.push({
          customer_id: users[customerIndex].id,
          provider_id: users[providerIndex].id,
          service_id: crypto.randomUUID(), // Temporary UUID
          scheduled_date: futureDate.toISOString().split('T')[0],
          scheduled_time: `${9 + Math.floor(Math.random() * 8)}:00:00`,
          duration_hours: [1, 2, 3, 4][Math.floor(Math.random() * 4)],
          total_amount: (50 + Math.random() * 200).toFixed(2),
          service_address: `${Math.floor(Math.random() * 9999) + 1} Test Street, Montreal, QC`,
          instructions: `TEST BOOKING ${i + 1} - This is a test booking created by admin`,
          status: ['pending', 'confirmed', 'completed'][Math.floor(Math.random() * 3)],
          payment_status: ['pending', 'succeeded', 'failed'][Math.floor(Math.random() * 3)]
        })
      }

      const { data, error } = await supabaseClient
        .from('bookings')
        .insert(testBookings)
        .select()

      if (error) throw error

      return new Response(
        JSON.stringify({ success: true, created: data.length }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (type === 'providers') {
      // Get some users to make into providers
      const { data: users } = await supabaseClient
        .from('users')
        .select('id')
        .eq('user_role', 'provider')
        .limit(count)

      if (!users || users.length === 0) {
        throw new Error('No provider users found to create profiles for')
      }

      const testProfiles = users.map((user, i) => ({
        user_id: user.id,
        business_name: `Test Business ${i + 1}`,
        description: `This is a test provider profile ${i + 1} created by admin`,
        years_experience: Math.floor(Math.random() * 10) + 1,
        hourly_rate: (25 + Math.random() * 75).toFixed(2),
        service_radius_km: [10, 25, 50][Math.floor(Math.random() * 3)],
        verified: Math.random() > 0.5,
        total_bookings: Math.floor(Math.random() * 50),
        average_rating: (3 + Math.random() * 2).toFixed(1)
      }))

      const { data, error } = await supabaseClient
        .from('provider_profiles')
        .insert(testProfiles)
        .select()

      if (error) throw error

      return new Response(
        JSON.stringify({ success: true, created: data.length }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Invalid type. Use: users, bookings, or providers' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error generating test data:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
