export interface Seat {
  id: string;
  row: number;
  column: number;
  isOccupied: boolean;
  passengerName: string;
  passengerPhone: string;
  passengerDestination: string;
  reservedAt: string | null;
  isPaid: boolean;
}

export interface Destination {
  name: string;
  price: number;
}

export interface RouteInfo {
  origin: string;
  destination: string; // Legacy field, now using destinations array
  date: string;
  destinations: Destination[];
}

export interface BusState {
  route: RouteInfo;
  seats: Seat[];
}
