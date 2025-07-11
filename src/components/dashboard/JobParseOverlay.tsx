import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ArrowLeft, 
  Bot,
  Loader2,
  Clock,
  AlertTriangle,
  User,
  DollarSign,
  CheckCircle,
  X
} from 'lucide-react';
import { toast } from 'sonner';

interface JobData {
  id: string;
  service_type: string;
  customer_name: string;
  address: string;
  instructions?: string;
  priority: string;
  status: string;
  phone?: string;
  scheduled_date?: string;
  scheduled_time?: string;
}

interface AIAnalysis {
  recommendations: string[];
  timeEstimate: string;
  blockers: string[];
  customerNotes: string[];
  costEstimate: string;
}

interface JobParseOverlayProps {
  job: JobData;
  isOpen: boolean;
  onClose: () => void;
}

const JobParseOverlay: React.FC<JobParseOverlayProps> = ({ job, isOpen, onClose }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [whatYouTried, setWhatYouTried] = useState('');
  const [nextSteps, setNextSteps] = useState('');
  const [reminders, setReminders] = useState('');
  const isMobile = useIsMobile();
  const { user } = useAuth();

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
        setAnalysis(data.analysis);
        // Pre-populate editable fields with AI suggestions
        setNextSteps(data.analysis.recommendations.join('\n• '));
        setReminders(data.analysis.customerNotes.join('\n• '));
      }
    } catch (error) {
      console.error('Parse job error:', error);
      // Fallback analysis for demo
      setAnalysis({
        recommendations: ["Inspect plumbing connections", "Check water pressure", "Test shut-off valves"],
        timeEstimate: "2-3 hours",
        blockers: ["Customer availability", "Access to basement"],
        customerNotes: ["Large dog on property", "Prefers morning appointments", "Narrow basement stairs"],
        costEstimate: "$125-200 (2.5 hrs @ $50/hr + materials)"
      });
      setNextSteps("Inspect plumbing connections\n• Check water pressure\n• Test shut-off valves");
      setReminders("Large dog on property\n• Prefers morning appointments\n• Narrow basement stairs");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveAndSchedule = async () => {
    if (!user || !analysis) return;
    
    setIsSaving(true);
    
    try {
      // Get tomorrow's date as default
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const scheduledDate = tomorrow.toISOString().split('T')[0];
      const scheduledTime = '09:00';

      // Create calendar appointment
      const { error: calendarError } = await supabase
        .from('calendar_appointments')
        .insert({
          user_id: user.id,
          title: `${job.service_type} - ${job.customer_name}`,
          client_name: job.customer_name,
          scheduled_date: scheduledDate,
          scheduled_time: scheduledTime,
          location: job.address,
          appointment_type: 'service',
          notes: `AI Analysis: ${analysis.timeEstimate}\nNext Steps: ${nextSteps}\nReminders: ${reminders}`,
          amount: parseFloat(analysis.costEstimate.replace(/[^0-9.-]+/g, '')) || 0,
          status: 'confirmed'
        });

      if (calendarError) throw calendarError;

      toast.success('Job scheduled successfully! Added to your calendar for tomorrow at 9:00 AM.');
      onClose();
    } catch (error) {
      console.error('Schedule job error:', error);
      toast.error('Failed to schedule job. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const overlayContent = (
    <div className="space-y-6">
      {/* Job Info Header */}
      <div className="border-b pb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-gray-800">{job.service_type}</h2>
          <Badge className={getPriorityColor(job.priority)}>{job.priority}</Badge>
        </div>
        <p className="text-gray-600">{job.customer_name} • {job.address}</p>
        {job.scheduled_date && (
          <p className="text-sm text-gray-500 mt-1">
            {job.scheduled_date} at {job.scheduled_time}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Raw Job Info */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4" />
                Job Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="font-medium">Customer:</span>
                <p className="text-gray-600">{job.customer_name}</p>
                {job.phone && <p className="text-sm text-gray-500">{job.phone}</p>}
              </div>
              <div>
                <span className="font-medium">Address:</span>
                <p className="text-gray-600">{job.address}</p>
              </div>
              {job.instructions && (
                <div>
                  <span className="font-medium">Instructions:</span>
                  <p className="text-gray-600 text-sm">{job.instructions}</p>
                </div>
              )}
              <div>
                <span className="font-medium">Status:</span>
                <Badge className="ml-2">{job.status}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* What You Tried */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">What you tried:</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Describe previous attempts or solutions tried..."
                value={whatYouTried}
                onChange={(e) => setWhatYouTried(e.target.value)}
                className="min-h-[100px]"
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - AI Analysis */}
        <div className="space-y-4">
          {!analysis ? (
            <Card className="border-dashed border-2 border-primary/20">
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Bot className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">AI-Powered Job Preparation</h3>
                <p className="text-gray-600 text-center mb-4 text-sm">
                  Get Annette's analysis with recommended actions, time estimates, and insights
                </p>
                <Button 
                  onClick={handleParseJob}
                  disabled={isAnalyzing}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Bot className="h-4 w-4 mr-2" />
                      🧠 Parse with AI
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* AI Analysis Results */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Bot className="h-4 w-4 text-primary" />
                    Annette's Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span>{analysis.timeEstimate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-green-500" />
                      <span>{analysis.costEstimate}</span>
                    </div>
                  </div>
                  
                  {analysis.blockers.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 text-sm font-medium mb-2">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        Potential Blockers:
                      </div>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {analysis.blockers.map((blocker, index) => (
                          <li key={index}>• {blocker}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Next Steps */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Next Steps:</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="AI-suggested next steps..."
                    value={nextSteps}
                    onChange={(e) => setNextSteps(e.target.value)}
                    className="min-h-[100px]"
                  />
                </CardContent>
              </Card>

              {/* Customer Reminders */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Customer Reminders:</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Important customer notes and reminders..."
                    value={reminders}
                    onChange={(e) => setReminders(e.target.value)}
                    className="min-h-[80px]"
                  />
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t">
        <Button variant="outline" onClick={onClose} className="flex-1">
          Back to List
        </Button>
        {analysis && (
          <Button 
            onClick={handleSaveAndSchedule}
            disabled={isSaving}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Scheduling...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Save & Schedule
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="bottom" className="h-[95vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-left flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              AI-Powered Job Preparation
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            {overlayContent}
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-[90vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            AI-Powered Job Preparation
          </DialogTitle>
        </DialogHeader>
        {overlayContent}
      </DialogContent>
    </Dialog>
  );
};

export default JobParseOverlay;