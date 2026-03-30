import { useState, useEffect } from "react";
import type { Destination } from "../../types/seat";

interface ReservationModalProps {
  seatIds: string[];
  destinations: Destination[];
  onConfirm: (
    name: string,
    phone: string,
    destinationId: string,
    destinationName: string,
    price: number
  ) => void;
  onCancel: () => void;
  defaultName?: string;
  defaultPhone?: string;
}

export const ReservationModal = ({
  seatIds,
  destinations,
  onConfirm,
  onCancel,
  defaultName,
  defaultPhone,
}: ReservationModalProps) => {
  const seatCount = seatIds.length;
  const [name, setName] = useState(defaultName || "");
  const [phone, setPhone] = useState(defaultPhone || "");
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);

  useEffect(() => {
    if (defaultName) {
      setName(defaultName);
    }
    if (defaultPhone) {
      setPhone(defaultPhone);
    }
  }, [defaultName, defaultPhone]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && phone.trim() && selectedDestination) {
      // Calculate total price = seat count × destination price
      const totalPrice = selectedDestination.price * seatCount;
      onConfirm(name.trim(), phone.trim(), selectedDestination.id, selectedDestination.name, totalPrice);
    }
  };

  const selectedDest = selectedDestination;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-80 shadow-xl">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
          {seatCount === 1 
            ? `Reservar Asiento ${seatIds[0]}` 
            : `Reservar ${seatCount} Asientos`}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          {seatCount === 1 
            ? "Completá tus datos para la reserva" 
            : `Asientos seleccionados: ${seatIds.join(', ')} (${seatCount} asientos)`}
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Tu nombre
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Juan Pérez"
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md 
                         bg-white dark:bg-slate-700 text-slate-800 dark:text-white
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Teléfono (identificador único)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ej: 5512345678"
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md 
                         bg-white dark:bg-slate-700 text-slate-800 dark:text-white
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Elegí tu destino
            </label>
            <div className="space-y-2">
              {destinations.map((dest) => (
                <label
                  key={dest.id}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedDestination?.id === dest.id
                      ? "bg-blue-100 border-2 border-blue-500 dark:bg-blue-900/30"
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

          {selectedDest && (
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm text-green-800 dark:text-green-300">
                Total a pagar: <span className="font-bold">${selectedDest.price * seatCount}</span>
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
              onClick={onCancel}
              className="px-4 py-2 text-slate-600 dark:text-slate-300 
                         hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!name.trim() || !phone.trim() || !selectedDestination}
              className="px-4 py-2 bg-blue-500 text-white rounded-md
                         hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirmar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
