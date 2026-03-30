import type { Seat, RouteInfo } from "../../types/seat";

interface DriverPanelProps {
  route: RouteInfo;
  seats: Seat[];
  occupiedCount: number;
  availableSeats: number;
  totalSeats: number;
  onUpdateRoute: (route: Partial<RouteInfo>) => void;
  onResetBus: () => void;
  onLogout: () => void;
}

export const DriverPanel = ({
  route,
  seats,
  occupiedCount,
  availableSeats,
  totalSeats,
  onUpdateRoute,
  onResetBus,
  onLogout,
}: DriverPanelProps) => {
  const passengerSeats = seats.filter((s) => s.isOccupied && s.id !== "1A");
  const occupancyPercentage = Math.round((occupiedCount / totalSeats) * 100);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      {/* Header */}
      <header className="bg-slate-800 text-white py-4 px-6">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🚗</span>
            <div>
              <h1 className="text-xl font-bold">Panel del Conductor</h1>
              <p className="text-sm text-slate-300">Gestión de pasajeros</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="px-4 py-2 text-sm bg-slate-700 hover:bg-slate-600 rounded-md"
          >
            Salir
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-6 space-y-6">
        {/* Route Info */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
              📍 Ruta del viaje
            </h2>
            <button
              onClick={() => {
                const newOrigin = prompt("Origen:", route.origin);
                const newDest = prompt("Destino:", route.destination);
                const newDate = prompt("Fecha (YYYY-MM-DD):", route.date);
                if (newOrigin) onUpdateRoute({ origin: newOrigin });
                if (newDest) onUpdateRoute({ destination: newDest });
                if (newDate) onUpdateRoute({ date: newDate });
              }}
              className="text-sm text-blue-500 hover:text-blue-600"
            >
              ✏️ Editar
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-xs text-slate-500 mb-1">Origen</p>
              <p className="font-semibold text-slate-800 dark:text-white">
                {route.origin}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-500 mb-1">Destino</p>
              <p className="font-semibold text-slate-800 dark:text-white">
                {route.destination}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-500 mb-1">Fecha</p>
              <p className="font-semibold text-slate-800 dark:text-white text-sm">
                {new Date(route.date).toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "short",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 text-white shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Disponibles</p>
                <p className="text-4xl font-bold">{availableSeats - 1}</p>
              </div>
              <span className="text-4xl">🪑</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Pasajeros</p>
                <p className="text-4xl font-bold">{occupiedCount - 1}</p>
              </div>
              <span className="text-4xl">👥</span>
            </div>
          </div>
        </div>

        {/* Occupancy Bar */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-md">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-slate-800 dark:text-white">
              Ocupación del vehículo
            </h3>
            <span className="text-sm text-slate-500">
              {occupancyPercentage}% ({occupiedCount - 1}/{totalSeats - 1} asientos)
            </span>
          </div>
          <div className="w-full h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-500"
              style={{ width: `${occupancyPercentage}%` }}
            />
          </div>
        </div>

        {/* Passenger List */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden">
          <div className="p-5 border-b border-slate-200 dark:border-slate-700">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
              📋 Lista de Pasajeros ({passengerSeats.length})
            </h3>
          </div>

          {passengerSeats.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <span className="text-4xl mb-2 block">🚌</span>
              <p>No hay pasajeros registrados aún</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {passengerSeats
                .sort((a, b) => a.id.localeCompare(b.id))
                .map((seat, index) => (
                  <div
                    key={seat.id}
                    className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center text-sm font-bold text-blue-600 dark:text-blue-300">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-white">
                            {seat.passengerName || "Sin nombre"}
                          </p>
                          <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                            📱 {seat.passengerPhone || "Sin teléfono"}
                          </p>
                        </div>
                      </div>
                      <div className="w-14 h-14 bg-blue-500 text-white rounded-lg flex flex-col items-center justify-center font-bold shadow-md">
                        <span className="text-[10px]">Asiento</span>
                        <span className="text-xl">{seat.id}</span>
                      </div>
                    </div>
                    <div className="ml-13 flex flex-wrap items-center gap-2 mt-2">
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
                        📍 Destino: {seat.passengerDestination || "No registrado"}
                      </span>
                      <span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">
                        🕐 {seat.reservedAt
                          ? new Date(seat.reservedAt).toLocaleString("es-ES", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "--:--"}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Quick Seat Map */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-md">
          <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            🗺️ Mapa de Asientos
          </h3>
          <div className="grid grid-cols-5 gap-2 text-center">
            {seats
              .filter((s) => s.id !== "1A")
              .sort((a, b) => a.id.localeCompare(b.id))
              .map((seat) => (
                <div
                  key={seat.id}
                  className={`p-2 rounded-lg text-sm font-semibold ${
                    seat.isOccupied
                      ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300"
                      : "bg-slate-100 text-slate-400 dark:bg-slate-700 dark:text-slate-500"
                  }`}
                >
                  {seat.id}
                </div>
              ))}
          </div>
          <div className="flex justify-center gap-4 mt-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-100 rounded" /> Ocupado
            </span>
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 bg-slate-100 rounded" /> Libre
            </span>
          </div>
        </div>

        {/* Reset Buttons */}
        <div className="text-center pt-4 space-y-3">
          <button
            onClick={() => {
              if (confirm("¿Limpiar datos corruptos del navegador?")) {
                localStorage.removeItem("bus-seats-data");
                onResetBus();
                window.location.reload();
              }
            }}
            className="block w-full px-6 py-3 text-orange-500 border-2 border-orange-500 rounded-lg
                       hover:bg-orange-500 hover:text-white transition-colors font-semibold"
          >
            🧹 Limpiar datos del navegador
          </button>
          <button
            onClick={() => {
              if (confirm("¿Estás seguro de resetear todos los asientos? Esto eliminará todas las reservas.")) {
                onResetBus();
              }
            }}
            className="px-6 py-3 text-red-500 border-2 border-red-500 rounded-lg
                       hover:bg-red-500 hover:text-white transition-colors font-semibold"
          >
            🔄 Iniciar nuevo viaje
          </button>
        </div>
      </main>
    </div>
  );
};
