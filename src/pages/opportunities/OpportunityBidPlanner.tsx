import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import VideoBackground from '@/components/common/VideoBackground';
import OpportunityBidPlanner from '@/components/opportunities/OpportunityBidPlanner';

interface ServiceSlot {
  id: string;
  service_type: string;
  title?: string;
}

const OpportunityBidPlannerPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [opportunity, setOpportunity] = useState<any>(null);
  const [serviceSlots, setServiceSlots] = useState<ServiceSlot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && user) {
      fetchOpportunityData();
    }
  }, [id, user]);

  const fetchOpportunityData = async () => {
    try {
      setLoading(true);

      // Fetch opportunity
      const { data: oppData, error: oppError } = await supabase
        .from('opportunities')
        .select('*')
        .eq('id', id)
        .single();

      if (oppError) throw oppError;

      // Fetch service slots
      const { data: slotsData, error: slotsError } = await supabase
        .from('opportunity_service_slots')
        .select('*')
        .eq('opportunity_id', id);

      if (slotsError) throw slotsError;

      setOpportunity(oppData);
      setServiceSlots(slotsData || []);
    } catch (error) {
      console.error('Error fetching opportunity data:', error);
      toast({
        title: "Error",
        description: "Failed to load opportunity details.",
        variant: "destructive"
      });
      navigate('/crews/opportunities');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    navigate('/auth');
    return null;
  }

  if (loading) {
    return (
      <>
        <VideoBackground />
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </>
    );
  }

  if (!opportunity) {
    return (
      <>
        <VideoBackground />
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-xl font-semibold mb-2">Opportunity Not Found</h2>
            <p className="text-white/80 mb-4">The opportunity you're looking for doesn't exist.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <VideoBackground />
      <div className="relative z-10">
        <OpportunityBidPlanner
          opportunityId={opportunity.id}
          serviceSlots={serviceSlots}
          onClose={() => navigate('/crews/opportunities')}
          onSuccess={() => {
            toast({
              title: "Bid Submitted",
              description: "Your crew's bid has been submitted successfully.",
            });
            navigate('/crews/bids');
          }}
        />
      </div>
    </>
  );
};

export default OpportunityBidPlannerPage;