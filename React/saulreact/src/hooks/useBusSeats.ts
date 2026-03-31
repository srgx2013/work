import { useState, useEffect, useCallback } from "react";
import type { Seat, RouteInfo, Trip, BusState, Destination, RemovalLog, TripSummary, TripStatus } from "../types/seat";
import { 
  db, 
  isConfigured, 
  TRIPS_COLLECTION, 
  SUMMARIES_COLLECTION, 
  SETTINGS_DOC,
  firestoreHelpers,
  type FirestoreTrip,
  type FirestoreTripSummary,
  type FirestoreSettings
} from "../services/firebase";
import { 
  onSnapshot, 
  collection, 
  doc, 
  type DocumentData,
  type QueryDocumentSnapshot 
} from "firebase/firestore";

// Constants
const STORAGE_KEY = "bus-seats-data";
const SUMMARIES_KEY = "bus-trip-summaries";
const MAX_SUMMARIES = 50;

const SEATS_PER_ROW = [2, 2, 3, 3, 4];

// Helper functions
const generateSeats = (): Seat[] => {
  const seats: Seat[] = [];
  const columns = ["A", "B", "C", "D"];

  SEATS_PER_ROW.forEach((count, rowIndex) => {
    const rowNumber = rowIndex + 1;
    for (let col = 0; col < count; col++) {
      const isDriverSeat = rowNumber === 1 && columns[col] === "A";
      seats.push({
        id: `${rowNumber}${columns[col]}`,
        row: rowNumber,
        column: col,
        isOccupied: isDriverSeat,
        passengerName: isDriverSeat ? "CONDUCTOR" : "",
        passengerPhone: "",
        passengerDestination: "",
        passengerDestinationId: null,
        passengerPrice: 0,
        passengerDestinations: [], // New array field for multiple destinations
        reservedAt: isDriverSeat ? new Date().toISOString() : null,
        isPaid: isDriverSeat,
      });
    }
  });

  return seats;
};

const getDefaultDestinations = (): Destination[] => [
  { id: "dest-1", name: "Puebla", price: 450 },
  { id: "dest-2", name: "Queretaro", price: 350 },
  { id: "dest-3", name: "Leon", price: 450 },
];

// Helper para obtener fecha local en formato YYYY-MM-DD (sin problemas de timezone)
const getLocalDateString = (date: Date = new Date()): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getDefaultRoute = (): RouteInfo => ({
  origin: "Terminal",
  date: getLocalDateString(), // Usar fecha local, no UTC
  departureTime: "08:00",
  destinations: getDefaultDestinations(),
});

// WARNING: Using fallback for development. Set VITE_DEFAULT_DRIVER_CODE in production!
const DEFAULT_DRIVER_CODE = import.meta.env.VITE_DEFAULT_DRIVER_CODE || "CONDUCTOR2024";

const createDefaultTrip = (): Trip => ({
  id: "trip-1",
  name: "Viaje 1",
  driverCode: DEFAULT_DRIVER_CODE || "NO-CONFIGURADO",
  route: getDefaultRoute(),
  seats: generateSeats(),
  isActive: true,
});

// Migration helper
const migrateTrip = (trip: any): Trip => {
  const oldDestinations = trip.route?.destinations;
  
  if (Array.isArray(oldDestinations)) {
    // Check if seats have passengerDestinations array
    if (trip.seats?.some((seat: any) => Array.isArray(seat.passengerDestinations))) {
      return trip as Trip; // Already migrated
    }
    
    // Migrate old seats to new format with passengerDestinations array
    return {
      ...trip,
      seats: trip.seats?.map((seat: any) => ({
        ...seat,
        passengerDestinations: seat.passengerDestination 
          ? [{ destinationId: seat.passengerDestinationId || "dest-1", destinationName: seat.passengerDestination, price: seat.passengerPrice || 0 }]
          : []
      })) || generateSeats()
    };
  }
  
  const oldDestination = trip.route?.destination || "Destino";
  const oldPrice = trip.route?.price || 450;
  
  return {
    ...trip,
    route: {
      origin: trip.route?.origin || "Terminal Central",
      date: trip.route?.date || getLocalDateString(),
      departureTime: trip.route?.departureTime || "08:00",
      destinations: [
        { id: "dest-1", name: oldDestination, price: oldPrice }
      ]
    },
    seats: trip.seats?.map((seat: any) => ({
      ...seat,
      passengerDestinationId: seat.passengerDestination ? "dest-1" : null,
      passengerPrice: seat.passengerDestination ? oldPrice : 0,
      passengerDestinations: seat.passengerDestination 
        ? [{ destinationId: seat.passengerDestinationId || "dest-1", destinationName: seat.passengerDestination, price: oldPrice }]
        : []
    })) || generateSeats()
  };
};

// LocalStorage helpers (fallback when Firebase is not configured)
const loadFromStorage = (): BusState | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      
      if (data.trips && Array.isArray(data.trips)) {
        return {
          trips: data.trips.map(migrateTrip),
          activeTripId: data.activeTripId || data.trips[0]?.id
        };
      } else if (data.route || data.seats) {
        const oldTrip: Trip = {
          id: "trip-1",
          name: "Viaje 1",
          driverCode: DEFAULT_DRIVER_CODE || "NO-CONFIGURADO",
          route: data.route || getDefaultRoute(),
          seats: data.seats || generateSeats(),
          isActive: true
        };
        
        return {
          trips: [migrateTrip(oldTrip)],
          activeTripId: "trip-1"
        };
      }
    }
  } catch (error) {
    console.error("Failed to load from storage:", error);
  }
  return null;
};

const saveToStorage = (state: BusState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Failed to save to storage:", error);
  }
};

const loadSummariesFromStorage = (): TripSummary[] => {
  try {
    const stored = localStorage.getItem(SUMMARIES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveSummariesToStorage = (summaries: TripSummary[]) => {
  try {
    localStorage.setItem(SUMMARIES_KEY, JSON.stringify(summaries));
  } catch {
    console.warn("Failed to save summaries to storage");
  }
};

const findTripByDriverCode = (trips: Trip[], code: string): Trip | undefined => {
  return trips.find((t) => t.driverCode === code && t.isActive);
};

// Convert Trip to FirestoreTrip
const tripToFirestore = (trip: Trip): FirestoreTrip => ({
  id: trip.id,
  name: trip.name,
  driverCode: trip.driverCode,
  route: trip.route,
  seats: trip.seats,
  isActive: trip.isActive,
  removalLogs: trip.removalLogs || [], // Firestore no acepta undefined
  status: trip.status || 'active',
  delayNewTime: trip.delayNewTime || '',
  statusReason: trip.statusReason || '',
  statusUpdatedAt: trip.statusUpdatedAt || '',
});

// Convert Firestore document to Trip
const firestoreToTrip = (snapshot: QueryDocumentSnapshot<DocumentData>): Trip => {
  const data = snapshot.data() as FirestoreTrip;
  return {
    id: snapshot.id,
    name: data.name,
    driverCode: data.driverCode,
    route: data.route,
    seats: data.seats,
    isActive: data.isActive,
    removalLogs: data.removalLogs,
    status: data.status || 'active',
    delayNewTime: data.delayNewTime || '',
    statusReason: data.statusReason || '',
    statusUpdatedAt: data.statusUpdatedAt || '',
  };
};

// Convert Firestore document to TripSummary
const firestoreToSummary = (snapshot: QueryDocumentSnapshot<DocumentData>): TripSummary => {
  const data = snapshot.data() as FirestoreTripSummary;
  return {
    id: snapshot.id,
    tripId: data.tripId,
    tripName: data.tripName,
    date: data.date,
    departureTime: data.departureTime,
    totalPassengers: data.totalPassengers,
    removedPassengers: data.removedPassengers,
    passengersByDestination: data.passengersByDestination,
    totalEarned: data.totalEarned,
    totalCollected: data.totalCollected,
    totalLost: data.totalLost,
    completedAt: data.completedAt,
  };
};

// Convert TripSummary to FirestoreTripSummary
const summaryToFirestore = (summary: TripSummary): FirestoreTripSummary => ({
  id: summary.id,
  tripId: summary.tripId,
  tripName: summary.tripName,
  date: summary.date,
  departureTime: summary.departureTime,
  totalPassengers: summary.totalPassengers,
  removedPassengers: summary.removedPassengers,
  passengersByDestination: summary.passengersByDestination,
  totalEarned: summary.totalEarned,
  totalCollected: summary.totalCollected,
  totalLost: summary.totalLost,
  completedAt: summary.completedAt,
});

export const useBusSeats = () => {
  const [trips, setTrips] = useState<Trip[]>(() => {
    if (isConfigured) return [];
    const stored = loadFromStorage();
    return stored?.trips?.length ? stored.trips : [createDefaultTrip()];
  });

  const [activeTripId, setActiveTripId] = useState<string | null>(() => {
    if (isConfigured) return null;
    const stored = loadFromStorage();
    return stored?.activeTripId || trips[0]?.id || null;
  });

  const [tripSummaries, setTripSummaries] = useState<TripSummary[]>(() => {
    if (isConfigured) return [];
    return loadSummariesFromStorage();
  });

  const [isLoading, setIsLoading] = useState(isConfigured);
  const [isFirestoreConnected, setIsFirestoreConnected] = useState(false);

  // Firebase real-time sync setup
  useEffect(() => {
    if (!isConfigured || !db) {
      setIsLoading(false);
      return;
    }

    // Listen to trips collection
    const unsubTrips = onSnapshot(
      collection(db, TRIPS_COLLECTION),
      (snapshot) => {
        const tripsData = snapshot.docs.map(firestoreToTrip);
        
        // Only update if we have data, otherwise keep default
        if (tripsData.length > 0) {
          setTrips(tripsData);
        } else {
          // Create default trip if none exist
          const defaultTrip = createDefaultTrip();
          firestoreHelpers.createTrip(tripToFirestore(defaultTrip));
        }
        setIsLoading(false);
      },
      (error) => {
        console.error('Error listening to trips:', error);
        setIsLoading(false);
      }
    );

    // Listen to summaries collection
    const unsubSummaries = onSnapshot(
      collection(db, SUMMARIES_COLLECTION),
      (snapshot) => {
        const summariesData = snapshot.docs.map(firestoreToSummary);
        setTripSummaries(summariesData);
      },
      (error) => {
        console.error('Error listening to summaries:', error);
      }
    );

    // Listen to settings document
    const unsubSettings = onSnapshot(
      doc(db, SETTINGS_DOC, 'config'),
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as FirestoreSettings;
          setActiveTripId(data.activeTripId || null);
        }
        setIsFirestoreConnected(true);
      },
      (error) => {
        console.error('Error listening to settings:', error);
        setIsFirestoreConnected(true);
      }
    );

    return () => {
      unsubTrips();
      unsubSummaries();
      unsubSettings();
    };
  }, [isConfigured]);

  // LocalStorage fallback sync (when Firebase is not configured)
  useEffect(() => {
    if (isConfigured) return;
    saveToStorage({ trips, activeTripId: activeTripId || trips[0]?.id || null });
  }, [trips, activeTripId, isConfigured]);

  // Trip operations
  const syncTripToFirestore = useCallback(async (trip: Trip) => {
    if (!isConfigured) return;
    try {
      await firestoreHelpers.updateTrip(trip.id, tripToFirestore(trip));
    } catch (error) {
      console.error('Error syncing trip to Firestore:', error);
    }
  }, [isConfigured]);

  const updateTrip = useCallback((tripId: string, updates: Partial<Trip>) => {
    setTrips((prev) => {
      const updated = prev.map((trip) => (trip.id === tripId ? { ...trip, ...updates } : trip));
      // Sync to Firestore in background
      const tripToSync = updated.find((t) => t.id === tripId);
      if (tripToSync) syncTripToFirestore(tripToSync);
      return updated;
    });
  }, [syncTripToFirestore]);

  const addTrip = useCallback((name: string, driverCode: string) => {
    const newTrip: Trip = {
      id: `trip-${Date.now()}`,
      name,
      driverCode,
      route: getDefaultRoute(),
      seats: generateSeats(),
      isActive: true,
    };
    
    if (isConfigured) {
      // No agregar a estado local - Firestore onSnapshot se encarga
      firestoreHelpers.createTrip(tripToFirestore(newTrip));
      return newTrip;
    } else {
      setTrips((prev) => [...prev, newTrip]);
      return newTrip;
    }
  }, [isConfigured]);

  const deleteTrip = useCallback((tripId: string) => {
    if (isConfigured) {
      // No modificar estado local - Firestore onSnapshot se encarga
      firestoreHelpers.deleteTrip(tripId);
    } else {
      setTrips((prev) => prev.filter((t) => t.id !== tripId));
    }
  }, [isConfigured]);

  const setActiveTrip = useCallback((tripId: string) => {
    if (isConfigured) {
      firestoreHelpers.updateSettings({ activeTripId: tripId });
    }
    setActiveTripId(tripId);
  }, [isConfigured]);

  const reserveSeat = useCallback(
    (
      seatIds: string[],
      passengerName: string,
      passengerPhone: string,
      passengerDestinations: Array<{
        destinationId: string;
        destinationName: string;
        price: number;
      }>,
      isPaid?: boolean
    ) => {
      if (!activeTripId) return;
      if (passengerDestinations.length === 0) return;
      if (seatIds.length === 0) return;
      
      // Calculate total price per seat and total price (seat count × destination price)
      const pricePerSeat = passengerDestinations.reduce((sum, d) => sum + d.price, 0);
      const totalPrice = pricePerSeat * seatIds.length;
      const primaryDestination = passengerDestinations[0];
      
      setTrips((prev) => {
        const updated = prev.map((trip) =>
          trip.id === activeTripId
            ? {
                ...trip,
                seats: trip.seats.map((seat) =>
                  seatIds.includes(seat.id)
                    ? {
                        ...seat,
                        isOccupied: true,
                        passengerName,
                        passengerPhone,
                        passengerDestination: passengerDestinations.map(d => d.destinationName).join(', '),
                        passengerDestinationId: primaryDestination.destinationId,
                        passengerPrice: totalPrice, // Total for all seats
                        passengerPricePerSeat: pricePerSeat, // Price per individual seat
                        passengerDestinations,
                        reservedAt: new Date().toISOString(),
                        isPaid: isPaid ?? false, // Set isPaid - defaults to false for regular reservations
                      }
                    : seat
                ),
              }
            : trip
        );
        
        // Sync to Firestore
        const tripToSync = updated.find((t) => t.id === activeTripId);
        if (tripToSync) syncTripToFirestore(tripToSync);
        
        return updated;
      });
    },
    [activeTripId, syncTripToFirestore]
  );

  const cancelReservation = useCallback(
    (seatId: string) => {
      if (!activeTripId || seatId === "1A") return;
      
      // Find the passenger's phone to cancel all their seats (for multi-seat reservations)
      const currentTrip = trips.find((t) => t.id === activeTripId);
      const seat = currentTrip?.seats.find((s) => s.id === seatId);
      const passengerPhone = seat?.passengerPhone;
      
      setTrips((prev) => {
        const updated = prev.map((trip) =>
          trip.id === activeTripId
            ? {
                ...trip,
                seats: trip.seats.map((seat) =>
                  // Cancel all seats belonging to this passenger (by phone)
                  passengerPhone && seat.passengerPhone === passengerPhone
                    ? {
                        ...seat,
                        isOccupied: false,
                        passengerName: "",
                        passengerPhone: "",
                        passengerDestination: "",
                        passengerDestinationId: null,
                        passengerPrice: 0,
                        passengerDestinations: [],
                        reservedAt: null,
                        isPaid: false,
                      }
                    : seat
                ),
              }
            : trip
        );
        
        // Sync to Firestore
        const tripToSync = updated.find((t) => t.id === activeTripId);
        if (tripToSync) syncTripToFirestore(tripToSync);
        
        return updated;
      });
    },
    [activeTripId, trips, syncTripToFirestore]
  );

  const removePassenger = useCallback(
    (seatId: string, reason: string) => {
      if (!activeTripId || seatId === "1A") return;

      setTrips((prevTrips) => {
        const currentTrip = prevTrips.find((t) => t.id === activeTripId);
        if (!currentTrip) return prevTrips;
        
        const seat = currentTrip.seats.find((s) => s.id === seatId);
        if (!seat || !seat.isOccupied) return prevTrips;
        
        // Find all seats belonging to this passenger (by phone) for multi-seat reservations
        const passengerPhone = seat.passengerPhone;
        const passengerSeats = currentTrip.seats.filter((s) => s.passengerPhone === passengerPhone);
        const seatIds = passengerSeats.map(s => s.id);
        
        // Create a single removal log for all seats (multi-seat reservation)
        const removalLog: RemovalLog = {
          id: `removal-${Date.now()}`,
          tripId: activeTripId,
          seatId: seatIds[0], // Primary seat ID for backward compatibility
          seatIds, // Array of all seat IDs
          passengerName: seat.passengerName,
          passengerPhone: seat.passengerPhone,
          passengerDestination: seat.passengerDestination,
          passengerPrice: passengerSeats.reduce((sum, s) => sum + s.passengerPrice, 0),
          reason,
          removedAt: new Date().toISOString(),
          removedBy: "driver",
        };

        const updated = prevTrips.map((trip) =>
          trip.id === activeTripId
            ? {
                ...trip,
                seats: trip.seats.map((s) =>
                  // Remove all seats belonging to this passenger (by phone)
                  s.passengerPhone === passengerPhone
                    ? {
                        ...s,
                        isOccupied: false,
                        passengerName: "",
                        passengerPhone: "",
                        passengerDestination: "",
                        passengerDestinationId: null,
                        passengerPrice: 0,
                        passengerDestinations: [],
                        reservedAt: null,
                        isPaid: false,
                      }
                    : s
                ),
                removalLogs: [...(trip.removalLogs || []), removalLog],
              }
            : trip
        );

        // Sync to Firestore
        const tripToSync = updated.find((t) => t.id === activeTripId);
        if (tripToSync) syncTripToFirestore(tripToSync);

        return updated;
      });
    },
    [activeTripId, syncTripToFirestore]
  );

  const togglePaid = useCallback(
    (seatId: string) => {
      if (!activeTripId) return;
      
      setTrips((prev) => {
        const updated = prev.map((trip) =>
          trip.id === activeTripId
            ? {
                ...trip,
                seats: trip.seats.map((seat) =>
                  seat.id === seatId ? { ...seat, isPaid: !seat.isPaid } : seat
                ),
              }
            : trip
        );
        
        // Sync to Firestore
        const tripToSync = updated.find((t) => t.id === activeTripId);
        if (tripToSync) syncTripToFirestore(tripToSync);
        
        return updated;
      });
    },
    [activeTripId, syncTripToFirestore]
  );

  const updateRoute = useCallback(
    (newRoute: Partial<RouteInfo>) => {
      if (!activeTripId) return;
      
      setTrips((prev) => {
        const updated = prev.map((trip) =>
          trip.id === activeTripId
            ? { ...trip, route: { ...trip.route, ...newRoute } }
            : trip
        );
        
        // Sync to Firestore
        const tripToSync = updated.find((t) => t.id === activeTripId);
        if (tripToSync) syncTripToFirestore(tripToSync);
        
        return updated;
      });
    },
    [activeTripId, syncTripToFirestore]
  );

  const resetBus = useCallback(() => {
    if (!activeTripId) return;
    
    setTrips((prev) => {
      const updated = prev.map((trip) =>
        trip.id === activeTripId ? { ...trip, seats: generateSeats() } : trip
      );
      
      // Sync to Firestore
      const tripToSync = updated.find((t) => t.id === activeTripId);
      if (tripToSync) syncTripToFirestore(tripToSync);
      
      return updated;
    });
  }, [activeTripId, syncTripToFirestore]);

  // Complete trip and save summary
  const completeTrip = useCallback(() => {
    if (!activeTripId) return;

    // Capture current trip BEFORE setTrips to avoid stale state
    const currentTrip = trips.find((t) => t.id === activeTripId);
    if (!currentTrip) return;

    const passengerSeats = currentTrip.seats.filter((s) => s.isOccupied && s.id !== "1A");
    const paidPassengers = passengerSeats.filter((s) => s.isPaid);

    const passengersByDestination: Record<string, number> = {};
    passengerSeats.forEach((s) => {
      // Use passengerDestinations array if available, otherwise fall back to legacy field
      if (s.passengerDestinations && s.passengerDestinations.length > 0) {
        s.passengerDestinations.forEach((dest) => {
          const destName = dest.destinationName || "Sin destino";
          passengersByDestination[destName] = (passengersByDestination[destName] || 0) + 1;
        });
      } else if (s.passengerDestination) {
        // Legacy support
        passengersByDestination[s.passengerDestination] = (passengersByDestination[s.passengerDestination] || 0) + 1;
      }
    });

    const totalEarned = passengerSeats.reduce((sum, s) => sum + s.passengerPrice, 0);
    const totalCollected = paidPassengers.reduce((sum, s) => sum + s.passengerPrice, 0);
    const totalLost = (currentTrip.removalLogs || []).reduce((sum, l) => sum + l.passengerPrice, 0);

    const capturedSummary: TripSummary = {
      id: `summary-${Date.now()}`,
      tripId: currentTrip.id,
      tripName: currentTrip.name,
      date: currentTrip.route.date,
      departureTime: currentTrip.route.departureTime,
      totalPassengers: passengerSeats.length,
      removedPassengers: (currentTrip.removalLogs || []).length,
      passengersByDestination,
      totalEarned,
      totalCollected,
      totalLost,
      completedAt: new Date().toISOString(),
    };

    // Prepare reset trip BEFORE setTrips
    const resetTrip: Trip = {
      ...currentTrip,
      seats: generateSeats(),
      removalLogs: [],
    };

    // Update local state
    setTrips((prevTrips) =>
      prevTrips.map((trip) =>
        trip.id === activeTripId ? resetTrip : trip
      )
    );

    // Save summary and sync to Firestore
    if (isConfigured) {
      firestoreHelpers.createSummary(summaryToFirestore(capturedSummary));
      // Sync the reset trip - using captured reference, not stale state
      syncTripToFirestore(resetTrip);
    } else {
      setTripSummaries((prev) => {
        const updated = [capturedSummary, ...prev].slice(0, MAX_SUMMARIES);
        saveSummariesToStorage(updated);
        return updated;
      });
    }
  }, [activeTripId, trips, isConfigured, syncTripToFirestore]);

  // Get active trip
  const activeTrip = trips.find((t) => t.id === activeTripId) || trips[0];

  // Update trip status (active, cancelled, delayed)
  const updateTripStatus = useCallback(
    (tripId: string, status: TripStatus, options?: { newTime?: string; reason?: string }) => {
      setTrips((prev) => {
        const updated = prev.map((trip) =>
          trip.id === tripId
            ? {
                ...trip,
                status,
                delayNewTime: options?.newTime,
                statusReason: options?.reason,
                statusUpdatedAt: new Date().toISOString(),
              }
            : trip
        );

        // Sync to Firestore
        const tripToSync = updated.find((t) => t.id === tripId);
        if (tripToSync) syncTripToFirestore(tripToSync);

        return updated;
      });
    },
    [syncTripToFirestore]
  );

  // Derived values
  const seats = activeTrip?.seats || [];
  const route = activeTrip?.route || getDefaultRoute();
  const occupiedCount = seats.filter((s) => s.isOccupied).length;
  const totalSeats = seats.length;
  const availableSeats = totalSeats - occupiedCount;

  return {
    // State
    trips,
    activeTrip,
    activeTripId,
    tripSummaries,
    isLoading,
    isFirestoreConnected,
    
    // Actions
    setActiveTrip,
    reserveSeat,
    cancelReservation,
    removePassenger,
    togglePaid,
    updateRoute,
    resetBus,
    completeTrip,
    addTrip,
    updateTrip,
    deleteTrip,
    findTripByDriverCode,
    updateTripStatus,
    
    // Derived
    route,
    seats,
    occupiedCount,
    totalSeats,
    availableSeats,
  };
};
