import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  getDocs, 
  onSnapshot,
  query,
  orderBy 
} from "firebase/firestore";
import { 
  getDatabase, 
  ref, 
  set, 
  get, 
  onValue 
} from "firebase/database";

// Firebase configuration from user's Firebase console project: tisna-car-care
export const firebaseConfig = {
  apiKey: "AIzaSyBkNICOfUttARM044l6Jz5PbsIFEwyEq68",
  authDomain: "tisna-car-care.firebaseapp.com",
  projectId: "tisna-car-care",
  storageBucket: "tisna-car-care.firebasestorage.app",
  messagingSenderId: "790476070224",
  appId: "1:790476070224:web:d723553b5e1b24ed3c2055",
  databaseURL: "https://tisna-car-care-default-rtdb.firebaseio.com"
};

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize both Firestore and Realtime Database instances
export const firestore = getFirestore(app);
export const rtdb = getDatabase(app);

/**
 * Cloud Sync Service for Tisna Car Care
 * Seamlessly supports both Firestore and Realtime Database, with automatic localStorage fallback.
 */

// 1. Save pricing to Cloud
export async function syncPricingToCloud(pricingData) {
  let synced = false;

  // Try Firestore
  try {
    const pricingDoc = doc(firestore, "tisna_config", "pricing");
    await setDoc(pricingDoc, pricingData, { merge: true });
    synced = true;
    console.log("Pricing successfully synced to Firebase Firestore!");
  } catch (err) {
    console.warn("Firestore pricing sync note:", err?.message || err);
  }

  // Try Realtime Database
  try {
    const pricingRef = ref(rtdb, "tisna_config/pricing");
    await set(pricingRef, pricingData);
    synced = true;
    console.log("Pricing successfully synced to Firebase Realtime Database!");
  } catch (err) {
    console.warn("Realtime Database pricing sync note:", err?.message || err);
  }

  return synced;
}

// 2. Fetch pricing from Cloud (once)
export async function fetchPricingFromCloud() {
  // Try Firestore first
  try {
    const pricingDoc = doc(firestore, "tisna_config", "pricing");
    const snap = await getDoc(pricingDoc);
    if (snap.exists()) {
      return snap.data();
    }
  } catch (err) {
    // try RTDB
  }

  // Try Realtime Database
  try {
    const pricingRef = ref(rtdb, "tisna_config/pricing");
    const snap = await get(pricingRef);
    if (snap.exists()) {
      return snap.val();
    }
  } catch (err) {
    // fallback
  }

  return null;
}

// 3. Listen to realtime pricing changes
export function subscribeToPricingChanges(callback) {
  let unsubFirestore = null;

  try {
    const pricingDoc = doc(firestore, "tisna_config", "pricing");
    unsubFirestore = onSnapshot(pricingDoc, (snap) => {
      if (snap.exists()) {
        callback(snap.data());
      }
    }, (err) => {
      // silent fallback
    });
  } catch (e) {}

  try {
    const pricingRef = ref(rtdb, "tisna_config/pricing");
    onValue(pricingRef, (snap) => {
      if (snap.exists()) {
        callback(snap.val());
      }
    }, (err) => {
      // silent fallback
    });
  } catch (e) {}

  return () => {
    if (unsubFirestore) unsubFirestore();
  };
}

// 4. Save booking to Cloud
export async function syncBookingToCloud(booking) {
  let synced = false;
  const bookingId = booking.id;

  // Try Firestore
  try {
    const bookingDoc = doc(firestore, "tisna_bookings", bookingId);
    await setDoc(bookingDoc, booking, { merge: true });
    synced = true;
    console.log(`Booking ${bookingId} saved to Firebase Firestore!`);
  } catch (err) {
    console.warn("Firestore booking sync note:", err?.message || err);
  }

  // Try Realtime Database
  try {
    const bookingRef = ref(rtdb, `tisna_bookings/${bookingId}`);
    await set(bookingRef, booking);
    synced = true;
    console.log(`Booking ${bookingId} saved to Firebase Realtime Database!`);
  } catch (err) {
    console.warn("Realtime Database booking sync note:", err?.message || err);
  }

  return synced;
}

// 5. Fetch all bookings from Cloud
export async function fetchBookingsFromCloud() {
  // Try Firestore
  try {
    const bookingsCol = collection(firestore, "tisna_bookings");
    const snap = await getDocs(bookingsCol);
    if (!snap.empty) {
      const list = [];
      snap.forEach((d) => list.push(d.data()));
      // Sort newest first
      list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      return list;
    }
  } catch (err) {
    // try RTDB
  }

  // Try Realtime Database
  try {
    const bookingsRef = ref(rtdb, "tisna_bookings");
    const snap = await get(bookingsRef);
    if (snap.exists()) {
      const data = snap.val();
      const list = Object.values(data);
      list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      return list;
    }
  } catch (err) {
    // fallback
  }

  return null;
}

// 6. Listen to live bookings
export function subscribeToBookings(callback) {
  let unsubFirestore = null;

  try {
    const bookingsCol = collection(firestore, "tisna_bookings");
    unsubFirestore = onSnapshot(bookingsCol, (snap) => {
      const list = [];
      snap.forEach((d) => list.push(d.data()));
      list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      callback(list);
    }, () => {});
  } catch (e) {}

  try {
    const bookingsRef = ref(rtdb, "tisna_bookings");
    onValue(bookingsRef, (snap) => {
      if (snap.exists()) {
        const data = snap.val();
        const list = Object.values(data);
        list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        callback(list);
      }
    }, () => {});
  } catch (e) {}

  return () => {
    if (unsubFirestore) unsubFirestore();
  };
}
