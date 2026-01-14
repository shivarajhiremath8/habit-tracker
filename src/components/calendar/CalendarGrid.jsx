import { getMonthDays } from "../../utils/dateHelpers";
import DayCell from "./DayCell";

export default function CalendarGrid({ selectedDate, onSelect }) {
    const today = new Date();
    const days = getMonthDays(today.getFullYear(), today.getMonth());

    return (
        <div className="grid grid-cols-7 gap-2 px-2">
            {days.map((day) => (
                <DayCell
                    key={day.date}
                    day={day}
                    isSelected={day.date === selectedDate}
                    onClick={() => onSelect(day.date)}
                />
            ))}
        </div>
    );
}
