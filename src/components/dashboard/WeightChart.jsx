import { useEffect, useState } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useAuth } from "../../hooks/useAuth";
import { getWeeklyWeights } from "../../services/weightService";

export default function WeightChart() {
    const { user } = useAuth();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) {
        return (
            <div className="bg-white rounded-xl p-4 text-sm text-gray-500">
                Loading weight chart...
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="bg-white rounded-xl p-4 text-sm text-gray-500">
                No weight data yet. Log weight on Mondays.
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
                Weekly Body Weight
            </h3>

            <div className="h-48 w-full" style={{ minHeight: 192 }}>
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <LineChart data={data}>
                        <XAxis
                            dataKey="week"
                            tick={{ fontSize: 10, fill: '#9ca3af' }}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                        />
                        <YAxis
                            domain={["dataMin - 1", "dataMax + 1"]}
                            tick={{ fontSize: 10, fill: '#9ca3af' }}
                            tickLine={false}
                            axisLine={false}
                            dx={-10}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            itemStyle={{ fontSize: '12px', fontWeight: 600, color: '#16a34a' }}
                        />
                        <Line
                            type="monotone"
                            dataKey="weight"
                            stroke="#16a34a"
                            strokeWidth={3}
                            dot={{ r: 4, fill: '#16a34a', strokeWidth: 2, stroke: '#fff' }}
                            activeDot={{ r: 6, fill: '#16a34a' }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
