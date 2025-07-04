import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-4 pointer-events-auto", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-6 sm:space-x-6 sm:space-y-0",
        month: "space-y-6",
        caption: "flex justify-center pt-2 relative items-center mb-4",
        caption_label: "text-lg font-semibold text-foreground",
        nav: "space-x-2 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-8 w-8 bg-background border-border hover:bg-accent hover:text-accent-foreground transition-all duration-200 shadow-sm rounded-lg"
        ),
        nav_button_previous: "absolute left-2",
        nav_button_next: "absolute right-2",
        table: "w-full border-collapse space-y-2",
        head_row: "flex mb-2",
        head_cell:
          "text-muted-foreground rounded-lg w-11 h-8 font-semibold text-sm flex items-center justify-center uppercase tracking-wide",
        row: "flex w-full gap-1",
        cell: "relative flex-1 flex items-center justify-center min-h-[44px] min-w-[44px] p-0 focus-within:relative focus-within:z-20",
        day: cn(
          "h-11 w-11 rounded-xl font-semibold text-sm transition-all duration-200",
          "hover:bg-accent hover:text-accent-foreground hover:scale-105 hover:shadow-sm",
          "focus:bg-accent focus:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          "active:scale-95"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-secondary text-secondary-foreground hover:bg-secondary hover:text-secondary-foreground focus:bg-secondary focus:text-secondary-foreground shadow-md border-2 border-secondary",
        day_today: "relative bg-primary text-primary-foreground font-bold shadow-lg ring-2 ring-primary/30 hover:bg-primary hover:text-primary-foreground",
        day_outside:
          "day-outside text-muted-foreground/50 opacity-40 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground/30 opacity-30 cursor-not-allowed hover:bg-transparent hover:text-muted-foreground/30",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ..._props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ..._props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
