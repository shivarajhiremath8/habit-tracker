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
        primary: "bg-primary text-primary-content hover:bg-primary-hover shadow-sm hover:shadow-md",
        secondary: "bg-surface text-primary border border-border hover:bg-primary-light hover:text-primary-hover shadow-sm",
        outline: "border border-border text-primary hover:bg-primary-light",
        ghost: "text-text-muted hover:bg-background hover:text-text-main",
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
