import { useState } from "react";
import { Room, BookingFormData } from "@/types/booking";
import { createBooking } from "@/utils/bookingUtils";
import { toast } from "sonner";

export function useBookingForm(room: Room, onBookingComplete: () => void) {
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
  const [selectedTimeSlotIds, setSelectedTimeSlotIds] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setSelectedTimeSlotIds([]);
    }
  };
  
  const handleTimeSlotSelect = (timeSlotId: string) => {
    setSelectedTimeSlotIds(prev => {
      if (prev.includes(timeSlotId)) {
        return prev.filter(id => id !== timeSlotId);
      }
      return [...prev, timeSlotId];
    });
  };
  
  const validateStep1 = () => {
    const { teamHeadName, teamName, phone, email, purpose } = formData;
    if (!teamHeadName || !teamName || !phone || !email || !purpose) {
      toast.error("Please fill in all required fields.");
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return false;
    }
    
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
    
    if (selectedTimeSlotIds.length === 0) {
      toast.error("Please select at least one time slot.");
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
    if (!selectedDate || selectedTimeSlotIds.length === 0) return;
    
    try {
      setIsLoading(true);
      
      const completeFormData: BookingFormData = {
        ...formData as BookingFormData,
        room,
        date: selectedDate,
        timeSlotIds: selectedTimeSlotIds
      };
      
      await createBooking(completeFormData);
      
      setIsLoading(false);
      onBookingComplete();
    } catch (error) {
      setIsLoading(false);
      toast.error(error instanceof Error ? error.message : "Failed to create booking. Please try again.");
    }
  };
  
  return {
    isLoading,
    formData,
    selectedDate,
    selectedTimeSlotIds,
    currentStep,
    handleInputChange,
    handleDateChange,
    handleTimeSlotSelect,
    handleNextStep,
    handlePrevStep
  };
}
