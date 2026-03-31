import { useState } from "react";
import type { Seat, Destination } from "../../types/seat";

interface VipReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReserve: (
    seatIds: string[],
    passengerData: {
      name: string;
      phone: string;
      destinationId: string;
      destinationName: string;
      price: number;
    }
  ) => void;
  availableSeats: Seat[];
  destinations: Destination[];
}

export const VipReservationModal = ({
  isOpen,
  onClose,
  onReserve,
  availableSeats,
  destinations,
}: VipReservationModalProps) => {
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);

  const handleSeatClick = (seat: Seat) => {
    if (selectedSeats.find((s) => s.id === seat.id)) {
      // Deselect seat
      setSelectedSeats(selectedSeats.filter((s) => s.id !== seat.id));
    } else {
      // Select seat (max 2)
      if (selectedSeats.length < 2) {
        setSelectedSeats([...selectedSeats, seat]);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && phone.trim() && selectedDestination && selectedSeats.length > 0) {
      const totalPrice = selectedDestination.price * selectedSeats.length;
      onReserve(
        selectedSeats.map((s) => s.id),
        {
          name: name.trim(),
          phone: phone.trim(),
          destinationId: selectedDestination.id,
          destinationName: selectedDestination.name,
          price: totalPrice,
        }
      );
      // Reset form
      setSelectedSeats([]);
      setName("");
      setPhone("");
      setSelectedDestination(null);
    }
  };

  const handleClose = () => {
    setSelectedSeats([]);
    setName("");
    setPhone("");
    setSelectedDestination(null);
    onClose();
  };

  if (!isOpen) return null;

  const seatCount = selectedSeats.length;
  const selectedDest = selectedDestination;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-80 max-h-[90vh] overflow-y-auto shadow-xl">
        <h3 className="text-lg font-bold text-purple-700 dark:text-purple-300 mb-2 flex items-center gap-2">
          ⭐ Reservar VIP / Prepagado
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          Reserve asientos para clientes VIP o que ya pagaron por anticipado.
        </p>

        {/* Seat Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Seleccionar asientos (máx 2)
          </label>
          <div className="grid grid-cols-5 gap-1">
            {availableSeats
              .filter((s) => s.id !== "1A")
              .sort((a, b) => a.id.localeCompare(b.id))
              .map((seat) => {
                const isSelected = selectedSeats.find((s) => s.id === seat.id);
                return (
                  <button
                    key={seat.id}
                    type="button"
                    onClick={() => handleSeatClick(seat)}
                    disabled={!isSelected && selectedSeats.length >= 2}
                    className={`p-2 rounded-lg text-sm font-semibold transition-colors ${
                      isSelected
                        ? "bg-purple-500 text-white"
                        : "bg-slate-100 text-slate-400 dark:bg-slate-700 dark:text-slate-500 hover:bg-purple-100 dark:hover:bg-purple-900/30"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {seat.id}
                  </button>
                );
              })}
          </div>
          {selectedSeats.length > 0 && (
            <p className="text-sm text-purple-600 dark:text-purple-400 mt-2">
              Asientos seleccionados: {selectedSeats.map((s) => s.id).join(", ")} ({selectedSeats.length})
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Nombre del pasajero
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Juan Pérez"
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md 
                         bg-white dark:bg-slate-700 text-slate-800 dark:text-white
                         focus:outline-none focus:ring-2 focus:ring-purple-500"
              autoFocus
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Teléfono
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ej: 5512345678"
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md 
                         bg-white dark:bg-slate-700 text-slate-800 dark:text-white
                         focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Destino
            </label>
            <div className="space-y-2">
              {destinations.map((dest) => (
                <label
                  key={dest.id}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedDestination?.id === dest.id
                      ? "bg-purple-100 border-2 border-purple-500 dark:bg-purple-900/30"
                      : "bg-slate-50 dark:bg-slate-700 border-2 border-transparent hover:bg-slate-100 dark:hover:bg-slate-600"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="destination"
                      checked={selectedDestination?.id === dest.id}
                      onChange={() => setSelectedDestination(dest)}
                      className="w-4 h-4"
                    />
                    <span className="font-medium text-slate-800 dark:text-white">
                      {dest.name}
                    </span>
                  </div>
                  <span className="font-bold text-green-600">
                    ${dest.price}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {selectedDest && seatCount > 0 && (
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm text-green-800 dark:text-green-300">
                <span className="font-bold">💳 PAGADO</span> - Total: <span className="font-bold">${selectedDest.price * seatCount}</span>
                {seatCount > 1 && (
                  <span className="text-xs block text-green-600 dark:text-green-400">
                    ({seatCount} asientos × ${selectedDest.price} c/u)
                  </span>
                )}
              </p>
            </div>
          )}

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-slate-600 dark:text-slate-300 
                         hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!name.trim() || !phone.trim() || !selectedDestination || selectedSeats.length === 0}
              className="px-4 py-2 bg-purple-500 text-white rounded-md
                         hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirmar Reserva VIP
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
