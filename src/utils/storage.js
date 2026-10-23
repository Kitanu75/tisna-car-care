import livePricingJson from '../data/livePricing.json';
import { 
  syncPricingToCloud, 
  fetchPricingFromCloud, 
  subscribeToPricingChanges, 
  syncBookingToCloud 
} from './firebase';

const STORAGE_KEYS = {
  USER: 'tisna_user',
  CARS: 'tisna_cars',
  ACTIVE_CAR_ID: 'tisna_active_car_id',
  BOOKINGS: 'tisna_bookings',
  NOTIFICATIONS: 'tisna_notifications',
  SERVICE_ADDRESS: 'tisna_service_address',
  PRICING: 'tisna_pricing_config',
};

// Cross-tab and Cross-Window Realtime Synchronization
let broadcastChannel = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    broadcastChannel = new BroadcastChannel('tisna_pricing_channel');
    broadcastChannel.onmessage = (event) => {
      if (event.data?.type === 'PRICING_UPDATED') {
        window.dispatchEvent(new Event('tisna_pricing_updated'));
      }
    };
  }
} catch (e) {
  // fallback
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEYS.PRICING) {
      window.dispatchEvent(new Event('tisna_pricing_updated'));
    }
  });
}

const DEFAULT_USER = {
  name: "Palash Gogoi",
  phone: "+91 98765 43210",
  email: "palash.gogoi@tisnacarcare.com",
  isLoggedIn: true,
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
};

const DEFAULT_CARS = [
  {
    id: "car_1",
    brand: "Honda",
    model: "City",
    year: "2018",
    regNumber: "DL 08 AB 1234",
    fuelType: "Petrol",
    carType: "sedan",
    image: "/assets/honda-city.png",
    isPrimary: true,
    addedAt: "2026-01-15"
  }
];

// Initial default pricing matching user specifications
export const DEFAULT_PRICING = {
  carTypePricing: {
    basic: {
      hatchback: 500, // Small car
      sedan: 600,     // Sedan
      suv: 700,       // SUV
      luxury: 850
    },
    premium: {
      hatchback: 800, // Small car
      sedan: 1100,    // Sedan
      suv: 1300,      // SUV
      luxury: 1600
    }
  },
  discounts: {
    '3m': 7,  // 7% discount for 3 months
    '6m': 11  // 11% discount for 6 months
  },
  subscriptionPlans: {
    basic: {
      '1m': 0,
      '3m': 0,
      '6m': 0
    },
    premium: {
      '1m': 0,
      '3m': 0,
      '6m': 0
    }
  },
  otherServices: {
    'jet-spray': 500,
    'dry-clean': 1200,
    'polishing': 400,
    'glass-cleaning': 300,
    'engine-bay-clean': 500
  },
  payment: {
    paymentPhone: "+91 70420 62926",
    whatsappNumber: "917042062926",
    upiId: "tisnacarcare@upi",
    platformFee: 0
  }
};

const DEFAULT_BOOKINGS = [];

const DEFAULT_ADDRESS = "";

export const storage = {
  // Pricing Configuration (Editable online by Admin with multi-device sync)
  getPricing: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PRICING);
      const fallback = (livePricingJson && typeof livePricingJson === 'object') ? livePricingJson : DEFAULT_PRICING;
      if (data) {
        const parsed = JSON.parse(data);
        return {
          ...fallback,
          ...parsed,
          carTypePricing: {
            basic: { ...fallback.carTypePricing?.basic, ...(parsed.carTypePricing?.basic || {}) },
            premium: { ...fallback.carTypePricing?.premium, ...(parsed.carTypePricing?.premium || {}) }
          },
          discounts: {
            '1m': Number(parsed.discounts?.['1m'] ?? fallback.discounts?.['1m'] ?? 0),
            '3m': Number(parsed.discounts?.['3m'] ?? fallback.discounts?.['3m'] ?? 7),
            '6m': Number(parsed.discounts?.['6m'] ?? fallback.discounts?.['6m'] ?? 11)
          },
          otherServices: { ...fallback.otherServices, ...(parsed.otherServices || {}) },
          payment: { ...fallback.payment, ...(parsed.payment || {}) }
        };
      }
      return fallback;
    } catch {
      return DEFAULT_PRICING;
    }
  },

  // Calculate plan duration price directly from Daily Price of that car segment and Admin's discount percentages
  calculatePlanPrice: (planKey = 'basic', durationId = '1m', carSegment = 'sedan', customPricing = null) => {
    // Support backward-compatible calling convention: calculatePlanPrice(planKey, durationId, pricingObj)
    let segment = typeof carSegment === 'string' ? carSegment : 'sedan';
    let p = (typeof carSegment === 'object' && carSegment !== null) ? carSegment : (customPricing || storage.getPricing());

    const planType = planKey === 'premium' ? 'premium' : 'basic';
    const fallbackDaily = planType === 'basic' ? 600 : 1100;
    const dailyRate = Number(p.carTypePricing?.[planType]?.[segment] ?? fallbackDaily);

    if (durationId === 'daily') {
      return dailyRate;
    }

    const discount1m = Number(p.discounts?.['1m'] ?? 0);
    const discount3m = Number(p.discounts?.['3m'] ?? 7);
    const discount6m = Number(p.discounts?.['6m'] ?? 11);

    if (durationId === '1m') {
      // 30 days
      const raw = dailyRate * 30;
      return Math.round(raw * (1 - (discount1m / 100)));
    }
    if (durationId === '3m') {
      // 90 days (3 months)
      const raw = dailyRate * 90;
      return Math.round(raw * (1 - (discount3m / 100)));
    }
    if (durationId === '6m') {
      // 180 days (6 months)
      const raw = dailyRate * 180;
      return Math.round(raw * (1 - (discount6m / 100)));
    }
    return dailyRate;
  },

  savePricing: (newPricing) => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRICING, JSON.stringify(newPricing));
      
      // 1. Dispatch event in current tab
      window.dispatchEvent(new Event('tisna_pricing_updated'));

      // 2. Broadcast to all other open tabs/windows
      if (broadcastChannel) {
        broadcastChannel.postMessage({ type: 'PRICING_UPDATED', pricing: newPricing });
      }

      // 3. Persist to Firebase Cloud (Firestore & Realtime Database)
      syncPricingToCloud(newPricing).catch(err => {
        console.warn('Firebase pricing sync note:', err);
      });

      // 4. Persist to local server on disk if dev server running
      fetch('/api/pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPricing)
      }).catch(err => {
        // silent note
      });
    } catch (e) {
      console.error(e);
    }
  },

  resetPricing: () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.PRICING);
      window.dispatchEvent(new Event('tisna_pricing_updated'));
      if (broadcastChannel) {
        broadcastChannel.postMessage({ type: 'PRICING_UPDATED', pricing: DEFAULT_PRICING });
      }
      syncPricingToCloud(DEFAULT_PRICING).catch(() => {});
      fetch('/api/pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(DEFAULT_PRICING)
      }).catch(() => {});
    } catch (e) {
      console.error(e);
    }
  },

  // Auto-sync prices from Firebase Cloud & server on startup
  initServerSync: async () => {
    try {
      if (typeof window === 'undefined') return;

      // 1. Realtime listener from Firebase Cloud
      subscribeToPricingChanges((cloudPricing) => {
        if (cloudPricing && typeof cloudPricing === 'object') {
          const localStr = localStorage.getItem(STORAGE_KEYS.PRICING);
          const cloudStr = JSON.stringify(cloudPricing);
          if (localStr !== cloudStr) {
            localStorage.setItem(STORAGE_KEYS.PRICING, cloudStr);
            window.dispatchEvent(new Event('tisna_pricing_updated'));
          }
        }
      });

      // 2. Initial fetch from Firebase Cloud
      const cloudData = await fetchPricingFromCloud();
      if (cloudData && typeof cloudData === 'object') {
        const localStr = localStorage.getItem(STORAGE_KEYS.PRICING);
        const cloudStr = JSON.stringify(cloudData);
        if (localStr !== cloudStr) {
          localStorage.setItem(STORAGE_KEYS.PRICING, cloudStr);
          window.dispatchEvent(new Event('tisna_pricing_updated'));
          return;
        }
      }

      // 3. Fallback to local server API
      const res = await fetch('/api/pricing');
      if (res.ok) {
        const serverData = await res.json();
        if (serverData && typeof serverData === 'object') {
          const localStr = localStorage.getItem(STORAGE_KEYS.PRICING);
          const serverStr = JSON.stringify(serverData);
          if (localStr !== serverStr) {
            localStorage.setItem(STORAGE_KEYS.PRICING, serverStr);
            window.dispatchEvent(new Event('tisna_pricing_updated'));
          }
        }
      }
    } catch (err) {
      // offline fallback
    }
  },

  // User Profile
  getUser: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER);
      return data ? JSON.parse(data) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  },
  setUser: (user) => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
  },

  // Cars
  getCars: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CARS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.CARS, JSON.stringify(DEFAULT_CARS));
        return DEFAULT_CARS;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_CARS;
    }
  },
  saveCars: (cars) => {
    try {
      localStorage.setItem(STORAGE_KEYS.CARS, JSON.stringify(cars));
    } catch (e) {
      console.error(e);
    }
  },
  addCar: (car) => {
    const cars = storage.getCars();
    const newCar = {
      ...car,
      id: "car_" + Date.now(),
      image: car.image || "/assets/honda-city.png",
      addedAt: new Date().toISOString()
    };
    cars.push(newCar);
    storage.saveCars(cars);
    storage.setActiveCarId(newCar.id);
    return newCar;
  },
  getActiveCarId: () => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_CAR_ID);
    if (saved) return saved;
    const cars = storage.getCars();
    return cars[0]?.id || "car_1";
  },
  setActiveCarId: (carId) => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_CAR_ID, carId);
  },
  getActiveCar: () => {
    const cars = storage.getCars();
    const activeId = storage.getActiveCarId();
    return cars.find(c => c.id === activeId) || cars[0] || DEFAULT_CARS[0];
  },

  // Bookings
  getBookings: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  addBooking: (booking) => {
    const bookings = storage.getBookings();
    const newBooking = {
      ...booking,
      id: booking.id || "TCC" + Math.floor(10000000 + Math.random() * 90000000),
      createdAt: new Date().toISOString(),
      status: "Payment Verification Pending",
      statusColor: "amber",
      isUpcoming: true
    };
    bookings.unshift(newBooking);
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));

    // 1. Sync to Firebase Cloud (Firestore & Realtime Database)
    syncBookingToCloud(newBooking).catch(err => {
      console.warn('Firebase booking sync note:', err);
    });

    // 2. Also persist to local dev server disk if running
    fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBooking)
    }).catch(err => console.warn('Booking server sync note:', err));

    return newBooking;
  },

  updateBookingPaymentStatus: (bookingId, newStatus) => {
    const bookings = storage.getBookings();
    const updated = bookings.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          paymentStatus: newStatus,
          status: newStatus === 'Payment Verified' ? 'Confirmed' : 'Payment Verification Pending',
          statusColor: newStatus === 'Payment Verified' ? 'emerald' : 'amber'
        };
      }
      return b;
    });
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updated));
    const target = updated.find(b => b.id === bookingId);
    if (target) {
      // 1. Sync to Firebase Cloud
      syncBookingToCloud(target).catch(err => {
        console.warn('Firebase booking status sync note:', err);
      });

      // 2. Local dev server disk
      fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(target)
      }).catch(err => console.warn('Booking status sync note:', err));
    }
    return updated;
  },

  // Address
  getServiceAddress: () => {
    return localStorage.getItem(STORAGE_KEYS.SERVICE_ADDRESS) || DEFAULT_ADDRESS;
  },
  setServiceAddress: (addr) => {
    localStorage.setItem(STORAGE_KEYS.SERVICE_ADDRESS, addr);
  },

  // Reset demo state
  resetAll: () => {
    localStorage.clear();
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(DEFAULT_USER));
    localStorage.setItem(STORAGE_KEYS.CARS, JSON.stringify(DEFAULT_CARS));
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(DEFAULT_BOOKINGS));
    localStorage.setItem(STORAGE_KEYS.SERVICE_ADDRESS, DEFAULT_ADDRESS);
  }
};
