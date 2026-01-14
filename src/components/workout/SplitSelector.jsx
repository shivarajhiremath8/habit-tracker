const SPLITS = [
    "Chest + Back",
    "Shoulders + Biceps",
    "Legs + Triceps",
];

export default function SplitSelector({ value, onChange }) {
    return (
        <div>
            <p className="text-sm text-gray-500 mb-2">
                Workout Split
            </p>

            <div className="space-y-3">
                {SPLITS.map((split) => {
                    const selected = value === split;
                    return (
                        <button
                            key={split}
                            type="button"
                            onClick={() => onChange(split)}
                            className={`w-full text-left p-4 rounded-xl border
                ${selected
                                    ? "border-green-600 bg-green-50"
                                    : "border-gray-200"
                                }
              `}
                        >
                            <p className="font-medium">{split}</p>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
