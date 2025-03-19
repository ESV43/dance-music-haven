
import { Booking, BookingFormData, Room, TimeSlot } from "@/types/booking";
import { toast } from "sonner";

// Generate time slots from 6 AM to 12 AM (midnight) in 30-minute intervals
export const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const startHour = 6; // 6 AM
  const endHour = 24; // 12 AM (midnight)

  for (let hour = startHour; hour < endHour; hour++) {
    // First 30-minute slot
    slots.push({
      id: `${hour}:00`,
      startTime: `${hour.toString().padStart(2, "0")}:00`,
      endTime: `${hour.toString().padStart(2, "0")}:30`,
      isBooked: false,
    });

    // Second 30-minute slot
    slots.push({
      id: `${hour}:30`,
      startTime: `${hour.toString().padStart(2, "0")}:30`,
      endTime: `${(hour === 23 ? 0 : hour + 1).toString().padStart(2, "0")}:00`,
      isBooked: false,
    });
  }

  return slots;
};

// Format time for display (convert from 24-hour to 12-hour format)
export const formatTime = (time: string): string => {
  const [hourStr, minute] = time.split(":");
  const hour = parseInt(hourStr, 10);
  
  if (hour === 0) {
    return `12:${minute} AM`;
  } else if (hour < 12) {
    return `${hour}:${minute} AM`;
  } else if (hour === 12) {
    return `12:${minute} PM`;
  } else {
    return `${hour - 12}:${minute} PM`;
  }
};

// Format date for display
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

// Local storage key for bookings
const BOOKINGS_STORAGE_KEY = "room-bookings";

// Load bookings from local storage
export const loadBookings = (): Booking[] => {
  const bookingsJson = localStorage.getItem(BOOKINGS_STORAGE_KEY);
  if (!bookingsJson) return [];
  
  try {
    const bookings = JSON.parse(bookingsJson);
    // Convert string dates back to Date objects
    return bookings.map((booking: any) => ({
      ...booking,
      date: new Date(booking.date),
      createdAt: new Date(booking.createdAt)
    }));
  } catch (error) {
    console.error("Error loading bookings:", error);
    return [];
  }
};

// Save bookings to local storage
export const saveBookings = (bookings: Booking[]): void => {
  localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
};

// Create a new booking
export const createBooking = (bookingData: BookingFormData): Booking => {
  const bookings = loadBookings();
  
  // Check if time slot is already booked
  const isSlotBooked = bookings.some(
    (booking) => 
      booking.room === bookingData.room && 
      booking.date.toDateString() === bookingData.date.toDateString() && 
      booking.timeSlotId === bookingData.timeSlotId
  );
  
  if (isSlotBooked) {
    throw new Error("This time slot is already booked. Please select another.");
  }
  
  // Find time slot details
  const timeSlots = generateTimeSlots();
  const timeSlot = timeSlots.find(slot => slot.id === bookingData.timeSlotId);
  
  if (!timeSlot) {
    throw new Error("Invalid time slot selected.");
  }
  
  // Create new booking
  const newBooking: Booking = {
    ...bookingData,
    id: `booking-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    createdAt: new Date(),
    timeSlot: { ...timeSlot, isBooked: true }
  };
  
  // Save updated bookings
  saveBookings([...bookings, newBooking]);
  
  // Simulate sending confirmation email
  simulateSendConfirmationEmail(newBooking);
  
  return newBooking;
};

// Get all bookings for a specific room and date
export const getBookingsForRoomAndDate = (room: Room, date: Date): Booking[] => {
  const bookings = loadBookings();
  return bookings.filter(
    (booking) => booking.room === room && booking.date.toDateString() === date.toDateString()
  );
};

// Get all booked time slot IDs for a specific room and date
export const getBookedTimeSlotIds = (room: Room, date: Date): string[] => {
  const bookings = getBookingsForRoomAndDate(room, date);
  return bookings.map((booking) => booking.timeSlotId);
};

// Check if a time slot is booked
export const isTimeSlotBooked = (room: Room, date: Date, timeSlotId: string): boolean => {
  const bookedSlotIds = getBookedTimeSlotIds(room, date);
  return bookedSlotIds.includes(timeSlotId);
};

// Get available time slots for a specific room and date
export const getAvailableTimeSlots = (room: Room, date: Date): TimeSlot[] => {
  const allTimeSlots = generateTimeSlots();
  const bookedSlotIds = getBookedTimeSlotIds(room, date);
  
  return allTimeSlots.map(slot => ({
    ...slot,
    isBooked: bookedSlotIds.includes(slot.id)
  }));
};

// Simulate sending a confirmation email
export const simulateSendConfirmationEmail = (booking: Booking): void => {
  console.log("Confirmation email sent to:", booking.email, {
    subject: `Booking Confirmation: ${booking.room.toUpperCase()} Room`,
    body: `
      Dear ${booking.teamHeadName},
      
      Your booking for the ${booking.room.toUpperCase()} Room has been confirmed.
      
      Details:
      - Date: ${formatDate(booking.date)}
      - Time: ${formatTime(booking.timeSlot.startTime)} - ${formatTime(booking.timeSlot.endTime)}
      - Team: ${booking.teamName}
      - Purpose: ${booking.purpose}
      
      Thank you for your booking!
    `
  });
  
  // Show success message
  toast.success("Booking confirmed! A confirmation email has been sent to your email address.");
};

// Room details
export const roomDetails = [
  {
    id: "dance" as Room,
    name: "Dance Room",
    description: "A spacious studio with hardwood floors, mirrors, and professional sound system. Perfect for dance rehearsals, choreography sessions, and group performances.",
    image: "/dance-room.jpg" 
  },
  {
    id: "src" as Room,
    name: "SRC Room",
    description: "Multi-purpose space with flexible setup options. Suitable for meetings, workshops, presentations, and collaborative sessions.",
    image: "/src-room.jpg"
  },
  {
    id: "music" as Room,
    name: "Music Room",
    description: "Acoustically treated room with professional audio equipment. Ideal for music practice, recording sessions, and band rehearsals.",
    image: "/music-room.jpg"
  }
];

// Create default images if they don't exist
export const initializeDefaultImages = () => {
  // Using placeholder images for now, but these could be replaced with actual images
  return {
    "dance-room": "https://images.unsplash.com/photo-1594737626072-90dc274bc2bd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    "src-room": "https://images.unsplash.com/photo-1497215842964-222b430dc094?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    "music-room": "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  };
};
