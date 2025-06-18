
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
      const { data, error } = await supabase
        .from('calendar_appointments')
        .select('*')
        .eq('user_id', user.id)
        .order('scheduled_date', { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les rendez-vous.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const createAppointment = async (appointmentData: Omit<CalendarAppointment, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('calendar_appointments')
        .insert({
          ...appointmentData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      setAppointments(prev => [...prev, data]);
      toast({
        title: "Succès",
        description: "Rendez-vous créé avec succès.",
      });

      return data;
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le rendez-vous.",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateAppointment = async (id: string, updates: Partial<CalendarAppointment>) => {
    try {
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

      setAppointments(prev => 
        prev.map(app => app.id === id ? data : app)
      );

      toast({
        title: "Succès",
        description: "Rendez-vous mis à jour.",
      });

      return data;
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le rendez-vous.",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteAppointment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('calendar_appointments')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAppointments(prev => prev.filter(app => app.id !== id));
      toast({
        title: "Succès",
        description: "Rendez-vous supprimé.",
      });
    } catch (error) {
      console.error('Error deleting appointment:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le rendez-vous.",
        variant: "destructive",
      });
    }
  };

  // Set up real-time subscription for appointment changes
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('calendar-appointments-sync')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'calendar_appointments',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          // Refresh appointments when changes occur
          fetchAppointments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchAppointments]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  return {
    appointments,
    loading,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    refreshAppointments: fetchAppointments
  };
};
