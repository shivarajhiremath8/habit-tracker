export default function DayCell({ day, isSelected, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`aspect-square rounded-xl flex items-center justify-center text-sm font-medium
        ${isSelected
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-800"
                }
      `}
        >
            {day.day}
        </button>
    );
}
