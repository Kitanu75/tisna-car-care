import { initializeApp } from "firebase/app";
import { 
  getDatabase, 
  ref, 
  set, 
  get, 
  onValue 
} from "firebase/database";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  getDocs, 
  onSnapshot 
} from "firebase/firestore";

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

// Initialize Realtime Database as Primary Cloud Database
export const rtdb = getDatabase(app);
export const firestore = getFirestore(app);

/**
 * Cloud Sync Service for Tisna Car Care
 * Uses Firebase Realtime Database as primary, with Firestore & localStorage fallbacks.
 */

// 1. Save pricing to Cloud
export async function syncPricingToCloud(pricingData) {
  let synced = false;

  // Realtime Database (Primary)
  try {
    const pricingRef = ref(rtdb, "tisna_config/pricing");
    await set(pricingRef, pricingData);
    synced = true;
    console.log("Pricing synced to Firebase Realtime Database!");
  } catch (err) {
    console.warn("RTDB pricing sync note:", err?.message || err);
  }

  // Also backup to Firestore if active
  try {
    const pricingDoc = doc(firestore, "tisna_config", "pricing");
    await setDoc(pricingDoc, pricingData, { merge: true });
    synced = true;
  } catch (err) {
    // silent fallback
  }

  return synced;
}

// 2. Fetch pricing from Cloud (once)
export async function fetchPricingFromCloud() {
  // Try Realtime Database first (fastest)
  try {
    const pricingRef = ref(rtdb, "tisna_config/pricing");
    const snap = await get(pricingRef);
    if (snap.exists()) {
      return snap.val();
    }
  } catch (err) {
    console.warn("RTDB get pricing note:", err?.message || err);
  }

  // Fallback to Firestore
  try {
    const pricingDoc = doc(firestore, "tisna_config", "pricing");
    const snap = await getDoc(pricingDoc);
    if (snap.exists()) {
      return snap.data();
    }
  } catch (err) {}

  return null;
}

// 3. Listen to realtime pricing changes
export function subscribeToPricingChanges(callback) {
  let unsubRtdb = null;
  let unsubFirestore = null;

  try {
    const pricingRef = ref(rtdb, "tisna_config/pricing");
    unsubRtdb = onValue(pricingRef, (snap) => {
      if (snap.exists()) {
        callback(snap.val());
      }
    }, (err) => {
      console.warn("RTDB pricing listener note:", err?.message || err);
    });
  } catch (e) {}

  try {
    const pricingDoc = doc(firestore, "tisna_config", "pricing");
    unsubFirestore = onSnapshot(pricingDoc, (snap) => {
      if (snap.exists()) {
        callback(snap.data());
      }
    }, () => {});
  } catch (e) {}

  return () => {
    if (unsubRtdb) unsubRtdb();
    if (unsubFirestore) unsubFirestore();
  };
}

// 4. Save booking to Cloud
export async function syncBookingToCloud(booking) {
  let synced = false;
  const bookingId = booking.id;

  // Realtime Database (Primary)
  try {
    const bookingRef = ref(rtdb, `tisna_bookings/${bookingId}`);
    await set(bookingRef, booking);
    synced = true;
    console.log(`Booking ${bookingId} saved to Firebase Realtime Database!`);
  } catch (err) {
    console.warn("RTDB booking sync note:", err?.message || err);
  }

  // Backup to Firestore if enabled
  try {
    const bookingDoc = doc(firestore, "tisna_bookings", bookingId);
    await setDoc(bookingDoc, booking, { merge: true });
    synced = true;
  } catch (err) {}

  return synced;
}

// 5. Fetch all bookings from Cloud
export async function fetchBookingsFromCloud() {
  // Realtime Database (Primary)
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
    console.warn("RTDB get bookings note:", err?.message || err);
  }

  // Fallback to Firestore
  try {
    const bookingsCol = collection(firestore, "tisna_bookings");
    const snap = await getDocs(bookingsCol);
    if (!snap.empty) {
      const list = [];
      snap.forEach((d) => list.push(d.data()));
      list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      return list;
    }
  } catch (err) {}

  return null;
}

// 6. Listen to live bookings
export function subscribeToBookings(callback) {
  let unsubRtdb = null;
  let unsubFirestore = null;

  try {
    const bookingsRef = ref(rtdb, "tisna_bookings");
    unsubRtdb = onValue(bookingsRef, (snap) => {
      if (snap.exists()) {
        const data = snap.val();
        const list = Object.values(data);
        list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        callback(list);
      }
    }, () => {});
  } catch (e) {}

  try {
    const bookingsCol = collection(firestore, "tisna_bookings");
    unsubFirestore = onSnapshot(bookingsCol, (snap) => {
      const list = [];
      snap.forEach((d) => list.push(d.data()));
      list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      callback(list);
    }, () => {});
  } catch (e) {}

  return () => {
    if (unsubRtdb) unsubRtdb();
    if (unsubFirestore) unsubFirestore();
  };
}
