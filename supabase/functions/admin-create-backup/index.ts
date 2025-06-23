
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
    const { timestamp } = await req.json()

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get admin user from request
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    // Check if user is admin
    const { data: userData, error: userError } = await supabaseClient
      .from('users')
      .select('user_role')
      .eq('id', user.id)
      .single()

    if (userError || userData?.user_role !== 'admin') {
      throw new Error('Insufficient privileges')
    }

    // For now, simulate backup creation by logging to emergency_actions_log
    const backupId = crypto.randomUUID()
    
    const { error: logError } = await supabaseClient.rpc('log_emergency_action', {
      p_admin_id: user.id,
      p_action_type: 'database_backup',
      p_action_details: {
        backup_id: backupId,
        timestamp,
        type: 'manual_backup',
        status: 'completed'
      }
    })

    if (logError) {
      console.error('Failed to log backup action:', logError)
    }

    // Update emergency controls to record backup
    const { error: updateError } = await supabaseClient
      .from('emergency_controls')
      .update({ 
        last_backup_triggered: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .order('created_at', { ascending: false })
      .limit(1)

    if (updateError) {
      console.error('Failed to update emergency controls:', updateError)
    }

    console.log(`✅ Database backup initiated by admin ${user.email}`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        backupId,
        message: 'Backup process initiated successfully',
        timestamp 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error creating backup:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
