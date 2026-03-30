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

export interface RouteInfo {
  origin: string;
  destination: string;
  date: string;
  price: number; // Price per trip in pesos
}

export interface BusState {
  route: RouteInfo;
  seats: Seat[];
}
