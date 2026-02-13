import { useState } from "react";
import WorkoutForm from "../components/workout/WorkoutForm";
import InjuryForm from "../components/injury/InjuryForm"; // Import InjuryForm
import ThemeToggle from "../components/ui/ThemeToggle";

export default function AddWorkout() {
    const [activeTab, setActiveTab] = useState("workout");

    return (
        <div className="max-w-md mx-auto px-4 pt-6 pb-24 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold text-black dark:text-white">
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
                            : "text-text-muted hover:text-text-main"
                        }`}
                >
                    Workout
                </button>
                <button
                    onClick={() => setActiveTab("injury")}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200
                        ${activeTab === "injury"
                            ? "bg-red-500 text-white shadow-sm" // Red for injury? Or primary? User said "light pink in theme" for calendar. For tab, maybe keep consistent or differentiate.
                            // Let's stick to Primary or a distinct color. Red is standard for injury. User said "light pink". But button text should bereadable.
                            // I'll stick to primary for consistency, OR use a soft error color.
                            // Actually, let's use a nice Rose color for injury mode to distinguish it.
                            : "text-text-muted hover:text-text-main"
                        }`}
                    // Overriding the class above:
                    style={activeTab === 'injury' ? { backgroundColor: '#f43f5e', color: 'white' } : {}}
                >
                    Injury
                </button>
            </div>

            {activeTab === "workout" ? <WorkoutForm /> : <InjuryForm />}
        </div>
    );
}
