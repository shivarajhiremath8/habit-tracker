import { useState } from "react";
import WorkoutForm from "../components/workout/WorkoutForm";
import InjuryForm from "../components/injury/InjuryForm";
import ThemeToggle from "../components/ui/ThemeToggle";

export default function AddWorkout() {
    const [activeTab, setActiveTab] = useState("workout");

    return (
        <div className="max-w-md mx-auto px-4 pt-6 pb-24 space-y-6">
            <div className="flex justify-between items-center">
                {/* Fixed: Uses 'text-text-main' which auto-switches color */}
                <h1 className="text-xl font-bold text-text-main">
                    Add Checkpoint
                </h1>
                <ThemeToggle />
            </div>

            {/* Tabs */}
            <div className="flex p-1 bg-surface rounded-xl border border-border">
                <button
                    onClick={() => setActiveTab("workout")}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200
                        ${activeTab === "workout"
                            ? "bg-primary text-primary-content shadow-sm"
                            : "text-text-muted hover:text-text-main hover:bg-black/5 dark:hover:bg-white/5"
                        }`}
                >
                    Workout
                </button>
                <button
                    onClick={() => setActiveTab("injury")}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200
                        ${activeTab === "injury"
                            ? "bg-rose-500 text-white shadow-sm"
                            : "text-text-muted hover:text-text-main hover:bg-black/5 dark:hover:bg-white/5"
                        }`}
                >
                    Injury
                </button>
            </div>

            {activeTab === "workout" ? <WorkoutForm /> : <InjuryForm />}
        </div>
    );
}