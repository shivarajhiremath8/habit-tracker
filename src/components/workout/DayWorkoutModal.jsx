import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getWorkoutByDate } from "../../services/dayWorkoutService";
import { saveWeeklyWeight, saveWorkout, deleteWorkout } from "../../services/workoutService";
import { getWeightForWeek } from "../../services/weightService";
import { getInjuryByDate, deleteInjury } from "../../services/injuryService"; // New imports
import Button from "../ui/Button";
import Input from "../ui/Input";
import SplitSelector from "./SplitSelector";

export default function DayWorkoutModal({ date, onClose }) {
    const { user } = useAuth();
    const [split, setSplit] = useState([]);
    const [bodyWeight, setBodyWeight] = useState("");
    const [injury, setInjury] = useState(null); // New state
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

                // Load Injury
                const injuryData = await getInjuryByDate(user.id, date);
                if (injuryData) {
                    setInjury(injuryData);
                } else {
                    setInjury(null);
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

            const hasSplit = split.length > 0;
            const hasWeight = isMonday && bodyWeight;

            // 1. Handle Workout (Save or Delete)
            if (hasSplit) {
                await saveWorkout({
                    userId: user.id,
                    date,
                    split: split.join(" + "),
                });
            } else {
                // If split is empty, clear it (set to empty string) so the green dot disappears
                // We use "" because the column has a NOT NULL constraint
                await saveWorkout({
                    userId: user.id,
                    date,
                    split: "",
                });
            }

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
        <div className="fixed inset-0 z-[60] flex items-end justify-center">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="relative w-full bg-surface rounded-t-2xl p-6 pb-safe max-h-[85vh] overflow-y-auto shadow-xl animate-in slide-in-from-bottom duration-200 z-10">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-sm text-text-muted font-medium">
                            Workout for
                        </p>
                        <h2 className="text-xl font-bold text-text-main">
                            {new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </h2>
                    </div>
                    {isMonday && (
                        <span className="bg-primary-light text-primary text-xs font-semibold px-2.5 py-0.5 rounded-full border border-primary-light">
                            Weigh-in Day
                        </span>
                    )}
                </div>

                {loading ? (
                    <div className="py-8 text-center text-text-muted text-sm">Loading details...</div>
                ) : injury ? (
                    <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                        <div className="bg-rose-50 dark:bg-rose-900/20 p-4 rounded-xl border border-rose-100 dark:border-rose-800">
                            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-semibold mb-2">
                                <span>🩹</span>
                                <span>Injury Active</span>
                            </div>
                            <div className="text-sm space-y-1 text-text-main">
                                <p><span className="text-text-muted">Start:</span> {new Date(injury.start_date).toLocaleDateString()}</p>
                                <p><span className="text-text-muted">End:</span> {injury.end_date ? new Date(injury.end_date).toLocaleDateString() : 'Ongoing'}</p>
                                {injury.notes && (
                                    <p className="mt-2 text-sm italic opacity-80">"{injury.notes}"</p>
                                )}
                            </div>
                        </div>

                        <Button
                            variant="danger"
                            onClick={async () => {
                                if (confirm("Delete this injury entry?")) {
                                    setSaving(true);
                                    await deleteInjury(injury.id);
                                    onClose();
                                }
                            }}
                            disabled={saving}
                        >
                            {saving ? "Deleting..." : "Delete Injury"}
                        </Button>

                        <Button variant="secondary" onClick={onClose}>Close</Button>
                    </div>
                ) : (
                    <>
                        <SplitSelector value={split} onChange={setSplit} />

                        {isMonday && (
                            <div className="mt-5 pt-5 border-t border-border">
                                <div className="mb-2">
                                    <label className="block text-sm font-medium text-text-main mb-1">
                                        Weekly Body Weight (kg)
                                    </label>
                                    <Input
                                        type="number"
                                        value={bodyWeight}
                                        onChange={(e) => setBodyWeight(e.target.value)}
                                        placeholder="e.g. 75.5"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="mt-8 space-y-3">
                            <Button
                                onClick={handleSave}
                                disabled={saving}
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
