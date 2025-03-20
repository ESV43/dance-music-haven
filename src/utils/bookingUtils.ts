
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

// Send confirmation email to user
export const sendConfirmationEmail = async (booking: Booking): Promise<boolean> => {
  // In a real application, you would make an API call to a backend service
  // that would send an email using a service like SendGrid, Mailgun, etc.
  
  console.log(`Sending confirmation email to ${booking.email} for ${booking.room} room booking:`, booking);
  
  // Simulate a successful email sending (in a real app, this would be an actual API call)
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Confirmation email sent to ${booking.email} successfully!`);
      resolve(true);
    }, 1000);
  });
};

// Google Sheets integration for storing booking data
export const saveBookingToGoogleSheets = async (booking: Booking): Promise<boolean> => {
  // In a real application, you would make an API call to a backend service
  // that would then update the Google Sheet for the appropriate room
  
  console.log(`Saving booking to Google Sheets for ${booking.room} room:`, booking);
  
  // Simulate a successful API call (in a real app, this would be an actual API call)
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Booking saved to ${booking.room} Google Sheet successfully!`);
      resolve(true);
    }, 1000);
  });
};

// Create a new booking
export const createBooking = async (bookingData: BookingFormData): Promise<Booking> => {
  const bookings = loadBookings();
  
  // Check if any of the selected time slots are already booked
  const timeSlotIds = bookingData.timeSlotIds;
  const alreadyBookedSlots = timeSlotIds.filter(
    slotId => bookings.some(
      booking => 
        booking.room === bookingData.room && 
        booking.date.toDateString() === bookingData.date.toDateString() && 
        booking.timeSlots.some(slot => slot.id === slotId)
    )
  );
  
  if (alreadyBookedSlots.length > 0) {
    throw new Error(`${alreadyBookedSlots.length} of your selected time slots are already booked. Please select different slots.`);
  }
  
  // Find time slot details for all selected slots
  const timeSlots = generateTimeSlots();
  const selectedTimeSlots = timeSlots
    .filter(slot => timeSlotIds.includes(slot.id))
    .map(slot => ({ ...slot, isBooked: true }));
  
  if (selectedTimeSlots.length === 0) {
    throw new Error("Invalid time slots selected.");
  }
  
  // Create new booking
  const newBooking: Booking = {
    ...bookingData,
    id: `booking-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    createdAt: new Date(),
    timeSlots: selectedTimeSlots
  };
  
  // Save booking to Google Sheets based on room type
  try {
    const sheetSaved = await saveBookingToGoogleSheets(newBooking);
    if (!sheetSaved) {
      throw new Error("Failed to save booking to Google Sheets.");
    }
    
    // Send confirmation email
    const emailSent = await sendConfirmationEmail(newBooking);
    if (!emailSent) {
      console.warn("Failed to send confirmation email, but booking was saved.");
    }
  } catch (error) {
    console.error("Error in booking process:", error);
    throw new Error("Failed to complete booking. Please try again.");
  }
  
  // Save updated bookings to local storage
  saveBookings([...bookings, newBooking]);
  
  // Show success message
  toast.success(`Booking confirmed for ${selectedTimeSlots.length} time slots! A confirmation email has been sent.`);
  
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
  return bookings.flatMap((booking) => booking.timeSlots.map(slot => slot.id));
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

// Room details
export const roomDetails = [
  {
    id: "dance" as Room,
    name: "Dance Room",
    image: "/dance-room.jpg" 
  },
  {
    id: "src" as Room,
    name: "SRC Room",
    image: "/src-room.jpg"
  },
  {
    id: "music" as Room,
    name: "Music Room",
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
