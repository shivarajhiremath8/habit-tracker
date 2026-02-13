import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getWorkoutByDate } from "../../services/dayWorkoutService";
import { saveWeeklyWeight, saveWorkout } from "../../services/workoutService";
import { getWeightForWeek } from "../../services/weightService";
import Button from "../ui/Button";
import Input from "../ui/Input";
import SplitSelector from "./SplitSelector";

export default function DayWorkoutModal({ date, onClose }) {
    const { user } = useAuth();
    const [split, setSplit] = useState([]);
    const [bodyWeight, setBodyWeight] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const isMonday = new Date(date).getDay() === 1;

    useEffect(() => {
        if (!user || !date) return;

        async function load() {
            try {
                // Load workout
                const workout = await getWorkoutByDate(user.id, date);
                if (workout?.split) {
                    setSplit(workout.split.split(" + "));
                } else {
                    setSplit([]);
                }

                // Load weight if Monday
                if (isMonday) {
                    const weightData = await getWeightForWeek(user.id, date);
                    if (weightData) {
                        setBodyWeight(weightData.body_weight);
                    }
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [user, date, isMonday]);

    const handleSave = async () => {
        try {
            setSaving(true);

            // 1. Save Workout
            await saveWorkout({
                userId: user.id,
                date,
                split,
            });

            // 2. Save Weight if Monday
            if (isMonday && bodyWeight) {
                await saveWeeklyWeight({
                    userId: user.id,
                    weekStart: date,
                    bodyWeight,
                });
            }

            onClose();
        } catch (err) {
            console.error(err);
            alert("Error saving: " + (err.message || JSON.stringify(err)));
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="absolute bottom-0 w-full bg-white rounded-t-2xl p-6 max-h-[85vh] overflow-y-auto shadow-xl animate-in slide-in-from-bottom duration-200">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-sm text-gray-500 font-medium">
                            Workout for
                        </p>
                        <h2 className="text-xl font-bold text-gray-900">
                            {new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </h2>
                    </div>
                    {isMonday && (
                        <span className="bg-green-50 text-green-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-green-100">
                            Weigh-in Day
                        </span>
                    )}
                </div>

                {loading ? (
                    <div className="py-8 text-center text-gray-500 text-sm">Loading details...</div>
                ) : (
                    <>
                        <SplitSelector value={split} onChange={setSplit} />

                        {isMonday && (
                            <div className="mt-5 pt-5 border-t border-gray-100">
                                <Input
                                    label="Weekly Body Weight (kg)"
                                    type="number"
                                    value={bodyWeight}
                                    onChange={(e) => setBodyWeight(e.target.value)}
                                    placeholder="e.g. 75.5"
                                />
                            </div>
                        )}

                        <div className="mt-8 space-y-3">
                            <Button
                                onClick={handleSave}
                                disabled={saving || (split.length === 0 && (!isMonday || !bodyWeight))}
                                className="bg-green-600 hover:bg-green-700 text-white"
                            >
                                {saving ? "Saving..." : "Save Changes"}
                            </Button>

                            <Button
                                variant="secondary"
                                onClick={onClose}
                            >
                                Cancel
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
