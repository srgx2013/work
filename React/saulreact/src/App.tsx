import { useState } from "react";
import { useBusSeats } from "./hooks/useBusSeats";
import { useAuth } from "./hooks/useAuth";
import { Bus, LoginForm, DriverPanel } from "./components";

type UserRole = "passenger" | "driver" | null;

function App() {
  const [userRole, setUserRole] = useState<UserRole>(() => {
    const stored = localStorage.getItem("bus-user-role");
    return stored as UserRole;
  });

  const { currentUser, login, logout } = useAuth();
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

  const handleLogin = (name: string, phone: string, destination: string) => {
    login(name, phone, destination);
    setUserRole("passenger");
    localStorage.setItem("bus-user-role", "passenger");
  };

  const handleDriverLogin = (_code: string) => {
    setUserRole("driver");
    localStorage.setItem("bus-user-role", "driver");
  };

  const handleLogout = () => {
    logout();
    setUserRole(null);
    localStorage.removeItem("bus-user-role");
  };

  // Show login if not authenticated or no role selected
  if (userRole === null) {
    return <LoginForm onLogin={handleLogin} onDriverLogin={handleDriverLogin} />;
  }

  // Driver Panel
  if (userRole === "driver") {
    return (
      <DriverPanel
        route={route}
        seats={seats}
        occupiedCount={occupiedCount}
        availableSeats={availableSeats}
        totalSeats={totalSeats}
        onUpdateRoute={updateRoute}
        onResetBus={resetBus}
        onLogout={handleLogout}
      />
    );
  }

  // Passenger Panel
  const passengerSeats = seats.filter((s) => s.isOccupied && s.id !== "1A");
  const userReservation = passengerSeats.find(
    (s) => s.passengerName.toLowerCase() === currentUser?.name.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-slate-200 dark:bg-slate-950 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
              🎫 Reserva tu lugar
            </h1>
            <p className="text-sm text-slate-500">
              Bienvenido, {currentUser?.name}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm text-red-500 border border-red-500 rounded-md
                       hover:bg-red-50 dark:hover:bg-red-900/30"
          >
            Salir
          </button>
        </header>

        {/* User's Reservation Alert */}
        {userReservation ? (
          <div className="bg-green-100 border border-green-300 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl font-bold">{userReservation.id}</span>
              </div>
              <div>
                <p className="font-semibold text-green-800">
                  Ya tienes tu lugar reservado
                </p>
                <p className="text-sm text-green-600">
                  Destino: {userReservation.passengerDestination}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-blue-100 border border-blue-300 rounded-xl p-4">
            <p className="text-blue-800 font-medium">
              ¡Aún no tienes asiento reservado!
            </p>
            <p className="text-sm text-blue-600">
              Tu destino: {currentUser?.destination}
            </p>
          </div>
        )}

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
                  <span className="text-xl">📍</span>
                  <div>
                    <p className="text-xs text-slate-500">Desde</p>
                    <p className="font-semibold text-slate-800 dark:text-white">
                      {route.origin}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xl">📍</span>
                  <div>
                    <p className="text-xs text-slate-500">Hasta</p>
                    <p className="font-semibold text-slate-800 dark:text-white">
                      {route.destination}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xl">📅</span>
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
            <p className="text-3xl font-bold text-green-500">{availableSeats - 1}</p>
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
          currentUserName={currentUser?.name}
          currentUserPhone={currentUser?.phone}
          currentUserDestination={currentUser?.destination}
          userHasReservation={!!userReservation}
        />
      </div>
    </div>
  );
}

export default App;
