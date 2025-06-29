
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

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
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

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
      return newAppointment;
    } catch (error) {
      console.error('Error creating appointment:', error);
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

      return updatedAppointment;
    } catch (error) {
      console.error('Error updating appointment:', error);
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
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  };

  // Simple data fetching on mount - no subscriptions here to avoid conflicts
  useEffect(() => {
    if (user?.id) {
      fetchAppointments();
    } else {
      setAppointments([]);
    }
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
