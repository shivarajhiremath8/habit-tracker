import { useEffect, useRef, useState } from "react";
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
    const [selectedDate, setSelectedDate] = useState(null);

    // Animation state
    const [slideDir, setSlideDir] = useState(null); // "left" | "right"

    // Swipe refs
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);
    const SWIPE_THRESHOLD = 50;

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

    // Fetch workouts
    useEffect(() => {
        if (!user) return;

        async function load() {
            const from = getLocalDateString(firstDayOfMonth);
            const to = getLocalDateString(lastDayOfMonth);

            const { data } = await supabase
                .from("workouts")
                .select("workout_date")
                .eq("user_id", user.id)
                .gte("workout_date", from)
                .lte("workout_date", to);

            if (data) {
                setWorkoutDates(data.map((d) => d.workout_date));
            }
        }

        load();
    }, [user, currentMonth, currentYear]);

    // Month navigation
    const goPrevMonth = () => {
        setSlideDir("right");
        setTimeout(() => {
            setSlideDir(null);
            if (currentMonth === 0) {
                setCurrentMonth(11);
                setCurrentYear((y) => y - 1);
            } else {
                setCurrentMonth((m) => m - 1);
            }
        }, 150);
    };

    const goNextMonth = () => {
        setSlideDir("left");
        setTimeout(() => {
            setSlideDir(null);
            if (currentMonth === 11) {
                setCurrentMonth(0);
                setCurrentYear((y) => y + 1);
            } else {
                setCurrentMonth((m) => m + 1);
            }
        }, 150);
    };

    // Swipe handlers
    const onTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const onTouchEnd = (e) => {
        touchEndX.current = e.changedTouches[0].clientX;
        const delta = touchStartX.current - touchEndX.current;

        if (Math.abs(delta) < SWIPE_THRESHOLD) return;

        delta > 0 ? goNextMonth() : goPrevMonth();
    };

    // Build calendar grid
    const days = [];
    const offset = firstDayOfMonth.getDay();

    for (let i = 0; i < offset; i++) days.push(null);

    for (let d = 1; d <= lastDayOfMonth.getDate(); d++) {
        days.push(
            getLocalDateString(new Date(currentYear, currentMonth, d))
        );
    }

    const monthLabel = firstDayOfMonth.toLocaleString("default", {
        month: "long",
        year: "numeric",
    });

    // Animation classes
    const slideClass =
        slideDir === "left"
            ? "-translate-x-6 opacity-0"
            : slideDir === "right"
                ? "translate-x-6 opacity-0"
                : "translate-x-0 opacity-100";

    return (
        <>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={goPrevMonth}
                    className="px-3 py-1 rounded-lg bg-gray-100 text-sm"
                >
                    ←
                </button>

                <h2 className="text-sm font-semibold">
                    {monthLabel}
                </h2>

                <button
                    onClick={goNextMonth}
                    className="px-3 py-1 rounded-lg bg-gray-100 text-sm"
                >
                    →
                </button>
            </div>

            {/* Swipe + animation container */}
            <div
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
                className={`transition-all duration-200 ${slideClass}`}
            >
                {/* Weekdays */}
                <div className="grid grid-cols-7 text-center text-xs text-gray-500 mb-2">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                        <div key={d}>{d}</div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2">
                    {days.map((date, i) => {
                        if (!date) return <div key={i} />;

                        const isFuture = date > todayStr;
                        const didGym = workoutDates.includes(date);
                        const isToday = date === todayStr;

                        return (
                            <button
                                key={date}
                                disabled={isFuture}
                                onClick={() => !isFuture && setSelectedDate(date)}
                                className={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm
                  ${isFuture
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        : didGym
                                            ? "bg-green-100 text-green-700"
                                            : "bg-gray-100 text-gray-700"
                                    }
                  ${isToday ? "ring-2 ring-green-500" : ""}
                `}
                            >
                                <span>{new Date(date).getDate()}</span>
                                {didGym && !isFuture && (
                                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full mt-1" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Day modal */}
            {selectedDate && (
                <DayWorkoutModal
                    date={selectedDate}
                    onClose={() => setSelectedDate(null)}
                />
            )}
        </>
    );
}
