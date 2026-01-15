import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { saveWeeklyWeight, saveWorkout } from "../../services/workoutService";
import { getLocalDateString } from "../../utils/dateUtils";
import Button from "../ui/Button";
import Input from "../ui/Input";
import BodyPartSelector from "./BodyPartSelector";

export default function WorkoutForm() {
    const { user } = useAuth();

    const [date, setDate] = useState(getLocalDateString());
    const [bodyParts, setBodyParts] = useState([]);
    const [bodyWeight, setBodyWeight] = useState("");
    const [saving, setSaving] = useState(false);

    const isMonday = new Date(date).getDay() === 1;

    const handleSave = async () => {
        if (!user) return;

        try {
            setSaving(true);

            // 1️⃣ Save workout (UPSERT, multi body parts)
            await saveWorkout({
                userId: user.id,
                date,
                bodyParts,
            });

            // 2️⃣ Save weekly weight (Monday only)
            if (isMonday && bodyWeight) {
                await saveWeeklyWeight({
                    userId: user.id,
                    weekStart: date,
                    bodyWeight,
                });
            }

            alert("Workout saved successfully");

            // Reset form (date stays)
            setBodyParts([]);
            setBodyWeight("");
        } catch (err) {
            console.error(err);
            alert("Something went wrong while saving");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-5">
            {/* Date */}
            <Input
                label="Date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
            />

            {/* Body parts (multi-select) */}
            <BodyPartSelector
                value={bodyParts}
                onChange={setBodyParts}
            />

            {/* Weekly body weight (Monday only) */}
            {isMonday && (
                <Input
                    label="Weekly Body Weight (kg)"
                    type="number"
                    value={bodyWeight}
                    onChange={(e) => setBodyWeight(e.target.value)}
                />
            )}

            {/* Save */}
            <Button
                onClick={handleSave}
                disabled={
                    bodyParts.length === 0 ||
                    saving ||
                    (isMonday && !bodyWeight)
                }
            >
                {saving ? "Saving..." : "Save Workout"}
            </Button>
        </div>
    );
}
