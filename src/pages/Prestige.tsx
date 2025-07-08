import React, { useState } from 'react';
import { ArrowLeft, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import VideoBackground from '@/components/common/VideoBackground';
import PrestigeHero from '@/components/prestige/PrestigeHero';
import PrestigeIntroduction from '@/components/prestige/PrestigeIntroduction';
import ServiceSpecificTracks from '@/components/prestige/ServiceSpecificTracks';
import RecognitionTracks from '@/components/prestige/RecognitionTracks';
import CustomerTracks from '@/components/prestige/CustomerTracks';
import PlatformMasteryTracks from '@/components/prestige/PlatformMasteryTracks';

const Prestige = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTrack, setActiveTrack] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeSection, setActiveSection] = useState<string | null>(null);

  return (
    <>
      <VideoBackground />
      <div className="relative z-10 min-h-screen">
        {/* Desktop/Tablet Header - Hidden on Mobile */}
        <div className="hidden md:block bg-slate-50/90 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-40">
          <div className="flex items-center gap-4 p-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/community-dashboard')}
              className="shrink-0"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Community
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-foreground">Prestige System</h1>
              <p className="text-xs text-muted-foreground">Your professional development journey</p>
            </div>
          </div>
        </div>

        {/* Mobile: Floating Back Button */}
        <div className="md:hidden fixed top-4 left-4 z-50">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/community-dashboard')}
            className="bg-slate-50/90 backdrop-blur-sm border-slate-200 shadow-lg"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </div>

        {/* Content Area */}
        <div className="p-4 md:p-8 pb-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Hero Section */}
            <PrestigeHero />

            {/* Introduction Section */}
            <PrestigeIntroduction />

            {/* Enhanced Search and Filter */}
            <div className="bg-slate-50/80 backdrop-blur-sm rounded-lg border border-slate-200 p-6 sticky top-16 md:top-20 z-30">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search prestige tracks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="current">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="locked">Locked</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Prestige Track Sections */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 bg-slate-50/80 backdrop-blur-sm">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="service">Service</TabsTrigger>
                <TabsTrigger value="recognition">Recognition</TabsTrigger>
                <TabsTrigger value="customer">Customer</TabsTrigger>
                <TabsTrigger value="platform">Platform</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid gap-4 md:gap-6">
                  <ServiceSpecificTracks 
                    searchTerm={searchTerm}
                    activeTrack={activeTrack}
                    setActiveTrack={setActiveTrack}
                    statusFilter={statusFilter}
                    activeSection={activeSection}
                    setActiveSection={setActiveSection}
                    viewMode="preview"
                  />
                  <RecognitionTracks 
                    searchTerm={searchTerm}
                    activeTrack={activeTrack}
                    setActiveTrack={setActiveTrack}
                    statusFilter={statusFilter}
                    activeSection={activeSection}
                    setActiveSection={setActiveSection}
                    viewMode="preview"
                  />
                  <CustomerTracks 
                    searchTerm={searchTerm}
                    activeTrack={activeTrack}
                    setActiveTrack={setActiveTrack}
                    statusFilter={statusFilter}
                    activeSection={activeSection}
                    setActiveSection={setActiveSection}
                    viewMode="preview"
                  />
                  <PlatformMasteryTracks 
                    searchTerm={searchTerm}
                    activeTrack={activeTrack}
                    setActiveTrack={setActiveTrack}
                    statusFilter={statusFilter}
                    activeSection={activeSection}
                    setActiveSection={setActiveSection}
                    viewMode="preview"
                  />
                </div>
              </TabsContent>

              <TabsContent value="service">
                <ServiceSpecificTracks 
                  searchTerm={searchTerm}
                  activeTrack={activeTrack}
                  setActiveTrack={setActiveTrack}
                  statusFilter={statusFilter}
                  activeSection={activeSection}
                  setActiveSection={setActiveSection}
                  viewMode="detailed"
                />
              </TabsContent>

              <TabsContent value="recognition">
                <RecognitionTracks 
                  searchTerm={searchTerm}
                  activeTrack={activeTrack}
                  setActiveTrack={setActiveTrack}
                  statusFilter={statusFilter}
                  activeSection={activeSection}
                  setActiveSection={setActiveSection}
                  viewMode="detailed"
                />
              </TabsContent>

              <TabsContent value="customer">
                <CustomerTracks 
                  searchTerm={searchTerm}
                  activeTrack={activeTrack}
                  setActiveTrack={setActiveTrack}
                  statusFilter={statusFilter}
                  activeSection={activeSection}
                  setActiveSection={setActiveSection}
                  viewMode="detailed"
                />
              </TabsContent>

              <TabsContent value="platform">
                <PlatformMasteryTracks 
                  searchTerm={searchTerm}
                  activeTrack={activeTrack}
                  setActiveTrack={setActiveTrack}
                  statusFilter={statusFilter}
                  activeSection={activeSection}
                  setActiveSection={setActiveSection}
                  viewMode="detailed"
                />
              </TabsContent>
            </Tabs>

            {/* Bottom Spacing */}
            <div className="h-16" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Prestige;