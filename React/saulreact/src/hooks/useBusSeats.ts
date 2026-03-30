import { useState, useEffect, useCallback } from "react";
import type { Seat, RouteInfo, BusState } from "../types/seat";

const STORAGE_KEY = "bus-seats-data";

// Minivan config (back to front): 2-2-3-3-4 = 14 passenger seats
const SEATS_PER_ROW = [2, 2, 3, 3, 4];

  const generateSeats = (): Seat[] => {
  const seats: Seat[] = [];
  const columns = ["A", "B", "C", "D"]; // Max 4 per row

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
        reservedAt: isDriverSeat ? new Date().toISOString() : null,
        isPaid: isDriverSeat, // Driver seat is considered "paid"
      });
    }
  });

  return seats;
};

const getDefaultRoute = (): RouteInfo => ({
  origin: "Ciudad A",
  destination: "Ciudad B",
  date: new Date().toISOString().split("T")[0],
});

const loadFromStorage = (): BusState | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    console.warn("No se pudo cargar datos del localStorage");
  }
  return null;
};

const saveToStorage = (state: BusState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    console.warn("No se pudo guardar en localStorage");
  }
};

export const useBusSeats = () => {
  const [route, setRoute] = useState<RouteInfo>(() => {
    const stored = loadFromStorage();
    return stored?.route || getDefaultRoute();
  });

  const [seats, setSeats] = useState<Seat[]>(() => {
    const stored = loadFromStorage();
    return stored?.seats || generateSeats();
  });

  // Persist changes
  useEffect(() => {
    saveToStorage({ route, seats });
  }, [route, seats]);

  const reserveSeat = useCallback(
    (seatId: string, passengerName: string, passengerPhone: string, passengerDestination: string) => {
      setSeats((prev) =>
        prev.map((seat) =>
          seat.id === seatId
            ? {
                ...seat,
                isOccupied: true,
                passengerName,
                passengerPhone,
                passengerDestination,
                reservedAt: new Date().toISOString(),
              }
            : seat
        )
      );
    },
    []
  );

  const cancelReservation = useCallback((seatId: string) => {
    // Can't cancel driver's seat
    if (seatId === "1A") return;

    setSeats((prev) =>
      prev.map((seat) =>
        seat.id === seatId
          ? {
              ...seat,
              isOccupied: false,
              passengerName: "",
              passengerPhone: "",
              passengerDestination: "",
              reservedAt: null,
              isPaid: false,
            }
          : seat
      )
    );
  }, []);

  const togglePaid = useCallback((seatId: string) => {
    setSeats((prev) =>
      prev.map((seat) =>
        seat.id === seatId
          ? { ...seat, isPaid: !seat.isPaid }
          : seat
      )
    );
  }, []);

  const updateRoute = useCallback((newRoute: Partial<RouteInfo>) => {
    setRoute((prev) => ({ ...prev, ...newRoute }));
  }, []);

  const resetBus = useCallback(() => {
    setSeats(generateSeats());
  }, []);

  const occupiedCount = seats.filter((s) => s.isOccupied).length;
  const totalSeats = seats.length;
  const availableSeats = totalSeats - occupiedCount;

  return {
    route,
    seats,
    occupiedCount,
    totalSeats,
    availableSeats,
    reserveSeat,
    cancelReservation,
    togglePaid,
    updateRoute,
    resetBus,
  };
};
