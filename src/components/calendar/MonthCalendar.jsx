import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { supabase } from "../../lib/supabase";
import { getLocalDateString } from "../../utils/dateUtils";
import DayWorkoutModal from "../workout/DayWorkoutModal";

export default function MonthCalendar() {
    const { user } = useAuth();

    const today = new Date();
    const todayStr = getLocalDateString(today);

    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [workoutDates, setWorkoutDates] = useState([]);
    const [injuries, setInjuries] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    // Swipe state
    const [dragOffset, setDragOffset] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const touchStartX = useRef(0);
    const SWIPE_THRESHOLD = 60;

    // Slide animation
    const [slideDir, setSlideDir] = useState(null);

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

    useEffect(() => {
        if (!user) return;

        async function load() {
            const from = getLocalDateString(firstDayOfMonth);
            const to = getLocalDateString(lastDayOfMonth);

            const { data: workouts } = await supabase
                .from("workouts")
                .select("workout_date, split")
                .eq("user_id", user.id)
                .gte("workout_date", from)
                .lte("workout_date", to);

            if (workouts) {
                const validDates = workouts
                    .filter(d => d.split && d.split.trim() !== "")
                    .map(d => d.workout_date);
                setWorkoutDates(validDates);
            }

            const { data: inj } = await supabase
                .from("injuries")
                .select("*")
                .eq("user_id", user.id)
                .lte("start_date", to)
                .or(`end_date.gte.${from},end_date.is.null`);

            if (inj) setInjuries(inj);
        }

        load();
    }, [user, currentMonth, currentYear, refreshKey]);

    const changeMonth = (direction) => {
        setSlideDir(direction > 0 ? "left" : "right");
        setTimeout(() => {
            setSlideDir(null);
            if (direction > 0) {
                if (currentMonth === 11) {
                    setCurrentMonth(0);
                    setCurrentYear(y => y + 1);
                } else {
                    setCurrentMonth(m => m + 1);
                }
            } else {
                if (currentMonth === 0) {
                    setCurrentMonth(11);
                    setCurrentYear(y => y - 1);
                } else {
                    setCurrentMonth(m => m - 1);
                }
            }
        }, 180);
    };

    const onTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
        setIsDragging(true);
    };

    const onTouchMove = (e) => {
        if (!isDragging) return;
        const delta = e.touches[0].clientX - touchStartX.current;
        setDragOffset(delta * 0.4);
    };

    const onTouchEnd = (e) => {
        setIsDragging(false);
        const delta = touchStartX.current - e.changedTouches[0].clientX;
        setDragOffset(0);
        if (Math.abs(delta) < SWIPE_THRESHOLD) return;
        changeMonth(delta > 0 ? 1 : -1);
    };

    const days = [];
    const offset = firstDayOfMonth.getDay();
    for (let i = 0; i < offset; i++) days.push(null);
    for (let d = 1; d <= lastDayOfMonth.getDate(); d++) {
        days.push(getLocalDateString(new Date(currentYear, currentMonth, d)));
    }

    const monthLabel = firstDayOfMonth.toLocaleString("default", {
        month: "long",
        year: "numeric",
    });

    const slideClass =
        slideDir === "left"
            ? "-translate-x-8 opacity-0 scale-[0.97]"
            : slideDir === "right"
                ? "translate-x-8 opacity-0 scale-[0.97]"
                : "translate-x-0 opacity-100 scale-100";

    return (
        <div className="
            rounded-2xl p-5 select-none
            bg-white shadow-sm border border-gray-100
            dark:bg-white/[0.04] dark:backdrop-blur-xl dark:border-white/[0.08] dark:shadow-none
        ">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <button onClick={() => changeMonth(-1)} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/10 transition-colors">
                    <ChevronLeft size={18} strokeWidth={2.5} />
                </button>

                {/* FORCE: Dark Black Text */}
                <h2 className="text-sm font-bold tracking-wide text-gray-900 dark:text-white">
                    {monthLabel}
                </h2>

                <button onClick={() => changeMonth(1)} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/10 transition-colors">
                    <ChevronRight size={18} strokeWidth={2.5} />
                </button>
            </div>

            {/* Calendar Grid */}
            <div
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                className={`transition-all duration-200 ease-out ${slideClass}`}
                style={{ transform: isDragging ? `translateX(${dragOffset}px)` : undefined }}
            >
                <div className="grid grid-cols-7 text-center mb-2">
                    {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                        <div key={i} className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 py-1">
                            {d}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-1.5">
                    {days.map((date, i) => {
                        if (!date) return <div key={i} />;
                        const isFuture = date > todayStr;
                        const didGym = workoutDates.includes(date);
                        const isToday = date === todayStr;
                        const isInjury = injuries.some(inj => date >= inj.start_date && (!inj.end_date || date <= inj.end_date));

                        let cellClass = "";

                        // LOGIC: Specific colors for Future vs Past
                        if (isFuture) {
                            // Faded Gray for Future
                            cellClass = "text-gray-300 dark:text-gray-700 cursor-not-allowed";
                        } else if (isInjury) {
                            cellClass = "bg-rose-50 text-rose-600 border border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20";
                        } else if (didGym) {
                            cellClass = "bg-emerald-50 text-emerald-700 font-bold border border-emerald-100 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/20";
                        } else {
                            // Dark Black for Past/Active
                            cellClass = "text-gray-900 font-medium hover:bg-gray-100 dark:text-white dark:hover:bg-white/5";
                        }

                        return (
                            <button
                                key={date}
                                disabled={isFuture}
                                onClick={() => !isFuture && setSelectedDate(date)}
                                className={`
                                    aspect-square rounded-xl flex flex-col items-center justify-center text-xs relative transition-all
                                    ${cellClass}
                                    ${isToday ? "ring-2 ring-emerald-500 dark:ring-emerald-400" : ""}
                                `}
                            >
                                <span>{new Date(date).getDate()}</span>
                                {didGym && !isFuture && !isInjury && <span className="w-1 h-1 rounded-full mt-0.5 bg-emerald-500 dark:bg-emerald-400" />}
                                {isInjury && !isFuture && <span className="text-[8px] leading-none mt-0.5">🩹</span>}
                            </button>
                        );
                    })}
                </div>
            </div>

            {selectedDate && (
                <DayWorkoutModal date={selectedDate} onClose={() => { setSelectedDate(null); setRefreshKey(k => k + 1); }} />
            )}
        </div>
    );
}