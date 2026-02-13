import { supabase } from "../lib/supabase";
import { getLocalDateString } from "../utils/dateUtils";

/**
 * Fetch workouts for the last N days
 */
export async function getWorkoutsLastNDays(userId, days = 7) {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - (days - 1));

    const from = getLocalDateString(startDate);
    const to = getLocalDateString(today);

    const { data, error } = await supabase
        .from("workouts")
        .select("workout_date, split")
        .eq("user_id", userId)
        .gte("workout_date", from)
        .lte("workout_date", to);

    if (error) {
        console.error("Error fetching workouts:", error);
        throw error;
    }

    return data;
}
