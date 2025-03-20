
import { Room } from "@/types/booking";
import { PersonalDetailsForm } from "./forms/PersonalDetailsForm";
import { DateSelectionForm } from "./forms/DateSelectionForm";
import { BookingFormFooter } from "./forms/BookingFormFooter";
import { useBookingForm } from "@/hooks/useBookingForm";
import { GoogleLogin } from "./auth/GoogleLogin";
import { useState } from "react";

interface BookingFormProps {
  room: Room;
  roomName: string;
  onBookingComplete: () => void;
}

export function BookingForm({ room, roomName, onBookingComplete }: BookingFormProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  
  const {
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
  } = useBookingForm(room, onBookingComplete, userEmail);
  
  const handleGoogleLoginSuccess = (email: string) => {
    setIsAuthenticated(true);
    setUserEmail(email);
    
    // Pre-fill the email field in the form
    if (email) {
      const event = {
        target: { name: 'email', value: email }
      } as React.ChangeEvent<HTMLInputElement>;
      handleInputChange(event);
    }
  };
  
  return (
    <div className="booking-form-container animate-in">
      {currentStep === 1 ? (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white/90 mb-6">
            Book {roomName}
          </h2>
          
          {!isAuthenticated && (
            <div className="mb-6">
              <p className="text-white/70 mb-4">Sign in to simplify your booking:</p>
              <GoogleLogin onLoginSuccess={handleGoogleLoginSuccess} />
              <div className="my-4 flex items-center">
                <div className="h-px flex-1 bg-white/10"></div>
                <p className="mx-4 text-white/50 text-sm">or continue as guest</p>
                <div className="h-px flex-1 bg-white/10"></div>
              </div>
            </div>
          )}
          
          <PersonalDetailsForm 
            formData={formData} 
            handleInputChange={handleInputChange} 
            isAuthenticated={isAuthenticated}
          />
        </div>
      ) : (
        <DateSelectionForm
          selectedDate={selectedDate}
          handleDateChange={handleDateChange}
          selectedRoom={room}
          handleTimeSlotSelect={handleTimeSlotSelect}
          selectedTimeSlotIds={selectedTimeSlotIds}
          handlePrevStep={handlePrevStep}
        />
      )}
      
      <BookingFormFooter 
        isLoading={isLoading} 
        currentStep={currentStep} 
        handleNextStep={handleNextStep} 
      />
    </div>
  );
}
