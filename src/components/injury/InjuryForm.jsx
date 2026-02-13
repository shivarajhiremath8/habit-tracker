import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { saveInjury } from "../../services/injuryService";
import Button from "../ui/Button";
import Input from "../ui/Input";

export default function InjuryForm() {
    const { user } = useAuth();
    const [startDate, setStartDate] = useState(
        new Date().toISOString().split("T")[0]
    );
    const [endDate, setEndDate] = useState("");
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(null); // Holds saved injury summary

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!startDate) return;

        setLoading(true);
        try {
            await saveInjury({
                userId: user.id,
                startDate,
                endDate,
                notes,
            });

            // Build summary for the card
            setSubmitted({
                startDate,
                endDate: endDate || null,
                notes: notes || "No notes provided",
            });
        } catch (err) {
            console.error(err);
            alert(`Error logging injury: ${err.message || err.error_description || "Unknown error"}`);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
        });
    };

    const getDayCount = () => {
        if (!submitted) return 0;
        if (!submitted.endDate) return 1;
        const start = new Date(submitted.startDate);
        const end = new Date(submitted.endDate);
        return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    };

    const handleReset = () => {
        setSubmitted(null);
        setStartDate(new Date().toISOString().split("T")[0]);
        setEndDate("");
        setNotes("");
    };

    // ── Summary Card (shown after successful log) ──
    if (submitted) {
        const dayCount = getDayCount();

        return (
            <div className="animate-in fade-in zoom-in-95 duration-300">
                {/* Light: clean white card · Dark: glassmorphism */}
                <div className="
                    rounded-2xl p-6 space-y-5
                    bg-white shadow-lg shadow-rose-100/40 border border-rose-100
                    dark:bg-white/5 dark:backdrop-blur-xl dark:shadow-none dark:border-white/10
                ">
                    {/* Header */}
                    <div className="flex items-center gap-3">
                        <div className="
                            w-12 h-12 rounded-xl flex items-center justify-center text-2xl
                            bg-rose-50 dark:bg-rose-500/10
                        ">
                            🩹
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-gray-900 dark:text-white">
                                Injury Logged
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                These days will be highlighted on your calendar
                            </p>
                        </div>
                    </div>

                    {/* Date Range */}
                    <div className="
                        rounded-xl p-4 space-y-3
                        bg-rose-50/60 border border-rose-100/80
                        dark:bg-rose-500/5 dark:border-rose-500/10
                    ">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-rose-400 dark:bg-rose-500" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {formatDate(submitted.startDate)}
                                </span>
                            </div>
                            {submitted.endDate && (
                                <>
                                    <div className="flex-1 mx-3 border-t border-dashed border-rose-200 dark:border-rose-500/20" />
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {formatDate(submitted.endDate)}
                                        </span>
                                        <div className="w-2 h-2 rounded-full bg-rose-400 dark:bg-rose-500" />
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="
                                text-xs font-semibold px-2.5 py-1 rounded-full
                                bg-rose-100 text-rose-600
                                dark:bg-rose-500/15 dark:text-rose-400
                            ">
                                {dayCount} {dayCount === 1 ? "day" : "days"} marked
                            </span>
                        </div>
                    </div>

                    {/* Reason */}
                    <div className="space-y-1.5">
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                            Reason
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed italic">
                            "{submitted.notes}"
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="pt-2 space-y-2.5">
                        <Button variant="secondary" onClick={handleReset}>
                            Log Another Injury
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // ── Form (default view) ──
    return (
        <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="Start Date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                />
                <Input
                    label="End Date (Optional)"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-text-main mb-1">
                    Notes
                </label>
                <textarea
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface text-text-main placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                    rows={3}
                    placeholder="Describe injury..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />
            </div>

            <Button type="submit" disabled={loading} variant="primary">
                {loading ? "Logging..." : "Log Injury"}
            </Button>
        </form>
    );
}
