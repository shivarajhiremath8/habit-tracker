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
                <label className="block text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 
                focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200
                disabled:bg-gray-50 disabled:text-gray-500
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
