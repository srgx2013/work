import { useState } from "react";
import type { Seat as SeatType } from "../../types/seat";
import { Seat } from "../Seat";
import { ReservationModal } from "../ReservationModal";

interface BusProps {
  seats: SeatType[];
  onReserve: (seatId: string, name: string) => void;
  onCancel: (seatId: string) => void;
}

// Minivan config (back to front): 2-2-3-3-4 = 14 passenger seats
const SEATS_PER_ROW = [2, 2, 3, 3, 4];

export const Bus = ({ seats, onReserve, onCancel }: BusProps) => {
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);

  // Group seats by row
  const seatsByRow = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) {
      acc[seat.row] = [];
    }
    acc[seat.row].push(seat);
    return acc;
  }, {} as Record<number, SeatType[]>);

  const handleSeatClick = (seat: SeatType) => {
    if (seat.isOccupied) {
      if (confirm(`Cancelar reserva de ${seat.passengerName} en asiento ${seat.id}?`)) {
        onCancel(seat.id);
      }
    } else {
      setSelectedSeat(seat.id);
    }
  };

  const handleConfirmReservation = (name: string) => {
    if (selectedSeat) {
      onReserve(selectedSeat, name);
      setSelectedSeat(null);
    }
  };

  const selectedSeatData = seats.find((s) => s.id === selectedSeat);

  return (
    <div className="bg-slate-100 dark:bg-slate-900 rounded-2xl p-6 shadow-lg max-w-md mx-auto">
      {/* Van Header */}
      <div className="bg-slate-800 text-white rounded-lg py-2 px-4 mb-6 text-center font-bold">
        🚐 MINIVAN - 14 PASAJEROS
      </div>

      {/* Driver area */}
      <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-300 dark:border-slate-700">
        <div className="w-16 h-12 bg-slate-600 rounded-md flex items-center justify-center">
          <span className="text-slate-400 text-xs">CONDUCTOR</span>
        </div>
        <div className="flex-1" />
        <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
          <span className="text-slate-500 text-xs">🚗</span>
        </div>
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
                      isSelected={selectedSeat === seat.id}
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
                      isSelected={selectedSeat === seat.id}
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
      </div>

      {/* Modal */}
      {selectedSeat && selectedSeatData && !selectedSeatData.isOccupied && (
        <ReservationModal
          seatId={selectedSeat}
          onConfirm={handleConfirmReservation}
          onCancel={() => setSelectedSeat(null)}
        />
      )}
    </div>
  );
};
