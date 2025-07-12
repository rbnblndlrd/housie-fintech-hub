import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CheckCircle, XCircle, AlertCircle, Camera, FileCheck, Eye } from 'lucide-react';

const SmartVerificationReview = () => {
  const [selectedVerification, setSelectedVerification] = useState<any>(null);

  // Mock verification data - in real app this would come from photo verification records
  const verificationHistory = [
    {
      id: '1',
      jobId: 'job-123',
      serviceName: 'Deep House Cleaning',
      provider: 'Jean Dubois',
      date: '2024-01-15',
      status: 'verified',
      totalItems: 8,
      completedItems: 8,
      photos: [
        { id: '1', url: '/photos/before-1.jpg', type: 'before', item: 'Kitchen Counter' },
        { id: '2', url: '/photos/after-1.jpg', type: 'after', item: 'Kitchen Counter' }
      ],
      annetteNotes: 'Photo metadata checks out perfectly. This provider really knows their stuff! ✨'
    },
    {
      id: '2',
      jobId: 'job-124',
      serviceName: 'Garden Maintenance',
      provider: 'Marie Tremblay',
      date: '2024-01-08',
      status: 'partial',
      totalItems: 6,
      completedItems: 5,
      photos: [
        { id: '3', url: '/photos/garden-1.jpg', type: 'after', item: 'Lawn Trimming' }
      ],
      annetteNotes: 'Most tasks verified, but one photo was missing timestamp metadata. Still solid work!'
    },
    {
      id: '3',
      jobId: 'job-125',
      serviceName: 'Window Cleaning',
      provider: 'Pierre Gagnon',
      date: '2023-12-20',
      status: 'failed',
      totalItems: 4,
      completedItems: 2,
      photos: [],
      annetteNotes: 'Incomplete verification - missing photos for several checklist items.'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'partial': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'partial': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <Card className="fintech-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Photo Verification History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {verificationHistory.length === 0 ? (
            <div className="text-center py-6">
              <FileCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">No verification records yet</p>
              <p className="text-sm text-muted-foreground">
                Photo verification will appear here after completed jobs
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {verificationHistory.map((verification) => (
                <div key={verification.id} className="fintech-inner-box p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(verification.status)}
                      <div>
                        <h3 className="font-medium">{verification.serviceName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {verification.provider} • {new Date(verification.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(verification.status)}>
                      {verification.status}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      {verification.completedItems}/{verification.totalItems} items verified
                      {verification.photos.length > 0 && (
                        <span> • {verification.photos.length} photos</span>
                      )}
                    </div>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedVerification(verification)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="fintech-card max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Verification Details</DialogTitle>
                        </DialogHeader>
                        {selectedVerification && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">Service</label>
                                <p>{selectedVerification.serviceName}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">Provider</label>
                                <p>{selectedVerification.provider}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">Date</label>
                                <p>{new Date(selectedVerification.date).toLocaleDateString()}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">Status</label>
                                <div className="flex items-center gap-2">
                                  {getStatusIcon(selectedVerification.status)}
                                  <Badge className={getStatusColor(selectedVerification.status)}>
                                    {selectedVerification.status}
                                  </Badge>
                                </div>
                              </div>
                            </div>

                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Verification Progress</label>
                              <p>{selectedVerification.completedItems}/{selectedVerification.totalItems} checklist items verified</p>
                            </div>

                            {selectedVerification.photos.length > 0 && (
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">Photos</label>
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                  {selectedVerification.photos.map((photo: any) => (
                                    <div key={photo.id} className="fintech-inner-box p-2">
                                      <div className="aspect-video bg-muted rounded-lg mb-2 flex items-center justify-center">
                                        <Camera className="h-8 w-8 text-muted-foreground" />
                                      </div>
                                      <p className="text-xs font-medium">{photo.item}</p>
                                      <p className="text-xs text-muted-foreground capitalize">{photo.type}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {selectedVerification.annetteNotes && (
                              <div className="fintech-inner-box p-3 border-l-4 border-primary">
                                <label className="text-sm font-medium text-muted-foreground">Annette's Notes</label>
                                <p className="text-sm mt-1">{selectedVerification.annetteNotes}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default SmartVerificationReview;