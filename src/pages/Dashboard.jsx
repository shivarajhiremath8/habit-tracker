import WeeklySummary from "../components/dashboard/WeeklySummary";
import WeightChart from "../components/dashboard/WeightChart";
import ThemeToggle from "../components/ui/ThemeToggle";

export default function Dashboard() {
    return (
        <div className="max-w-md mx-auto px-4 pt-6 pb-24 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold text-black dark:text-white">Dashboard</h1>

                <ThemeToggle />
            </div>

            <WeeklySummary />
            <WeightChart />
        </div>
    );
}
