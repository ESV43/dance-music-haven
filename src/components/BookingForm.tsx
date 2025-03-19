
import { Room } from "@/types/booking";
import { PersonalDetailsForm } from "./forms/PersonalDetailsForm";
import { DateSelectionForm } from "./forms/DateSelectionForm";
import { BookingFormFooter } from "./forms/BookingFormFooter";
import { useBookingForm } from "@/hooks/useBookingForm";

interface BookingFormProps {
  room: Room;
  roomName: string;
  onBookingComplete: () => void;
}

export function BookingForm({ room, roomName, onBookingComplete }: BookingFormProps) {
  const {
    isLoading,
    formData,
    selectedDate,
    selectedTimeSlotId,
    currentStep,
    handleInputChange,
    handleDateChange,
    handleTimeSlotSelect,
    handleNextStep,
    handlePrevStep
  } = useBookingForm(room, onBookingComplete);
  
  return (
    <div className="booking-form-container animate-in">
      {currentStep === 1 ? (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white/90 mb-6">
            Book {roomName}
          </h2>
          
          <PersonalDetailsForm 
            formData={formData} 
            handleInputChange={handleInputChange} 
          />
        </div>
      ) : (
        <DateSelectionForm
          selectedDate={selectedDate}
          handleDateChange={handleDateChange}
          selectedRoom={room}
          handleTimeSlotSelect={handleTimeSlotSelect}
          selectedTimeSlotId={selectedTimeSlotId}
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
