export interface Seat {
  id: string;
  row: number;
  column: number;
  isOccupied: boolean;
  passengerName: string;
  passengerPhone: string;
  passengerDestination: string;
  reservedAt: string | null;
}

export interface RouteInfo {
  origin: string;
  destination: string;
  date: string;
}

export interface BusState {
  route: RouteInfo;
  seats: Seat[];
}
