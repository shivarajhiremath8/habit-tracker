import { supabase } from "../lib/supabase";

/**
 * Save workout for a given day
 */
export async function saveWorkout({
    userId,
    date,
    split,
}) {
    const { error } = await supabase
        .from("workouts")
        .insert([
            {
                user_id: userId,
                workout_date: date,
                split,
            },
        ]);

    if (error) {
        console.error("Error saving workout:", error);
        throw error;
    }
}

/**
 * Save weekly body weight (Monday only)
 */
export async function saveWeeklyWeight({
    userId,
    weekStart,
    bodyWeight,
}) {
    const { error } = await supabase
        .from("weekly_weights")
        .insert([
            {
                user_id: userId,
                week_start: weekStart,
                body_weight: bodyWeight,
            },
        ]);

    if (error) {
        console.error("Error saving weight:", error);
        throw error;
    }
}
