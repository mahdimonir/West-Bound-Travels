// Type definitions for West Bound Travels
export interface Room {
  type: string;
  count: number;
  maxPax: number;
  attachBath: boolean;
  balcony: boolean;
  price: number;
}

export interface Boat {
  id: string;
  _id?: string; // Keep for safety/legacy if any
  name: string;
  type: 'AC' | 'Non-AC' | 'NON_AC';
  rooms: Room[];
  totalRooms: number;
  isActive: boolean;
  images: string[];
  features: string[];
  description?: string;
}

export interface Destination {
  id: string;
  name: string;
  description: string;
  images: string[];
  location?: string;
  createdAt?: string;
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
  id?: string;
  _id?: string;
  title: string;
  content: string;
  slug: string;
  excerpt?: string;
  author?: string;
  publishedAt?: string;
  coverImage?: string;
  image?: string; // Kept for backward compatibility if any
  images?: string[];
  status?: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ContactForm {
  name: string;
  email: string;
  phone?: string;
  message: string;
  subject?: string;
}
