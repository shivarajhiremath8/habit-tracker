import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { saveWeeklyWeight, saveWorkout } from "../../services/workoutService";
import { getWeightForWeek } from "../../services/weightService";
import Button from "../ui/Button";
import Input from "../ui/Input";
import SplitSelector from "./SplitSelector";

export default function WorkoutForm() {
    const { user } = useAuth();

    const [date, setDate] = useState(
        new Date().toISOString().split("T")[0]
    );
    const [split, setSplit] = useState([]); // Array for multi-select
    const [bodyWeight, setBodyWeight] = useState("");
    const [saving, setSaving] = useState(false);

    const isMonday = new Date(date).getDay() === 1;

    // Pre-fill weight if editing a past Monday
    useEffect(() => {
        if (!user || !isMonday) return;

        async function loadWeight() {
            try {
                const data = await getWeightForWeek(user.id, date);
                if (data) {
                    setBodyWeight(data.body_weight);
                } else {
                    setBodyWeight(""); // Reset if no data
                }
            } catch (err) {
                console.error("Failed to load weight", err);
            }
        }
        loadWeight();
    }, [date, isMonday, user]);

    const handleSave = async () => {
        if (!user) return;

        // Validation: Must have either a split OR a body weight
        const hasSplit = split.length > 0;
        const hasWeight = isMonday && bodyWeight;

        if (!hasSplit && !hasWeight) {
            alert("Please select a workout split or enter body weight.");
            return;
        }

        try {
            setSaving(true);

            // 1️⃣ Save workout (if split selected)
            if (hasSplit) {
                await saveWorkout({
                    userId: user.id,
                    date,
                    split: split.join(" + "), // Join array for DB storage
                });
            }

            // 2️⃣ Save weekly weight (only Monday)
            if (isMonday && bodyWeight) {
                await saveWeeklyWeight({
                    userId: user.id,
                    weekStart: date,
                    bodyWeight,
                });
            }

            alert("Saved successfully");
            setSplit([]);
            setBodyWeight("");
        } catch (err) {
            console.error(err);
            alert("Error saving: " + (err.message || JSON.stringify(err)));
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
                <div className="pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <Input
                        label="Weekly Body Weight (kg)"
                        type="number"
                        value={bodyWeight}
                        onChange={(e) => setBodyWeight(e.target.value)}
                        placeholder="e.g. 75.5"
                    />
                </div>
            )}

            <Button
                onClick={handleSave}
                disabled={saving || (split.length === 0 && (!isMonday || !bodyWeight))}
                className="bg-green-600 hover:bg-green-700 text-white"
            >
                {saving ? "Saving..." : "Save Log"}
            </Button>
        </div>
    );
}
