export default function Button({
    children,
    onClick,
    type = "button",
    disabled = false,
    variant = "primary",
    className = "",
    ...props
}) {
    const base =
        "w-full py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";

    const variants = {
        primary: "bg-green-600 text-white hover:bg-green-700 shadow-sm hover:shadow-md",
        secondary: "bg-white text-green-700 border border-green-200 hover:bg-green-50 hover:text-green-900 shadow-sm",
        outline: "border border-green-300 text-green-700 hover:bg-green-50",
        ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
        danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
    };

    return (
        <button
            type={type}
            disabled={disabled}
            onClick={onClick}
            className={`${base} ${variants[variant] || variants.primary} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
