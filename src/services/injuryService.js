import { supabase } from "../lib/supabase";

export async function saveInjury({ userId, startDate, endDate, notes }) {
    const { data, error } = await supabase
        .from("injuries")
        .insert([
            {
                user_id: userId,
                start_date: startDate,
                end_date: endDate || null,
                notes,
            },
        ])
        .select();

    if (error) throw error;
    return data;
}

export async function getInjuriesForMonth(userId, year, month) {
    // Determine start/end of month to filter
    // Actually, an injury might span across months.
    // A simple approach is to fetch all active injuries or overlap.
    // For now, let's just fetch all injuries for the user (assuming not too many)
    // or fetch based on range overlap if performance matters. 
    // Let's settle for simple fetch all for now, as habit trackers usually don't have thousands of injuries.

    const { data, error } = await supabase
        .from("injuries")
        .select("*")
        .eq("user_id", userId)
        .order("start_date", { ascending: false });

    if (error) throw error;
    return data;
}

export async function deleteInjury(id) {
    const { error } = await supabase
        .from("injuries")
        .delete()
        .eq("id", id);

    if (error) throw error;
    return true;
}

export async function getInjuryByDate(userId, date) {
    const { data, error } = await supabase
        .from("injuries")
        .select("*")
        .eq("user_id", userId)
        .lte("start_date", date)
        .or(`end_date.gte.${date},end_date.is.null`)
        .limit(1)
        .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
}
