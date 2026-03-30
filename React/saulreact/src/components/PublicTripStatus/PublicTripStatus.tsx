import { useParams } from "react-router-dom";
import { useBusSeats } from "../../hooks/useBusSeats";

interface Props {
  tripId?: string;
}

// Format date for display
const formatDate = (dateStr: string): string => {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("es-ES", { 
    weekday: "long", 
    year: "numeric", 
    month: "long", 
    day: "numeric" 
  });
};

// Format relative time (hace X minutos)
const formatRelativeTime = (dateStr?: string): string => {
  if (!dateStr) return "Sin información";
  
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffMinutes < 1) return "Hace un momento";
  if (diffMinutes < 60) return `Hace ${diffMinutes} minuto${diffMinutes > 1 ? 's' : ''}`;
  if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
  if (diffDays < 7) return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
  
  return date.toLocaleDateString("es-ES", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
};

export const PublicTripStatus = ({ tripId: propTripId }: Props) => {
  const urlTripId = useParams<{ tripId: string }>().tripId;
  const tripId = propTripId || urlTripId;
  
  const { trips, isLoading } = useBusSeats();
  const trip = trips.find(t => t.id === tripId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando...</p>
        </div>
      </div>
    );
  }
  
  if (!trip) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg overflow-hidden p-8 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Viaje no encontrado</h2>
          <p className="text-gray-600">
            El ID del viaje no existe o ha sido eliminado.
          </p>
          <p className="text-sm text-gray-400 mt-4">
            ID: {tripId}
          </p>
        </div>
      </div>
    );
  }

  const isCancelled = trip.status === 'cancelled';
  const isDelayed = trip.status === 'delayed';
  const isActive = !trip.status || trip.status === 'active';

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header with trip info */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
          <h1 className="text-2xl font-bold">{trip.name}</h1>
          <p className="opacity-90 mt-1">
            {trip.route.origin} → {trip.route.destinations.map(d => d.name).join(', ')}
          </p>
          <p className="opacity-80 mt-2">
            📅 {formatDate(trip.route.date)} · 🕐 {trip.route.departureTime}
          </p>
        </div>

        {/* Status display */}
        <div className="p-6 text-center">
          {isCancelled && (
            <>
              <div className="text-6xl mb-4">❌</div>
              <h2 className="text-3xl font-bold text-red-600 mb-2">VIAJE CANCELADO</h2>
              <p className="text-gray-600">
                {trip.statusReason || 'Por causas de fuerza mayor'}
              </p>
            </>
          )}
          
          {isDelayed && (
            <>
              <div className="text-6xl mb-4">⏰</div>
              <h2 className="text-3xl font-bold text-yellow-600 mb-2">VIAJE RETRASADO</h2>
              <p className="text-2xl font-semibold text-gray-800">
                Nueva hora: {trip.delayNewTime}
              </p>
              {trip.statusReason && (
                <p className="text-gray-600 mt-2">{trip.statusReason}</p>
              )}
            </>
          )}
          
          {isActive && (
            <>
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-3xl font-bold text-green-600 mb-2">VIAJE ACTIVO</h2>
              <p className="text-gray-600">
                El viaje saldrá según lo previsto
              </p>
            </>
          )}
        </div>

        {/* Footer with last update */}
        <div className="bg-gray-50 p-4 text-center text-sm text-gray-500">
          Última actualización: {formatRelativeTime(trip.statusUpdatedAt)}
        </div>
      </div>
      
      {/* Powered by */}
      <p className="text-center text-gray-400 text-xs mt-6">
        Sistema de Reservas
      </p>
    </div>
  );
};
