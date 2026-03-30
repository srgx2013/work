import type { Seat, RouteInfo } from "../../types/seat";

interface OwnerPanelProps {
  route: RouteInfo;
  seats: Seat[];
  onUpdateRoute: (route: Partial<RouteInfo>) => void;
  onLogout: () => void;
  onResetBus: () => void;
}

export const OwnerPanel = ({
  route,
  seats,
  onUpdateRoute,
  onLogout,
  onResetBus,
}: OwnerPanelProps) => {
  const passengerSeats = seats.filter((s) => s.isOccupied && s.id !== "1A");
  const paidPassengers = passengerSeats.filter((s) => s.isPaid);
  
  // Calculate earnings
  const totalPassengers = passengerSeats.length;
  const pricePerPassenger = route.price; // Price is per passenger
  const totalEarnings = totalPassengers * pricePerPassenger;
  const collectedAmount = paidPassengers.length * pricePerPassenger;
  const pendingAmount = (totalPassengers - paidPassengers.length) * pricePerPassenger;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-amber-600 to-amber-700 text-white py-4 px-6 shadow-lg">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">👤</span>
            <div>
              <h1 className="text-xl font-bold">Panel del Propietario</h1>
              <p className="text-amber-200 text-sm">Control de ganancias</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="px-4 py-2 text-sm bg-white/20 hover:bg-white/30 rounded-md transition-colors"
          >
            Salir
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-6 space-y-6">
        {/* Price Configuration */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
          <h2 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
            💵 Precio del Viaje
          </h2>
          
          <div className="flex items-center gap-4">
            <label className="text-slate-600 dark:text-slate-300 font-medium">
              Precio por pasajero:
            </label>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-amber-600">$</span>
              <input
                type="number"
                value={route.price}
                onChange={(e) => onUpdateRoute({ price: Number(e.target.value) })}
                className="w-32 px-4 py-2 text-xl font-bold text-center border-2 border-amber-300 
                           rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200
                           dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                min="0"
              />
              <span className="text-slate-500">pesos</span>
            </div>
          </div>
          
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            💡 Este precio aplica a todos los pasajeros de este viaje
          </p>
        </div>

        {/* Earnings Summary */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              💰 Ganancias del Viaje
            </h2>
            <span className="text-4xl">📊</span>
          </div>
          
          <div className="text-center py-4">
            <p className="text-green-100 text-sm mb-1">Total a Recaudar</p>
            <p className="text-5xl font-bold">${totalEarnings.toLocaleString("es-AR")}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-white/20 rounded-xl p-4 text-center">
              <p className="text-green-100 text-xs">💵 Cobrado</p>
              <p className="text-2xl font-bold">${collectedAmount.toLocaleString("es-AR")}</p>
            </div>
            <div className="bg-white/20 rounded-xl p-4 text-center">
              <p className="text-green-100 text-xs">⏳ Pendiente</p>
              <p className="text-2xl font-bold">${pendingAmount.toLocaleString("es-AR")}</p>
            </div>
          </div>
        </div>

        {/* Calculation Breakdown */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
          <h3 className="font-bold text-slate-800 dark:text-white mb-4">
            📐 Cálculo de Ganancias
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
              <span className="text-slate-600 dark:text-slate-300">
                Pasajeros registrados
              </span>
              <span className="font-bold text-slate-800 dark:text-white">
                {totalPassengers} × ${pricePerPassenger}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
              <span className="text-slate-600 dark:text-slate-300">
                Pagados
              </span>
              <span className="font-bold text-green-600">
                {paidPassengers.length} × ${pricePerPassenger} = ${(paidPassengers.length * pricePerPassenger).toLocaleString("es-AR")}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
              <span className="text-slate-600 dark:text-slate-300">
                Pendientes de pago
              </span>
              <span className="font-bold text-orange-500">
                {totalPassengers - paidPassengers.length} × ${pricePerPassenger} = ${((totalPassengers - paidPassengers.length) * pricePerPassenger).toLocaleString("es-AR")}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl px-3 -mx-3">
              <span className="font-bold text-amber-700 dark:text-amber-300">
                💵 Total del Viaje
              </span>
              <span className="text-xl font-bold text-amber-600 dark:text-amber-400">
                ${totalEarnings.toLocaleString("es-AR")}
              </span>
            </div>
          </div>
        </div>

        {/* Route Info */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
          <h3 className="font-bold text-slate-800 dark:text-white mb-4">
            🚌 Información del Viaje
          </h3>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
              <p className="text-xs text-slate-500 mb-1">Origen</p>
              <p className="font-semibold text-slate-800 dark:text-white">
                {route.origin}
              </p>
            </div>
            <div className="text-center p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
              <p className="text-xs text-slate-500 mb-1">Destino</p>
              <p className="font-semibold text-slate-800 dark:text-white">
                {route.destination}
              </p>
            </div>
            <div className="text-center p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
              <p className="text-xs text-slate-500 mb-1">Fecha</p>
              <p className="font-semibold text-slate-800 dark:text-white">
                {new Date(route.date).toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "short",
                })}
              </p>
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
            <span className="text-slate-600 dark:text-slate-300">Pasajeros</span>
            <span className="text-xl font-bold text-blue-600">{totalPassengers}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="text-center pt-4 space-y-3">
          <button
            onClick={() => {
              if (confirm("¿Limpiar datos del navegador?")) {
                localStorage.removeItem("bus-seats-data");
                onResetBus();
                window.location.reload();
              }
            }}
            className="block w-full px-6 py-3 text-orange-500 border-2 border-orange-500 rounded-xl
                       hover:bg-orange-500 hover:text-white transition-colors font-semibold"
          >
            🧹 Limpiar datos del navegador
          </button>
        </div>
      </main>
    </div>
  );
};
