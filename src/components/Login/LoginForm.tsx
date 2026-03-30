import { useState } from "react";
import type { Destination } from "../../types/seat";

type LoginMode = "passenger" | "driver" | "owner";

interface LoginFormProps {
  onLogin: (name: string, phone: string, destination: string) => void;
  onDriverLogin: (code: string) => void;
  onOwnerLogin: (code: string) => void;
  destinations?: Destination[]; // Optional, defaults to common destinations
}

const DEFAULT_DESTINATIONS: Destination[] = [
  { name: "León", price: 400 },
  { name: "Puebla", price: 450 },
  { name: "Querétaro", price: 500 },
];

export const LoginForm = ({ onLogin, onDriverLogin, onOwnerLogin, destinations = DEFAULT_DESTINATIONS }: LoginFormProps) => {
  const [mode, setMode] = useState<LoginMode>("passenger");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [destination, setDestination] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const DRIVER_CODE = "CONDUCTOR2024";
  const OWNER_CODE = "PROPIETARIO2024";

  const handlePassengerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

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

    if (!destination.trim()) {
      setError("Ingresá tu destino");
      return;
    }

    onLogin(name, phone, destination);
  };

  const handleStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!code.trim()) {
      setError("Ingresá el código de acceso");
      return;
    }

    if (mode === "driver" && code !== DRIVER_CODE) {
      setError("Código de conductor incorrecto");
      return;
    }

    if (mode === "owner" && code !== OWNER_CODE) {
      setError("Código de propietario incorrecto");
      return;
    }

    if (mode === "driver") {
      onDriverLogin(code);
    } else {
      onOwnerLogin(code);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case "driver": return "Panel del Conductor";
      case "owner": return "Panel del Propietario";
      default: return "Reserva tu lugar";
    }
  };

  const getSubtitle = () => {
    switch (mode) {
      case "driver": return "Accedé a la gestión del viaje";
      case "owner": return "Accedé al control de ganancias";
      default: return "Ingresá tus datos para continuar";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🚌</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">
            {getTitle()}
          </h1>
          <p className="text-slate-500 mt-2">
            {getSubtitle()}
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex rounded-lg bg-slate-100 p-1 mb-6">
          <button
            type="button"
            onClick={() => { setMode("passenger"); setError(""); }}
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
            onClick={() => { setMode("driver"); setError(""); }}
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
            onClick={() => { setMode("owner"); setError(""); }}
            className={`flex-1 py-2 px-2 rounded-md text-xs font-medium transition-colors ${
              mode === "owner"
                ? "bg-white text-amber-600 shadow"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            👤 Propietario
          </button>
        </div>

        {/* Passenger Form */}
        {mode === "passenger" && (
          <form onSubmit={handlePassengerSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
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
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
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

            <div>
              <label
                htmlFor="destination"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Destino
              </label>
              <select
                id="destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           text-slate-800 bg-white"
              >
                <option value="">Seleccioná tu destino</option>
                {destinations.map((dest, index) => (
                  <option key={index} value={dest.name}>
                    📍 {dest.name} - ${dest.price.toLocaleString("es-AR")}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg
                         hover:bg-blue-600 transition-colors duration-200
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Entrar
            </button>
          </form>
        )}

        {/* Driver Form */}
        {mode === "driver" && (
          <form onSubmit={handleStaffSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="code"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Código de conductor
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
              Código: CONDUCTOR2024
            </p>
          </form>
        )}

        {/* Owner Form */}
        {mode === "owner" && (
          <form onSubmit={handleStaffSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="code"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
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

            <p className="text-xs text-slate-400 text-center">
              Código: PROPIETARIO2024
            </p>
          </form>
        )}
      </div>
    </div>
  );
};
