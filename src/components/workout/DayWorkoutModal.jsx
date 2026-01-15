import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getWorkoutByDate } from "../../services/dayWorkoutService";
import { saveWorkout } from "../../services/workoutService";
import Button from "../ui/Button";
import BodyPartSelector from "./BodyPartSelector";

export default function DayWorkoutModal({ date, onClose }) {
    const { user } = useAuth();

    const [bodyParts, setBodyParts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!user || !date) return;

        async function load() {
            try {
                const workout = await getWorkoutByDate(user.id, date);
                setBodyParts(workout?.body_parts ?? []);
            } catch (e) {
                console.error("Failed to load workout", e);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [user, date]);

    const handleSave = async () => {
        if (bodyParts.length === 0) return;

        try {
            setSaving(true);

            await saveWorkout({
                userId: user.id,
                date,
                bodyParts,
            });

            onClose();
        } catch (e) {
            console.error(e);
            alert("Failed to save workout");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40"
                onClick={onClose}
            />

            {/* Bottom Sheet */}
            <div className="absolute bottom-0 w-full bg-white rounded-t-2xl p-4 max-h-[85vh] overflow-y-auto">
                <p className="text-sm text-gray-500 mb-1">
                    Workout for
                </p>
                <h2 className="text-lg font-semibold mb-4">
                    {date}
                </h2>

                {loading ? (
                    <p className="text-sm text-gray-500">
                        Loading workout...
                    </p>
                ) : (
                    <>
                        {/* Body Part Multi-Select */}
                        <BodyPartSelector
                            value={bodyParts}
                            onChange={setBodyParts}
                        />

                        {/* Actions */}
                        <div className="mt-6 space-y-3">
                            <Button
                                onClick={handleSave}
                                disabled={bodyParts.length === 0 || saving}
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
