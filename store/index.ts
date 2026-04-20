import create from 'zustand';
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
  
  // Imperial Platform Settings
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
    tenants: Array<{
      id: string;
      companyName: string;
      domain: string;
      apiKey: string;
      branding: {
        logoType: 'Icon' | 'FullText' | 'Hybrid';
        primaryColor: string;
        tagline: string;
      };
    }>;
    activeTenantId: string;
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

export const useStore = create<AppState>((set) => ({
  user: { id: '1', name: 'Imperial Traveler', email: 'traveler@ecommerco.ai' },
  destinations: [],
  bookings: [],
  news: [
    { 
      id: 'n1', 
      title: 'ecommerco.ai V2 Launch', 
      subtitle: 'The new standard in Enterprise Brokerage', 
      content: 'We are proud to announce the launch of ecommerco.ai V2, featuring our proprietary Imperial Handshake engine and OLED-optimized architecture.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
      createdAt: new Date().toISOString(),
      author: 'Imperial Team'
    },
    { 
      id: 'n2', 
      title: 'Imperial Engine Handshake', 
      subtitle: 'Real-time price brokerage activated', 
      content: 'Our global node clusters are now live, providing real-time price brokerage across 50+ countries with sub-200ms latency.',
      image: 'https://images.unsplash.com/photo-1551288049-bbbda536339a?auto=format&fit=crop&w=1200&q=80',
      createdAt: new Date().toISOString(),
      author: 'Engineering'
    },
    { 
      id: 'n3', 
      title: 'Global Node Clusters', 
      subtitle: 'New low-latency servers in Beirut & Dubai', 
      content: 'Expansion of our infrastructure continues with new edge nodes in the Middle East, ensuring the fastest booking experience for our regional partners.',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&w=1200&q=80',
      createdAt: new Date().toISOString(),
      author: 'Infrastructure'
    },
    { 
      id: 'n4', 
      title: 'Zero-Compute Architecture', 
      subtitle: 'The future of local IDE development', 
      content: 'Our new zero-compute local IDE model allows developers to build massive platforms without the need for heavy local processing power.',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
      createdAt: new Date().toISOString(),
      author: 'CEO Office'
    }
  ],
  selectedDestination: null,
  isLoading: false,
  searchQuery: '',
  language: 'en',
  theme: 'dark',
  
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
      logoType: 'Hybrid',
      primaryColor: '#ed7430',
      companyName: 'ecommerco.ai',
      tagline: 'Imperial Enterprise & Brokerage Platform',
    },
    tenants: [
      {
        id: 'default',
        companyName: 'ecommerco.ai',
        domain: 'ecommerco.ai',
        apiKey: '6f2fcbc34fmsh738b32a4809cc60p13f140jsnb1110a344209',
        branding: {
          logoType: 'Hybrid',
          primaryColor: '#ed7430',
          tagline: 'Imperial Enterprise & Brokerage Platform',
        }
      }
    ],
    activeTenantId: 'default',
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
}));