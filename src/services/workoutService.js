import { supabase } from "../lib/supabase";

/**
 * Insert or update workout for a day (UPSERT)
 */
export async function saveWorkout({ userId, date, split }) {
    const { error } = await supabase
        .from("workouts")
        .upsert(
            {
                user_id: userId,
                workout_date: date,
                split,
            },
            {
                onConflict: "user_id,workout_date",
            }
        );

    if (error) {
        console.error("Error saving workout:", error);
        throw error;
    }
}

/**
 * Insert weekly body weight (Monday only)
 */
export async function saveWeeklyWeight({
    userId,
    weekStart,
    bodyWeight,
}) {
    const { error } = await supabase
        .from("weekly_weights")
        .upsert(
            {
                user_id: userId,
                week_start: weekStart,
                body_weight: bodyWeight,
            },
            {
                onConflict: "user_id,week_start",
            }
        );

    if (error) {
        console.error("Error saving weekly weight:", error);
        throw error;
    }
}
