
import { Room } from "@/types/booking";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TimeSlotPicker } from "../TimeSlotPicker";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/bookingUtils";

interface DateSelectionFormProps {
  selectedDate: Date | undefined;
  handleDateChange: (date: Date | undefined) => void;
  selectedRoom: Room;
  handleTimeSlotSelect: (timeSlotId: string) => void;
  selectedTimeSlotId: string | null;
  handlePrevStep: () => void;
}

export function DateSelectionForm({
  selectedDate,
  handleDateChange,
  selectedRoom,
  handleTimeSlotSelect,
  selectedTimeSlotId,
  handlePrevStep
}: DateSelectionFormProps) {
  // Get today's date with time set to midnight for accurate comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white/90">
          Select Date & Time
        </h2>
        <button
          onClick={handlePrevStep}
          className="text-gold hover:text-gold-light text-sm"
        >
          Back to details
        </button>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-white/90">Select Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal bg-navy-light border-navy text-white",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-gold" />
                {selectedDate ? (
                  format(selectedDate, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-navy-light border-navy" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateChange}
                initialFocus
                disabled={(date) => date < today}
                className="bg-navy border-navy"
              />
            </PopoverContent>
          </Popover>
        </div>
        
        {selectedDate && (
          <div className="pt-2 pb-4">
            <p className="text-sm text-white/70 mb-6">
              Selecting time slots for {formatDate(selectedDate)}
            </p>
            
            <TimeSlotPicker
              selectedDate={selectedDate}
              selectedRoom={selectedRoom}
              onSelectTimeSlot={handleTimeSlotSelect}
              selectedTimeSlotId={selectedTimeSlotId}
            />
          </div>
        )}
      </div>
    </div>
  );
}
