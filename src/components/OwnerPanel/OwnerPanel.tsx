import { useState } from "react";
import type { Seat, RouteInfo } from "../../types/seat";

interface OwnerPanelProps {
  route: RouteInfo;
  seats: Seat[];
  onUpdateRoute: (route: Partial<RouteInfo>) => void;
  onAddDestination: (name: string, price: number) => void;
  onUpdateDestination: (index: number, name: string, price: number) => void;
  onDeleteDestination: (index: number) => void;
  onLogout: () => void;
  onResetBus: () => void;
}

export const OwnerPanel = ({
  route,
  seats,
  onUpdateRoute,
  onAddDestination,
  onUpdateDestination,
  onDeleteDestination,
  onLogout,
  onResetBus,
}: OwnerPanelProps) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newDestName, setNewDestName] = useState("");
  const [newDestPrice, setNewDestPrice] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const passengerSeats = seats.filter((s) => s.isOccupied && s.id !== "1A");
  const destinations: { name: string; price: number }[] = route.destinations || [];

  // Calculate earnings per destination
  const getDestinationEarnings = () => {
    const earnings: Record<string, { total: number; paid: number; pending: number; count: number }> = {};
    
    destinations.forEach((dest) => {
      const passengers = passengerSeats.filter((s) => s.passengerDestination === dest.name);
      const paid = passengers.filter((s) => s.isPaid);
      const pending = passengers.filter((s) => !s.isPaid);
      
      earnings[dest.name] = {
        total: passengers.length * dest.price,
        paid: paid.length * dest.price,
        pending: pending.length * dest.price,
        count: passengers.length,
      };
    });
    
    return earnings;
  };

  const earningsByDest = getDestinationEarnings();
  const totalEarnings = Object.values(earningsByDest).reduce((sum, e) => sum + e.total, 0);
  const totalCollected = Object.values(earningsByDest).reduce((sum, e) => sum + e.paid, 0);
  const totalPending = Object.values(earningsByDest).reduce((sum, e) => sum + e.pending, 0);

  const handleAddDestination = () => {
    if (newDestName.trim() && newDestPrice) {
      onAddDestination(newDestName.trim(), Number(newDestPrice));
      setNewDestName("");
      setNewDestPrice("");
      setShowAddForm(false);
    }
  };

  const handleEditDestination = (index: number) => {
    const dest = destinations[index];
    setNewDestName(dest.name);
    setNewDestPrice(String(dest.price));
    setEditingIndex(index);
  };

  const handleSaveEdit = () => {
    if (editingIndex !== null && newDestName.trim() && newDestPrice) {
      onUpdateDestination(editingIndex, newDestName.trim(), Number(newDestPrice));
      setEditingIndex(null);
      setNewDestName("");
      setNewDestPrice("");
    }
  };

  const handleDeleteDestination = (index: number) => {
    const dest = destinations[index];
    const hasPassengers = passengerSeats.some((s) => s.passengerDestination === dest.name);
    
    if (hasPassengers) {
      alert(`No puedes eliminar "${dest.name}" porque hay pasajeros con ese destino.`);
      return;
    }
    
    if (confirm(`¿Eliminar el destino "${dest.name}"?`)) {
      onDeleteDestination(index);
    }
  };

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
                value={route.origin}
                onChange={(e) => onUpdateRoute({ origin: e.target.value })}
                className="w-full text-center font-semibold text-slate-800 dark:text-white bg-transparent border-b border-transparent hover:border-amber-400 focus:border-amber-500 outline-none"
              />
            </div>
            <div className="text-center p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
              <p className="text-xs text-slate-500 mb-1">Fecha</p>
              <input
                type="date"
                value={route.date}
                onChange={(e) => onUpdateRoute({ date: e.target.value })}
                className="w-full text-center font-semibold text-slate-800 dark:text-white bg-transparent"
              />
            </div>
            <div className="text-center p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
              <p className="text-xs text-slate-500 mb-1">Pasajeros</p>
              <p className="text-xl font-bold text-blue-600">{passengerSeats.length}</p>
            </div>
          </div>
        </div>

        {/* Destinations Management */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
              📍 Destinos y Precios
            </h2>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-3 py-1.5 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              {showAddForm ? "Cancelar" : "+ Agregar"}
            </button>
          </div>

          {/* Add New Destination Form */}
          {showAddForm && (
            <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border-2 border-green-200 dark:border-green-800">
              <h4 className="font-medium text-green-700 dark:text-green-300 mb-3">Agregar nuevo destino</h4>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newDestName}
                  onChange={(e) => setNewDestName(e.target.value)}
                  placeholder="Nombre del destino"
                  className="flex-1 px-3 py-2 border border-green-300 dark:border-green-700 rounded-lg 
                             bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                />
                <div className="flex items-center gap-1">
                  <span className="text-green-600 font-bold">$</span>
                  <input
                    type="number"
                    value={newDestPrice}
                    onChange={(e) => setNewDestPrice(e.target.value)}
                    placeholder="Precio"
                    className="w-24 px-3 py-2 border border-green-300 dark:border-green-700 rounded-lg 
                               bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                  />
                </div>
                <button
                  onClick={handleAddDestination}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium"
                >
                  Guardar
                </button>
              </div>
            </div>
          )}

          {/* Destinations List */}
          <div className="space-y-3">
            {destinations.map((dest, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl border-2 ${
                  editingIndex === index
                    ? "border-amber-400 bg-amber-50 dark:bg-amber-900/20"
                    : "border-slate-200 dark:border-slate-700 hover:border-amber-300"
                }`}
              >
                {editingIndex === index ? (
                  // Edit Mode
                  <div className="flex gap-3 items-center">
                    <input
                      type="text"
                      value={newDestName}
                      onChange={(e) => setNewDestName(e.target.value)}
                      className="flex-1 px-3 py-2 border border-amber-300 rounded-lg 
                                 bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                    />
                    <div className="flex items-center gap-1">
                      <span className="text-amber-600 font-bold">$</span>
                      <input
                        type="number"
                        value={newDestPrice}
                        onChange={(e) => setNewDestPrice(e.target.value)}
                        className="w-24 px-3 py-2 border border-amber-300 rounded-lg 
                                   bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                      />
                    </div>
                    <button
                      onClick={handleSaveEdit}
                      className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 font-medium"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={() => { setEditingIndex(null); setNewDestName(""); setNewDestPrice(""); }}
                      className="px-4 py-2 text-slate-500 hover:text-slate-700"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  // View Mode
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/50 rounded-xl flex items-center justify-center">
                        <span className="text-2xl">📍</span>
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 dark:text-white text-lg">
                          {dest.name}
                        </p>
                        <p className="text-2xl font-bold text-amber-600">
                          ${dest.price.toLocaleString("es-AR")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditDestination(index)}
                        className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg"
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteDestination(index)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg"
                        title="Eliminar"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {destinations.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              <p>No hay destinos configurados</p>
              <p className="text-sm">Agregá al menos un destino</p>
            </div>
          )}
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
              <p className="text-2xl font-bold">${totalCollected.toLocaleString("es-AR")}</p>
            </div>
            <div className="bg-white/20 rounded-xl p-4 text-center">
              <p className="text-green-100 text-xs">⏳ Pendiente</p>
              <p className="text-2xl font-bold">${totalPending.toLocaleString("es-AR")}</p>
            </div>
          </div>
        </div>

        {/* Earnings by Destination */}
        {passengerSeats.length > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
            <h3 className="font-bold text-slate-800 dark:text-white mb-4">
              📈 Ganancias por Destino
            </h3>
            
            <div className="space-y-3">
              {destinations.map((dest, index) => {
                const earning = earningsByDest[dest.name];
                if (!earning || earning.count === 0) return null;
                
                return (
                  <div key={index} className="p-4 bg-slate-50 dark:bg-slate-700 rounded-xl">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-bold text-slate-800 dark:text-white">
                          📍 {dest.name}
                        </p>
                        <p className="text-sm text-slate-500">
                          {earning.count} pasajero{earning.count !== 1 ? "s" : ""} × ${dest.price}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-green-600">
                          ${earning.total.toLocaleString("es-AR")}
                        </p>
                        <p className="text-xs text-green-500">
                          ${earning.paid} cobrado · ${earning.pending} pendiente
                        </p>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 transition-all duration-500"
                        style={{ width: `${earning.total > 0 ? (earning.paid / earning.total) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

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
