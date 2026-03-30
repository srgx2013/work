import { useState } from "react";
import { useBusSeats } from "./hooks/useBusSeats";
import { Bus } from "./components/Bus";

function App() {
  const {
    route,
    seats,
    occupiedCount,
    totalSeats,
    availableSeats,
    reserveSeat,
    cancelReservation,
    updateRoute,
    resetBus,
  } = useBusSeats();

  const [isEditingRoute, setIsEditingRoute] = useState(false);

  return (
    <div className="min-h-screen bg-slate-200 dark:bg-slate-950 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <header className="text-center">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
            🎫 Control de Asientos
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Sistema de reservas de bus
          </p>
        </header>

        {/* Route Info Card */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-md">
          {isEditingRoute ? (
            <div className="space-y-3">
              <input
                type="text"
                value={route.origin}
                onChange={(e) => updateRoute({ origin: e.target.value })}
                placeholder="Origen"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 
                           rounded-md bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
              />
              <input
                type="text"
                value={route.destination}
                onChange={(e) => updateRoute({ destination: e.target.value })}
                placeholder="Destino"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 
                           rounded-md bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
              />
              <input
                type="date"
                value={route.date}
                onChange={(e) => updateRoute({ date: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 
                           rounded-md bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
              />
              <button
                onClick={() => setIsEditingRoute(false)}
                className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Guardar
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📍</span>
                  <div>
                    <p className="text-xs text-slate-500">Desde</p>
                    <p className="font-semibold text-slate-800 dark:text-white">
                      {route.origin}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-2xl">📍</span>
                  <div>
                    <p className="text-xs text-slate-500">Hasta</p>
                    <p className="font-semibold text-slate-800 dark:text-white">
                      {route.destination}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-2xl">📅</span>
                  <div>
                    <p className="text-xs text-slate-500">Fecha</p>
                    <p className="font-semibold text-slate-800 dark:text-white">
                      {new Date(route.date).toLocaleDateString("es-ES", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsEditingRoute(true)}
                className="px-3 py-2 text-sm text-blue-500 hover:bg-blue-50 
                           dark:hover:bg-blue-900/30 rounded-md"
              >
                ✏️ Editar
              </button>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-md text-center">
            <p className="text-3xl font-bold text-green-500">{availableSeats}</p>
            <p className="text-xs text-slate-500">Disponibles</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-md text-center">
            <p className="text-3xl font-bold text-red-500">{occupiedCount}</p>
            <p className="text-xs text-slate-500">Ocupados</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-md text-center">
            <p className="text-3xl font-bold text-slate-600 dark:text-slate-300">
              {totalSeats}
            </p>
            <p className="text-xs text-slate-500">Total</p>
          </div>
        </div>

        {/* Bus Component */}
        <Bus
          seats={seats}
          onReserve={reserveSeat}
          onCancel={cancelReservation}
        />

        {/* Reset Button */}
        <div className="text-center">
          <button
            onClick={() => {
              if (confirm("¿Resetear todos los asientos?")) {
                resetBus();
              }
            }}
            className="px-6 py-2 text-red-500 border border-red-500 rounded-md
                       hover:bg-red-50 dark:hover:bg-red-900/30"
          >
            🔄 Resetear Bus
          </button>
        </div>

        {/* Reservations List */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-md">
          <h3 className="font-bold text-slate-800 dark:text-white mb-3">
            📋 Reservas Activas
          </h3>
          {seats.filter((s) => s.isOccupied).length === 0 ? (
            <p className="text-slate-500 text-sm">No hay reservas activas</p>
          ) : (
            <ul className="space-y-2">
              {seats
                .filter((s) => s.isOccupied)
                .sort((a, b) => a.id.localeCompare(b.id))
                .map((seat) => (
                  <li
                    key={seat.id}
                    className="flex items-center justify-between py-2 px-3 
                               bg-slate-50 dark:bg-slate-700 rounded-md"
                  >
                    <div>
                      <span className="font-bold text-blue-500">
                        Asiento {seat.id}
                      </span>
                      <span className="text-slate-600 dark:text-slate-300">
                        {" "}
                        — {seat.passengerName}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400">
                      {seat.reservedAt &&
                        new Date(seat.reservedAt).toLocaleTimeString("es-ES", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                    </span>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
