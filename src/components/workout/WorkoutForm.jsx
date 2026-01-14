import { useState } from "react";
import { workoutStore } from "../../data/workoutStore";
import Button from "../ui/Button";
import Input from "../ui/Input";
import SplitSelector from "./SplitSelector";

export default function WorkoutForm() {
    const [date, setDate] = useState(
        new Date().toISOString().split("T")[0]
    );
    const [split, setSplit] = useState(null);
    const [bodyWeight, setBodyWeight] = useState("");

    const isMonday = new Date(date).getDay() === 1;

    const handleSave = () => {
        workoutStore.addWorkout({
            date,
            split,
            bodyWeight: isMonday ? bodyWeight : null,
        });
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
                    placeholder="e.g. 72.5"
                    value={bodyWeight}
                    onChange={(e) => setBodyWeight(e.target.value)}
                />
            )}

            <Button
                onClick={handleSave}
                disabled={!split || (isMonday && !bodyWeight)}
            >
                Save Workout
            </Button>
        </div>
    );
}
