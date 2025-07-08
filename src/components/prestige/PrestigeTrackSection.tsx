import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronDown, ChevronRight, CheckCircle, Clock, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PreviewTrackCard from './PreviewTrackCard';
import TitleModal from './TitleModal';

interface PrestigeLevel {
  title: string;
  jobsRequired: number;
  timeEstimate: string;
  status: 'completed' | 'current' | 'locked';
  currentJobs?: number;
}

interface PrestigeTrack {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  color: string;
  levels: PrestigeLevel[];
  description?: string;
}

interface PrestigeTrackSectionProps {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  tracks: PrestigeTrack[];
  searchTerm: string;
  activeTrack: string | null;
  setActiveTrack: (trackId: string | null) => void;
  defaultExpanded?: boolean;
  sectionId: string;
  statusFilter?: string;
  activeSection?: string | null;
  setActiveSection?: (sectionId: string | null) => void;
  viewMode?: 'preview' | 'detailed';
}

const PrestigeTrackSection: React.FC<PrestigeTrackSectionProps> = ({
  title,
  subtitle,
  icon,
  tracks,
  searchTerm,
  activeTrack,
  setActiveTrack,
  defaultExpanded = false,
  sectionId,
  statusFilter = 'all',
  activeSection,
  setActiveSection,
  viewMode = 'detailed'
}) => {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);
  const [selectedTitle, setSelectedTitle] = React.useState<{
    track: PrestigeTrack;
    level: PrestigeLevel;
    levelIndex: number;
  } | null>(null);

  // Accordion behavior - only one section open at a time
  const handleSectionToggle = () => {
    if (setActiveSection) {
      setActiveSection(activeSection === sectionId ? null : sectionId);
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  const sectionIsExpanded = setActiveSection ? activeSection === sectionId : isExpanded;

  // Filter tracks based on search term and status filter with null safety
  const filteredTracks = (tracks || []).filter(track => {
    if (!track || !track.title || !track.levels) return false;
    
    // Search filter
    const searchLower = (searchTerm || '').toLowerCase();
    const matchesSearch = track.title.toLowerCase().includes(searchLower) ||
           (track.subtitle || '').toLowerCase().includes(searchLower) ||
           track.levels.some(level => level && level.title && level.title.toLowerCase().includes(searchLower));
    
    if (!matchesSearch) return false;
    
    // Status filter
    if (statusFilter === 'all') return true;
    
    return track.levels.some(level => {
      if (!level) return false;
      return level.status === statusFilter;
    });
  });

  if (filteredTracks.length === 0 && (searchTerm || statusFilter !== 'all')) {
    return null;
  }

  const getStatusIcon = (status: PrestigeLevel['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'current':
        return <Clock className="h-4 w-4 text-orange-600" />;
      case 'locked':
        return <Lock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: PrestigeLevel['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 text-green-700 border-green-200';
      case 'current':
        return 'bg-orange-500/10 text-orange-700 border-orange-200';
      case 'locked':
        return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  // Preview mode for overview tab
  if (viewMode === 'preview') {
    return (
      <Card className="bg-slate-50/80 backdrop-blur-sm border border-slate-200 shadow-lg">
        <CardHeader 
          className="cursor-pointer hover:bg-slate-50/60 transition-colors"
          onClick={handleSectionToggle}
        >
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {icon}
              <div>
                <h3 className="text-lg font-bold">{title}</h3>
                {subtitle && (
                  <p className="text-sm text-muted-foreground font-normal">{subtitle}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {filteredTracks.length} tracks
              </Badge>
              {sectionIsExpanded ? (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
          </CardTitle>
        </CardHeader>

        {sectionIsExpanded && (
          <CardContent className="pt-0">
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {filteredTracks.map((track) => (
                <PreviewTrackCard
                  key={track.id}
                  id={track.id}
                  title={track.title}
                  subtitle={track.subtitle}
                  emoji={track.emoji}
                  levels={track.levels}
                  onClick={() => setActiveTrack(activeTrack === track.id ? null : track.id)}
                />
              ))}
            </div>
          </CardContent>
        )}
      </Card>
    );
  }

  // Detailed mode for individual category tabs
  return (
    <div className="space-y-6">
      <TitleModal
        isOpen={!!selectedTitle}
        onClose={() => setSelectedTitle(null)}
        title={selectedTitle?.level.title || ''}
        trackTitle={selectedTitle?.track.title || ''}
        emoji={selectedTitle?.track.emoji || ''}
        level={selectedTitle?.level || {} as PrestigeLevel}
        levelIndex={selectedTitle?.levelIndex || 0}
        totalLevels={selectedTitle?.track.levels.length || 0}
        nextLevel={selectedTitle ? selectedTitle.track.levels[selectedTitle.levelIndex + 1] : undefined}
      />

      <Card className="bg-slate-50/80 backdrop-blur-sm border border-slate-200 shadow-lg">
        <CardHeader 
          className="cursor-pointer hover:bg-slate-50/60 transition-colors"
          onClick={handleSectionToggle}
        >
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {icon}
            <div>
              <h3 className="text-xl font-bold">{title}</h3>
              {subtitle && (
                <p className="text-sm text-muted-foreground font-normal">{subtitle}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {filteredTracks.length} tracks
            </Badge>
            {sectionIsExpanded ? (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        </CardTitle>
      </CardHeader>

      {sectionIsExpanded && (
        <CardContent className="pt-0">
          <div className="space-y-6">
            {filteredTracks.map((track) => {
              if (!track || !track.levels) return null;
              const isTrackExpanded = activeTrack === track.id;
              const currentLevel = track.levels.find(level => level && level.status === 'current');
              const completedLevels = track.levels.filter(level => level && level.status === 'completed').length;
              const totalLevels = track.levels.length;
              const progressPercentage = totalLevels > 0 ? (completedLevels / totalLevels) * 100 : 0;

              return (
                <Card 
                  key={track.id} 
                  className="bg-slate-50/60 border border-slate-200 hover:shadow-md transition-shadow"
                >
                  <CardHeader 
                    className="cursor-pointer pb-3"
                    onClick={() => setActiveTrack(isTrackExpanded ? null : track.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{track.emoji}</div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground">{track.title}</h4>
                          <p className="text-sm text-muted-foreground">{track.subtitle}</p>
                          
                          {/* Progress Summary */}
                          <div className="flex items-center gap-2 mt-2">
                            <Progress value={progressPercentage} className="h-2 flex-1 max-w-32" />
                            <span className="text-xs text-muted-foreground">
                              {completedLevels}/{totalLevels}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {currentLevel && (
                          <Badge variant="outline" className={getStatusColor('current')}>
                            In Progress
                          </Badge>
                        )}
                        {isTrackExpanded ? (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  {isTrackExpanded && (
                    <CardContent className="pt-0">
                      {track.description && (
                        <p className="text-sm text-muted-foreground mb-4">{track.description}</p>
                      )}
                      
                      <div className="space-y-3">
                        {(track.levels || []).map((level, index) => {
                          if (!level) return null;
                          return (
                          <div 
                            key={index}
                            className={`p-4 rounded-lg border transition-all ${
                              level.status === 'completed' 
                                ? 'bg-green-50/50 border-green-200' 
                                : level.status === 'current'
                                ? 'bg-orange-50/50 border-orange-200'
                                : 'bg-gray-50/50 border-gray-200'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                {getStatusIcon(level.status)}
                                <div>
                                  <h5 
                                    className="font-medium text-foreground hover:text-primary cursor-pointer transition-colors"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedTitle({ track, level, levelIndex: index });
                                    }}
                                  >
                                    {level.title}
                                  </h5>
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span>{level.jobsRequired} jobs</span>
                                    <span>•</span>
                                    <span>{level.timeEstimate}</span>
                                  </div>
                                </div>
                              </div>
                              
                              {level.status === 'current' && level.currentJobs && (
                                <div className="text-right">
                                  <div className="text-sm font-medium text-foreground">
                                    {level.currentJobs}/{level.jobsRequired}
                                  </div>
                                  <Progress 
                                    value={(level.currentJobs / level.jobsRequired) * 100} 
                                    className="h-2 w-20 mt-1" 
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                          );
                        }).filter(Boolean)}
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        </CardContent>
          )}
        </Card>
      </div>
    );
};

export default PrestigeTrackSection;