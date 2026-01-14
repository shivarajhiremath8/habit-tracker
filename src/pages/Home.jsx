import { useState } from "react";
import CalendarGrid from "../components/calendar/CalendarGrid";

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

            {selectedDate && (
                <p className="text-center mt-4 text-sm text-gray-600">
                    Selected: {selectedDate}
                </p>
            )}
        </div>
    );
}
