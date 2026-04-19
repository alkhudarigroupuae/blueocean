import axios from 'axios';
import { Destination, Booking, BookingRequest } from '../types';

const API_KEY = 'YOUR_RAPIDAPI_KEY'; // User needs to add their RapidAPI key
const BASE_URL = 'https://travel-advisor.p.rapidapi.com';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'X-RapidAPI-Key': API_KEY,
    'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com',
  },
});

// Sample destinations data (for demo when API unavailable)
export const sampleDestinations: Destination[] = [
  {
    id: '1',
    name: 'Maldives Paradise',
    country: 'Maldives',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800',
    price: 2499,
    rating: 4.9,
    description: 'Experience the ultimate tropical getaway in the pristine Maldives islands. Crystal clear waters, white sandy beaches, and luxurious over-water villas await you.',
    duration: '7 Days / 6 Nights',
    highlights: ['Over-water villa', 'Snorkeling', 'Sunset dinner', 'Spa treatment'],
  },
  {
    id: '2',
    name: 'Bali Adventure',
    country: 'Indonesia',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
    price: 1299,
    rating: 4.7,
    description: 'Discover the magical island of Bali with its ancient temples, lush rice terraces, and vibrant culture. Perfect for adventure seekers and wellness enthusiasts.',
    duration: '6 Days / 5 Nights',
    highlights: ['Temple visits', 'Rice terraces', 'Volcano trek', 'Beach club'],
  },
  {
    id: '3',
    name: 'Santorini Escape',
    country: 'Greece',
    image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800',
    price: 1899,
    rating: 4.8,
    description: 'Wake up to stunning sunset views in the iconic white-washed buildings of Santorini. Experience Greek hospitality, delicious cuisine, and romantic beach dinners.',
    duration: '5 Days / 4 Nights',
    highlights: ['Sunset views', 'Wine tasting', 'Boat tour', 'Beach dinner'],
  },
  {
    id: '4',
    name: 'Dubai Luxury',
    country: 'UAE',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
    price: 3299,
    rating: 4.6,
    description: 'Indulge in ultra-luxury experiences in Dubai. From desert safaris to world-class shopping and breathtaking attractions, experience the best of modern Arabia.',
    duration: '5 Days / 4 Nights',
    highlights: ['Desert safari', 'Burj Khalifa', 'Shopping', 'Luxury hotel'],
  },
  {
    id: '5',
    name: 'Swiss Alps',
    country: 'Switzerland',
    image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a2?w=800',
    price: 2799,
    rating: 4.9,
    description: 'Escape to the majestic Swiss Alps for an unforgettable mountain adventure. Skiing, scenic train rides, and cozy chalets await in this winter wonderland.',
    duration: '6 Days / 5 Nights',
    highlights: ['Skiing', 'Scenic train', 'Mountain hike', 'Chocolate tour'],
  },
  {
    id: '6',
    name: 'Tokyo Discovery',
    country: 'Japan',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
    price: 2199,
    rating: 4.8,
    description: 'Explore the fascinating blend of ancient traditions and cutting-edge technology in Tokyo. From ancient temples to neon-lit streets, experience it all.',
    duration: '7 Days / 6 Nights',
    highlights: ['Temple tours', 'Anime culture', 'Food tour', 'Tech districts'],
  },
];

// Get all destinations
export const getDestinations = async (): Promise<Destination[]> => {
  try {
    const response = await api.get('/locations/list', {
      params: { ll: '40.7128,-74.0060', radius: '50' },
    });
    return response.data.data || sampleDestinations;
  } catch {
    return sampleDestinations;
  }
};

// Search destinations
export const searchDestinations = async (query: string): Promise<Destination[]> => {
  try {
    const response = await api.get('/locations/search', {
      params: { query, limit: '20' },
    });
    return response.data.data || sampleDestinations.filter(d => 
      d.name.toLowerCase().includes(query.toLowerCase()) ||
      d.country.toLowerCase().includes(query.toLowerCase())
    );
  } catch {
    return sampleDestinations.filter(d => 
      d.name.toLowerCase().includes(query.toLowerCase()) ||
      d.country.toLowerCase().includes(query.toLowerCase())
    );
  }
};

// Create booking (simulated)
export const createBooking = async (bookingRequest: BookingRequest): Promise<Booking> => {
  // In production, this would call RapidAPI payment/booking endpoint
  // For demo, we simulate the booking
  const confirmationCode = 'BO' + Math.random().toString(36).substring(2, 8).toUpperCase();
  
  const booking: Booking = {
    id: Date.now().toString(),
    destinationId: bookingRequest.destinationId,
    destinationName: 'Booked Destination',
    date: bookingRequest.date,
    guests: bookingRequest.guests,
    totalPrice: 0, // Would be calculated from API
    status: 'confirmed',
    confirmationCode,
    createdAt: new Date().toISOString(),
  };
  
  return booking;
};

export default api;