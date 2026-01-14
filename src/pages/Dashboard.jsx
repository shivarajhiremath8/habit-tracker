import WeeklySummary from "../components/dashboard/WeeklySummary";

export default function Dashboard() {
    return (
        <div className="max-w-md mx-auto px-4 pt-6 pb-24">
            <h1 className="text-xl font-semibold mb-4">
                Dashboard
            </h1>

            {/* Weekly data from Supabase */}
            <WeeklySummary />
        </div>
    );
}
