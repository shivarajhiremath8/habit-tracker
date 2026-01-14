import addIcon from "../../assets/add.svg";
import calendarIcon from "../../assets/calendar.svg";
import homeIcon from "../../assets/home.svg";

export default function BottomNav({ current, onChange }) {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t z-50">
            <div className="max-w-md mx-auto flex justify-around py-2">
                {/* Dashboard */}
                <button
                    onClick={() => onChange("dashboard")}
                    className={`flex flex-col items-center text-xs font-medium
            ${current === "dashboard" ? "text-green-600" : "text-gray-500"}
          `}
                >
                    <img
                        src={homeIcon}
                        alt="Dashboard"
                        className={`w-6 h-6 mb-1
              ${current === "dashboard" ? "opacity-100" : "opacity-60"}
            `}
                    />
                    Dashboard
                </button>

                {/* Calendar */}
                <button
                    onClick={() => onChange("calendar")}
                    className={`flex flex-col items-center text-xs font-medium
            ${current === "calendar" ? "text-green-600" : "text-gray-500"}
          `}
                >
                    <img
                        src={calendarIcon}
                        alt="Calendar"
                        className={`w-6 h-6 mb-1
              ${current === "calendar" ? "opacity-100" : "opacity-60"}
            `}
                    />
                    Calendar
                </button>

                {/* Add Workout */}
                <button
                    onClick={() => onChange("add")}
                    className={`flex flex-col items-center text-xs font-medium
            ${current === "add" ? "text-green-600" : "text-gray-500"}
          `}
                >
                    <img
                        src={addIcon}
                        alt="Add Workout"
                        className={`w-6 h-6 mb-1
              ${current === "add" ? "opacity-100" : "opacity-60"}
            `}
                    />
                    Add
                </button>
            </div>
        </div>
    );
}
