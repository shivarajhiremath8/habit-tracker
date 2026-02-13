import { useEffect, useRef, useState } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useAuth } from "../../hooks/useAuth";
import { getWeeklyWeights } from "../../services/weightService";

export default function WeightChart() {
    const { user } = useAuth();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        if (!user) return;

        async function load() {
            try {
                const rows = await getWeeklyWeights(user.id);
                setData(
                    rows.map((r) => ({
                        week: r.week_start.slice(5), // MM-DD
                        weight: Number(r.body_weight),
                    }))
                );
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [user]);

    // Delay chart mount to ensure container has dimensions
    useEffect(() => {
        if (loading || data.length === 0) return;
        const timer = setTimeout(() => setMounted(true), 50);
        return () => clearTimeout(timer);
    }, [loading, data]);

    if (loading) {
        return (
            <div className="bg-white dark:bg-white/[0.04] rounded-2xl p-4 text-sm text-gray-400">
                Loading weight chart...
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="bg-white dark:bg-white/[0.04] rounded-2xl p-4 text-sm text-gray-400">
                No weight data yet. Log weight on Mondays.
            </div>
        );
    }

    return (
        <div className="
            rounded-2xl p-5
            bg-white shadow-sm border border-gray-100
            dark:bg-white/[0.04] dark:backdrop-blur-xl dark:border-white/[0.08] dark:shadow-none
        ">
            <h3 className="text-sm font-bold text-black dark:text-gray-100 mb-4">
                Weekly Body Weight
            </h3>

            <div ref={containerRef} style={{ width: '100%', height: 256 }}>
                {mounted && (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="lineColor" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.8} />
                                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={1} />
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="week"
                                tickFormatter={(val) => {
                                    // val is "MM-DD". Append a dummy year to parse.
                                    // Or better, store full date in data?
                                    // Only showing month name if it changes could be complex.
                                    // Simple approach: Show Month Short Name.
                                    const [m, d] = val.split("-");
                                    const date = new Date(new Date().getFullYear(), parseInt(m) - 1, parseInt(d));
                                    return date.toLocaleString('default', { month: 'short' });
                                }}
                                tick={{ fontSize: 10, fill: '#9ca3af' }}
                                tickLine={false}
                                axisLine={false}
                                dy={10}
                                interval="preserveStartEnd"
                            />
                            <YAxis
                                domain={["dataMin - 1", "dataMax + 1"]}
                                tick={{ fontSize: 10, fill: '#9ca3af' }}
                                tickLine={false}
                                axisLine={false}
                                dx={-10}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'var(--surface)',
                                    borderColor: 'var(--border)',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                    color: 'var(--text-main)'
                                }}
                                itemStyle={{ fontSize: '12px', fontWeight: 600, color: 'var(--primary)' }}
                                labelStyle={{ color: 'var(--text-muted)' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="weight"
                                stroke="url(#lineColor)"
                                strokeWidth={3}
                                dot={{ r: 4, fill: 'var(--primary)', strokeWidth: 2, stroke: '#fff' }}
                                activeDot={{ r: 6, fill: 'var(--primary)' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}
