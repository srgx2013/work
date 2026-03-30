import { useState } from "react";

interface RemovalModalProps {
  seatId: string;
  passengerName: string;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
}

const commonReasons = [
  "No llegó a tiempo",
  "Canceló su viaje",
  "No se presentó",
  "Emergencia personal",
  "Viaje reprogramado",
  "Otro motivo",
];

export const RemovalModal = ({
  seatId,
  passengerName,
  onConfirm,
  onCancel,
}: RemovalModalProps) => {
  const [reason, setReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalReason = showCustomInput ? customReason : reason;
    if (finalReason.trim()) {
      onConfirm(finalReason.trim());
    }
  };

  const selectedReason = showCustomInput ? customReason : reason;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-96 shadow-xl">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
          🚫 Eliminar Pasajero
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          Asiento <span className="font-bold">{seatId}</span> - {passengerName}
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Motivo de eliminación:
            </label>
            <div className="space-y-2">
              {commonReasons.map((r) => (
                <label
                  key={r}
                  className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-colors ${
                    reason === r && !showCustomInput
                      ? "bg-red-100 border-2 border-red-500 dark:bg-red-900/30"
                      : "bg-slate-50 dark:bg-slate-700 border-2 border-transparent hover:bg-slate-100 dark:hover:bg-slate-600"
                  }`}
                >
                  <input
                    type="radio"
                    name="reason"
                    checked={reason === r && !showCustomInput}
                    onChange={() => {
                      setReason(r);
                      setShowCustomInput(false);
                    }}
                    className="w-4 h-4"
                  />
                  <span className="text-slate-800 dark:text-white">{r}</span>
                </label>
              ))}
              <label
                className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-colors ${
                  showCustomInput
                    ? "bg-red-100 border-2 border-red-500 dark:bg-red-900/30"
                    : "bg-slate-50 dark:bg-slate-700 border-2 border-transparent hover:bg-slate-100 dark:hover:bg-slate-600"
                }`}
              >
                <input
                  type="radio"
                  name="reason"
                  checked={showCustomInput}
                  onChange={() => setShowCustomInput(true)}
                  className="w-4 h-4"
                />
                <span className="text-slate-800 dark:text-white">Otro motivo</span>
              </label>
            </div>

            {showCustomInput && (
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Escribí el motivo..."
                className="w-full mt-2 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg 
                           bg-white dark:bg-slate-700 text-slate-800 dark:text-white
                           focus:outline-none focus:ring-2 focus:ring-red-500"
                rows={2}
                autoFocus
              />
            )}
          </div>

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
              disabled={!selectedReason.trim()}
              className="px-4 py-2 bg-red-500 text-white rounded-md
                         hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Eliminar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
