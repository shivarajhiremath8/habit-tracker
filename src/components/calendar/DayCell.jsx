export default function DayCell({ day, isSelected, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`aspect-square rounded-xl flex items-center justify-center text-sm font-medium
        ${isSelected
                    ? "bg-primary text-primary-content shadow-sm"
                    : "bg-surface text-text-main hover:bg-border border border-transparent hover:border-border"
                }
      `}
        >
            {day.day}
        </button>
    );
}
