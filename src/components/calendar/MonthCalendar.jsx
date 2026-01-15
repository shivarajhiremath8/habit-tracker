import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { supabase } from "../../lib/supabase";
import { getLocalDateString } from "../../utils/dateUtils";
import DayWorkoutModal from "../workout/DayWorkoutModal";

export default function MonthCalendar({ readOnly = false, userId: sharedUserId = null }) {
    const { user } = useAuth();
    const activeUserId = readOnly ? sharedUserId : user?.id;

    const today = new Date();
    const todayStr = getLocalDateString(today);

    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [workoutDates, setWorkoutDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);

    const touchStartX = useRef(0);
    const SWIPE_THRESHOLD = 50;

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

    useEffect(() => {
        if (!activeUserId) return;

        async function load() {
            const { data } = await supabase
                .from("workouts")
                .select("workout_date")
                .eq("user_id", activeUserId)
                .gte("workout_date", getLocalDateString(firstDayOfMonth))
                .lte("workout_date", getLocalDateString(lastDayOfMonth));

            if (data) {
                setWorkoutDates(data.map((d) => d.workout_date));
            }
        }

        load();
    }, [activeUserId, currentMonth, currentYear]);

    const goPrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear((y) => y - 1);
        } else {
            setCurrentMonth((m) => m - 1);
        }
    };

    const goNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear((y) => y + 1);
        } else {
            setCurrentMonth((m) => m + 1);
        }
    };

    const onTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const onTouchEnd = (e) => {
        const delta = touchStartX.current - e.changedTouches[0].clientX;
        if (Math.abs(delta) < SWIPE_THRESHOLD) return;
        delta > 0 ? goNextMonth() : goPrevMonth();
    };

    const days = [];
    const offset = firstDayOfMonth.getDay();
    for (let i = 0; i < offset; i++) days.push(null);

    for (let d = 1; d <= lastDayOfMonth.getDate(); d++) {
        days.push(getLocalDateString(new Date(currentYear, currentMonth, d)));
    }

    return (
        <>
            <div className="flex items-center justify-between mb-4">
                <button onClick={goPrevMonth}>←</button>
                <span className="font-semibold">
                    {firstDayOfMonth.toLocaleString("default", { month: "long", year: "numeric" })}
                </span>
                <button onClick={goNextMonth}>→</button>
            </div>

            <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
                <div className="grid grid-cols-7 gap-2">
                    {days.map((date, i) => {
                        if (!date) return <div key={i} />;

                        const isFuture = date > todayStr;
                        const didGym = workoutDates.includes(date);

                        return (
                            <button
                                key={date}
                                disabled={isFuture || readOnly}
                                onClick={() => !readOnly && setSelectedDate(date)}
                                className={`aspect-square rounded-lg text-sm
                  ${didGym
                                        ? "bg-green-100 text-green-700"
                                        : "bg-gray-100 text-gray-700"
                                    }
                  ${readOnly ? "opacity-70" : ""}
                `}
                            >
                                {new Date(date).getDate()}
                            </button>
                        );
                    })}
                </div>
            </div>

            {!readOnly && selectedDate && (
                <DayWorkoutModal
                    date={selectedDate}
                    onClose={() => setSelectedDate(null)}
                />
            )}
        </>
    );
}
