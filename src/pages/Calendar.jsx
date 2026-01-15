import MonthCalendar from "../components/calendar/MonthCalendar";

export default function Calendar({ readOnly = false, userId = null }) {
    return (
        <div className="max-w-md mx-auto px-4 pt-6 pb-24">
            <h1 className="text-xl font-semibold mb-4">
                Calendar
            </h1>

            <MonthCalendar readOnly={readOnly} userId={userId} />
        </div>
    );
}
