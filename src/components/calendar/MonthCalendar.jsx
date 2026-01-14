import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { supabase } from "../../lib/supabase";
import { getLocalDateString } from "../../utils/dateUtils";
import DayWorkoutModal from "../workout/DayWorkoutModal";

export default function MonthCalendar() {
    const { user } = useAuth();
    const [workoutDates, setWorkoutDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth(); // 0-based

    // Get first & last day of month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Fetch workouts for this month
    useEffect(() => {
        if (!user) return;

        async function load() {
            const from = getLocalDateString(firstDay);
            const to = getLocalDateString(lastDay);

            const { data, error } = await supabase
                .from("workouts")
                .select("workout_date")
                .eq("user_id", user.id)
                .gte("workout_date", from)
                .lte("workout_date", to);

            if (!error) {
                setWorkoutDates(data.map((d) => d.workout_date));
            }
        }

        load();
    }, [user, month, year]);

    // Build calendar days
    const days = [];
    const startOffset = firstDay.getDay(); // Sun = 0

    for (let i = 0; i < startOffset; i++) {
        days.push(null);
    }

    for (let d = 1; d <= lastDay.getDate(); d++) {
        const date = new Date(year, month, d);
        days.push(getLocalDateString(date));
    }

    return (
        <>
            {/* Weekdays */}
            <div className="grid grid-cols-7 text-center text-xs text-gray-500 mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((w) => (
                    <div key={w}>{w}</div>
                ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-2">
                {days.map((date, i) => {
                    if (!date) return <div key={i} />;

                    const didGym = workoutDates.includes(date);
                    const isToday = date === getLocalDateString();

                    return (
                        <button
                            key={date}
                            onClick={() => setSelectedDate(date)}
                            className={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm
                ${didGym
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-100 text-gray-700"
                                }
                ${isToday ? "ring-2 ring-green-500" : ""}
              `}
                        >
                            <span>{new Date(date).getDate()}</span>
                            {didGym && (
                                <span className="w-1.5 h-1.5 bg-green-600 rounded-full mt-1" />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Day detail modal */}
            {selectedDate && (
                <DayWorkoutModal
                    date={selectedDate}
                    onClose={() => setSelectedDate(null)}
                />
            )}
        </>
    );
}
