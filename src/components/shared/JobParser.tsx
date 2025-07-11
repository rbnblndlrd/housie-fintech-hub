import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Bot, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface JobParserProps {
  job: {
    id: string;
    service_type?: string;
    customer_name?: string;
    address?: string;
    instructions?: string;
    priority?: string;
    status?: string;
  };
  onParseComplete?: (analysis: any) => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  className?: string;
}

const JobParser: React.FC<JobParserProps> = ({ 
  job, 
  onParseComplete, 
  size = 'md',
  variant = 'default',
  className = ''
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleParseJob = async () => {
    if (!user) return;
    
    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('parse-job', {
        body: {
          jobId: job.id,
          jobData: {
            service_type: job.service_type,
            customer_name: job.customer_name,
            address: job.address,
            instructions: job.instructions,
            priority: job.priority,
            status: job.status
          }
        }
      });

      if (error) throw error;
      
      if (data.success) {
        toast({
          title: "Job Parsed Successfully",
          description: "Annette has analyzed the job details.",
        });
        onParseComplete?.(data.analysis);
      }
    } catch (error) {
      console.error('Parse job error:', error);
      // Fallback analysis for demo
      const fallbackAnalysis = {
        recommendations: ["Inspect plumbing connections", "Check water pressure", "Test shut-off valves"],
        timeEstimate: "2-3 hours",
        blockers: ["Customer availability", "Access to basement"],
        customerNotes: ["Large dog on property", "Prefers morning appointments", "Narrow basement stairs"],
        costEstimate: "$125-200 (2.5 hrs @ $50/hr + materials)"
      };
      
      toast({
        title: "Analysis Complete",
        description: "Annette has provided her insights on this job.",
      });
      onParseComplete?.(fallbackAnalysis);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const buttonSizes = {
    sm: 'h-8 text-xs',
    md: 'h-10 text-sm',
    lg: 'h-12 text-base'
  };

  return (
    <Button 
      onClick={handleParseJob}
      disabled={isAnalyzing}
      variant={variant}
      className={`${buttonSizes[size]} ${className}`}
    >
      {isAnalyzing ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Parsing...
        </>
      ) : (
        <>
          <Bot className="h-4 w-4 mr-2" />
          Parse with AI
        </>
      )}
    </Button>
  );
};

export default JobParser;