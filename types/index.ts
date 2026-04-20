// Theme Colors
export const Colors = {
  primary: '#FFD400', // CEO's Yellow
  secondary: '#FFFFFF', // Clean White for Imperial look
  accent: '#FFD400', 
  background: '#000000', // OLED Pure Black
  backgroundLight: '#0A0A0A', // Near Black
  text: '#FFFFFF',
  textLight: '#A1A1AA', // Zinc 400
  textMuted: '#71717A', // Zinc 500
  white: '#FFFFFF',
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  border: '#27272A', // Zinc 800
};

// Destinations Types
export interface PriceOffer {
  id: string;
  provider: string; // e.g., 'Emirates', 'Middle East Airlines', 'Fly Dubai', 'Booking.com'
  price: number;
  type: 'Flight' | 'Hotel' | 'Package';
  logo?: string;
  details?: {
    flightNo?: string;
    stops?: number;
    baggage?: string;
    cabin?: 'Economy' | 'Business' | 'First';
    departureTime?: string;
    arrivalTime?: string;
  };
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  avatar?: string | null;
}

export interface NewsPost {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  image: string;
  createdAt: string;
  author: string;
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  image: string;
  price: number; // Lowest price
  highestPrice?: number; // Added for comparison
  rating: number;
  reviewCount: number;
  description: string;
  duration: string;
  highlights: string[];
  offers?: PriceOffer[]; // List of all available prices for this trip
  reviews?: Review[]; // Added reviews list
}

export interface Booking {
  id: string;
  destinationId: string;
  destinationName: string;
  date: string;
  guests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  confirmationCode: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

// Payment Types
export interface PaymentInfo {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

export interface BookingRequest {
  destinationId: string;
  date: string;
  guests: number;
  paymentInfo: PaymentInfo;
}