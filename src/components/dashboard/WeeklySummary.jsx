import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getWorkoutsLastNDays } from "../../services/dashboardService";

export default function WeeklySummary() {
    const { user } = useAuth();
    const [workoutDates, setWorkoutDates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        async function loadData() {
            try {
                const data = await getWorkoutsLastNDays(user.id, 7);
                setWorkoutDates(data.map((d) => d.workout_date));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [user]);

    if (loading) {
        return (
            <div className="bg-white rounded-xl p-4 text-sm text-gray-500">
                Loading weekly summary...
            </div>
        );
    }

    const today = new Date();
    const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        return d.toISOString().split("T")[0];
    }).reverse();

    const gymDays = last7Days.filter((date) =>
        workoutDates.includes(date)
    ).length;

    return (
        <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-sm text-gray-500 mb-3">
                Last 7 days
            </p>

            <div className="flex justify-between mb-4">
                {last7Days.map((date) => {
                    const didGym = workoutDates.includes(date);
                    return (
                        <div
                            key={date}
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs
                ${didGym
                                    ? "bg-green-500 text-white"
                                    : "bg-gray-200 text-gray-500"
                                }
              `}
                        >
                            {new Date(date).getDate()}
                        </div>
                    );
                })}
            </div>

            <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                    Gym days
                </span>
                <span className="font-semibold">
                    {gymDays} / 7
                </span>
            </div>
        </div>
    );
}
