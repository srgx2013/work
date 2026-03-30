import { useState, useEffect } from "react";
import type { Trip, Destination, TripSummary } from "../../types/seat";

interface OwnerPanelProps {
  trips: Trip[];
  activeTripId: string | null;
  tripSummaries: TripSummary[];
  onUpdateTrip: (tripId: string, updates: Partial<Trip>) => void;
  onAddTrip: (name: string, driverCode: string) => void;
  onDeleteTrip: (tripId: string) => void;
  onSetActiveTrip: (tripId: string) => void;
  onLogout: () => void;
}

export const OwnerPanel = ({
  trips,
  activeTripId,
  tripSummaries,
  onUpdateTrip,
  onAddTrip,
  onDeleteTrip,
  onSetActiveTrip,
  onLogout,
}: OwnerPanelProps) => {
  const [showAddTrip, setShowAddTrip] = useState(false);
  const [newTripName, setNewTripName] = useState("");
  const [newDriverCode, setNewDriverCode] = useState("");
  const [showAddDestination, setShowAddDestination] = useState(false);
  const [newDestName, setNewDestName] = useState("");
  const [newDestPrice, setNewDestPrice] = useState("");
  const [showRemovalHistory, setShowRemovalHistory] = useState(false);
  const [selectedTripForModal, setSelectedTripForModal] = useState<Trip | null>(null);
  const [selectedSummaryForModal, setSelectedSummaryForModal] = useState<TripSummary | null>(null);
  
  // Local state for status buttons (synced with activeTrip)
  const [localStatus, setLocalStatus] = useState<'active' | 'cancelled' | 'delayed'>('active');
  const [localDelayTime, setLocalDelayTime] = useState('');
  const [localStatusReason, setLocalStatusReason] = useState('');

  const activeTrip = trips.find((t) => t.id === activeTripId);
  
  // Sync local status with activeTrip when it changes
  useEffect(() => {
    if (activeTrip?.status) {
      setLocalStatus(activeTrip.status);
      setLocalDelayTime(activeTrip.delayNewTime || '');
      setLocalStatusReason(activeTrip.statusReason || '');
    } else {
      setLocalStatus('active');
      setLocalDelayTime('');
      setLocalStatusReason('');
    }
  }, [activeTrip?.id]); // Only sync when switching trips

  const getTripStats = (trip: Trip) => {
    const passengerSeats = trip.seats.filter((s) => s.isOccupied && s.id !== "1A");
    
    // Group seats by passenger (phone) for multi-seat reservations
    const passengersMap = passengerSeats.reduce((acc, seat) => {
      const key = seat.passengerPhone;
      if (!acc[key]) {
        acc[key] = {
          name: seat.passengerName,
          phone: seat.passengerPhone,
          seats: [],
          destination: seat.passengerDestination,
          destinationId: seat.passengerDestinationId,
          price: 0,
          isPaid: true,
        };
      }
      acc[key].seats.push(seat);
      acc[key].price += seat.passengerPrice;
      if (!seat.isPaid) acc[key].isPaid = false;
      return acc;
    }, {} as Record<string, {
      name: string;
      phone: string;
      seats: typeof passengerSeats;
      destination: string;
      destinationId: string | null;
      price: number;
      isPaid: boolean;
    }>);
    
    const passengers = Object.values(passengersMap).sort((a, b) => 
      a.seats[0].id.localeCompare(b.seats[0].id)
    );
    
    const paidPassengers = passengers.filter((p) => p.isPaid);
    const totalPassengers = passengers.length;
    
    const byDestination: Record<string, { count: number; earned: number; paid: number }> = {};
    
    passengers.forEach((p) => {
      const destId = p.destinationId || "unknown";
      if (!byDestination[destId]) {
        byDestination[destId] = { count: 0, earned: 0, paid: 0 };
      }
      byDestination[destId].count++;
      byDestination[destId].earned += p.price;
      if (p.isPaid) {
        byDestination[destId].paid += p.price;
      }
    });

    const totalEarned = passengerSeats.reduce((sum, s) => sum + s.passengerPrice, 0);
    const totalCollected = paidPassengers.reduce((sum, p) => sum + p.price, 0);

    return {
      passengers,
      passengerSeats,
      paidPassengers,
      totalPassengers,
      totalEarned,
      totalCollected,
      totalPending: totalEarned - totalCollected,
      byDestination,
    };
  };

  const handleAddTrip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTripName.trim() || !newDriverCode.trim()) return;
    onAddTrip(newTripName.trim(), newDriverCode.trim());
    setNewTripName("");
    setNewDriverCode("");
    setShowAddTrip(false);
  };

  const handleAddDestination = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTrip || !newDestName.trim() || !newDestPrice) return;

    const price = Number(newDestPrice);
    if (price <= 0) {
      alert("El precio debe ser mayor a 0");
      return;
    }

    const newDestination: Destination = {
      id: `dest-${Date.now()}`,
      name: newDestName.trim(),
      price,
    };

    onUpdateTrip(activeTrip.id, {
      route: {
        ...activeTrip.route,
        destinations: [...activeTrip.route.destinations, newDestination],
      },
    });

    setNewDestName("");
    setNewDestPrice("");
    setShowAddDestination(false);
  };

  const handleDeleteDestination = (destId: string) => {
    if (!activeTrip) return;
    if (!confirm("¿Eliminar este destino?")) return;

    onUpdateTrip(activeTrip.id, {
      route: {
        ...activeTrip.route,
        destinations: activeTrip.route.destinations.filter((d) => d.id !== destId),
      },
    });
  };

  const handleUpdateDestination = (destId: string, updates: Partial<Destination>) => {
    if (!activeTrip) return;
    
    // Validate price if being updated
    if (updates.price !== undefined) {
      if (updates.price <= 0) {
        alert("El precio debe ser mayor a 0");
        return;
      }
    }
    
    onUpdateTrip(activeTrip.id, {
      route: {
        ...activeTrip.route,
        destinations: activeTrip.route.destinations.map((d) =>
          d.id === destId ? { ...d, ...updates } : d
        ),
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-950 dark:to-slate-900">
      <header className="bg-gradient-to-r from-amber-600 to-amber-700 text-white py-4 px-6 shadow-lg">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">👤</span>
            <div>
              <h1 className="text-xl font-bold">Panel del Propietario</h1>
              <p className="text-amber-200 text-sm">Gestión de viajes</p>
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
        {/* Trips Management */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
              🚌 Viajes
            </h2>
            <button
              onClick={() => setShowAddTrip(!showAddTrip)}
              className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              + Nuevo Viaje
            </button>
          </div>

          {showAddTrip && (
            <form onSubmit={handleAddTrip} className="mb-4 p-4 bg-slate-50 dark:bg-slate-700 rounded-xl space-y-3">
              <input
                type="text"
                value={newTripName}
                onChange={(e) => setNewTripName(e.target.value)}
                placeholder="Nombre del viaje (ej: Viaje Mañana)"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-600 text-slate-800 dark:text-white"
              />
              <input
                type="text"
                value={newDriverCode}
                onChange={(e) => setNewDriverCode(e.target.value)}
                placeholder="Código para el conductor"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-600 text-slate-800 dark:text-white"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Crear
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddTrip(false)}
                  className="px-4 py-2 text-slate-500 border border-slate-300 rounded-lg hover:bg-slate-100"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}

          <div className="space-y-2">
            {trips.map((trip) => {
              const stats = getTripStats(trip);
              const isActive = trip.id === activeTripId;
              return (
                <div
                  key={trip.id}
                  className={`p-3 rounded-xl border-2 transition-colors ${
                    isActive
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                      : "border-slate-200 dark:border-slate-600"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-800 dark:text-white">{trip.name}</h3>
                        {isActive && (
                          <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                            Activo
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-500">
                        {trip.route.origin} → {trip.route.destinations.map((d) => d.name).join(", ")}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Código: <code className="bg-slate-200 dark:bg-slate-600 px-1 rounded">{trip.driverCode}</code>
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        💵 ${stats.totalEarned.toLocaleString("es-AR")} ({stats.totalPassengers} pasajeros)
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {stats.totalPassengers > 0 && (
                        <button
                          onClick={() => {
                            setSelectedTripForModal(trip);
                            setSelectedSummaryForModal(null);
                          }}
                          className="px-2 py-1 text-xs bg-green-500 text-white rounded-lg hover:bg-green-600"
                        >
                          👥 Pasajeros
                        </button>
                      )}
                      {!isActive && (
                        <button
                          onClick={() => onSetActiveTrip(trip.id)}
                          className="px-2 py-1 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                          Activar
                        </button>
                      )}
                      <button
                        onClick={() => {
                          const isLastTrip = trips.length === 1;
                          const passengerCount = trip.seats.filter((s) => s.isOccupied && s.id !== "1A").length;
                          
                          if (isLastTrip && passengerCount > 0) {
                            alert("No se puede eliminar el único viaje que tiene pasajeros. Cancela las reservas primero.");
                            return;
                          }
                          
                          if (isLastTrip) {
                            if (!confirm("¿Eliminar el último viaje? Se perderán todos los datos.")) {
                              return;
                            }
                          } else if (passengerCount > 0) {
                            if (!confirm(`¿Eliminar este viaje? Hay ${passengerCount} pasajero(s) con reserva que se perderán.`)) {
                              return;
                            }
                          }
                          
                          onDeleteTrip(trip.id);
                        }}
                        className="px-2 py-1 text-xs text-red-500 border border-red-500 rounded-lg hover:bg-red-50"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Trip Configuration */}
        {activeTrip && (
          <>
            {/* Destinations Management */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  📍 Destinos y Precios
                </h2>
                <button
                  onClick={() => setShowAddDestination(!showAddDestination)}
                  className="px-3 py-1.5 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  + Agregar Destino
                </button>
              </div>

              {showAddDestination && (
                <form onSubmit={handleAddDestination} className="mb-4 p-4 bg-slate-50 dark:bg-slate-700 rounded-xl space-y-3">
                  <input
                    type="text"
                    value={newDestName}
                    onChange={(e) => setNewDestName(e.target.value)}
                    placeholder="Nombre del destino (ej: Zona Norte)"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-600 text-slate-800 dark:text-white"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">$</span>
                    <input
                      type="number"
                      value={newDestPrice}
                      onChange={(e) => setNewDestPrice(e.target.value)}
                      placeholder="Precio"
                      className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-600 text-slate-800 dark:text-white"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                      Agregar
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddDestination(false)}
                      className="px-4 py-2 text-slate-500 border border-slate-300 rounded-lg hover:bg-slate-100"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-2">
                {activeTrip.route.destinations.map((dest) => (
                  <div
                    key={dest.id}
                    className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-xl"
                  >
                    <div className="flex-1">
                      <input
                        type="text"
                        value={dest.name}
                        onChange={(e) => handleUpdateDestination(dest.id, { name: e.target.value })}
                        className="w-full font-medium text-slate-800 dark:text-white bg-transparent border-b border-transparent focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-slate-500">$</span>
                      <input
                        type="number"
                        value={dest.price}
                        onChange={(e) => handleUpdateDestination(dest.id, { price: Number(e.target.value) })}
                        className="w-24 px-2 py-1 text-right font-bold text-green-600 bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-lg focus:outline-none focus:border-green-500"
                      />
                    </div>
                    <button
                      onClick={() => handleDeleteDestination(dest.id)}
                      className="px-2 py-1 text-red-500 hover:bg-red-50 rounded-lg"
                      title="Eliminar destino"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>

              {activeTrip.route.destinations.length === 0 && (
                <p className="text-center text-slate-400 py-4">
                  No hay destinos agregados. Agregá al menos uno para que los pasajeros puedan reservar.
                </p>
              )}
            </div>

            {/* Route Info */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
              <h3 className="font-bold text-slate-800 dark:text-white mb-4">
                🚌 Información del Viaje
              </h3>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
                  <p className="text-xs text-slate-500 mb-1">Origen</p>
                  <input
                    type="text"
                    value={activeTrip.route.origin}
                    onChange={(e) =>
                      onUpdateTrip(activeTrip.id, {
                        route: { ...activeTrip.route, origin: e.target.value },
                      })
                    }
                    className="w-full text-center font-semibold text-slate-800 dark:text-white bg-transparent border-b border-slate-300 dark:border-slate-500 focus:outline-none"
                  />
                </div>
                <div className="text-center p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
                  <p className="text-xs text-slate-500 mb-1">Fecha</p>
                  <input
                    type="date"
                    value={activeTrip.route.date}
                    onChange={(e) =>
                      onUpdateTrip(activeTrip.id, {
                        route: { ...activeTrip.route, date: e.target.value },
                      })
                    }
                    className="w-full text-center font-semibold text-slate-800 dark:text-white bg-transparent border-b border-slate-300 dark:border-slate-500 focus:outline-none"
                  />
                </div>
                <div className="text-center p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
                  <p className="text-xs text-slate-500 mb-1">Hora de salida</p>
                  <input
                    type="time"
                    value={activeTrip.route.departureTime}
                    onChange={(e) =>
                      onUpdateTrip(activeTrip.id, {
                        route: { ...activeTrip.route, departureTime: e.target.value },
                      })
                    }
                    className="w-full text-center font-semibold text-slate-800 dark:text-white bg-transparent border-b border-slate-300 dark:border-slate-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Status Management */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg mt-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  🚨 Estado del Viaje
                </h2>
                {/* Share Status Link */}
                <button
                  onClick={() => {
                    const url = `${window.location.origin}/status/${activeTrip.id}`;
                    navigator.clipboard.writeText(url);
                    alert('URL de estado copiada al portapapeles');
                  }}
                  className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-1"
                >
                  📤 Compartir Estado
                </button>
              </div>

              {/* Status Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <button
                  onClick={() => {
                    setLocalStatus('active');
                    onUpdateTrip(activeTrip.id, {
                      status: 'active',
                      statusUpdatedAt: new Date().toISOString(),
                    });
                  }}
                  className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all ${
                    localStatus === 'active'
                      ? "bg-green-500 text-white shadow-md"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  ✅ Activo
                </button>
                <button
                  onClick={() => {
                    const reason = prompt("¿Razón del retraso? (opcional)");
                    const newTime = prompt("Nueva hora de salida (ej: 09:30)");
                    if (newTime) {
                      setLocalStatus('delayed');
                      setLocalDelayTime(newTime);
                      setLocalStatusReason(reason || '');
                      onUpdateTrip(activeTrip.id, {
                        status: 'delayed',
                        delayNewTime: newTime,
                        statusReason: reason || '',
                        statusUpdatedAt: new Date().toISOString(),
                      });
                    }
                  }}
                  className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all ${
                    localStatus === 'delayed'
                      ? "bg-yellow-500 text-white shadow-md"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  ⏰ Retrasado
                  {localStatus === 'delayed' && localDelayTime && (
                    <span className="text-sm">→ {localDelayTime}</span>
                  )}
                </button>
                <button
                  onClick={() => {
                    const reason = prompt("¿Motivo de cancelación? (opcional)");
                    if (confirm('¿Estás seguro de cancelar este viaje?')) {
                      setLocalStatus('cancelled');
                      setLocalStatusReason(reason || 'Cancelado por causas de fuerza mayor');
                      onUpdateTrip(activeTrip.id, {
                        status: 'cancelled',
                        statusReason: reason || 'Cancelado por causas de fuerza mayor',
                        statusUpdatedAt: new Date().toISOString(),
                      });
                    }
                  }}
                  className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all ${
                    localStatus === 'cancelled'
                      ? "bg-red-500 text-white shadow-md"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  🚫 Cancelado
                </button>
              </div>

              {/* Current Status Display */}
              {localStatus && localStatus !== 'active' && (
                <div className={`p-4 rounded-xl ${
                  localStatus === 'cancelled' ? 'bg-red-50 border border-red-200' :
                  localStatus === 'delayed' ? 'bg-yellow-50 border border-yellow-200' : ''
                }`}>
                  <p className={`font-semibold ${
                    localStatus === 'cancelled' ? 'text-red-600' :
                    localStatus === 'delayed' ? 'text-yellow-600' : ''
                  }`}>
                    {localStatus === 'cancelled' && '🚫 Viaje CANCELADO'}
                    {localStatus === 'delayed' && `⏰ Viaje RETRASADO - Nueva hora: ${localDelayTime || 'No establecida'}`}
                  </p>
                  {localStatusReason && (
                    <p className="text-sm text-slate-600 mt-1">
                      Razón: {localStatusReason}
                    </p>
                  )}
                  {activeTrip.statusUpdatedAt && (
                    <p className="text-xs text-slate-400 mt-2">
                      Actualizado: {(() => {
                        const date = new Date(activeTrip.statusUpdatedAt);
                        const now = new Date();
                        const diff = Math.floor((now.getTime() - date.getTime()) / 60000);
                        if (diff < 1) return 'Hace un momento';
                        if (diff < 60) return `Hace ${diff} minuto${diff > 1 ? 's' : ''}`;
                        return date.toLocaleString('es-ES');
                      })()}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Earnings Summary by Destination */}
            {(() => {
              const stats = getTripStats(activeTrip);
              return (
                <>
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-bold flex items-center gap-2">
                        💰 Ganancias del Viaje
                      </h2>
                      <span className="text-4xl">📊</span>
                    </div>

                    <div className="text-center py-4">
                      <p className="text-green-100 text-sm mb-1">Total a Recaudar</p>
                      <p className="text-5xl font-bold">
                        ${stats.totalEarned.toLocaleString("es-AR")}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="bg-white/20 rounded-xl p-4 text-center">
                        <p className="text-green-100 text-xs">💵 Cobrado</p>
                        <p className="text-2xl font-bold">
                          ${stats.totalCollected.toLocaleString("es-AR")}
                        </p>
                      </div>
                      <div className="bg-white/20 rounded-xl p-4 text-center">
                        <p className="text-green-100 text-xs">⏳ Pendiente</p>
                        <p className="text-2xl font-bold">
                          ${stats.totalPending.toLocaleString("es-AR")}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Earnings by Destination */}
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
                    <h3 className="font-bold text-slate-800 dark:text-white mb-4">
                      📊 Ganancias por Destino
                    </h3>
                    
                    {Object.keys(stats.byDestination).length > 0 ? (
                      <div className="space-y-3">
                        {Object.entries(stats.byDestination).map(([destId, data]) => {
                          const dest = activeTrip.route.destinations.find((d) => d.id === destId);
                          return (
                            <div
                              key={destId}
                              className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-xl"
                            >
                              <div>
                                <p className="font-medium text-slate-800 dark:text-white">
                                  {dest?.name || "Destino eliminado"}
                                </p>
                                <p className="text-sm text-slate-500">
                                  {data.count} pasajeros × ${dest?.price || 0}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold text-green-600">
                                  ${data.earned.toLocaleString("es-AR")}
                                </p>
                                <p className="text-xs text-slate-500">
                                  Cobrado: ${data.paid.toLocaleString("es-AR")}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-center text-slate-400 py-4">
                        No hay pasajeros registrados aún
                      </p>
                    )}
                  </div>
                </>
              );
            })()}

            {/* Removal History */}
            {activeTrip.removalLogs && activeTrip.removalLogs.length > 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    🚫 Historial de Eliminados ({activeTrip.removalLogs.length})
                  </h3>
                  <button
                    onClick={() => setShowRemovalHistory(!showRemovalHistory)}
                    className="text-sm text-red-500 hover:text-red-600"
                  >
                    {showRemovalHistory ? "Ocultar" : "Ver"}
                  </button>
                </div>

                {showRemovalHistory && (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {activeTrip.removalLogs
                      .sort((a, b) => new Date(b.removedAt).getTime() - new Date(a.removedAt).getTime())
                      .map((log) => (
                        <div
                          key={log.id}
                          className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800"
                        >
                          <div>
                            <p className="font-semibold text-slate-800 dark:text-white">
                              {log.passengerName}
                            </p>
                            <p className="text-sm text-slate-500">
                              📱 {log.passengerPhone} • Asiento {log.seatId} • 📍 {log.passengerDestination}
                            </p>
                            <p className="text-xs text-red-500 mt-1">
                              🚫 {log.reason}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-red-500">-${log.passengerPrice}</p>
                            <p className="text-xs text-slate-400">
                              {new Date(log.removedAt).toLocaleString("es-ES", {
                                day: "numeric",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}

            {/* Total Eliminados Stats */}
            {activeTrip.removalLogs && activeTrip.removalLogs.length > 0 && (
              <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100 text-sm">Pasajeros Eliminados</p>
                    <p className="text-3xl font-bold">{activeTrip.removalLogs.length}</p>
                  </div>
                  <span className="text-4xl">🚫</span>
                </div>
                <p className="text-red-100 text-sm mt-2">
                  Total perdido: ${activeTrip.removalLogs.reduce((sum, l) => sum + l.passengerPrice, 0).toLocaleString("es-AR")}
                </p>
              </div>
            )}
          </>
        )}

        {/* Trip History Summary */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
              📜 Historial de Viajes ({tripSummaries.length})
            </h3>
          </div>

          {tripSummaries.length === 0 ? (
            <p className="text-center text-slate-400 py-4">
              No hay viajes completados aún. Los viajes aparecerán aquí cuando el conductor reinicie el viaje.
            </p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {tripSummaries.map((summary) => (
                <div
                  key={summary.id}
                  className="p-4 bg-slate-50 dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800 dark:text-white">{summary.tripName}</p>
                      <p className="text-sm text-slate-500">
                        {(() => {
                          const [year, month, day] = summary.date.split('-').map(Number);
                          const date = new Date(year, month - 1, day);
                          return date.toLocaleDateString("es-ES");
                        })()} - {summary.departureTime}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">
                          ${summary.totalCollected.toLocaleString("es-AR")}
                        </p>
                        <p className="text-xs text-slate-500">
                          de ${summary.totalEarned.toLocaleString("es-AR")}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedSummaryForModal(summary);
                          setSelectedTripForModal(null);
                        }}
                        className="px-2 py-1 text-xs bg-green-500 text-white rounded-lg hover:bg-green-600"
                      >
                        👥 Ver
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">
                      👥 {summary.totalPassengers} pasajeros
                    </span>
                    {Object.entries(summary.passengersByDestination).map(([dest, count]) => (
                      <span key={dest} className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded">
                        📍 {dest}: {count}
                      </span>
                    ))}
                    {summary.removedPassengers > 0 && (
                      <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded">
                        🚫 {summary.removedPassengers} eliminados
                      </span>
                    )}
                    {summary.totalLost > 0 && (
                      <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded">
                        -${summary.totalLost.toLocaleString("es-AR")}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="text-center pt-4 space-y-3">
          <button
            onClick={() => {
              if (confirm("¿Limpiar datos del navegador?")) {
                localStorage.removeItem("bus-seats-data");
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

      {/* Trip Detail Modal - Active Trip */}
      {selectedTripForModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg max-h-[80vh] overflow-hidden shadow-xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">{selectedTripForModal.name}</h2>
                  <p className="text-green-100 text-sm">
                    {selectedTripForModal.route.origin} → {selectedTripForModal.route.destinations.map((d) => d.name).join(", ")}
                  </p>
                  <p className="text-green-100 text-xs mt-1">
                    📅 {(() => {
                      const [year, month, day] = selectedTripForModal.route.date.split('-').map(Number);
                      const date = new Date(year, month - 1, day);
                      return date.toLocaleDateString("es-ES");
                    })()} - 🕐 {selectedTripForModal.route.departureTime}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedTripForModal(null)}
                  className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Passenger List */}
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              {/* Group passengers by phone for multi-seat display */}
              {(() => {
                const passengerSeats = selectedTripForModal.seats.filter((s) => s.isOccupied && s.id !== "1A");
                const passengersMap = passengerSeats.reduce((acc, seat) => {
                  const key = seat.passengerPhone;
                  if (!acc[key]) {
                    acc[key] = {
                      name: seat.passengerName,
                      phone: seat.passengerPhone,
                      seats: [],
                      destination: seat.passengerDestination,
                      price: 0,
                      isPaid: true,
                    };
                  }
                  acc[key].seats.push(seat);
                  acc[key].price += seat.passengerPrice;
                  if (!seat.isPaid) acc[key].isPaid = false;
                  return acc;
                }, {} as Record<string, {
                  name: string;
                  phone: string;
                  seats: typeof passengerSeats;
                  destination: string;
                  price: number;
                  isPaid: boolean;
                }>);
                
                const passengers = Object.values(passengersMap).sort((a, b) => 
                  a.seats[0].id.localeCompare(b.seats[0].id)
                );
                const passengerCount = passengers.length;
                
                return (
                  <>
                    <h3 className="font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                      👥 Pasajeros ({passengerCount})
                    </h3>

                    {passengerCount === 0 ? (
                      <p className="text-center text-slate-400 py-8">No hay pasajeros en este viaje</p>
                    ) : (
                      <div className="space-y-2">
                        {passengers.map((passenger, index) => (
                          <div
                            key={passenger.phone}
                            className="p-3 bg-slate-50 dark:bg-slate-700 rounded-xl"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center text-sm font-bold text-blue-600 dark:text-blue-300">
                                  {index + 1}
                                </div>
                                <div>
                                  <p className="font-semibold text-slate-800 dark:text-white">
                                    {passenger.name || "Sin nombre"}
                                  </p>
                                  <p className="text-sm text-blue-600 dark:text-blue-400">
                                    📱 {passenger.phone || "Sin teléfono"}
                                  </p>
                                  {passenger.seats.length > 1 && (
                                    <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                                      🎫 {passenger.seats.length} asientos: {passenger.seats.map(s => s.id).join(', ')}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="w-10 h-10 bg-blue-500 text-white rounded-lg flex items-center justify-center font-bold text-sm">
                                    {passenger.seats.length === 1 ? passenger.seats[0].id : `${passenger.seats[0].id}+`}
                                  </span>
                                </div>
                                <p className="font-bold text-green-600">${passenger.price}</p>
                              </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
                                📍 {passenger.destination || "No registrado"}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                passenger.isPaid
                                  ? "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300"
                                  : "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300"
                              }`}>
                                {passenger.isPaid ? "✓ Pagado" : "⏳ Pendiente"}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                );
              })()}
            </div>

            {/* Footer Stats */}
            <div className="p-4 bg-slate-50 dark:bg-slate-700 border-t border-slate-200 dark:border-slate-600">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-2 bg-white dark:bg-slate-600 rounded-lg">
                  <p className="text-xs text-slate-500">Pasajeros</p>
                  <p className="text-lg font-bold text-blue-600">
                    {selectedTripForModal.seats.filter((s) => s.isOccupied && s.id !== "1A").length}
                  </p>
                </div>
                <div className="p-2 bg-white dark:bg-slate-600 rounded-lg">
                  <p className="text-xs text-slate-500">Total</p>
                  <p className="text-lg font-bold text-green-600">
                    ${selectedTripForModal.seats
                      .filter((s) => s.isOccupied && s.id !== "1A")
                      .reduce((sum, s) => sum + s.passengerPrice, 0)
                      .toLocaleString("es-AR")}
                  </p>
                </div>
                <div className="p-2 bg-white dark:bg-slate-600 rounded-lg">
                  <p className="text-xs text-slate-500">Cobrado</p>
                  <p className="text-lg font-bold text-emerald-600">
                    ${selectedTripForModal.seats
                      .filter((s) => s.isOccupied && s.id !== "1A" && s.isPaid)
                      .reduce((sum, s) => sum + s.passengerPrice, 0)
                      .toLocaleString("es-AR")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trip Detail Modal - Completed Trip (TripSummary) */}
      {selectedSummaryForModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg max-h-[80vh] overflow-hidden shadow-xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-600 to-slate-700 p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold">{selectedSummaryForModal.tripName}</h2>
                    <span className="text-xs bg-slate-500 px-2 py-0.5 rounded-full">Completado</span>
                  </div>
                  <p className="text-slate-300 text-sm">
                    📅 {(() => {
                      const [year, month, day] = selectedSummaryForModal.date.split('-').map(Number);
                      const date = new Date(year, month - 1, day);
                      return date.toLocaleDateString("es-ES");
                    })()} - 🕐 {selectedSummaryForModal.departureTime}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedSummaryForModal(null)}
                  className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Summary Content */}
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              <div className="bg-amber-50 dark:bg-amber-900/30 p-4 rounded-xl mb-4">
                <p className="text-sm text-amber-700 dark:text-amber-300 text-center">
                  ℹ️ Los detalles de pasajeros individuales no están disponibles para viajes completados. Solo se muestra el resumen.
                </p>
              </div>

              <h3 className="font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                📊 Resumen del Viaje
              </h3>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl text-center">
                    <p className="text-2xl font-bold text-blue-600">{selectedSummaryForModal.totalPassengers}</p>
                    <p className="text-xs text-slate-500">Pasajeros</p>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-xl text-center">
                    <p className="text-2xl font-bold text-green-600">
                      ${selectedSummaryForModal.totalCollected.toLocaleString("es-AR")}
                    </p>
                    <p className="text-xs text-slate-500">Cobrado</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-xl text-center">
                    <p className="text-xl font-bold text-slate-600">
                      ${selectedSummaryForModal.totalEarned.toLocaleString("es-AR")}
                    </p>
                    <p className="text-xs text-slate-500">Total a Cobrar</p>
                  </div>
                  <div className="p-3 bg-amber-50 dark:bg-amber-900/30 rounded-xl text-center">
                    <p className="text-xl font-bold text-amber-600">
                      ${selectedSummaryForModal.totalEarned - selectedSummaryForModal.totalCollected}
                    </p>
                    <p className="text-xs text-slate-500">Pendiente</p>
                  </div>
                </div>

                {selectedSummaryForModal.removedPassengers > 0 && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/30 rounded-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-red-700 dark:text-red-300 font-medium">Pasajeros Eliminados</span>
                      <span className="text-red-600 font-bold">{selectedSummaryForModal.removedPassengers}</span>
                    </div>
                    <p className="text-sm text-red-500">Total perdido: ${selectedSummaryForModal.totalLost.toLocaleString("es-AR")}</p>
                  </div>
                )}

                {Object.keys(selectedSummaryForModal.passengersByDestination).length > 0 && (
                  <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
                    <p className="font-medium text-slate-700 dark:text-slate-300 mb-2">Pasajeros por Destino</p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(selectedSummaryForModal.passengersByDestination).map(([dest, count]) => (
                        <span key={dest} className="px-3 py-1.5 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-full text-sm">
                          📍 {dest}: {count}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 dark:bg-slate-700 border-t border-slate-200 dark:border-slate-600">
              <p className="text-xs text-slate-400 text-center">
                Completado el {new Date(selectedSummaryForModal.completedAt).toLocaleString("es-ES")}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
