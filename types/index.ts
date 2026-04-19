// Theme Colors
export const Colors = {
  primary: '#0066CC',
  secondary: '#00A3CC',
  accent: '#FF6B35',
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
export interface Destination {
  id: string;
  name: string;
  country: string;
  image: string;
  price: number;
  rating: number;
  description: string;
  duration: string;
  highlights: string[];
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