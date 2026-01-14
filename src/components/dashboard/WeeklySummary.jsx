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
            <div className="bg-white rounded-xl shadow-sm p-4">
                <p className="text-sm text-gray-500 mb-3">
                    Last 7 days
                </p>

                {/* Day indicators */}
                <div className="flex justify-between mb-4">
                    {last7Days.map((date) => {
                        const didGym = workoutDates.includes(date);

                        return (
                            <button
                                key={date}
                                onClick={() => setSelectedDate(date)}
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium
                  ${didGym
                                        ? "bg-green-500 text-white"
                                        : "bg-gray-200 text-gray-600"
                                    }
                `}
                            >
                                {new Date(date).getDate()}
                            </button>
                        );
                    })}
                </div>

                {/* Summary */}
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                        Gym days
                    </span>
                    <span className="font-semibold">
                        {gymDays} / 7
                    </span>
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
