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
        <div className="bg-white rounded-xl p-4">
            <p className="text-sm text-gray-500 mb-2">
                Weekly Body Weight
            </p>

            <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <XAxis dataKey="week" />
                        <YAxis domain={["dataMin - 1", "dataMax + 1"]} />
                        <Tooltip />
                        <Line
                            type="monotone"
                            dataKey="weight"
                            stroke="#16a34a"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
