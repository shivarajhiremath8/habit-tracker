const BODY_PARTS = [
    "Chest",
    "Back",
    "Shoulders",
    "Biceps",
    "Triceps",
    "Legs",
    "Abs",
    "Cardio"
];

export default function SplitSelector({ value, onChange }) {
    // Value is now an array of strings, e.g. ["Chest", "Triceps"]
    const selectedParts = Array.isArray(value) ? value : [];

    const togglePart = (part) => {
        if (selectedParts.includes(part)) {
            onChange(selectedParts.filter((p) => p !== part));
        } else {
            onChange([...selectedParts, part]);
        }
    };

    return (
        <div>
            <p className="text-sm text-text-muted mb-2">
                Workout Split (Select multiple)
            </p>

            <div className="grid grid-cols-2 gap-2">
                {BODY_PARTS.map((part) => {
                    const isSelected = selectedParts.includes(part);
                    return (
                        <button
                            key={part}
                            type="button"
                            onClick={() => togglePart(part)}
                            className={`p-3 rounded-xl border text-sm font-medium transition-all duration-200
                ${isSelected
                                    ? "border-primary bg-primary-light text-primary shadow-sm ring-1 ring-primary"
                                    : "border-border text-text-main hover:border-primary-light hover:bg-background"
                                }
              `}
                        >
                            {part}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
