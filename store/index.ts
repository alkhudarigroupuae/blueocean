import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Destination, Booking, User, NewsPost } from '../types';

interface AppState {
  user: User | null;
  destinations: Destination[];
  bookings: Booking[];
  news: NewsPost[];
  selectedDestination: Destination | null;
  isLoading: boolean;
  searchQuery: string;
  language: 'ar' | 'en' | 'fr' | 'es' | 'de';
  theme: 'light' | 'dark';
  
  // SaaS / Broker Settings
  apiSettings: {
    markupPercentage: number;
    certificates: Array<{
      id: string;
      alias: string;
      content: string;
      type: 'File' | 'Text';
      addedAt: string;
    }>;
    subscriptions: Array<{
      id: string;
      apiName: string;
      plan: string;
      status: 'Active' | 'Inactive';
      dateSubscribed: string;
      quotaUsage: string;
    }>;
    providers: {
      [key: string]: {
        apiKey: string;
        apiHost: string;
        enabled: boolean;
      };
    };
    paymentGateways: {
      activeGateway: 'Stripe' | 'Tap' | 'NOWPayments' | 'PayPal' | 'Manual' | 'None';
      stripeKey: string;
      tapKey: string;
      nowPaymentsKey: string;
      paypalClientId: string;
      paypalSecret: string;
      manualCryptoAddress: string;
      manualCryptoNetwork: string;
      enabledMethods: {
        card: boolean;
        paypal: boolean;
        applePay: boolean;
        googlePay: boolean;
        crypto: boolean;
      };
    };
    branding: {
      logoType: 'Icon' | 'FullText' | 'Hybrid';
      primaryColor: string;
      companyName: string;
      tagline: string;
    };
  };
  
  // Actions
  setUser: (user: User | null) => void;
  setDestinations: (destinations: Destination[]) => void;
  setSelectedDestination: (destination: Destination | null) => void;
  addBooking: (booking: Booking) => void;
  setBookings: (bookings: Booking[]) => void;
  addNews: (post: NewsPost) => void;
  setNews: (news: NewsPost[]) => void;
  deleteNews: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setSearchQuery: (query: string) => void;
  setLanguage: (lang: AppState['language']) => void;
  setTheme: (theme: AppState['theme']) => void;
  updateApiSettings: (settings: Partial<AppState['apiSettings']>) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: { id: '1', name: 'Blue Ocean Traveler', email: 'traveler@blueocean.com' },
      destinations: [],
      bookings: [],
      news: [
        { 
          id: '1', 
          title: 'Global Travel Update', 
          subtitle: 'New visa-free routes for 2026', 
          content: 'The world is opening up! Several countries have announced new visa-free travel arrangements for UAE residents in 2026.',
          image: 'https://images.unsplash.com/photo-1502602898657-3e917247a184?auto=format&fit=crop&w=800&q=80',
          createdAt: new Date().toISOString(),
          author: 'Admin'
        },
        { 
          id: '2', 
          title: 'Dubai Luxury Deals', 
          subtitle: 'Save 40% on Burj Al Arab packages', 
          content: 'Experience the height of luxury for less. Exclusive summer discounts are now available for all Imperial travel members.',
          image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
          createdAt: new Date().toISOString(),
          author: 'Admin'
        }
      ],
      selectedDestination: null,
      isLoading: false,
      searchQuery: '',
      language: 'en',
      theme: 'light',
      
      apiSettings: {
        markupPercentage: 15,
        certificates: [],
        subscriptions: [
          { id: '69d355f0f8c79228df20167c', apiName: 'Flights sky', plan: 'Basic ($0.00 /mo)', status: 'Active', dateSubscribed: 'Apr 6, 2026 10:42', quotaUsage: '0%' },
          { id: '699ef6c8935ecb4d0f79632b', apiName: 'NOWPayments', plan: 'Basic ($0.00 /mo)', status: 'Active', dateSubscribed: 'Feb 25, 2026 17:19', quotaUsage: 'N/A' },
          { id: '6944c087060be1fee97216ba', apiName: 'BIN Info Checker API', plan: 'Basic ($0.00 /mo)', status: 'Active', dateSubscribed: 'Dec 19, 2025 07:03', quotaUsage: '0%' },
          { id: '68f8b402bdce53c928b5d9a0', apiName: 'Demo Project', plan: 'Basic ($0.00 /mo)', status: 'Active', dateSubscribed: 'Oct 22, 2025 14:37', quotaUsage: '0%' },
        ],
        providers: {
          'Booking.com': { apiKey: '', apiHost: 'booking-com15.p.rapidapi.com', enabled: true },
          'Skyscanner': { apiKey: '', apiHost: 'skyscanner44.p.rapidapi.com', enabled: true },
          'TripAdvisor': { apiKey: '', apiHost: 'tripadvisor16.p.rapidapi.com', enabled: false },
          'Google Flights': { apiKey: '', apiHost: 'google-flights12.p.rapidapi.com', enabled: false },
        },
        paymentGateways: {
          activeGateway: 'None',
          stripeKey: '',
          tapKey: '',
          nowPaymentsKey: '',
          paypalClientId: '',
          paypalSecret: '',
          manualCryptoAddress: '',
          manualCryptoNetwork: 'USDT (TRC20)',
          enabledMethods: {
            card: true,
            paypal: true,
            applePay: true,
            googlePay: true,
            crypto: true,
          },
        },
        branding: {
          logoType: 'Icon',
          primaryColor: '#0066CC',
          companyName: 'Alkhudari Group',
          tagline: 'Imperial Travel & Brokerage Platform',
        },
      },
      
      setUser: (user) => set({ user }),
      setDestinations: (destinations) => set({ destinations }),
      setSelectedDestination: (destination) => set({ selectedDestination: destination }),
      addBooking: (booking) => set((state) => ({ bookings: [booking, ...state.bookings] })),
      setBookings: (bookings) => set({ bookings }),
      addNews: (post) => set((state) => ({ news: [post, ...state.news] })),
      setNews: (news) => set({ news }),
      deleteNews: (id) => set((state) => ({ news: state.news.filter(n => n.id !== id) })),
      setLoading: (isLoading) => set({ isLoading }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setLanguage: (language) => set({ language }),
      setTheme: (theme) => set({ theme }),
      updateApiSettings: (newSettings) => set((state) => ({ 
        apiSettings: { ...state.apiSettings, ...newSettings } 
      })),
    }),
    {
      name: 'blue-ocean-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);