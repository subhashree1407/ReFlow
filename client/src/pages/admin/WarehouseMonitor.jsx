import { useState, useEffect } from 'react';
import API from '../../api';

export default function WarehouseMonitor() {
    const [stats, setStats] = useState({ warehouses: [] });

    useEffect(() => {
        API.get('/warehouses/stats').then(res => setStats(res.data)).catch(() => { });
    }, []);

    const statusColor = { active: 'bg-green-100 text-green-700', maintenance: 'bg-amber-100 text-amber-700', full: 'bg-red-100 text-red-700' };

    return (
        <div className="space-y-8">
            <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Warehouse Studio</p>
                <h1 className="text-3xl font-display text-slate-900">Warehouse monitoring</h1>
                <p className="text-slate-500 mt-2">Track capacity, inspection load, and local pool readiness.</p>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                    { label: 'Total Warehouses', value: stats.totalWarehouses || 0, icon: '🏭' },
                    { label: 'Active', value: stats.activeWarehouses || 0, icon: '✅' },
                    { label: 'Utilization', value: `${stats.utilizationRate || 0}%`, icon: '📊' },
                    { label: 'Pending Inspection', value: stats.pendingInspection || 0, icon: '🔍' },
                    { label: 'Local Pool Items', value: stats.localPoolItems || 0, icon: '🎯' },
                ].map(s => (
                    <div key={s.label} className="stat-card surface-soft p-4 text-center">
                        <span className="text-2xl">{s.icon}</span>
                        <p className="text-xl font-bold text-slate-800 mt-2">{s.value}</p>
                        <p className="text-xs text-slate-500">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Warehouse Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stats.warehouses?.map(wh => (
                    <div key={wh._id} className="surface-card p-5 hover:shadow-md transition">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <h3 className="font-semibold text-slate-800">{wh.name}</h3>
                                <p className="text-xs text-slate-400">Code: {wh.code}</p>
                            </div>
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor[wh.status]}`}>{wh.status}</span>
                        </div>

                        {/* Capacity Bar */}
                        <div className="mb-3">
                            <div className="flex justify-between text-xs text-slate-500 mb-1">
                                <span>Capacity</span>
                                <span>{wh.currentLoad}/{wh.capacity} ({wh.loadPercentage}%)</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-3">
                                <div className={`h-3 rounded-full progress-bar-fill ${wh.loadPercentage > 80 ? 'bg-red-500' : wh.loadPercentage > 60 ? 'bg-amber-500' : 'bg-indigo-500'}`}
                                    style={{ width: `${wh.loadPercentage}%` }}></div>
                            </div>
                        </div>

                        {/* Demand Score */}
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500">Demand Score</span>
                            <div className="flex items-center gap-2">
                                <div className="w-20 bg-slate-100 rounded-full h-2">
                                    <div className="h-2 rounded-full bg-purple-500 progress-bar-fill" style={{ width: `${wh.demandScore}%` }}></div>
                                </div>
                                <span className="text-xs font-medium text-slate-700">{wh.demandScore}</span>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-1 text-xs text-slate-400">
                            <span>📍</span>
                            <span>{wh.location.lat.toFixed(4)}, {wh.location.lng.toFixed(4)}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
