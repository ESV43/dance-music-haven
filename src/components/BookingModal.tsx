
import { useState } from "react";
import { Room } from "@/types/booking";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BookingForm } from "./BookingForm";
import { X, Check, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: Room;
  roomName: string;
}

export function BookingModal({ isOpen, onClose, room, roomName }: BookingModalProps) {
  const [isBookingComplete, setIsBookingComplete] = useState(false);
  
  const handleBookingComplete = () => {
    setIsBookingComplete(true);
    
    // Reset the booking complete state after closing the modal
    setTimeout(() => {
      setIsBookingComplete(false);
    }, 1000);
  };
  
  const handleClose = () => {
    onClose();
    
    // Reset the booking complete state
    setTimeout(() => {
      setIsBookingComplete(false);
    }, 300);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px] bg-navy border border-gold/20 text-white shadow-[0_0_30px_rgba(212,175,55,0.15)] p-0">
        <DialogHeader className="px-6 pt-6">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-semibold text-white">
              {isBookingComplete ? "Booking Confirmed!" : `Book ${roomName}`}
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={handleClose} className="text-gray-400 hover:text-white">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="px-6 pb-6">
          <AnimatePresence mode="wait">
            {isBookingComplete ? (
              <motion.div
                key="confirmation"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="booking-confirmation py-12 flex flex-col items-center justify-center"
              >
                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6 animate-pulse-gold">
                  <Check className="h-10 w-10 text-green-500" />
                </div>
                
                <h3 className="text-xl font-medium text-white mb-2">Booking Successful!</h3>
                <p className="text-gray-300 text-center mb-6 max-w-xs">
                  A confirmation email has been sent to your email address.
                </p>
                
                <div className="flex items-center justify-center space-x-2 text-gold mb-6">
                  <Mail className="h-5 w-5" />
                  <span className="text-sm">Check your inbox</span>
                </div>
                
                <Button 
                  onClick={handleClose}
                  className="bg-gradient-to-r from-gold-dark to-gold hover:from-gold hover:to-gold-light text-navy-dark font-medium py-2 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-[0_8px_20px_-6px_rgba(212,175,55,0.6)] focus:outline-none focus:ring-2 focus:ring-gold focus:ring-opacity-50"
                >
                  Done
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <BookingForm 
                  room={room} 
                  roomName={roomName} 
                  onBookingComplete={handleBookingComplete} 
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
