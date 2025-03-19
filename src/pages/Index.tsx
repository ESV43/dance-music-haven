
import { RoomCard } from "@/components/RoomCard";
import { roomDetails } from "@/utils/bookingUtils";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CalendarCheck, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="min-h-screen bg-navy-dark pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-light/40 to-navy-dark z-0"></div>
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0,_var(--tw-gradient-to)_100%)] from-gold/20 to-transparent"></div>
        
        <div className="container max-w-6xl mx-auto px-4 pt-32 pb-24 relative z-10">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span className="inline-block px-4 py-1.5 bg-gold/10 text-gold rounded-full text-sm font-medium mb-6">
                Room Booking System
              </span>
            </motion.div>
            
            <motion.h1 
              className="text-5xl sm:text-6xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Book Your Perfect <span className="text-gold">Space</span>
            </motion.h1>
            
            <motion.p 
              className="text-lg text-gray-300 max-w-2xl mx-auto mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Reserve our dance, SRC, or music rooms with our intuitive booking system.
              Half-hour slots available from 6 AM to midnight.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Button asChild className="bg-gradient-to-r from-gold-dark to-gold hover:from-gold hover:to-gold-light text-navy-dark font-medium px-6 py-2 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-[0_8px_20px_-6px_rgba(212,175,55,0.6)] focus:outline-none focus:ring-2 focus:ring-gold focus:ring-opacity-50">
                <a href="#rooms">
                  Book a Room
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              
              <Button asChild variant="outline" className="border-gold/30 text-gold hover:bg-gold/10 px-6 py-2 rounded-lg transition-all duration-300">
                <Link to="/bookings">
                  <CalendarCheck className="mr-2 h-4 w-4" />
                  View Bookings
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Rooms Section */}
      <section id="rooms" className="container max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <motion.h2 
            className="text-3xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Available Rooms
          </motion.h2>
          <motion.p 
            className="text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Choose from our specialized rooms designed for different activities and purposes.
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {roomDetails.map((room, index) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="container max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <motion.h2 
            className="text-3xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            How It Works
          </motion.h2>
          <motion.p 
            className="text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Booking a room is quick and easy with our streamlined process.
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: 1,
              title: "Choose a Room",
              description: "Select from our dance, SRC, or music rooms based on your needs."
            },
            {
              step: 2,
              title: "Select Date & Time",
              description: "Pick a date and choose from available 30-minute time slots."
            },
            {
              step: 3,
              title: "Confirm Booking",
              description: "Fill in your details and receive a confirmation email instantly."
            }
          ].map((item, index) => (
            <motion.div 
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card rounded-xl p-6 text-center"
            >
              <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-gold font-semibold">{item.step}</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-gray-400">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* Footer */}
      <footer className="container max-w-6xl mx-auto px-4 pt-16 pb-8">
        <div className="border-t border-navy-light/20 pt-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Room Booking System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
