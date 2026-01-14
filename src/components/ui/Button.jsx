export default function Button({
    children,
    onClick,
    type = "button",
    disabled = false,
    variant = "primary",
    className = "",
}) {
    const base =
        "w-full py-3 rounded-xl font-medium transition disabled:opacity-50";

    const variants = {
        primary: "bg-green-600 text-white",
        secondary: "bg-gray-100 text-gray-800",
        outline: "border border-gray-300 text-gray-700",
    };

    return (
        <button
            type={type}
            disabled={disabled}
            onClick={onClick}
            className={`${base} ${variants[variant]} ${className}`}
        >
            {children}
        </button>
    );
}
