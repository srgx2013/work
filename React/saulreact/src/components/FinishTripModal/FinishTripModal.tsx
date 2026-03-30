interface FinishTripModalProps {
  tripName: string;
  totalPassengers: number;
  totalEarned: number;
  totalCollected: number;
  passengersByDestination: Record<string, number>;
  onFinishAndContinue: () => void;
  onCancel: () => void;
}

export const FinishTripModal = ({
  tripName,
  totalPassengers,
  totalEarned,
  totalCollected,
  passengersByDestination,
  onFinishAndContinue,
  onCancel,
}: FinishTripModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-96 shadow-xl">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          🏁 Finalizar Viaje
        </h3>
        
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          ¿Querés finalizar <span className="font-semibold">{tripName}</span>?
        </p>

        {/* Trip Summary */}
        <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-4 mb-4">
          <h4 className="font-semibold text-slate-800 dark:text-white mb-3">📊 Resumen del Viaje</h4>
          
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="text-center p-2 bg-white dark:bg-slate-600 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{totalPassengers}</p>
              <p className="text-xs text-slate-500">Pasajeros</p>
            </div>
            <div className="text-center p-2 bg-white dark:bg-slate-600 rounded-lg">
              <p className="text-2xl font-bold text-green-600">${totalCollected}</p>
              <p className="text-xs text-slate-500">Cobrado</p>
            </div>
            <div className="text-center p-2 bg-white dark:bg-slate-600 rounded-lg">
              <p className="text-2xl font-bold text-slate-600">${totalEarned}</p>
              <p className="text-xs text-slate-500">Total a Cobrar</p>
            </div>
            <div className="text-center p-2 bg-white dark:bg-slate-600 rounded-lg">
              <p className="text-2xl font-bold text-amber-600">${totalEarned - totalCollected}</p>
              <p className="text-xs text-slate-500">Pendiente</p>
            </div>
          </div>

          {Object.keys(passengersByDestination).length > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-600">
              <p className="text-xs text-slate-500 mb-2">Pasajeros por destino:</p>
              <div className="flex flex-wrap gap-1">
                {Object.entries(passengersByDestination).map(([dest, count]) => (
                  <span key={dest} className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-xs">
                    📍 {dest}: {count}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <p className="text-xs text-slate-400 mb-4">
          💡 El resumen se guardará y estará disponible para el propietario.
        </p>

        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 text-slate-600 dark:text-slate-300 
                       hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onFinishAndContinue}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md
                       hover:bg-blue-600 transition-colors font-medium"
          >
            Finalizar
          </button>
        </div>
      </div>
    </div>
  );
};
