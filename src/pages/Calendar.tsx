import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar as ShadCalendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { addDays, format, subMonths, addMonths } from "date-fns";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from 'lucide-react';

const Calendar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Determine user role for navigation
  const userRole = user?.user_metadata?.user_role || 'customer';
  const dashboardPath = userRole === 'provider' ? '/provider-dashboard' : '/customer-dashboard';

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const handleViewModeChange = (mode: 'month' | 'week' | 'day') => {
    setViewMode(mode);
  };

  const goToPreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      <Header />
      
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate(dashboardPath)}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
              <div className="space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleViewModeChange('month')}>Month</Button>
                <Button variant="outline" size="sm" onClick={() => handleViewModeChange('week')}>Week</Button>
                <Button variant="outline" size="sm" onClick={() => handleViewModeChange('day')}>Day</Button>
              </div>
            </div>

            <div className="border rounded-lg bg-white shadow-sm p-4">
              <div className="flex items-center justify-between mb-4">
                <Button onClick={goToPreviousMonth} variant="ghost">Previous</Button>
                <h2 className="text-xl font-semibold">{format(currentDate, 'MMMM yyyy')}</h2>
                <Button onClick={goToNextMonth} variant="ghost">Next</Button>
              </div>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <ShadCalendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
