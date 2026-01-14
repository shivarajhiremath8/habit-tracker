import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getWorkoutByDate } from "../../services/dayWorkoutService";
import { saveWorkout } from "../../services/workoutService";
import Button from "../ui/Button";
import SplitSelector from "./SplitSelector";

export default function DayWorkoutModal({ date, onClose }) {
    const { user } = useAuth();
    const [split, setSplit] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!user || !date) return;

        async function load() {
            try {
                const workout = await getWorkoutByDate(user.id, date);
                setSplit(workout?.split ?? null);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [user, date]);

    const handleSave = async () => {
        try {
            setSaving(true);
            await saveWorkout({
                userId: user.id,
                date,
                split,
            });
            onClose();
        } catch {
            alert("Failed to save workout");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50">
            <div
                className="absolute inset-0 bg-black/40"
                onClick={onClose}
            />

            <div className="absolute bottom-0 w-full bg-white rounded-t-2xl p-4 max-h-[85vh] overflow-y-auto">
                <p className="text-sm text-gray-500 mb-1">
                    Workout for
                </p>
                <h2 className="text-lg font-semibold mb-4">
                    {date}
                </h2>

                {loading ? (
                    <p className="text-sm text-gray-500">Loading...</p>
                ) : (
                    <>
                        <SplitSelector value={split} onChange={setSplit} />

                        <div className="mt-6 space-y-3">
                            <Button
                                onClick={handleSave}
                                disabled={!split || saving}
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
