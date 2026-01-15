const BODY_PARTS = [
    "Chest",
    "Back",
    "Shoulders",
    "Biceps",
    "Triceps",
    "Legs",
    "Abs",
];

export default function BodyPartSelector({ value = [], onChange }) {
    const togglePart = (part) => {
        if (value.includes(part)) {
            onChange(value.filter((p) => p !== part));
        } else {
            onChange([...value, part]);
        }
    };

    return (
        <div>
            <p className="text-sm text-gray-500 mb-2">
                Body Parts Trained
            </p>

            <div className="grid grid-cols-2 gap-3">
                {BODY_PARTS.map((part) => {
                    const selected = value.includes(part);

                    return (
                        <button
                            key={part}
                            type="button"
                            onClick={() => togglePart(part)}
                            className={`p-3 rounded-xl border text-sm font-medium
                ${selected
                                    ? "bg-green-100 border-green-600 text-green-700"
                                    : "bg-white border-gray-200 text-gray-700"
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
