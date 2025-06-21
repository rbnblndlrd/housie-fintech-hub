
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CalendarEvent {
  id: string
  summary: string
  start: string
  end: string
  status: string
  transparency?: string
  location?: string
}

interface AvailabilitySlot {
  start: string
  end: string
  duration: number // in minutes
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, providerId, startDate, endDate, timeZone = 'America/Montreal', proposedStart, proposedEnd } = await req.json()
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Google Calendar Events request:', { action, providerId, startDate, endDate })

    switch (action) {
      case 'getEvents':
        return await getCalendarEvents(providerId, startDate, endDate, timeZone, supabaseClient)
      
      case 'getAvailability':
        return await calculateAvailability(providerId, startDate, endDate, timeZone, supabaseClient)
      
      case 'checkConflict':
        return await checkTimeConflict(providerId, proposedStart, proposedEnd, timeZone, supabaseClient)
      
      default:
        throw new Error('Invalid action')
    }
  } catch (error) {
    console.error('Google Calendar Events error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

async function getValidAccessToken(providerId: string, supabase: any): Promise<string> {
  console.log('Getting valid access token for provider:', providerId)
  
  // Get current token
  const { data: tokenData, error } = await supabase
    .from('google_calendar_tokens')
    .select('access_token, refresh_token, expires_at')
    .eq('user_id', providerId)
    .single()

  if (error || !tokenData) {
    console.error('No calendar connection found:', error)
    throw new Error('No calendar connection found. Please connect your Google Calendar.')
  }

  // Check if token is still valid (with 5-minute buffer)
  const expiresAt = new Date(tokenData.expires_at)
  const now = new Date()
  const bufferTime = 5 * 60 * 1000 // 5 minutes

  if (expiresAt.getTime() - now.getTime() > bufferTime) {
    console.log('Token is still valid')
    return tokenData.access_token
  }

  console.log('Token expired, refreshing...')
  
  // Token is expired or close to expiring, refresh it
  const clientId = Deno.env.get('GOOGLE_CLIENT_ID')
  const clientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET')

  const refreshResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId!,
      client_secret: clientSecret!,
      refresh_token: tokenData.refresh_token,
      grant_type: 'refresh_token'
    })
  })

  const newTokens = await refreshResponse.json()

  if (newTokens.error) {
    console.error('Token refresh failed:', newTokens.error_description)
    throw new Error(`Token refresh failed: ${newTokens.error_description}`)
  }

  // Update stored token
  await supabase
    .from('google_calendar_tokens')
    .update({
      access_token: newTokens.access_token,
      expires_at: new Date(Date.now() + newTokens.expires_in * 1000).toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('user_id', providerId)

  console.log('Token refreshed successfully')
  return newTokens.access_token
}

async function getCalendarEvents(
  providerId: string, 
  startDate: string, 
  endDate: string, 
  timeZone: string,
  supabase: any
): Promise<Response> {
  
  const accessToken = await getValidAccessToken(providerId, supabase)

  // Format dates for Google Calendar API
  const timeMin = new Date(startDate).toISOString()
  const timeMax = new Date(endDate).toISOString()

  const calendarUrl = `https://www.googleapis.com/calendar/v3/calendars/primary/events?` +
    `timeMin=${encodeURIComponent(timeMin)}&` +
    `timeMax=${encodeURIComponent(timeMax)}&` +
    `timeZone=${encodeURIComponent(timeZone)}&` +
    `singleEvents=true&` +
    `orderBy=startTime&` +
    `maxResults=100`

  console.log('Fetching events from Google Calendar API')

  const response = await fetch(calendarUrl, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json'
    }
  })

  if (!response.ok) {
    const error = await response.json()
    console.error('Google Calendar API error:', error)
    throw new Error(`Google Calendar API error: ${error.error?.message || 'Unknown error'}`)
  }

  const calendarData = await response.json()
  
  // Process and filter events
  const events: CalendarEvent[] = calendarData.items
    .filter((event: any) => {
      // Filter out declined events and transparent (available) events
      return event.status !== 'cancelled' && 
             event.transparency !== 'transparent' &&
             (event.start?.dateTime || event.start?.date)
    })
    .map((event: any) => ({
      id: event.id,
      summary: event.summary || 'Busy',
      start: event.start.dateTime || event.start.date,
      end: event.end.dateTime || event.end.date,
      status: event.status,
      transparency: event.transparency,
      location: event.location
    }))

  console.log(`Found ${events.length} calendar events`)

  return new Response(
    JSON.stringify({ 
      events,
      totalEvents: events.length,
      dateRange: { start: startDate, end: endDate }
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function calculateAvailability(
  providerId: string,
  startDate: string,
  endDate: string,
  timeZone: string,
  supabase: any
): Promise<Response> {

  console.log('Calculating availability for provider:', providerId)

  // Get provider's working hours and preferences
  const { data: providerSettings } = await supabase
    .from('provider_settings')
    .select('*')
    .eq('user_id', providerId)
    .single()

  const settings = {
    workingHours: {
      monday: { start: '09:00', end: '17:00', enabled: true },
      tuesday: { start: '09:00', end: '17:00', enabled: true },
      wednesday: { start: '09:00', end: '17:00', enabled: true },
      thursday: { start: '09:00', end: '17:00', enabled: true },
      friday: { start: '09:00', end: '17:00', enabled: true },
      saturday: { start: '10:00', end: '16:00', enabled: true },
      sunday: { start: '10:00', end: '16:00', enabled: false }
    },
    defaultServiceDuration: 120, // 2 hours
    bufferTime: 15, // 15 minutes
    breakDuration: 30 // 30 minutes
  }

  // Override with provider settings if available
  if (providerSettings) {
    if (providerSettings.working_hours) {
      settings.workingHours = providerSettings.working_hours
    }
    if (providerSettings.service_duration) {
      settings.defaultServiceDuration = providerSettings.service_duration
    }
    if (providerSettings.buffer_time) {
      settings.bufferTime = providerSettings.buffer_time
    }
    if (providerSettings.break_duration) {
      settings.breakDuration = providerSettings.break_duration
    }
  }

  // Get busy events from Google Calendar
  const eventsResponse = await getCalendarEvents(providerId, startDate, endDate, timeZone, supabase)
  const eventsData = await eventsResponse.json()
  const busyEvents = eventsData.events

  // Get existing HOUSIE bookings
  const { data: housieBookings } = await supabase
    .from('bookings')
    .select('scheduled_date, scheduled_time, duration_hours, status')
    .eq('provider_id', providerId)
    .gte('scheduled_date', startDate.split('T')[0])
    .lte('scheduled_date', endDate.split('T')[0])
    .in('status', ['confirmed', 'in_progress'])

  // Combine all busy times
  const allBusyTimes = [
    ...busyEvents.map((event: CalendarEvent) => ({
      start: new Date(event.start).toISOString(),
      end: new Date(event.end).toISOString(),
      source: 'google_calendar',
      title: event.summary
    })),
    ...(housieBookings || []).map((booking: any) => {
      const bookingDate = new Date(booking.scheduled_date)
      const [hours, minutes] = booking.scheduled_time.split(':')
      bookingDate.setHours(parseInt(hours), parseInt(minutes), 0, 0)
      
      const endTime = new Date(bookingDate)
      endTime.setHours(endTime.getHours() + (booking.duration_hours || 2))
      
      return {
        start: bookingDate.toISOString(),
        end: endTime.toISOString(),
        source: 'housie_booking',
        title: 'HOUSIE Booking'
      }
    })
  ]

  // Sort busy times by start time
  allBusyTimes.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())

  // Calculate available slots
  const availableSlots: AvailabilitySlot[] = []
  const current = new Date(startDate)
  const end = new Date(endDate)

  while (current < end) {
    const dayName = current.toLocaleDateString('en-US', { weekday: 'lowercase' }) as keyof typeof settings.workingHours
    const daySettings = settings.workingHours[dayName]

    if (!daySettings.enabled) {
      current.setDate(current.getDate() + 1)
      current.setHours(0, 0, 0, 0)
      continue
    }

    // Set working hours for this day
    const dayStart = new Date(current)
    const [startHour, startMin] = daySettings.start.split(':').map(Number)
    dayStart.setHours(startHour, startMin, 0, 0)

    const dayEnd = new Date(current)
    const [endHour, endMin] = daySettings.end.split(':').map(Number)
    dayEnd.setHours(endHour, endMin, 0, 0)

    // Find available slots within working hours
    let slotStart = dayStart
    
    for (const busyTime of allBusyTimes) {
      const busyStart = new Date(busyTime.start)
      const busyEnd = new Date(busyTime.end)

      // Skip if busy time is outside current day
      if (busyEnd <= dayStart || busyStart >= dayEnd) continue

      // If there's a gap before this busy time
      if (slotStart < busyStart) {
        const availableEnd = busyStart < dayEnd ? busyStart : dayEnd
        const duration = (availableEnd.getTime() - slotStart.getTime()) / (1000 * 60)
        
        if (duration >= settings.defaultServiceDuration + settings.bufferTime) {
          availableSlots.push({
            start: slotStart.toISOString(),
            end: availableEnd.toISOString(),
            duration: Math.floor(duration)
          })
        }
      }

      // Move slot start to after this busy time (with buffer)
      slotStart = new Date(Math.max(
        busyEnd.getTime() + (settings.bufferTime * 60 * 1000),
        slotStart.getTime()
      ))
    }

    // Check for availability after last busy time until end of day
    if (slotStart < dayEnd) {
      const duration = (dayEnd.getTime() - slotStart.getTime()) / (1000 * 60)
      
      if (duration >= settings.defaultServiceDuration + settings.bufferTime) {
        availableSlots.push({
          start: slotStart.toISOString(),
          end: dayEnd.toISOString(),
          duration: Math.floor(duration)
        })
      }
    }

    // Move to next day
    current.setDate(current.getDate() + 1)
    current.setHours(0, 0, 0, 0)
  }

  console.log(`Found ${availableSlots.length} available slots`)

  return new Response(
    JSON.stringify({
      availableSlots,
      totalSlots: availableSlots.length,
      busyTimes: allBusyTimes,
      settings: {
        workingHours: settings.workingHours,
        serviceDuration: settings.defaultServiceDuration,
        bufferTime: settings.bufferTime
      }
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function checkTimeConflict(
  providerId: string,
  proposedStart: string,
  proposedEnd: string,
  timeZone: string,
  supabase: any
): Promise<Response> {

  console.log('Checking time conflict for:', { providerId, proposedStart, proposedEnd })

  const startTime = new Date(proposedStart)
  const endTime = new Date(proposedEnd)
  
  // Expand search range by 1 hour before and after to catch buffer conflicts
  const searchStart = new Date(startTime.getTime() - (60 * 60 * 1000))
  const searchEnd = new Date(endTime.getTime() + (60 * 60 * 1000))

  const eventsResponse = await getCalendarEvents(
    providerId, 
    searchStart.toISOString(), 
    searchEnd.toISOString(), 
    timeZone, 
    supabase
  )
  
  const eventsData = await eventsResponse.json()
  const conflicts = eventsData.events.filter((event: CalendarEvent) => {
    const eventStart = new Date(event.start)
    const eventEnd = new Date(event.end)
    
    // Check for any overlap
    return !(endTime <= eventStart || startTime >= eventEnd)
  })

  console.log(`Found ${conflicts.length} conflicts`)

  return new Response(
    JSON.stringify({
      hasConflict: conflicts.length > 0,
      conflicts,
      proposedTime: { start: proposedStart, end: proposedEnd }
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}
