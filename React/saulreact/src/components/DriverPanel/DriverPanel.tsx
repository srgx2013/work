import { useState } from "react";
import type { Seat, RouteInfo, RemovalLog } from "../../types/seat";
import { RemovalModal } from "../RemovalModal";
import { FinishTripModal } from "../FinishTripModal/FinishTripModal";

interface DriverPanelProps {
  route: RouteInfo;
  seats: Seat[];
  occupiedCount: number;
  availableSeats: number;
  totalSeats: number;
  removalLogs?: RemovalLog[];
  onUpdateRoute: (route: Partial<RouteInfo>) => void;
  onResetBus: () => void;
  onTogglePaid: (seatId: string) => void;
  onRemovePassenger: (seatId: string, reason: string) => void;
  onLogout: () => void;
}

export const DriverPanel = ({
  route,
  seats,
  occupiedCount,
  availableSeats,
  totalSeats,
  removalLogs = [],
  onUpdateRoute,
  onResetBus,
  onTogglePaid,
  onRemovePassenger,
  onLogout,
}: DriverPanelProps) => {
  const [showRemovalModal, setShowRemovalModal] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [isEditingOrigin, setIsEditingOrigin] = useState(false);
  const [editedOrigin, setEditedOrigin] = useState(route.origin);

  const passengerSeats = seats.filter((s) => s.isOccupied && s.id !== "1A");
  
  // Group seats by passenger (phone) to handle multi-seat reservations
  const passengersMap = passengerSeats.reduce((acc, seat) => {
    const key = seat.passengerPhone;
    if (!acc[key]) {
      acc[key] = {
        name: seat.passengerName,
        phone: seat.passengerPhone,
        seats: [],
        destination: seat.passengerDestination,
        price: 0,
        isPaid: true, // Will be false if any seat is unpaid
      };
    }
    acc[key].seats.push(seat);
    acc[key].price += seat.passengerPrice;
    if (!seat.isPaid) acc[key].isPaid = false;
    return acc;
  }, {} as Record<string, {
    name: string;
    phone: string;
    seats: Seat[];
    destination: string;
    price: number;
    isPaid: boolean;
  }>);
  
  const passengers = Object.values(passengersMap).sort((a, b) => 
    a.seats[0].id.localeCompare(b.seats[0].id)
  );
  
  const occupancyPercentage = Math.round((occupiedCount / totalSeats) * 100);

  const totalEarned = passengerSeats.reduce((sum, s) => sum + s.passengerPrice, 0);
  const totalCollected = passengerSeats.filter((s) => s.isPaid).reduce((sum, s) => sum + s.passengerPrice, 0);

  // Count passengers (not seats) by destination
  const passengersByDestination: Record<string, number> = {};
  passengers.forEach((p) => {
    const dest = p.destination || "Sin destino";
    passengersByDestination[dest] = (passengersByDestination[dest] || 0) + 1;
  });

  const handleRemoveClick = (seat: Seat) => {
    setSelectedSeat(seat);
    setShowRemovalModal(true);
  };

  const handleConfirmRemoval = (reason: string) => {
    if (selectedSeat) {
      onRemovePassenger(selectedSeat.id, reason);
    }
    setShowRemovalModal(false);
    setSelectedSeat(null);
  };

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
                setEditedOrigin(route.origin);
                setIsEditingOrigin(true);
              }}
              className="text-sm text-blue-500 hover:text-blue-600"
            >
              ✏️ Editar Origen
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <p className="text-xs text-slate-500 mb-1">Origen</p>
              {isEditingOrigin ? (
                <div className="flex flex-col gap-1">
                  <input
                    type="text"
                    value={editedOrigin}
                    onChange={(e) => setEditedOrigin(e.target.value)}
                    className="w-full text-center font-semibold text-slate-800 dark:text-white bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded px-2 py-1 text-sm"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        onUpdateRoute({ origin: editedOrigin });
                        setIsEditingOrigin(false);
                      } else if (e.key === "Escape") {
                        setIsEditingOrigin(false);
                      }
                    }}
                  />
                  <div className="flex gap-1 justify-center">
                    <button
                      onClick={() => {
                        onUpdateRoute({ origin: editedOrigin });
                        setIsEditingOrigin(false);
                      }}
                      className="text-xs text-green-500 hover:text-green-600"
                    >
                      ✓
                    </button>
                    <button
                      onClick={() => setIsEditingOrigin(false)}
                      className="text-xs text-red-500 hover:text-red-600"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ) : (
                <p className="font-semibold text-slate-800 dark:text-white">
                  {route.origin}
                </p>
              )}
            </div>
            <div className="text-center p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <p className="text-xs text-slate-500 mb-1">Fecha</p>
              <p className="font-semibold text-slate-800 dark:text-white text-sm">
                {(() => {
                  const [year, month, day] = route.date.split('-').map(Number);
                  const date = new Date(year, month - 1, day);
                  return date.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
                })()}
              </p>
            </div>
            <div className="text-center p-3 bg-amber-50 dark:bg-amber-900/30 rounded-lg">
              <p className="text-xs text-slate-500 mb-1">Hora de salida</p>
              <p className="font-bold text-amber-600 dark:text-amber-400 text-xl">
                {route.departureTime}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs text-slate-500 mb-2">Destinos disponibles:</p>
            <div className="flex flex-wrap gap-2">
              {route.destinations.map((dest) => (
                <span
                  key={dest.id}
                  className="px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium"
                >
                  📍 {dest.name} - ${dest.price}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 text-white shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Disponibles</p>
                <p className="text-3xl font-bold">{availableSeats}</p>
              </div>
              <span className="text-3xl">🪑</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Pasajeros</p>
                <p className="text-3xl font-bold">{occupiedCount}</p>
              </div>
              <span className="text-3xl">👥</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-5 text-white shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm">Recaudado</p>
                <p className="text-2xl font-bold">${totalCollected.toLocaleString("es-AR")}</p>
              </div>
              <span className="text-3xl">💰</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-5 text-white shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-sm">Total a Cobrar</p>
                <p className="text-2xl font-bold">${totalEarned.toLocaleString("es-AR")}</p>
              </div>
              <span className="text-3xl">📊</span>
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
              {occupancyPercentage}% ({occupiedCount}/{totalSeats} asientos)
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
          <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
              📋 Pasajeros ({passengers.length})
            </h3>
            {removalLogs.length > 0 && (
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              >
                📜 Ver eliminados ({removalLogs.length})
              </button>
            )}
          </div>

          {passengers.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <span className="text-4xl mb-2 block">🚌</span>
              <p>No hay pasajeros registrados aún</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {passengers.map((passenger, index) => (
                <div
                  key={passenger.phone}
                  className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center text-sm font-bold text-blue-600 dark:text-blue-300">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-white">
                          {passenger.name || "Sin nombre"}
                        </p>
                        <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                          📱 {passenger.phone || "Sin teléfono"}
                        </p>
                        {passenger.seats.length > 1 && (
                          <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                            🎫 {passenger.seats.length} asientos: {passenger.seats.map(s => s.id).join(', ')}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-bold text-green-600">
                          ${passenger.price}
                          {passenger.seats.length > 1 && (
                            <span className="text-xs text-slate-500 block">
                              ({passenger.seats.length} × ${passenger.price / passenger.seats.length})
                            </span>
                          )}
                        </p>
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={passenger.isPaid}
                            onChange={() => {
                              // Toggle paid for all seats of this passenger
                              passenger.seats.forEach(s => onTogglePaid(s.id));
                            }}
                            className="w-4 h-4 rounded border-slate-300 text-green-500 focus:ring-green-500 cursor-pointer"
                          />
                          <span className={`text-xs font-medium ${
                            passenger.isPaid 
                              ? "text-green-600 dark:text-green-400" 
                              : "text-slate-500"
                          }`}>
                            {passenger.isPaid ? "✓ Pagado" : "Pendiente"}
                          </span>
                        </label>
                      </div>
                      <div className="flex gap-1">
                          <button
                            onClick={() => handleRemoveClick(passenger.seats[0])}
                            className="w-10 h-10 flex items-center justify-center text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                            title="Eliminar pasajero"
                          >
                            🗑️
                          </button>
                          <div className="w-12 h-12 bg-blue-500 text-white rounded-lg flex flex-col items-center justify-center font-bold shadow-md">
                            <span className="text-[8px]">Asiento</span>
                            <span className="text-lg">{passenger.seats.length === 1 ? passenger.seats[0].id : `${passenger.seats[0].id}+`}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
                        📍 {passenger.destination || "No registrado"}
                      </span>
                      <span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">
                        🕐 {passenger.seats[0]?.reservedAt
                          ? new Date(passenger.seats[0].reservedAt).toLocaleString("es-ES", {
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

        {/* Removal History */}
        {showHistory && removalLogs.length > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden">
            <div className="p-5 border-b border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                📜 Historial de Eliminados ({removalLogs.length})
              </h3>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700 max-h-64 overflow-y-auto">
              {removalLogs
                .sort((a, b) => new Date(b.removedAt).getTime() - new Date(a.removedAt).getTime())
                .map((log) => (
                  <div key={log.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-white">
                          {log.passengerName}
                        </p>
                        <p className="text-sm text-slate-500">
                          📱 {log.passengerPhone} • Asiento {log.seatId}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-red-500">${log.passengerPrice}</p>
                        <p className="text-xs text-slate-400">
                          {new Date(log.removedAt).toLocaleString("es-ES", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded text-xs">
                        🚫 {log.reason}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

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
            onClick={() => setShowFinishModal(true)}
            disabled={passengerSeats.length === 0}
            className="px-6 py-3 text-green-500 border-2 border-green-500 rounded-lg
                       hover:bg-green-500 hover:text-white transition-colors font-semibold
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🏁 Finalizar Viaje
          </button>
        </div>
      </main>

      {/* Removal Modal */}
      {showRemovalModal && selectedSeat && (
        <RemovalModal
          seatId={selectedSeat.id}
          passengerName={selectedSeat.passengerName}
          onConfirm={handleConfirmRemoval}
          onCancel={() => {
            setShowRemovalModal(false);
            setSelectedSeat(null);
          }}
        />
      )}

      {/* Finish Trip Modal */}
      {showFinishModal && (
        <FinishTripModal
          tripName={route.destinations.length > 0 ? "Viaje" : "Viaje"}
          totalPassengers={passengerSeats.length}
          totalEarned={totalEarned}
          totalCollected={totalCollected}
          passengersByDestination={passengersByDestination}
          onFinishAndContinue={() => {
            onResetBus();
            setShowFinishModal(false);
          }}
          onCancel={() => setShowFinishModal(false)}
        />
      )}
    </div>
  );
};
