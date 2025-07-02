import { useState, useCallback } from 'react';

export interface Job {
  id: string;
  title: string;
  serviceType: string;
  customerName: string;
  location: string;
  address: string;
  estimatedDuration: number;
  amount: number;
  priority: 'low' | 'medium' | 'high' | 'emergency';
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed';
  scheduledTime: string;
  coordinates?: { lat: number; lng: number };
}

export interface JobExecutionPhase {
  id: string;
  name: string;
  requirements: PhotoRequirement[];
  completed: boolean;
  unlocked: boolean;
}

export interface PhotoRequirement {
  id: string;
  type: 'photo' | 'signature';
  label: string;
  required: boolean;
  completed: boolean;
  file?: File;
  thumbnail?: string;
}

export const useRouteOptimizer = () => {
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [executionMode, setExecutionMode] = useState<boolean>(false);
  const [phases, setPhases] = useState<JobExecutionPhase[]>([
    {
      id: 'phase1',
      name: 'Pre-Work Documentation',
      unlocked: true,
      completed: false,
      requirements: [
        { id: 'before-photo', type: 'photo', label: 'Before photo', required: true, completed: false },
        { id: 'equipment-photo', type: 'photo', label: 'Equipment setup', required: true, completed: false },
        { id: 'work-order', type: 'signature', label: 'Work order signed', required: true, completed: false }
      ]
    },
    {
      id: 'phase2',
      name: 'Work Completion',
      unlocked: false,
      completed: false,
      requirements: [
        { id: 'after-photo', type: 'photo', label: 'After photo', required: true, completed: false },
        { id: 'completion-signature', type: 'signature', label: 'Completion confirmation', required: true, completed: false }
      ]
    }
  ]);

  const [routeJobs, setRouteJobs] = useState<Job[]>([
    {
      id: '1',
      title: 'Emergency Plumbing Repair',
      serviceType: 'Plumbing',
      customerName: 'Sarah Johnson',
      location: 'Downtown Montreal',
      address: '123 Rue Saint-Catherine, Montreal, QC',
      estimatedDuration: 120,
      amount: 150,
      priority: 'emergency',
      status: 'confirmed',
      scheduledTime: '09:00',
      coordinates: { lat: 45.5088, lng: -73.5678 }
    },
    {
      id: '2',
      title: 'House Cleaning Service',
      serviceType: 'Cleaning',
      customerName: 'Mike Ross',
      location: 'Westmount',
      address: '456 Avenue Victoria, Westmount, QC',
      estimatedDuration: 180,
      amount: 120,
      priority: 'medium',
      status: 'pending',
      scheduledTime: '11:30',
      coordinates: { lat: 45.4833, lng: -73.5967 }
    },
    {
      id: '3',
      title: 'Electrical Installation',
      serviceType: 'Electrical',
      customerName: 'Emily Chen',
      location: 'Plateau',
      address: '789 Rue Saint-Denis, Montreal, QC',
      estimatedDuration: 150,
      amount: 215,
      priority: 'high',
      status: 'confirmed',
      scheduledTime: '14:00',
      coordinates: { lat: 45.5230, lng: -73.5800 }
    }
  ]);

  const selectJob = useCallback((jobId: string) => {
    setSelectedJobId(jobId);
    setExecutionMode(true);
  }, []);

  const exitExecutionMode = useCallback(() => {
    setSelectedJobId(null);
    setExecutionMode(false);
  }, []);

  const updatePhotoRequirement = useCallback((phaseId: string, requirementId: string, file: File, thumbnail: string) => {
    setPhases(prev => prev.map(phase => {
      if (phase.id === phaseId) {
        const updatedRequirements = phase.requirements.map(req => {
          if (req.id === requirementId) {
            return { ...req, completed: true, file, thumbnail };
          }
          return req;
        });

        const allCompleted = updatedRequirements.every(req => req.completed);
        const updatedPhase = { ...phase, requirements: updatedRequirements, completed: allCompleted };

        return updatedPhase;
      }
      return phase;
    }));

    // Check if Phase 1 is complete to unlock Phase 2
    setPhases(prev => {
      const phase1 = prev.find(p => p.id === 'phase1');
      if (phase1?.completed) {
        return prev.map(phase => 
          phase.id === 'phase2' ? { ...phase, unlocked: true } : phase
        );
      }
      return prev;
    });
  }, []);

  const completeJob = useCallback((jobId: string) => {
    setRouteJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, status: 'completed' } : job
    ));
    exitExecutionMode();
  }, [exitExecutionMode]);

  const getSelectedJob = useCallback(() => {
    return routeJobs.find(job => job.id === selectedJobId);
  }, [routeJobs, selectedJobId]);

  const getProgressPercentage = useCallback(() => {
    const totalRequirements = phases.reduce((sum, phase) => sum + phase.requirements.length, 0);
    const completedRequirements = phases.reduce((sum, phase) => 
      sum + phase.requirements.filter(req => req.completed).length, 0
    );
    return Math.round((completedRequirements / totalRequirements) * 100);
  }, [phases]);

  const getTotalRouteStats = useCallback(() => {
    const totalEarnings = routeJobs.reduce((sum, job) => sum + job.amount, 0);
    const totalTime = routeJobs.reduce((sum, job) => sum + job.estimatedDuration, 0);
    const completedJobs = routeJobs.filter(job => job.status === 'completed').length;
    
    return {
      totalEarnings,
      totalTime: Math.round(totalTime / 60 * 10) / 10, // Convert to hours with 1 decimal
      completedJobs,
      totalJobs: routeJobs.length
    };
  }, [routeJobs]);

  return {
    selectedJobId,
    executionMode,
    phases,
    routeJobs,
    selectJob,
    exitExecutionMode,
    updatePhotoRequirement,
    completeJob,
    getSelectedJob,
    getProgressPercentage,
    getTotalRouteStats
  };
};