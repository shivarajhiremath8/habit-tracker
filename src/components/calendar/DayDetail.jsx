import { mockWorkouts } from "../../data/mockWorkouts";

export default function DayDetail({ date }) {
    const data = mockWorkouts[date];

    return (
        <div>
            <h2 className="text-lg font-semibold">{date}</h2>

            {!data && (
                <p className="text-sm text-gray-500 mt-4">
                    No workout logged for this day.
                </p>
            )}

            {data && (
                <div className="mt-4 space-y-3">
                    <div>
                        <p className="text-xs text-gray-500">Workout Split</p>
                        <p className="font-medium">{data.split}</p>
                    </div>

                    <div>
                        <p className="text-xs text-gray-500">Body Weight</p>
                        <p className="font-medium">{data.bodyWeight} kg</p>
                    </div>

                    <div>
                        <p className="text-xs text-gray-500">Exercises</p>
                        <p className="text-sm text-gray-700">
                            {data.exercises.length} exercises logged
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
