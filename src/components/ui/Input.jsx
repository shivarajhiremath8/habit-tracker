export default function Input({
    label,
    value,
    onChange,
    type = "text",
    placeholder,
    className = "",
    error,
    ...props
}) {
    return (
        <div className="space-y-1.5 w-full">
            {label && (
                <label className="block text-sm font-medium text-text-main">
                    {label}
                </label>
            )}
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full px-4 py-2.5 rounded-lg border border-border bg-surface text-text-main placeholder-text-muted 
                focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200
                disabled:bg-surface disabled:text-text-muted disabled:opacity-60
                ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''}
                ${className}`}
                {...props}
            />
            {error && (
                <p className="text-xs text-red-500 mt-1">{error}</p>
            )}
        </div>
    );
}
