
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface CalendarAppointment {
  id: string;
  title: string;
  scheduled_date: string;
  scheduled_time: string;
  client_name: string;
  location: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  amount: number;
  notes?: string;
  appointment_type: 'personal' | 'service';
  created_at: string;
  updated_at: string;
}

export const useCalendarAppointments = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<CalendarAppointment[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAppointments = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      console.log('Fetching appointments for user:', user.id);
      const { data, error } = await supabase
        .from('calendar_appointments')
        .select('*')
        .eq('user_id', user.id)
        .order('scheduled_date', { ascending: true });

      if (error) throw error;
      
      // Type cast the data to match our interface
      const typedAppointments: CalendarAppointment[] = (data || []).map(item => ({
        id: item.id,
        title: item.title,
        scheduled_date: item.scheduled_date,
        scheduled_time: item.scheduled_time,
        client_name: item.client_name,
        location: item.location || '',
        status: item.status as 'pending' | 'confirmed' | 'completed' | 'cancelled',
        amount: Number(item.amount) || 0,
        notes: item.notes,
        appointment_type: item.appointment_type as 'personal' | 'service',
        created_at: item.created_at,
        updated_at: item.updated_at
      }));
      
      console.log('Fetched appointments:', typedAppointments.length);
      setAppointments(typedAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast({
        title: "Error",
        description: "Unable to load appointments.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const createAppointment = async (appointmentData: Omit<CalendarAppointment, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) return null;

    try {
      console.log('Creating appointment:', appointmentData);
      const { data, error } = await supabase
        .from('calendar_appointments')
        .insert({
          ...appointmentData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      const newAppointment: CalendarAppointment = {
        id: data.id,
        title: data.title,
        scheduled_date: data.scheduled_date,
        scheduled_time: data.scheduled_time,
        client_name: data.client_name,
        location: data.location || '',
        status: data.status as 'pending' | 'confirmed' | 'completed' | 'cancelled',
        amount: Number(data.amount) || 0,
        notes: data.notes,
        appointment_type: data.appointment_type as 'personal' | 'service',
        created_at: data.created_at,
        updated_at: data.updated_at
      };

      setAppointments(prev => [...prev, newAppointment]);
      toast({
        title: "Success",
        description: "Appointment created successfully.",
      });

      return newAppointment;
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast({
        title: "Error",
        description: "Unable to create appointment.",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateAppointment = async (id: string, updates: Partial<CalendarAppointment>) => {
    try {
      console.log('Updating appointment:', id, updates);
      const { data, error } = await supabase
        .from('calendar_appointments')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const updatedAppointment: CalendarAppointment = {
        id: data.id,
        title: data.title,
        scheduled_date: data.scheduled_date,
        scheduled_time: data.scheduled_time,
        client_name: data.client_name,
        location: data.location || '',
        status: data.status as 'pending' | 'confirmed' | 'completed' | 'cancelled',
        amount: Number(data.amount) || 0,
        notes: data.notes,
        appointment_type: data.appointment_type as 'personal' | 'service',
        created_at: data.created_at,
        updated_at: data.updated_at
      };

      setAppointments(prev => 
        prev.map(app => app.id === id ? updatedAppointment : app)
      );

      toast({
        title: "Success",
        description: "Appointment updated.",
      });

      return updatedAppointment;
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast({
        title: "Error",
        description: "Unable to update appointment.",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteAppointment = async (id: string) => {
    try {
      console.log('Deleting appointment:', id);
      const { error } = await supabase
        .from('calendar_appointments')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAppointments(prev => prev.filter(app => app.id !== id));
      toast({
        title: "Success",
        description: "Appointment deleted.",
      });
    } catch (error) {
      console.error('Error deleting appointment:', error);
      toast({
        title: "Error",
        description: "Unable to delete appointment.",
        variant: "destructive",
      });
    }
  };

  // Set up data fetching and real-time subscription
  useEffect(() => {
    if (!user?.id) {
      setAppointments([]);
      return;
    }

    // Initial fetch
    fetchAppointments();

    // Set up real-time subscription with proper cleanup
    let channel: any = null;
    
    const setupSubscription = () => {
      // Generate a unique channel name to avoid conflicts
      const channelName = `calendar-appointments-${user.id}-${Date.now()}`;
      console.log('Setting up calendar subscription:', channelName);
      
      channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'calendar_appointments',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            console.log('Calendar appointment change detected:', payload);
            // Refresh appointments when changes occur
            fetchAppointments();
          }
        )
        .subscribe((status) => {
          console.log('Calendar subscription status:', status);
        });
    };

    // Small delay to ensure proper initialization
    const timeoutId = setTimeout(setupSubscription, 100);

    return () => {
      console.log('Cleaning up calendar appointments subscription');
      clearTimeout(timeoutId);
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [user?.id, fetchAppointments]);

  return {
    appointments,
    loading,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    refreshAppointments: fetchAppointments
  };
};
