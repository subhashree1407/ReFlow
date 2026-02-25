import { useState, useEffect } from 'react';
import API from '../../api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

export default function SmartDispatch() {
    const [warehouses, setWarehouses] = useState([]);
    const [heatmap, setHeatmap] = useState([]);
    const [deliveryData, setDeliveryData] = useState({});

    useEffect(() => {
        API.get('/warehouses').then(res => setWarehouses(res.data)).catch(() => { });
        API.get('/analytics/demand-heatmap').then(res => setHeatmap(res.data)).catch(() => { });
        API.get('/analytics/delivery-optimization').then(res => setDeliveryData(res.data)).catch(() => { });
    }, []);

    const radarData = heatmap.map(wh => ({
        warehouse: wh.name.split(' ')[0],
        demand: wh.demandScore,
        load: Math.round((wh.currentLoad / wh.capacity) * 100),
    }));

    return (
        <div className="space-y-8">
            <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Dispatch Studio</p>
                <h1 className="text-3xl font-display text-slate-900">Smart dispatch monitor</h1>
                <p className="text-slate-500 mt-2">Intelligent routing, demand heatmap, and delivery optimization.</p>
            </div>

            {/* Dispatch Engine Info */}
            <div className="surface-card p-6" style={{ backgroundColor: 'var(--ink-900)', color: '#fff' }}>
                <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">🚀</span>
                    <h3 className="text-lg font-bold">Smart Dispatch Engine</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
                        <p className="text-2xl font-bold">{deliveryData.avgLocalDeliveryTime || 4.2}h</p>
                        <p className="text-slate-300 text-sm">Local Delivery Avg</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
                        <p className="text-2xl font-bold">{deliveryData.avgRemoteDeliveryTime || 18.5}h</p>
                        <p className="text-slate-300 text-sm">Remote Delivery Avg</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
                        <p className="text-2xl font-bold">{deliveryData.timeReduction || '77%'}</p>
                        <p className="text-slate-300 text-sm">Average Time Saved</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Demand Heatmap */}
                <div className="surface-card p-5">
                    <h3 className="font-semibold text-slate-800 mb-4">Warehouse Demand Heatmap</h3>
                    <div className="space-y-3">
                        {heatmap.map(wh => {
                            const heatColor = wh.demandScore > 85 ? 'bg-red-500' : wh.demandScore > 70 ? 'bg-orange-500' : wh.demandScore > 50 ? 'bg-amber-500' : 'bg-green-500';
                            return (
                                <div key={wh.warehouseId} className="flex items-center gap-3">
                                    <div className={`w-4 h-4 rounded ${heatColor}`}></div>
                                    <div className="flex-1">
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm font-medium text-slate-700">{wh.name}</span>
                                            <span className="text-xs text-slate-400">Score: {wh.demandScore}</span>
                                        </div>
                                        <div className="w-full bg-slate-100 rounded-full h-2">
                                            <div className={`h-2 rounded-full progress-bar-fill ${heatColor}`} style={{ width: `${wh.demandScore}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Radar Chart */}
                <div className="surface-card p-5">
                    <h3 className="font-semibold text-slate-800 mb-4">Demand vs Load Analysis</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <RadarChart data={radarData}>
                            <PolarGrid stroke="#e2e8f0" />
                            <PolarAngleAxis dataKey="warehouse" tick={{ fontSize: 11 }} />
                            <PolarRadiusAxis tick={{ fontSize: 10 }} />
                            <Radar name="Demand" dataKey="demand" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
                            <Radar name="Load %" dataKey="load" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} />
                            <Tooltip />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Delivery Comparison */}
            <div className="surface-card p-5">
                <h3 className="font-semibold text-slate-800 mb-4">Delivery Time Comparison</h3>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={deliveryData.deliveryComparison || []} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis type="number" tick={{ fontSize: 12 }} label={{ value: 'Hours', position: 'insideBottom', offset: -5 }} />
                        <YAxis dataKey="label" type="category" tick={{ fontSize: 12 }} width={120} />
                        <Tooltip />
                        <Bar dataKey="hours" radius={[0, 4, 4, 0]}>
                            {(deliveryData.deliveryComparison || []).map((entry, i) => (
                                <rect key={i} fill={i === 0 ? '#6366f1' : '#f59e0b'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Nearest Warehouse Table */}
            <div className="surface-card">
                <div className="px-5 py-4 border-b border-slate-100">
                    <h3 className="font-semibold text-slate-800">Warehouse Network</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-slate-500 border-b border-slate-100">
                                <th className="px-5 py-3 font-medium">Warehouse</th>
                                <th className="px-5 py-3 font-medium">Code</th>
                                <th className="px-5 py-3 font-medium">Location</th>
                                <th className="px-5 py-3 font-medium">Status</th>
                                <th className="px-5 py-3 font-medium">Load</th>
                            </tr>
                        </thead>
                        <tbody>
                            {warehouses.map(wh => (
                                <tr key={wh._id} className="border-b border-slate-50 hover:bg-slate-50 transition">
                                    <td className="px-5 py-3 font-medium text-slate-700">{wh.name}</td>
                                    <td className="px-5 py-3 text-indigo-600 font-mono text-xs">{wh.code}</td>
                                    <td className="px-5 py-3 text-xs text-slate-500">{wh.location.lat.toFixed(3)}, {wh.location.lng.toFixed(3)}</td>
                                    <td className="px-5 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${wh.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{wh.status}</span></td>
                                    <td className="px-5 py-3 text-slate-600">{wh.currentLoad}/{wh.capacity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
