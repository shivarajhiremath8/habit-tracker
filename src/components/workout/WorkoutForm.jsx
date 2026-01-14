import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { saveWeeklyWeight, saveWorkout } from "../../services/workoutService";
import Button from "../ui/Button";
import Input from "../ui/Input";
import SplitSelector from "./SplitSelector";

export default function WorkoutForm() {
    const { user } = useAuth();

    const [date, setDate] = useState(
        new Date().toISOString().split("T")[0]
    );
    const [split, setSplit] = useState(null);
    const [bodyWeight, setBodyWeight] = useState("");
    const [saving, setSaving] = useState(false);

    const isMonday = new Date(date).getDay() === 1;

    const handleSave = async () => {
        if (!user) return;

        try {
            setSaving(true);

            // 1️⃣ Save workout
            await saveWorkout({
                userId: user.id,
                date,
                split,
            });

            // 2️⃣ Save weekly weight (only Monday)
            if (isMonday && bodyWeight) {
                await saveWeeklyWeight({
                    userId: user.id,
                    weekStart: date,
                    bodyWeight,
                });
            }

            alert("Workout saved successfully");
            setSplit(null);
            setBodyWeight("");
        } catch (err) {
            alert("Something went wrong while saving");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-5">
            <Input
                label="Date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
            />

            <SplitSelector value={split} onChange={setSplit} />

            {isMonday && (
                <Input
                    label="Weekly Body Weight (kg)"
                    type="number"
                    value={bodyWeight}
                    onChange={(e) => setBodyWeight(e.target.value)}
                />
            )}

            <Button
                onClick={handleSave}
                disabled={!split || saving || (isMonday && !bodyWeight)}
            >
                {saving ? "Saving..." : "Save Workout"}
            </Button>
        </div>
    );
}
