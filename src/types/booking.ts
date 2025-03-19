
export type Room = 'dance' | 'src' | 'music';

export type TimeSlot = {
  id: string;
  startTime: string; // Format: "HH:MM"
  endTime: string; // Format: "HH:MM"
  isBooked: boolean;
};

export type RoomDetails = {
  id: Room;
  name: string;
  image: string;
};

export type BookingFormData = {
  teamHeadName: string;
  teamName: string;
  phone: string;
  email: string;
  purpose: string;
  room: Room;
  date: Date;
  timeSlotId: string;
};

export type Booking = BookingFormData & {
  id: string;
  createdAt: Date;
  timeSlot: TimeSlot;
};
