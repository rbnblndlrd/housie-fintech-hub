import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface OptimizeClusterRequest {
  cluster_id: string
}

interface ParticipantWithPreferences {
  id: string
  user_id: string
  display_name: string
  unit_id: string | null
  preferred_time_blocks: string[] | null
}

interface TimeBlockResult {
  id: string
  block_name: string
  start_time: string
  end_time: string
  preference_count: number
}

interface RouteItem {
  unit: string
  start: string
  end: string
}

interface OptimizationResult {
  success: boolean
  summary: string
  route: RouteItem[]
  preferred_block_id: string
  confidence: 'high' | 'medium' | 'low'
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { cluster_id }: OptimizeClusterRequest = await req.json()

    if (!cluster_id) {
      throw new Error('cluster_id is required')
    }

    // Get user from auth header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      throw new Error('Invalid authorization')
    }

    // Get cluster details and validate permissions
    const { data: cluster, error: clusterError } = await supabase
      .from('clusters')
      .select('*')
      .eq('id', cluster_id)
      .single()

    if (clusterError || !cluster) {
      throw new Error('Cluster not found')
    }

    // Check if user is organizer or a provider with a bid
    const isOrganizer = cluster.organizer_id === user.id
    
    const { data: userBid, error: bidError } = await supabase
      .from('cluster_bids')
      .select('id')
      .eq('cluster_id', cluster_id)
      .eq('provider_id', user.id)
      .single()

    const isProviderWithBid = !bidError && userBid

    if (!isOrganizer && !isProviderWithBid) {
      throw new Error('Unauthorized: must be cluster organizer or provider with bid')
    }

    // Get confirmed participants with unit_id
    const { data: participants, error: participantsError } = await supabase
      .from('cluster_participants')
      .select('*')
      .eq('cluster_id', cluster_id)
      .not('unit_id', 'is', null)

    if (participantsError) {
      throw new Error('Failed to fetch participants')
    }

    if (!participants || participants.length === 0) {
      throw new Error('No confirmed participants with unit IDs found')
    }

    // Get time blocks for this cluster
    const { data: timeBlocks, error: timeBlocksError } = await supabase
      .from('cluster_time_blocks')
      .select('*')
      .eq('cluster_id', cluster_id)
      .order('preference_count', { ascending: false })

    if (timeBlocksError) {
      throw new Error('Failed to fetch time blocks')
    }

    // Calculate preference counts for each time block
    const timeBlockPreferences = timeBlocks?.map(block => {
      const preferenceCount = participants.filter(p => 
        p.preferred_time_blocks?.includes(block.block_name)
      ).length
      return {
        ...block,
        preference_count: preferenceCount
      }
    }) || []

    // Get the most preferred time block
    const mostPreferredBlock = timeBlockPreferences.reduce((prev, current) => 
      current.preference_count > prev.preference_count ? current : prev
    )

    // Sort participants by unit_id for route optimization
    const sortedParticipants = participants
      .filter(p => p.unit_id)
      .sort((a, b) => (a.unit_id || '').localeCompare(b.unit_id || ''))

    // Generate route with 45min per unit + 5min buffer
    const route: RouteItem[] = []
    let currentTime = new Date(`2000-01-01T${mostPreferredBlock.start_time}`)

    sortedParticipants.forEach((participant, index) => {
      const startTime = new Date(currentTime)
      const endTime = new Date(currentTime.getTime() + 45 * 60 * 1000) // 45 minutes

      route.push({
        unit: participant.unit_id!,
        start: startTime.toTimeString().slice(0, 5), // HH:MM format
        end: endTime.toTimeString().slice(0, 5)
      })

      // Add 5 minute buffer for next unit
      currentTime = new Date(endTime.getTime() + 5 * 60 * 1000)
    })

    // Determine confidence based on preference alignment
    const participantsWhoPreferBlock = participants.filter(p => 
      p.preferred_time_blocks?.includes(mostPreferredBlock.block_name)
    ).length
    const preferenceRatio = participantsWhoPreferBlock / participants.length
    
    let confidence: 'high' | 'medium' | 'low'
    if (preferenceRatio >= 0.8) confidence = 'high'
    else if (preferenceRatio >= 0.5) confidence = 'medium'
    else confidence = 'low'

    const optimization: OptimizationResult = {
      success: true,
      summary: `Suggested ${mostPreferredBlock.start_time}–${mostPreferredBlock.end_time} based on participant preferences`,
      route,
      preferred_block_id: mostPreferredBlock.id,
      confidence
    }

    // Store optimization result in cluster
    const { error: updateError } = await supabase
      .from('clusters')
      .update({ housie_optimization: optimization })
      .eq('id', cluster_id)

    if (updateError) {
      console.error('Failed to store optimization:', updateError)
      // Don't throw, still return the result
    }

    return new Response(JSON.stringify(optimization), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Error in optimize-cluster function:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})