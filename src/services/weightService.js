import { supabase } from "../lib/supabase";

/**
 * Fetch weekly body weight data (Monday entries)
 */
export async function getWeeklyWeights(userId) {
    const { data, error } = await supabase
        .from("weekly_weights")
        .select("week_start, body_weight")
        .eq("user_id", userId)
        .order("week_start", { ascending: true });

    if (error) {
        console.error("Error fetching weekly weights:", error);
        throw error;
    }

    return data;
}

/**
 * Fetch weight for a specific week start date
 */
export async function getWeightForWeek(userId, date) {
    const { data, error } = await supabase
        .from("weekly_weights")
        .select("body_weight")
        .eq("user_id", userId)
        .eq("week_start", date)
        .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "Row not found" - ignore it
        console.error("Error fetching weight for week:", error);
    }

    return data;
}
