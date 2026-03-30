import { useState } from "react";
import type { Seat as SeatType, Destination } from "../../types/seat";
import { Seat } from "../Seat";
import { ReservationModal } from "../ReservationModal";

interface BusProps {
  seats: SeatType[];
  destinations: Destination[];
  onReserve: (
    seatIds: string[],
    name: string,
    phone: string,
    passengerDestinations: Array<{
      destinationId: string;
      destinationName: string;
      price: number;
    }>
  ) => void;
  onCancel: (seatId: string) => void;
  currentUserName?: string;
  currentUserPhone?: string;
}

// Minivan config (back to front): 2-2-3-3-4 = 14 passenger seats
const SEATS_PER_ROW = [2, 2, 3, 3, 4];

export const Bus = ({
  seats,
  destinations,
  onReserve,
  onCancel,
  currentUserName,
  currentUserPhone,
}: BusProps) => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const MAX_SELECTED_SEATS = 2;

  // Group seats by row
  const seatsByRow = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) {
      acc[seat.row] = [];
    }
    acc[seat.row].push(seat);
    return acc;
  }, {} as Record<number, SeatType[]>);

  // Check if user already has a reservation
  const userReservedSeats = seats.filter(
    (s) => s.isOccupied && 
           s.passengerName.toLowerCase() === currentUserName?.toLowerCase() && 
           s.passengerPhone === currentUserPhone
  );
  const userHasExistingReservation = userReservedSeats.length > 0;

  const handleSeatClick = (seat: SeatType) => {
    if (seat.isOccupied) {
      // Only allow cancel if it's the user's own seat (check both name AND phone)
      const isOwnSeat =
        seat.passengerName.toLowerCase() === currentUserName?.toLowerCase() &&
        seat.passengerPhone === currentUserPhone;
      if (isOwnSeat) {
        const seatCount = userReservedSeats.length;
        const message = seatCount > 1 
          ? `¿Cancelar tu reserva de ${seat.passengerName} (${seatCount} asientos: ${userReservedSeats.map(s => s.id).join(', ')})?`
          : `¿Cancelar tu reserva del asiento ${seat.id}?`;
        if (confirm(message)) {
          onCancel(seat.id);
        }
      } else {
        alert(`Este asiento ya está reservado por ${seat.passengerName}`);
      }
    } else {
      // If user already has reservation, don't allow new selection
      if (userHasExistingReservation) {
        alert(`Ya tienes ${userReservedSeats.length} asiento(s) reservado(s): ${userReservedSeats.map(s => s.id).join(', ')}. Cancela el actual primero.`);
        return;
      }
      
      // If seat is already selected, deselect it
      if (selectedSeats.includes(seat.id)) {
        setSelectedSeats(prev => prev.filter(id => id !== seat.id));
        return;
      }
      
      // If we haven't reached max seats, add the seat
      if (selectedSeats.length < MAX_SELECTED_SEATS) {
        setSelectedSeats(prev => [...prev, seat.id]);
      }
    }
  };

  const handleConfirmReservation = (
    name: string,
    phone: string,
    destinationId: string,
    destinationName: string,
    totalPrice: number
  ) => {
    if (selectedSeats.length > 0) {
      // Calculate price per seat (total price / number of seats)
      const pricePerSeat = totalPrice / selectedSeats.length;
      
      // Create destinations array format expected by the hook
      const passengerDestinations = [{
        destinationId,
        destinationName,
        price: pricePerSeat
      }];
      
      onReserve(selectedSeats, name, phone, passengerDestinations);
      setSelectedSeats([]);
    }
  };

  const selectedSeatData = selectedSeats.map(id => seats.find((s) => s.id === id)).filter(Boolean) as SeatType[];

  return (
    <div className="bg-slate-100 dark:bg-slate-900 rounded-2xl p-6 shadow-lg max-w-md mx-auto">
      {/* Van Header */}
      <div className="bg-slate-800 text-white rounded-lg py-2 px-4 mb-6 text-center font-bold">
        🚐 MINIVAN - 14 PASAJEROS
      </div>

      {/* Seats Grid - Minivan layout */}
      <div className="space-y-3">
        {SEATS_PER_ROW.map((_, rowIndex) => {
          const rowNumber = rowIndex + 1;
          const rowSeats = seatsByRow[rowNumber] || [];

          return (
            <div key={rowNumber} className="flex items-center justify-center gap-2">
              <div className="flex gap-2">
                {rowSeats
                  .filter((s) => s.column < 2)
                  .sort((a, b) => a.column - b.column)
                  .map((seat) => (
                    <Seat
                      key={seat.id}
                      seat={seat}
                      isSelected={selectedSeats.includes(seat.id)}
                      isOwnSeat={
                        seat.passengerName.toLowerCase() === currentUserName?.toLowerCase() &&
                        seat.passengerPhone === currentUserPhone
                      }
                      onClick={() => handleSeatClick(seat)}
                    />
                  ))}
              </div>

              {/* Aisle */}
              <div className="w-6" />

              <div className="flex gap-2">
                {rowSeats
                  .filter((s) => s.column >= 2)
                  .sort((a, b) => a.column - b.column)
                  .map((seat) => (
                    <Seat
                      key={seat.id}
                      seat={seat}
                      isSelected={selectedSeats.includes(seat.id)}
                      isOwnSeat={
                        seat.passengerName.toLowerCase() === currentUserName?.toLowerCase() &&
                        seat.passengerPhone === currentUserPhone
                      }
                      onClick={() => handleSeatClick(seat)}
                    />
                  ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-6 pt-4 border-t border-slate-300 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded" />
          <span className="text-xs text-slate-600 dark:text-slate-400">Disponible</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded" />
          <span className="text-xs text-slate-600 dark:text-slate-400">Ocupado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded" />
          <span className="text-xs text-slate-600 dark:text-slate-400">Tu asiento</span>
        </div>
      </div>

      {/* Modal */}
      {selectedSeats.length > 0 && selectedSeatData.length > 0 && (
        <ReservationModal
          seatIds={selectedSeats}
          destinations={destinations}
          onConfirm={handleConfirmReservation}
          onCancel={() => setSelectedSeats([])}
          defaultName={currentUserName}
          defaultPhone={currentUserPhone}
        />
      )}
    </div>
  );
};
