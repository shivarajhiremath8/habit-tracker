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
