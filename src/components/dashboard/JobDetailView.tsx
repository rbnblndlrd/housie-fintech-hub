import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  ArrowLeft, 
  Phone, 
  MapPin, 
  Bot,
  Check,
  Clock,
  MessageSquare,
  X
} from 'lucide-react';

interface JobDetailViewProps {
  job: {
    time: string;
    service: string;
    customer: string;
    phone: string;
    address: string;
    status: string;
  };
  onBack: () => void;
}

const JobDetailView: React.FC<JobDetailViewProps> = ({ job, onBack }) => {
  const [showAnalysis, setShowAnalysis] = useState(false);
  const isMobile = useIsMobile();

  const handleParseWithAI = () => {
    setShowAnalysis(true);
  };

  const jobContent = (
    <>
      {/* Header Section */}
      <div className={`${isMobile ? 'sticky top-0 bg-white border-b border-gray-200 p-4' : 'pb-4'}`}>
        <div className="flex items-center gap-3 mb-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="p-2"
          >
            {isMobile ? <ArrowLeft className="h-5 w-5" /> : <X className="h-5 w-5" />}
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-800">{job.service}</h1>
            <div className="text-2xl font-bold text-orange-600">{job.time}</div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Customer Info Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-lg font-semibold text-gray-800">{job.customer}</div>
              <div className="text-gray-600">{job.phone}</div>
              <div className="text-gray-600 flex items-center gap-1 mt-1">
                <MapPin className="h-4 w-4" />
                {job.address}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Status:</span>
              <Badge 
                className={
                  job.status === 'Emergency' ? 'bg-red-100 text-red-800' :
                  job.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                  'bg-yellow-100 text-yellow-800'
                }
              >
                {job.status}
              </Badge>
            </div>

            <div className="flex gap-3">
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                <Phone className="h-4 w-4 mr-2" />
                📞 Call
              </Button>
              <Button variant="outline" className="flex-1">
                <MapPin className="h-4 w-4 mr-2" />
                🗺️ Navigate
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* AI Analysis Section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Bot className="h-5 w-5 text-blue-600" />
              AI Job Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!showAnalysis ? (
              <Button 
                onClick={handleParseWithAI}
                className="w-full h-14 text-lg font-semibold bg-blue-600 hover:bg-blue-700"
              >
                <Bot className="h-6 w-6 mr-3" />
                🤖 Parse with AI
              </Button>
            ) : (
              <div className="space-y-4">
                {/* What you tried */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">What you tried:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Replaced thermostat unit</li>
                    <li>• Checked wiring connections</li>
                    <li>• Tested gas line pressure</li>
                  </ul>
                </div>

                {/* Next steps */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Next steps:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Check main control board</li>
                    <li>• Bring multimeter + spare board</li>
                    <li>• Test ignition sequence</li>
                  </ul>
                </div>

                {/* Customer reminders */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Customer reminders:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Large dog - use front door</li>
                    <li>• Narrow basement stairs</li>
                    <li>• Prefers after 2 PM</li>
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3 pb-6">
          <Button className="w-full h-14 text-lg font-semibold bg-green-600 hover:bg-green-700">
            <Check className="h-6 w-6 mr-3" />
            ✓ Mark Complete
          </Button>
          
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-12 text-base font-semibold">
              <Clock className="h-5 w-5 mr-2" />
              ⏰ Reschedule
            </Button>
            <Button variant="outline" className="h-12 text-base font-semibold">
              <MessageSquare className="h-5 w-5 mr-2" />
              💬 Ask Claude
            </Button>
          </div>
        </div>
      </div>
    </>
  );

  if (isMobile) {
    // Mobile: Full-screen experience
    return (
      <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
        {jobContent}
      </div>
    );
  }

  // Desktop: Modal experience
  return (
    <Dialog open={true} onOpenChange={onBack}>
      <DialogContent className="max-w-2xl w-[70%] max-h-[80vh] overflow-y-auto p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Job Details</DialogTitle>
        </DialogHeader>
        {jobContent}
      </DialogContent>
    </Dialog>
  );
};

export default JobDetailView;