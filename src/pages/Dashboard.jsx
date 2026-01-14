import WeeklySummary from "../components/dashboard/WeeklySummary";
import WeightChart from "../components/dashboard/WeightChart";

export default function Dashboard() {
    return (
        <div className="max-w-md mx-auto px-4 pt-6 pb-24 space-y-6">
            <h1 className="text-xl font-semibold">
                Dashboard
            </h1>

            <WeeklySummary />
            <WeightChart />
        </div>
    );
}
