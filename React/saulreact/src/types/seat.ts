export interface Destination {
  id: string;
  name: string;
  price: number;
}

export interface RemovalLog {
  id: string;
  tripId: string;
  seatId: string;
  seatIds?: string[]; // Array of seat IDs for multi-seat reservations
  passengerName: string;
  passengerPhone: string;
  passengerDestination: string;
  passengerPrice: number;
  reason: string;
  removedAt: string;
  removedBy: "driver";
}

export interface TripSummary {
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

export interface PassengerDestination {
  destinationId: string;
  destinationName: string;
  price: number;
}

export interface Seat {
  id: string;
  row: number;
  column: number;
  isOccupied: boolean;
  passengerName: string;
  passengerPhone: string;
  passengerDestination: string; // Legacy: comma-separated for backward compatibility
  passengerDestinationId: string | null; // Legacy: first destination ID
  passengerPrice: number;
  passengerPricePerSeat?: number; // Price per individual seat (for multi-seat reservations)
  passengerDestinations: PassengerDestination[]; // New: array of destinations (max 2)
  reservedAt: string | null;
  isPaid: boolean;
}

export interface RouteInfo {
  origin: string;
  date: string;
  departureTime: string;
  destinations: Destination[];
}

export interface Trip {
  id: string;
  name: string;
  driverCode: string;
  route: RouteInfo;
  seats: Seat[];
  isActive: boolean;
  removalLogs?: RemovalLog[];
}

export interface BusState {
  trips: Trip[];
  activeTripId: string | null;
}
