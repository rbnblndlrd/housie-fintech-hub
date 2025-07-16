import React, { ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';

interface UnifiedDashboardLayoutProps {
  children: ReactNode;
  leftDock?: ReactNode;
  rightDock?: ReactNode;
  bottomRow?: ReactNode;
  className?: string;
  enableResponsive?: boolean;
}

export const UnifiedDashboardLayout: React.FC<UnifiedDashboardLayoutProps> = ({
  children,
  leftDock,
  rightDock,
  bottomRow,
  className,
  enableResponsive = true
}) => {
  const [leftDockCollapsed, setLeftDockCollapsed] = useState(false);
  const [rightDockCollapsed, setRightDockCollapsed] = useState(false);
  const [bottomRowHidden, setBottomRowHidden] = useState(false);

  return (
    <div className={cn(
      "min-h-screen bg-gradient-to-br from-slate-50 to-slate-100",
      "dark:from-slate-900 dark:to-slate-800",
      className
    )}>
      {/* Main Grid Container */}
      <div className={cn(
        "grid gap-4 p-4 min-h-screen",
        // Desktop: 3-column layout with collapsible sides
        "lg:grid-cols-[auto_1fr_auto] lg:grid-rows-[1fr_auto]",
        // Tablet: 2-column layout
        enableResponsive && "md:grid-cols-[1fr_auto] md:grid-rows-[1fr_auto]",
        // Mobile: single column
        enableResponsive && "grid-cols-1 grid-rows-[auto_1fr_auto]"
      )}>
        
        {/* Left Dock Zone */}
        {leftDock && (
          <div className={cn(
            "relative transition-all duration-300 ease-in-out",
            // Desktop positioning
            "lg:row-span-1",
            // Responsive behavior
            enableResponsive && "md:order-1 lg:order-none",
            enableResponsive && "order-1",
            // Collapsed state
            leftDockCollapsed ? "lg:w-16" : "lg:w-80",
            // Mobile: full width
            enableResponsive && "w-full lg:w-auto"
          )}>
            <div className={cn(
              "sticky top-4 z-30",
              "transition-all duration-300"
            )}>
              {/* Collapse Toggle - Desktop Only */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLeftDockCollapsed(!leftDockCollapsed)}
                className={cn(
                  "absolute -right-3 top-4 z-40 h-6 w-6 rounded-full bg-white shadow-md",
                  "border border-slate-200 hover:bg-slate-50",
                  "hidden lg:flex items-center justify-center"
                )}
              >
                {leftDockCollapsed ? (
                  <ChevronRight className="h-3 w-3" />
                ) : (
                  <ChevronLeft className="h-3 w-3" />
                )}
              </Button>

              {/* Left Dock Content */}
              <div className={cn(
                "transition-all duration-300",
                leftDockCollapsed && "lg:opacity-50 lg:scale-90"
              )}>
                {leftDock}
              </div>
            </div>
          </div>
        )}

        {/* Main Pane Zone */}
        <div className={cn(
          "min-h-0 transition-all duration-300",
          // Responsive ordering
          enableResponsive && "order-2",
          // Grid positioning
          "lg:col-start-2 lg:row-start-1"
        )}>
          <div className="h-full">
            {children}
          </div>
        </div>

        {/* Right Dock Zone */}
        {rightDock && (
          <div className={cn(
            "relative transition-all duration-300 ease-in-out",
            // Desktop positioning
            "lg:row-span-1",
            // Responsive behavior
            enableResponsive && "md:order-3 lg:order-none",
            enableResponsive && "order-3",
            // Collapsed state
            rightDockCollapsed ? "lg:w-16" : "lg:w-80",
            // Mobile: full width
            enableResponsive && "w-full lg:w-auto"
          )}>
            <div className={cn(
              "sticky top-4 z-30",
              "transition-all duration-300"
            )}>
              {/* Collapse Toggle - Desktop Only */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRightDockCollapsed(!rightDockCollapsed)}
                className={cn(
                  "absolute -left-3 top-4 z-40 h-6 w-6 rounded-full bg-white shadow-md",
                  "border border-slate-200 hover:bg-slate-50",
                  "hidden lg:flex items-center justify-center"
                )}
              >
                {rightDockCollapsed ? (
                  <ChevronLeft className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
              </Button>

              {/* Right Dock Content */}
              <div className={cn(
                "transition-all duration-300",
                rightDockCollapsed && "lg:opacity-50 lg:scale-90"
              )}>
                {rightDock}
              </div>
            </div>
          </div>
        )}

        {/* Bottom Row Zone */}
        {bottomRow && (
          <div className={cn(
            "transition-all duration-500 ease-in-out",
            // Grid positioning - spans all columns
            "lg:col-span-3 lg:row-start-2",
            enableResponsive && "md:col-span-2",
            enableResponsive && "order-4",
            // Hidden state
            bottomRowHidden ? "opacity-0 scale-95 pointer-events-none h-0 overflow-hidden" : "opacity-100 scale-100"
          )}>
            {/* Toggle Button */}
            <div className="flex justify-center mb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setBottomRowHidden(!bottomRowHidden)}
                className="h-6 px-4 rounded-full bg-white/80 backdrop-blur-sm shadow-sm border border-slate-200 hover:bg-white"
              >
                {bottomRowHidden ? (
                  <ChevronUp className="h-3 w-3" />
                ) : (
                  <ChevronDown className="h-3 w-3" />
                )}
                <span className="ml-2 text-xs">
                  {bottomRowHidden ? 'Show Metrics' : 'Hide Metrics'}
                </span>
              </Button>
            </div>

            {/* Bottom Row Content */}
            <div className="transition-all duration-300">
              {bottomRow}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};