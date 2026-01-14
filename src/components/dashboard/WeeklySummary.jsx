import { workoutStore } from "../../data/workoutStore";

export default function WeeklySummary() {
    const workouts = workoutStore.getWorkouts();
    const today = new Date();

    const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        return d.toISOString().split("T")[0];
    }).reverse();

    const gymDays = last7Days.filter(
        (date) => workouts[date]
    ).length;

    return (
        <div className="bg-white rounded-xl p-4">
            <p className="text-sm text-gray-500 mb-3">Last 7 days</p>

            <div className="flex justify-between mb-4">
                {last7Days.map((date) => {
                    const didGym = Boolean(workouts[date]);
                    return (
                        <div
                            key={date}
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs
                ${didGym ? "bg-green-500 text-white" : "bg-gray-200"}
              `}
                        >
                            {new Date(date).getDate()}
                        </div>
                    );
                })}
            </div>

            <div className="flex justify-between">
                <span className="text-sm text-gray-600">Gym days</span>
                <span className="font-semibold">{gymDays} / 7</span>
            </div>
        </div>
    );
}
