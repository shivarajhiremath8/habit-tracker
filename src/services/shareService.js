import { supabase } from "../lib/supabase";

export async function createTrainerShare(userId) {
    const token = crypto.randomUUID();

    const { data, error } = await supabase
        .from("trainer_shares")
        .insert([
            {
                user_id: userId,
                share_token: token,
            },
        ])
        .select()
        .single();

    if (error) {
        console.error("Error creating share link", error);
        throw error;
    }

    return token;
}
