
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface BookingFormFooterProps {
  isLoading: boolean;
  currentStep: number;
  handleNextStep: () => void;
}

export function BookingFormFooter({ 
  isLoading, 
  currentStep, 
  handleNextStep 
}: BookingFormFooterProps) {
  return (
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
  );
}
