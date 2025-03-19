
import { TimeSlot, Room } from "@/types/booking";
import { formatTime, getAvailableTimeSlots } from "@/utils/bookingUtils";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface TimeSlotPickerProps {
  selectedDate: Date;
  selectedRoom: Room;
  onSelectTimeSlot: (timeSlotId: string) => void;
  selectedTimeSlotId: string | null;
}

export function TimeSlotPicker({ 
  selectedDate, 
  selectedRoom, 
  onSelectTimeSlot, 
  selectedTimeSlotId 
}: TimeSlotPickerProps) {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (selectedDate && selectedRoom) {
      setIsLoading(true);
      // Small delay to show loading state (simulates API call)
      setTimeout(() => {
        const slots = getAvailableTimeSlots(selectedRoom, selectedDate);
        setTimeSlots(slots);
        setIsLoading(false);
      }, 500);
    }
  }, [selectedDate, selectedRoom]);

  if (isLoading) {
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <Clock className="h-8 w-8 text-gold mb-2 animate-bounce" />
          <p className="text-gray-400">Loading available time slots...</p>
        </div>
      </div>
    );
  }

  // Group time slots by morning, afternoon, and evening
  const morningSlots = timeSlots.filter(slot => {
    const hour = parseInt(slot.startTime.split(':')[0]);
    return hour >= 6 && hour < 12;
  });
  
  const afternoonSlots = timeSlots.filter(slot => {
    const hour = parseInt(slot.startTime.split(':')[0]);
    return hour >= 12 && hour < 18;
  });
  
  const eveningSlots = timeSlots.filter(slot => {
    const hour = parseInt(slot.startTime.split(':')[0]);
    return hour >= 18;
  });

  const renderTimeSlotGroup = (slots: TimeSlot[], title: string) => (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-gold/90 mb-3">{title}</h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
        {slots.map((slot) => (
          <button
            key={slot.id}
            onClick={() => !slot.isBooked && onSelectTimeSlot(slot.id)}
            disabled={slot.isBooked}
            className={cn(
              "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300",
              slot.isBooked 
                ? "bg-navy-light/20 text-gray-500 cursor-not-allowed opacity-50" 
                : selectedTimeSlotId === slot.id
                  ? "bg-gold text-navy-dark shadow-md scale-[1.03]"
                  : "bg-navy-light hover:bg-navy hover:scale-[1.03] text-white"
            )}
          >
            {formatTime(slot.startTime)}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="time-slot-picker animate-in">
      <h2 className="text-xl font-semibold mb-4 text-white">Select a Time Slot</h2>
      
      {morningSlots.length > 0 && renderTimeSlotGroup(morningSlots, "Morning")}
      {afternoonSlots.length > 0 && renderTimeSlotGroup(afternoonSlots, "Afternoon")}
      {eveningSlots.length > 0 && renderTimeSlotGroup(eveningSlots, "Evening")}
      
      {selectedTimeSlotId && (
        <div className="mt-4 p-3 bg-gold/10 border border-gold/20 rounded-lg">
          <p className="text-gold">
            You selected: {formatTime(timeSlots.find(slot => slot.id === selectedTimeSlotId)?.startTime || "")} - {
              formatTime(timeSlots.find(slot => slot.id === selectedTimeSlotId)?.endTime || "")
            }
          </p>
        </div>
      )}
    </div>
  );
}
