import WeeklySummary from "../components/dashboard/WeeklySummary";
import WeightChart from "../components/dashboard/WeightChart";
import { supabase } from "../lib/supabase";

export default function Dashboard() {
    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    return (
        <div className="max-w-md mx-auto px-4 pt-6 pb-24 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-semibold">Dashboard</h1>

                <button
                    onClick={handleLogout}
                    className="text-sm text-red-600 font-medium"
                >
                    Logout
                </button>
            </div>

            <WeeklySummary />
            <WeightChart />
        </div>
    );
}
