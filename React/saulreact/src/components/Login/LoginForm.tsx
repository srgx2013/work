import { useState } from "react";

interface LoginFormProps {
  onLogin: (name: string, phone: string, destination: string) => void;
  onDriverLogin: (code: string) => void;
}

export const LoginForm = ({ onLogin, onDriverLogin }: LoginFormProps) => {
  const [isDriverMode, setIsDriverMode] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [destination, setDestination] = useState("");
  const [driverCode, setDriverCode] = useState("");
  const [error, setError] = useState("");

  const DRIVER_CODE = "CONDUCTOR2024"; // Simple code for demo

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

  const handleDriverSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!driverCode.trim()) {
      setError("Ingresá el código de conductor");
      return;
    }

    if (driverCode !== DRIVER_CODE) {
      setError("Código incorrecto");
      return;
    }

    onDriverLogin(driverCode);
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
            {isDriverMode ? "Panel del Conductor" : "Reserva tu lugar"}
          </h1>
          <p className="text-slate-500 mt-2">
            {isDriverMode ? "Accedé a la gestión del viaje" : "Ingresá tus datos para continuar"}
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex rounded-lg bg-slate-100 p-1 mb-6">
          <button
            type="button"
            onClick={() => {
              setIsDriverMode(false);
              setError("");
            }}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              !isDriverMode
                ? "bg-white text-blue-600 shadow"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            🚶 Pasajero
          </button>
          <button
            type="button"
            onClick={() => {
              setIsDriverMode(true);
              setError("");
            }}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              isDriverMode
                ? "bg-white text-blue-600 shadow"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            🚗 Conductor
          </button>
        </div>

        {/* Passenger Form */}
        {!isDriverMode && (
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
              <input
                id="destination"
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Ej: Centro, Norte, Zona Rosa..."
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
              className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg
                         hover:bg-blue-600 transition-colors duration-200
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Entrar
            </button>
          </form>
        )}

        {/* Driver Form */}
        {isDriverMode && (
          <form onSubmit={handleDriverSubmit} className="space-y-4">
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
                value={driverCode}
                onChange={(e) => setDriverCode(e.target.value)}
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
              ¿No tenés código? Pedí uno al administrador
            </p>
          </form>
        )}
      </div>
    </div>
  );
};
