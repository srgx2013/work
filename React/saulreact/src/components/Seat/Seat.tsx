import type { Seat as SeatType } from "../../types/seat";

interface SeatProps {
  seat: SeatType;
  onClick: () => void;
  isSelected: boolean;
}

export const Seat = ({ seat, onClick, isSelected }: SeatProps) => {
  const getSeatStyle = () => {
    if (seat.isOccupied) {
      return "bg-red-500 cursor-pointer hover:bg-red-600";
    }
    if (isSelected) {
      return "bg-blue-500 cursor-pointer hover:bg-blue-600";
    }
    return "bg-green-500 cursor-pointer hover:bg-green-600";
  };

  return (
    <button
      onClick={onClick}
      className={`
        w-10 h-10 rounded-md font-semibold text-white text-sm
        transition-all duration-200
        ${getSeatStyle()}
        ${seat.isOccupied || isSelected ? "ring-2 ring-offset-2 ring-white/50" : ""}
      `}
      title={
        seat.isOccupied
          ? `Ocupado por: ${seat.passengerName}`
          : isSelected
          ? "Seleccionado - Click para cancelar"
          : "Disponible - Click para reservar"
      }
    >
      {seat.id}
    </button>
  );
};
