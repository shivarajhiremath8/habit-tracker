import { Calendar, Home, PlusCircle } from "lucide-react";

export default function BottomNav({ current, onChange }) {
    const navItems = [
        { id: "calendar", label: "History", icon: Calendar },
        { id: "dashboard", label: "Dashboard", icon: Home },
        { id: "add", label: "Add Checkpoint", icon: PlusCircle },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border z-50 pb-safe">
            <div className="max-w-md mx-auto flex justify-around items-center h-16">
                {navItems.map((item) => {
                    const isActive = current === item.id;
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.id}
                            onClick={() => onChange(item.id)}
                            className={`flex flex-col items-center justify-center w-full h-full space-y-1
                                ${isActive ? "text-primary" : "text-text-muted hover:text-text-main"}
                                transition-colors duration-200`}
                        >
                            <Icon
                                size={24}
                                strokeWidth={isActive ? 2.5 : 2}
                                className="transition-transform duration-200 active:scale-95"
                            />
                            <span className="text-[10px] font-medium tracking-wide">
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
