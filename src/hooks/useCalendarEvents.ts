
import { useState, useCallback } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

export interface CalendarEvent {
  id: string
  summary: string
  start: string
  end: string
  status: string
  location?: string
}

export interface AvailabilitySlot {
  start: string
  end: string
  duration: number
}

export const useCalendarEvents = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const fetchEvents = useCallback(async (providerId: string, startDate: string, endDate: string) => {
    setLoading(true)
    try {
      const { data, error } = await supabase.functions.invoke('google-calendar-events', {
        body: { 
          action: 'getEvents',
          providerId,
          startDate,
          endDate,
          timeZone: 'America/Montreal'
        }
      })

      if (error) throw error

      setEvents(data.events || [])
      return data.events
    } catch (error) {
      console.error('Error fetching calendar events:', error)
      toast({
        title: "Calendar Sync Error",
        description: "Unable to fetch calendar events. Please check your connection.",
        variant: "destructive"
      })
      return []
    } finally {
      setLoading(false)
    }
  }, [toast])

  const fetchAvailability = useCallback(async (providerId: string, startDate: string, endDate: string) => {
    setLoading(true)
    try {
      const { data, error } = await supabase.functions.invoke('google-calendar-events', {
        body: { 
          action: 'getAvailability',
          providerId,
          startDate,
          endDate,
          timeZone: 'America/Montreal'
        }
      })

      if (error) throw error

      setAvailability(data.availableSlots || [])
      return data
    } catch (error) {
      console.error('Error fetching availability:', error)
      toast({
        title: "Availability Error",
        description: "Unable to calculate availability. Please try again.",
        variant: "destructive"
      })
      return { availableSlots: [], busyTimes: [] }
    } finally {
      setLoading(false)
    }
  }, [toast])

  const checkConflict = useCallback(async (
    providerId: string, 
    proposedStart: string, 
    proposedEnd: string
  ) => {
    try {
      const { data, error } = await supabase.functions.invoke('google-calendar-events', {
        body: { 
          action: 'checkConflict',
          providerId,
          proposedStart,
          proposedEnd,
          timeZone: 'America/Montreal'
        }
      })

      if (error) throw error

      return data
    } catch (error) {
      console.error('Error checking conflict:', error)
      return { hasConflict: true, conflicts: [] }
    }
  }, [])

  return {
    events,
    availability,
    loading,
    fetchEvents,
    fetchAvailability,
    checkConflict
  }
}
