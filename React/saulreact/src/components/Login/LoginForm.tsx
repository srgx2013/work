import { useState } from "react";
import type { Trip } from "../../types/seat";

type LoginMode = "passenger" | "driver" | "owner";

interface LoginFormProps {
  onLogin: (name: string, phone: string, tripId: string) => void;
  onDriverLogin: (tripId: string) => void;
  onOwnerLogin: (code: string) => void;
  trips: Trip[];
}

// WARNING: Using fallback for development. Set VITE_OWNER_CODE in production!
const OWNER_CODE = import.meta.env.VITE_OWNER_CODE || "PROPIETARIO2024";

export const LoginForm = ({
  onLogin,
  onDriverLogin,
  onOwnerLogin,
  trips,
}: LoginFormProps) => {
  const [mode, setMode] = useState<LoginMode>("passenger");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [selectedTripId, setSelectedTripId] = useState("");
  const [selectedPassengerTripId, setSelectedPassengerTripId] = useState("");
  const [error, setError] = useState("");

  const activeTrips = trips.filter((t) => t.isActive);

  const handlePassengerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!selectedPassengerTripId) {
      setError("Seleccioná el viaje");
      return;
    }

    if (!name.trim()) {
      setError("Ingresá tu nombre");
      return;
    }

    if (!phone.trim()) {
      setError("Ingresá tu teléfono");
      return;
    }

    if (phone.length < 10) {
      setError("El teléfono debe tener al menos 10 dígitos");
      return;
    }

    onLogin(name, phone, selectedPassengerTripId);
  };

  const handleDriverSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!selectedTripId) {
      setError("Seleccioná tu viaje");
      return;
    }

    if (!code.trim()) {
      setError("Ingresá tu código de acceso");
      return;
    }

    const trip = trips.find((t) => t.id === selectedTripId);
    if (!trip || trip.driverCode !== code) {
      setError("Código incorrecto para este viaje");
      return;
    }

    onDriverLogin(selectedTripId);
  };

  const handleStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!OWNER_CODE) {
      setError("Código de propietario no configurado en el sistema");
      return;
    }

    if (!code.trim()) {
      setError("Ingresá el código de acceso");
      return;
    }

    if (mode === "owner" && code !== OWNER_CODE) {
      setError("Código de propietario incorrecto");
      return;
    }

    if (mode === "owner") {
      onOwnerLogin(code);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case "driver":
        return "Panel del Conductor";
      case "owner":
        return "Panel del Propietario";
      default:
        return "Reserva tu lugar";
    }
  };

  const getSubtitle = () => {
    switch (mode) {
      case "driver":
        return "Accedé a la gestión de tu viaje";
      case "owner":
        return "Accedé al control de ganancias";
      default:
        return "Ingresá tus datos para continuar";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🚌</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">{getTitle()}</h1>
          <p className="text-slate-500 mt-2">{getSubtitle()}</p>
        </div>

        <div className="flex rounded-lg bg-slate-100 p-1 mb-6">
          <button
            type="button"
            onClick={() => {
              setMode("passenger");
              setError("");
            }}
            className={`flex-1 py-2 px-2 rounded-md text-xs font-medium transition-colors ${
              mode === "passenger"
                ? "bg-white text-blue-600 shadow"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            🚶 Pasajero
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("driver");
              setError("");
              setSelectedTripId(activeTrips[0]?.id || "");
            }}
            className={`flex-1 py-2 px-2 rounded-md text-xs font-medium transition-colors ${
              mode === "driver"
                ? "bg-white text-blue-600 shadow"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            🚗 Conductor
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("owner");
              setError("");
            }}
            className={`flex-1 py-2 px-2 rounded-md text-xs font-medium transition-colors ${
              mode === "owner"
                ? "bg-white text-amber-600 shadow"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            👤 Propietario
          </button>
        </div>

        {mode === "passenger" && (
          <form onSubmit={handlePassengerSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                🚍 Seleccioná tu viaje
              </label>
              <div className="space-y-2">
                {activeTrips.length === 0 ? (
                  <p className="text-center text-slate-400 py-4">
                    No hay viajes disponibles
                  </p>
                ) : (
                  activeTrips.map((trip) => {
                    // Status badge
                    const statusConfig = {
                      cancelled: { bg: "bg-red-50", border: "border-red-200", text: "text-red-600", icon: "🚫", label: "Cancelado" },
                      delayed: { bg: "bg-yellow-100", border: "border-yellow-300", text: "text-yellow-600", icon: "⏰", label: "Retrasado" },
                      active: { bg: "bg-green-100", border: "border-green-300", text: "text-green-600", icon: "✅", label: "Activo" },
                    };
                    const status = trip.status || 'active';
                    const statusStyle = statusConfig[status];
                    const isCancelled = status === 'cancelled';
                    
                    return (
                    <label
                      key={trip.id}
                      className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all ${
                        selectedPassengerTripId === trip.id
                          ? isCancelled 
                            ? "bg-red-100 border-2 border-red-400 shadow-md opacity-80"
                            : "bg-blue-100 border-2 border-blue-500 shadow-md"
                          : isCancelled
                            ? "bg-red-50 border-2 border-red-200 opacity-60 cursor-not-allowed"
                            : "bg-slate-50 border-2 border-transparent hover:bg-slate-100"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="passengerTrip"
                          checked={selectedPassengerTripId === trip.id}
                          onChange={() => !isCancelled && setSelectedPassengerTripId(trip.id)}
                          disabled={isCancelled}
                          className={`w-5 h-5 ${isCancelled ? 'opacity-50 cursor-not-allowed' : 'text-blue-600'}`}
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-slate-800">{trip.name}</p>
                            {/* Status badge */}
                            {status !== 'active' && (
                              <span className={`text-xs px-2 py-0.5 rounded-full ${statusStyle.bg} ${statusStyle.text} font-medium`}>
                                {statusStyle.icon} {statusStyle.label}
                              </span>
                            )}
                            {status === 'active' && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-600 font-medium">
                                ✅ Activo
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-slate-500">
                            {trip.route.origin} → {trip.route.destinations.map((d) => d.name).join(", ")}
                          </p>
                          {status === 'delayed' && trip.delayNewTime && (
                            <p className="text-xs text-yellow-600 font-medium mt-0.5">
                              Nueva hora: {trip.delayNewTime}
                            </p>
                          )}
                          {status === 'cancelled' && (
                            <p className="text-xs text-red-600 font-medium mt-0.5">
                              {trip.statusReason || 'Cancelado por causas de fuerza mayor'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-blue-600">{trip.route.departureTime}</p>
                        <p className="text-xs text-slate-400">
                          {(() => {
                            const [year, month, day] = trip.route.date.split('-').map(Number);
                            const date = new Date(year, month - 1, day);
                            return date.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
                          })()}
                        </p>
                      </div>
                    </label>
                  )})
                )}
              </div>
            </div>

            {selectedPassengerTripId && (
              <>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                    Nombre completo
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej: Juan Pérez"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg 
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                               text-slate-800"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
                    Teléfono
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ej: 55 1234 5678"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg 
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                               text-slate-800"
                  />
                </div>
              </>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!selectedPassengerTripId}
              className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg
                         hover:bg-blue-600 transition-colors duration-200
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Entrar al viaje
            </button>
          </form>
        )}

        {mode === "driver" && (
          <form onSubmit={handleDriverSubmit} className="space-y-4">
            <div>
              <label htmlFor="trip" className="block text-sm font-medium text-slate-700 mb-1">
                Seleccioná tu viaje
              </label>
              <select
                id="trip"
                value={selectedTripId}
                onChange={(e) => setSelectedTripId(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           text-slate-800 bg-white"
              >
                <option value="">Elegí un viaje...</option>
                {activeTrips.map((trip) => {
                  const statusIcon = trip.status === 'cancelled' ? '🚫 ' : 
                                   trip.status === 'delayed' ? '⏰ ' : '✅ ';
                  return (
                    <option key={trip.id} value={trip.id}>
                      {statusIcon}{trip.name} ({trip.route.departureTime})
                      {trip.status === 'cancelled' && ' - CANCELADO'}
                      {trip.status === 'delayed' && ` - RETRASADO (${trip.delayNewTime})`}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label htmlFor="code" className="block text-sm font-medium text-slate-700 mb-1">
                Tu código de acceso
              </label>
              <input
                id="code"
                type="password"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Ingresá tu código"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           text-slate-800"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-slate-800 text-white font-semibold rounded-lg
                         hover:bg-slate-700 transition-colors duration-200
                         focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
            >
              Acceder como Conductor
            </button>

            <p className="text-xs text-slate-400 text-center">
              Consultá tu código con el propietario
            </p>
          </form>
        )}

        {mode === "owner" && (
          <form onSubmit={handleStaffSubmit} className="space-y-4">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-slate-700 mb-1">
                Código de propietario
              </label>
              <input
                id="code"
                type="password"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Ingresá tu código"
                className="w-full px-4 py-3 border border-amber-300 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent
                           text-slate-800"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-lg
                         hover:from-amber-600 hover:to-amber-700 transition-colors duration-200
                         focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            >
              Acceder como Propietario
            </button>

            <p className="text-xs text-slate-400 text-center">Consultá tu código con el administrador</p>
          </form>
        )}
      </div>
    </div>
  );
};
