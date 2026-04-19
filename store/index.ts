import { create } from 'zustand';
import { Destination, Booking, User } from '../types';

interface AppState {
  user: User | null;
  destinations: Destination[];
  bookings: Booking[];
  selectedDestination: Destination | null;
  isLoading: boolean;
  searchQuery: string;
  
  // Actions
  setUser: (user: User | null) => void;
  setDestinations: (destinations: Destination[]) => void;
  setSelectedDestination: (destination: Destination | null) => void;
  addBooking: (booking: Booking) => void;
  setBookings: (bookings: Booking[]) => void;
  setLoading: (loading: boolean) => void;
  setSearchQuery: (query: string) => void;
}

export const useStore = create<AppState>((set) => ({
  user: { id: '1', name: 'Blue Ocean Traveler', email: 'traveler@blueocean.com' },
  destinations: [],
  bookings: [],
  selectedDestination: null,
  isLoading: false,
  searchQuery: '',
  
  setUser: (user) => set({ user }),
  setDestinations: (destinations) => set({ destinations }),
  setSelectedDestination: (destination) => set({ selectedDestination: destination }),
  addBooking: (booking) => set((state) => ({ bookings: [booking, ...state.bookings] })),
  setBookings: (bookings) => set({ bookings }),
  setLoading: (isLoading) => set({ isLoading }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
}));