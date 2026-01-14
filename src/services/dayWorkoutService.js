import { supabase } from "../lib/supabase";

/**
 * Fetch workout for a specific date
 */
export async function getWorkoutByDate(userId, date) {
    const { data, error } = await supabase
        .from("workouts")
        .select("id, workout_date, split")
        .eq("user_id", userId)
        .eq("workout_date", date)
        .single();

    if (error && error.code !== "PGRST116") {
        // PGRST116 = no rows found
        console.error("Error fetching workout:", error);
        throw error;
    }

    return data ?? null;
}
