import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  deleteDoc
} from 'firebase/firestore';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Check if Firebase is configured
const isConfigured = !!(
  firebaseConfig.apiKey && 
  firebaseConfig.projectId
);

// Initialize Firebase only if configured
let app: ReturnType<typeof initializeApp> | null = null;
let db: ReturnType<typeof getFirestore> | null = null;

if (isConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
  }
}

// Collection and document names
export const TRIPS_COLLECTION = 'trips';
export const SUMMARIES_COLLECTION = 'tripSummaries';
export const SETTINGS_DOC = 'settings';

// Types for Firestore documents
export interface FirestoreTrip {
  id: string;
  name: string;
  driverCode: string;
  route: {
    origin: string;
    date: string;
    departureTime: string;
    destinations: Array<{
      id: string;
      name: string;
      price: number;
    }>;
  };
  seats: Array<{
    id: string;
    row: number;
    column: number;
    isOccupied: boolean;
    passengerName: string;
    passengerPhone: string;
    passengerDestination: string;
    passengerDestinationId: string | null;
    passengerPrice: number;
    passengerDestinations: Array<{
      destinationId: string;
      destinationName: string;
      price: number;
    }>;
    reservedAt: string | null;
    isPaid: boolean;
  }>;
  isActive: boolean;
  status?: 'active' | 'cancelled' | 'delayed';
  delayNewTime?: string;
  statusReason?: string;
  statusUpdatedAt?: string;
  removalLogs?: Array<{
    id: string;
    tripId: string;
    seatId: string;
    passengerName: string;
    passengerPhone: string;
    passengerDestination: string;
    passengerPrice: number;
    reason: string;
    removedAt: string;
    removedBy: 'driver';
  }>;
}

export interface FirestoreSettings {
  activeTripId: string | null;
}

export interface FirestoreTripSummary {
  id: string;
  tripId: string;
  tripName: string;
  date: string;
  departureTime: string;
  totalPassengers: number;
  removedPassengers: number;
  passengersByDestination: Record<string, number>;
  totalEarned: number;
  totalCollected: number;
  totalLost: number;
  completedAt: string;
}

// Export db for use in hooks
export { db, isConfigured };

// Helper functions for Firestore operations
export const firestoreHelpers = {
  // Trips
  async createTrip(trip: FirestoreTrip): Promise<void> {
    if (!db) throw new Error('Firestore not initialized');
    const tripRef = doc(db, TRIPS_COLLECTION, trip.id);
    await setDoc(tripRef, trip);
  },

  async updateTrip(tripId: string, updates: Partial<FirestoreTrip>): Promise<void> {
    if (!db) throw new Error('Firestore not initialized');
    const tripRef = doc(db, TRIPS_COLLECTION, tripId);
    await setDoc(tripRef, updates, { merge: true });
  },

  async deleteTrip(tripId: string): Promise<void> {
    if (!db) throw new Error('Firestore not initialized');
    await deleteDoc(doc(db, TRIPS_COLLECTION, tripId));
  },

  // Settings
  async updateSettings(settings: FirestoreSettings): Promise<void> {
    if (!db) throw new Error('Firestore not initialized');
    await setDoc(doc(db, SETTINGS_DOC, 'config'), settings, { merge: true });
  },

  // Trip Summaries
  async createSummary(summary: FirestoreTripSummary): Promise<void> {
    if (!db) throw new Error('Firestore not initialized');
    const summaryRef = doc(db, SUMMARIES_COLLECTION, summary.id);
    await setDoc(summaryRef, summary);
  },

  async deleteSummary(summaryId: string): Promise<void> {
    if (!db) throw new Error('Firestore not initialized');
    await deleteDoc(doc(db, SUMMARIES_COLLECTION, summaryId));
  },
};
