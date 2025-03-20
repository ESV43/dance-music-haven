
import { useState, useEffect } from "react";
import { loadBookings, formatDate, formatTime } from "@/utils/bookingUtils";
import { Booking } from "@/types/booking";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CalendarIcon, Clock, User, Home } from "lucide-react";
import { motion } from "framer-motion";

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Load bookings from local storage
    const loadedBookings = loadBookings();
    
    // Sort bookings by date and time
    loadedBookings.sort((a, b) => {
      const dateCompare = a.date.getTime() - b.date.getTime();
      if (dateCompare !== 0) return dateCompare;
      
      // Use the first time slot for sorting when multiple exist
      const aStartTime = a.timeSlots[0]?.startTime || "";
      const bStartTime = b.timeSlots[0]?.startTime || "";
      return aStartTime.localeCompare(bStartTime);
    });
    
    setBookings(loadedBookings);
    setIsLoading(false);
  }, []);
  
  const getRoomColor = (room: string) => {
    switch (room) {
      case "dance":
        return "bg-pink-500/20 text-pink-400";
      case "src":
        return "bg-blue-500/20 text-blue-400";
      case "music":
        return "bg-green-500/20 text-green-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };
  
  return (
    <div className="min-h-screen bg-navy-dark text-white pb-16">
      <div className="container max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">My Bookings</h1>
            <p className="text-gray-400 mt-2">View and manage your room bookings</p>
          </div>
          
          <Button asChild className="bg-gold hover:bg-gold-light text-navy-dark">
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Return Home
            </Link>
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-gold/20 flex items-center justify-center mb-4">
                <CalendarIcon className="h-6 w-6 text-gold" />
              </div>
              <p className="text-gray-400">Loading bookings...</p>
            </div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-16 bg-navy rounded-xl border border-navy-light/20">
            <div className="mx-auto w-16 h-16 rounded-full bg-navy-light/30 flex items-center justify-center mb-4">
              <CalendarIcon className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">No bookings found</h3>
            <p className="text-gray-400 mb-6">You don't have any room bookings yet.</p>
            <Button asChild className="bg-gold hover:bg-gold-light text-navy-dark">
              <Link to="/">Book a Room</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking, index) => (
              <motion.div 
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="glass-card rounded-xl overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoomColor(booking.room)}`}>
                      {booking.room.charAt(0).toUpperCase() + booking.room.slice(1)} Room
                    </span>
                    <span className="text-xs text-gray-400">
                      Booked on {new Date(booking.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white mb-1">{booking.teamName}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{booking.purpose}</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <CalendarIcon className="h-4 w-4 text-gold mr-2" />
                      <span className="text-gray-300">{formatDate(booking.date)}</span>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 text-gold mr-2" />
                        <span className="text-gray-300">
                          {booking.timeSlots.length} time slot{booking.timeSlots.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      
                      <div className="ml-6 flex flex-wrap gap-1">
                        {booking.timeSlots.map((slot, i) => (
                          <span key={i} className="text-xs text-gold/80 bg-gold/10 px-2 py-1 rounded">
                            {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <User className="h-4 w-4 text-gold mr-2" />
                      <span className="text-gray-300">{booking.teamHeadName}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
