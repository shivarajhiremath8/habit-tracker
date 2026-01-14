export default function BottomSheet({ open, onClose, children }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40"
                onClick={onClose}
            />

            {/* Sheet */}
            <div className="absolute bottom-0 w-full bg-white rounded-t-2xl p-4 max-h-[85vh] overflow-y-auto">
                <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-3" />
                {children}
            </div>
        </div>
    );
}
