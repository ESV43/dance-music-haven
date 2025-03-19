
import { useState } from "react";
import { Room, RoomDetails } from "@/types/booking";
import { initializeDefaultImages } from "@/utils/bookingUtils";
import { Button } from "@/components/ui/button";
import { BookingModal } from "./BookingModal";
import { motion } from "framer-motion";

interface RoomCardProps {
  room: RoomDetails;
}

export function RoomCard({ room }: RoomCardProps) {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const images = initializeDefaultImages();
  
  // Use the image URL from the room object or get a default image
  const imageUrl = room.image || images[`${room.id}-room`];

  return (
    <>
      <motion.div 
        className="glass-card rounded-2xl overflow-hidden card-hover"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative h-64 overflow-hidden">
          <img 
            src={imageUrl} 
            alt={room.name} 
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/90 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <span className="px-3 py-1 text-xs font-medium bg-gold/20 text-gold rounded-full mb-3 inline-block">
              Available for Booking
            </span>
            <h3 className="text-2xl font-semibold text-white mb-1">{room.name}</h3>
          </div>
        </div>
        
        <div className="p-6">
          <Button 
            onClick={() => setIsBookingModalOpen(true)}
            className="w-full bg-gradient-to-r from-gold-dark to-gold hover:from-gold hover:to-gold-light text-navy-dark font-medium py-2 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-[0_8px_20px_-6px_rgba(212,175,55,0.6)] focus:outline-none focus:ring-2 focus:ring-gold focus:ring-opacity-50"
          >
            Book {room.name}
          </Button>
        </div>
      </motion.div>
      
      <BookingModal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)} 
        room={room.id as Room}
        roomName={room.name}
      />
    </>
  );
}
