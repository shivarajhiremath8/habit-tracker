import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getWorkoutsLastNDays } from "../../services/dashboardService";
import DayWorkoutModal from "../workout/DayWorkoutModal";
import { getLocalDateString } from "../../utils/dateUtils";

export default function WeeklySummary() {
    const { user } = useAuth();
    const [workoutDates, setWorkoutDates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);
    const [selectedDate, setSelectedDate] = useState(null);

    useEffect(() => {
        if (!user) return;
        async function load() {
            try {
                const data = await getWorkoutsLastNDays(user.id, 7);
                setWorkoutDates(data.filter(d => d.split?.trim()).map(d => d.workout_date));
            } catch (e) { console.error(e); } finally { setLoading(false); }
        }
        load();
    }, [user, refreshKey]);

    if (loading) return <div className="p-4 text-sm text-gray-400">Loading...</div>;

    const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return getLocalDateString(d);
    }).reverse();

    const gymDays = last7Days.filter(d => workoutDates.includes(d)).length;

    return (
        <>
            <div className="rounded-2xl p-5 bg-white shadow-sm border border-gray-100 dark:bg-white/[0.04] dark:border-white/[0.08] dark:shadow-none">
                <div className="flex items-center justify-between mb-4">
                    {/* FORCE: Dark Black */}
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                        Weekly Check-ins
                    </h3>
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                        {gymDays} / 7
                    </span>
                </div>

                <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50/80 border border-gray-100/50 dark:bg-white/[0.03] dark:border-white/[0.05]">
                    {last7Days.map((date) => {
                        const didGym = workoutDates.includes(date);
                        const isToday = date === getLocalDateString(new Date());
                        const dayLabel = new Date(date).toLocaleDateString('en-US', { weekday: 'narrow' });

                        return (
                            <div key={date} className="flex flex-col items-center gap-1.5">
                                <span className="text-[9px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                                    {dayLabel}
                                </span>
                                <button
                                    onClick={() => setSelectedDate(date)}
                                    className={`
                                        w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all
                                        ${didGym
                                            ? "bg-gradient-to-br from-emerald-500 to-green-500 text-white shadow-md shadow-emerald-500/20"
                                            : "text-gray-900 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-white/10"
                                        }
                                        ${isToday && !didGym ? "ring-1.5 ring-emerald-400 dark:ring-emerald-500" : ""}
                                    `}
                                >
                                    {didGym ? "✓" : new Date(date).getDate()}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
            {selectedDate && <DayWorkoutModal date={selectedDate} onClose={() => { setSelectedDate(null); setRefreshKey(k => k + 1); }} />}
        </>
    );
}