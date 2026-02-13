import MonthCalendar from "../components/calendar/MonthCalendar";
import ThemeToggle from "../components/ui/ThemeToggle";

export default function Calendar() {
    return (
        <div className="max-w-md mx-auto px-4 pt-6 pb-24 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold text-black dark:text-white">Calendar</h1>
                <ThemeToggle />
            </div>
            <MonthCalendar />
        </div>
    );
}
