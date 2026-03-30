import { useState } from "react";

interface ReservationModalProps {
  seatId: string;
  onConfirm: (name: string) => void;
  onCancel: () => void;
}

export const ReservationModal = ({
  seatId,
  onConfirm,
  onCancel,
}: ReservationModalProps) => {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onConfirm(name.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-80 shadow-xl">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
          Reservar Asiento {seatId}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          Ingresá el nombre del pasajero
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre del pasajero"
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md 
                       bg-white dark:bg-slate-700 text-slate-800 dark:text-white
                       focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            autoFocus
          />

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
              disabled={!name.trim()}
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
