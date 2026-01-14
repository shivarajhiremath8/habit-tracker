export default function Input({
    label,
    value,
    onChange,
    type = "text",
    placeholder,
    className = "",
    ...props
}) {
    return (
        <div className="space-y-1">
            {label && (
                <label className="text-sm text-gray-500">
                    {label}
                </label>
            )}
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-green-500 ${className}`}
                {...props}
            />
        </div>
    );
}
