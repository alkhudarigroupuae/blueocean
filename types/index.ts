// Theme Colors
export const Colors = {
  primary: '#ed7430', // New Brand Color
  secondary: '#00A3CC',
  accent: '#ed7430', // Unified with brand
  background: '#FFFFFF',
  backgroundLight: '#F5F8FA',
  text: '#1A1A1A',
  textLight: '#666666',
  textMuted: '#999999',
  white: '#FFFFFF',
  success: '#22C55E',
  error: '#EF4444',
  warning: '#F59E0B',
  border: '#E5E7EB',
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
  avatar?: string;
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