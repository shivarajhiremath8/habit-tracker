import { useState } from "react";
import CalendarGrid from "../components/calendar/CalendarGrid";
import DayDetail from "../components/calendar/DayDetail";
import BottomSheet from "../components/ui/BottomSheet";

export default function Home() {
    const [selectedDate, setSelectedDate] = useState(null);

    return (
        <div className="max-w-md mx-auto pt-6">
            <h1 className="text-xl font-semibold text-center mb-4">
                Habit & Workout Tracker
            </h1>

            <CalendarGrid
                selectedDate={selectedDate}
                onSelect={setSelectedDate}
            />

            <BottomSheet
                open={Boolean(selectedDate)}
                onClose={() => setSelectedDate(null)}
            >
                <DayDetail date={selectedDate} />
            </BottomSheet>
        </div>
    );
}
