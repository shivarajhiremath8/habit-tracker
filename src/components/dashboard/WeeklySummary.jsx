import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getWorkoutsLastNDays } from "../../services/dashboardService";
import DayWorkoutModal from "../workout/DayWorkoutModal";
import { getLocalDateString } from "../../utils/dateUtils";

export default function WeeklySummary() {
    const { user } = useAuth();

    const [workoutDates, setWorkoutDates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(null);

    useEffect(() => {
        if (!user) return;

        async function loadWeeklyData() {
            try {
                const data = await getWorkoutsLastNDays(user.id, 7);
                setWorkoutDates(data.map((d) => d.workout_date));
            } catch (err) {
                console.error("Failed to load weekly workouts", err);
            } finally {
                setLoading(false);
            }
        }

        loadWeeklyData();
    }, [user]);

    if (loading) {
        return (
            <div className="bg-white rounded-xl p-4 text-sm text-gray-500">
                Loading weekly summary...
            </div>
        );
    }

    const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return getLocalDateString(d);
    }).reverse();

    const gymDays = last7Days.filter((date) =>
        workoutDates.includes(date)
    ).length;

    return (
        <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-900">
                        Weekly Check-ins
                    </h3>
                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                        {gymDays} / 7 Days
                    </span>
                </div>

                {/* Day indicators */}
                <div className="flex justify-between items-center bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                    {last7Days.map((date, index) => {
                        const didGym = workoutDates.includes(date);
                        const dayLabel = new Date(date).toLocaleDateString('en-US', { weekday: 'narrow' }); // M, T, W etc.

                        return (
                            <div key={date} className="flex flex-col items-center gap-1.5">
                                <span className="text-[10px] text-gray-400 font-medium">{dayLabel}</span>
                                <button
                                    onClick={() => setSelectedDate(date)}
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200
                                        ${didGym
                                            ? "bg-green-600 text-white shadow-md shadow-green-200 hover:bg-green-700 scale-105"
                                            : "bg-white border border-gray-200 text-gray-400 hover:border-gray-300 hover:bg-gray-50"
                                        }
                                    `}
                                >
                                    {didGym ? "✓" : ""}
                                    {/* Or keep date number? User specifically wanted "clean". Checkmark is cleaner for "done", date number might be useful though. 
                                       Original had date number. Let's stick to valid content. 
                                       Actually, let's put the DATE inside if not done, and CHECK if done? Or just date.
                                    */}
                                    {!didGym && new Date(date).getDate()}
                                    {didGym && (
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    )}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* View / Edit Workout Modal */}
            {selectedDate && (
                <DayWorkoutModal
                    date={selectedDate}
                    onClose={() => setSelectedDate(null)}
                />
            )}
        </>
    );
}
