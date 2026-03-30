import { useState } from "react";
import { useBusSeats } from "./hooks/useBusSeats";
import { useAuth } from "./hooks/useAuth";
import { Bus, LoginForm, DriverPanel, OwnerPanel } from "./components";

type UserRole = "passenger" | "driver" | "owner" | null;

function App() {
  const [userRole, setUserRole] = useState<UserRole>(() => {
    const stored = localStorage.getItem("bus-user-role");
    return stored as UserRole;
  });

  const [passengerTripId, setPassengerTripId] = useState<string | null>(() => {
    return localStorage.getItem("bus-passenger-trip");
  });

  const { currentUser, login, logout } = useAuth();
  const {
    trips,
    activeTrip,
    activeTripId,
    setActiveTrip,
    reserveSeat,
    cancelReservation,
    updateTrip,
    addTrip,
    deleteTrip,
    completeTrip,
    tripSummaries,
    removePassenger,
    togglePaid,
    isLoading,
    isFirestoreConnected,
  } = useBusSeats();

  // Show loading while Firestore initializes
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-200 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-600 dark:text-slate-300">Cargando datos...</p>
          {isFirestoreConnected && (
            <p className="text-sm text-green-500">Conectado a la nube</p>
          )}
        </div>
      </div>
    );
  }

  const handleLogin = (name: string, phone: string, tripId: string) => {
    login(name, phone, "");
    setPassengerTripId(tripId);
    setUserRole("passenger");
    localStorage.setItem("bus-user-role", "passenger");
    localStorage.setItem("bus-passenger-trip", tripId);
  };

  const handleDriverLogin = (tripId: string) => {
    setActiveTrip(tripId);
    setUserRole("driver");
    localStorage.setItem("bus-user-role", "driver");
    localStorage.setItem("bus-active-trip", tripId);
  };

  const handleOwnerLogin = (_code: string) => {
    setUserRole("owner");
    localStorage.setItem("bus-user-role", "owner");
  };

  const handleLogout = () => {
    logout();
    setUserRole(null);
    localStorage.removeItem("bus-user-role");
  };

  // Show login if not authenticated or no role selected
  if (userRole === null) {
    return (
      <LoginForm
        trips={trips}
        onLogin={handleLogin}
        onDriverLogin={handleDriverLogin}
        onOwnerLogin={handleOwnerLogin}
      />
    );
  }

  // Owner Panel
  if (userRole === "owner") {
    return (
      <OwnerPanel
        trips={trips}
        activeTripId={activeTripId}
        tripSummaries={tripSummaries}
        onUpdateTrip={updateTrip}
        onAddTrip={addTrip}
        onDeleteTrip={deleteTrip}
        onSetActiveTrip={setActiveTrip}
        onLogout={handleLogout}
      />
    );
  }

  // Driver Panel
  if (userRole === "driver") {
    const driverTrip = activeTripId ? trips.find((t) => t.id === activeTripId) : activeTrip;
    if (!driverTrip) {
      handleLogout();
      return null;
    }
    const occupiedCountDriver = driverTrip.seats.filter((s) => s.isOccupied).length;
    const availableSeatsDriver = driverTrip.seats.length - occupiedCountDriver;
    return (
      <DriverPanel
        route={driverTrip.route}
        seats={driverTrip.seats}
        occupiedCount={occupiedCountDriver}
        availableSeats={availableSeatsDriver}
        totalSeats={driverTrip.seats.length}
        removalLogs={driverTrip.removalLogs}
        onUpdateRoute={(r) => updateTrip(driverTrip.id, { route: { ...driverTrip.route, ...r } })}
        onResetBus={() => {
          // Save summary and reset trip
          completeTrip();
        }}
        onTogglePaid={(seatId) => {
          // Use togglePaid from hook - it handles functional update internally
          togglePaid(seatId);
        }}
        onRemovePassenger={(seatId, reason) => {
          removePassenger(seatId, reason);
        }}
        onLogout={handleLogout}
      />
    );
  }

  // Passenger Panel
  const passengerTrip = passengerTripId 
    ? trips.find((t) => t.id === passengerTripId) 
    : activeTrip;
  
  const passengerSeats = passengerTrip?.seats.filter((s) => s.isOccupied && s.id !== "1A") || [];
  const userReservation = passengerSeats.find(
    (s) => s.passengerPhone === currentUser?.phone
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

        {/* Trip Info Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-4 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">🚌</span>
              </div>
              <div>
                <p className="text-xs text-blue-200">Viaje actual</p>
                <p className="text-lg font-bold">{passengerTrip?.name || "Viaje"}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-blue-200">Hora de salida</p>
              <p className="text-2xl font-bold">{passengerTrip?.route.departureTime}</p>
            </div>
          </div>
        </div>

        {/* User's Reservation Alert */}
        {userReservation ? (
          <div className="bg-green-100 border border-green-300 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl font-bold">{userReservation.id}</span>
              </div>
              <div>
                <p className="font-semibold text-green-800">
                  Ya tienes tu lugar reservado ✓
                </p>
                <p className="text-sm text-green-600">
                  Destino: {userReservation.passengerDestination} - ${userReservation.passengerPrice}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-blue-100 border border-blue-300 rounded-xl p-4">
            <p className="text-blue-800 font-medium">
              ¡Aún no tienes asiento reservado!
            </p>
          </div>
        )}

        {/* Route Info Card */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xl">📍</span>
                <div>
                  <p className="text-xs text-slate-500">Desde</p>
                  <p className="font-semibold text-slate-800 dark:text-white">
                    {passengerTrip?.route.origin}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xl">📍</span>
                <div>
                  <p className="text-xs text-slate-500">Destinos</p>
                  <p className="font-semibold text-slate-800 dark:text-white">
                    {(passengerTrip?.route.destinations || []).map((d) => `${d.name} ($${d.price})`).join(", ") || "Sin destinos"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xl">📅</span>
                <div>
                  <p className="text-xs text-slate-500">Fecha</p>
                  <p className="font-semibold text-slate-800 dark:text-white">
                    {passengerTrip ? (() => {
                      const [year, month, day] = passengerTrip.route.date.split('-').map(Number);
                      const date = new Date(year, month - 1, day);
                      return date.toLocaleDateString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
                    })() : ""}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-md text-center">
            <p className="text-3xl font-bold text-green-500">
              {passengerTrip ? (passengerTrip.seats.length - passengerSeats.length - 1) : 0}
            </p>
            <p className="text-xs text-slate-500">Disponibles</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-md text-center">
            <p className="text-3xl font-bold text-red-500">{passengerSeats.length}</p>
            <p className="text-xs text-slate-500">Ocupados</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-md text-center">
            <p className="text-3xl font-bold text-slate-600 dark:text-slate-300">
              {passengerTrip?.seats.length || 0}
            </p>
            <p className="text-xs text-slate-500">Total</p>
          </div>
        </div>

        {/* Bus Component */}
        <Bus
          seats={passengerTrip?.seats || []}
          destinations={passengerTrip?.route.destinations || []}
          onReserve={reserveSeat}
          onCancel={cancelReservation}
          currentUserName={currentUser?.name}
          currentUserPhone={currentUser?.phone}
        />
      </div>
    </div>
  );
}

export default App;
