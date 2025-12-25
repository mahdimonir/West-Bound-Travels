// Type definitions for West Bound Travels

export interface Room {
  type: string;
  count: number;
  maxPax: number;
  attachBath: boolean;
  balcony: boolean;
}

export interface Boat {
  _id: string;
  name: string;
  type: 'AC' | 'Non-AC';
  rooms: Room[];
  totalRooms: number;
  images: string[];
  description?: string;
}

export interface Destination {
  name: string;
  description: string;
  images: string[];
  location?: string;
}

export interface BookingRoom {
  type: string;
  quantity: number;
}

export interface Booking {
  _id?: string;
  boatId: string;
  roomsBooked: BookingRoom[];
  dates: {
    start: string;
    end: string;
  };
  pax: number;
  places: string[];
  price?: number;
  status?: 'pending' | 'confirmed' | 'cancelled';
  userId?: string;
}

export interface User {
  _id?: string;
  email: string;
  name?: string;
  phone?: string;
}

export interface BlogPost {
  _id?: string;
  title: string;
  content: string;
  slug: string;
  excerpt?: string;
  author?: string;
  publishedAt?: string;
  image?: string;
  tags?: string[];
}

export interface ContactForm {
  name: string;
  email: string;
  phone?: string;
  message: string;
  subject?: string;
}
