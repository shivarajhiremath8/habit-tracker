import WorkoutForm from "../components/workout/WorkoutForm";

export default function AddWorkout() {
    return (
        <div className="max-w-md mx-auto px-4 pt-6 pb-24">
            <h1 className="text-xl font-semibold mb-4">
                Add Workout
            </h1>

            <WorkoutForm />
        </div>
    );
}
