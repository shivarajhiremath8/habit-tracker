import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import Calendar from "./Calendar";

export default function TrainerShare() {
    const { token } = useParams();

    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [invalid, setInvalid] = useState(false);

    useEffect(() => {
        async function loadShare() {
            const { data, error } = await supabase
                .from("trainer_shares")
                .select("user_id")
                .eq("share_token", token)
                .single();

            if (error || !data) {
                setInvalid(true);
            } else {
                setUserId(data.user_id);
            }

            setLoading(false);
        }

        loadShare();
    }, [token]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-sm text-gray-500">
                Loading shared view...
            </div>
        );
    }

    if (invalid) {
        return (
            <div className="min-h-screen flex items-center justify-center text-sm text-red-500">
                Invalid or expired trainer link
            </div>
        );
    }

    return (
        <div className="pb-6">
            {/* Read-only banner */}
            <div className="bg-yellow-100 text-yellow-800 text-xs text-center py-2">
                Read-only trainer view
            </div>

            <Calendar readOnly userId={userId} />
        </div>
    );
}
