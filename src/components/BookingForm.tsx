
import { useState } from "react";
import { Room, BookingFormData } from "@/types/booking";
import { TimeSlotPicker } from "./TimeSlotPicker";
import { createBooking, formatDate } from "@/utils/bookingUtils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon, Check, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface BookingFormProps {
  room: Room;
  roomName: string;
  onBookingComplete: () => void;
}

export function BookingForm({ room, roomName, onBookingComplete }: BookingFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<BookingFormData>>({
    room,
    teamHeadName: "",
    teamName: "",
    phone: "",
    email: "",
    purpose: "",
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTimeSlotId, setSelectedTimeSlotId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      // Reset time slot when date changes
      setSelectedTimeSlotId(null);
    }
  };
  
  const handleTimeSlotSelect = (timeSlotId: string) => {
    setSelectedTimeSlotId(timeSlotId);
  };
  
  const validateStep1 = () => {
    const { teamHeadName, teamName, phone, email, purpose } = formData;
    if (!teamHeadName || !teamName || !phone || !email || !purpose) {
      toast.error("Please fill in all required fields.");
      return false;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return false;
    }
    
    // Basic phone validation
    const phoneRegex = /^\d{10,}$/;
    if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
      toast.error("Please enter a valid phone number (at least 10 digits).");
      return false;
    }
    
    return true;
  };
  
  const validateStep2 = () => {
    if (!selectedDate) {
      toast.error("Please select a date.");
      return false;
    }
    
    if (!selectedTimeSlotId) {
      toast.error("Please select a time slot.");
      return false;
    }
    
    return true;
  };
  
  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      handleSubmit();
    }
  };
  
  const handlePrevStep = () => {
    setCurrentStep(1);
  };
  
  const handleSubmit = async () => {
    if (!selectedDate || !selectedTimeSlotId) return;
    
    try {
      setIsLoading(true);
      
      const completeFormData: BookingFormData = {
        ...formData as BookingFormData,
        room,
        date: selectedDate,
        timeSlotId: selectedTimeSlotId
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create booking
      createBooking(completeFormData);
      
      // Show success toast (handled by createBooking)
      setIsLoading(false);
      onBookingComplete();
    } catch (error) {
      setIsLoading(false);
      toast.error(error instanceof Error ? error.message : "Failed to create booking. Please try again.");
    }
  };
  
  return (
    <div className="booking-form-container animate-in">
      {currentStep === 1 ? (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white/90 mb-6">
            Book {roomName}
          </h2>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="teamHeadName" className="text-white/90">Team Head Name</Label>
              <Input
                id="teamHeadName"
                name="teamHeadName"
                placeholder="Enter team head name"
                value={formData.teamHeadName || ""}
                onChange={handleInputChange}
                className="bg-navy-light border-navy text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="teamName" className="text-white/90">Team Name</Label>
              <Input
                id="teamName"
                name="teamName"
                placeholder="Enter team name"
                value={formData.teamName || ""}
                onChange={handleInputChange}
                className="bg-navy-light border-navy text-white"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-white/90">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="Enter phone number"
                  value={formData.phone || ""}
                  onChange={handleInputChange}
                  className="bg-navy-light border-navy text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/90">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email || ""}
                  onChange={handleInputChange}
                  className="bg-navy-light border-navy text-white"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="purpose" className="text-white/90">Purpose</Label>
              <Textarea
                id="purpose"
                name="purpose"
                placeholder="Describe the purpose of your booking"
                value={formData.purpose || ""}
                onChange={handleInputChange}
                className="bg-navy-light border-navy text-white resize-none min-h-[100px]"
              />
            </div>
          </div>
        </div>
      ) : (
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
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
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
                  selectedRoom={room}
                  onSelectTimeSlot={handleTimeSlotSelect}
                  selectedTimeSlotId={selectedTimeSlotId}
                />
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="mt-8 flex justify-end">
        <Button
          onClick={handleNextStep}
          disabled={isLoading}
          className="bg-gradient-to-r from-gold-dark to-gold hover:from-gold hover:to-gold-light text-navy-dark font-medium py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-[0_8px_20px_-6px_rgba(212,175,55,0.6)] focus:outline-none focus:ring-2 focus:ring-gold focus:ring-opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : currentStep === 1 ? (
            "Next: Choose Date & Time"
          ) : (
            "Confirm Booking"
          )}
        </Button>
      </div>
    </div>
  );
}
