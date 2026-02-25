import { useState, useEffect } from 'react';
import API from '../../api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Package, RotateCcw, Factory, DollarSign, Zap, Navigation, Clock, Activity, Target, Truck } from 'lucide-react';

const COLORS = ['#6366f1', '#a855f7', '#10b981', '#f59e0b', '#3b82f6'];

export default function AdminDashboard() {
    const [overview, setOverview] = useState({});
    const [costData, setCostData] = useState({});
    const [deliveryData, setDeliveryData] = useState({});
    const [warehouseStats, setWarehouseStats] = useState({});
    const [returns, setReturns] = useState([]);
    const [co2Data, setCo2Data] = useState({});
    const [demoSimulating, setDemoSimulating] = useState(false);
    const [demoResult, setDemoResult] = useState(null);

    const fetchData = () => {
        API.get('/analytics/overview').then(res => setOverview(res.data)).catch(() => { });
        API.get('/analytics/cost-savings').then(res => setCostData(res.data)).catch(() => { });
        API.get('/analytics/delivery-optimization').then(res => setDeliveryData(res.data)).catch(() => { });
        API.get('/warehouses/stats').then(res => setWarehouseStats(res.data)).catch(() => { });
        API.get('/returns').then(res => setReturns(res.data)).catch(() => { });
        API.get('/analytics/co2-savings').then(res => setCo2Data(res.data)).catch(() => { });
    };

    useEffect(() => {
        fetchData();
    }, []);

    const runSimulation = async () => {
        setDemoSimulating(true);
        setDemoResult(null);
        try {
            const res = await API.post('/demo/simulate');
            setDemoResult(res.data);
            fetchData();
        } catch (error) {
            alert('Simulation failed: ' + (error.response?.data?.message || error.message));
        } finally {
            setDemoSimulating(false);
        }
    };

    const pieData = [
        { name: 'Local Pool', value: overview.localFulfillments || 0 },
        { name: 'Remote Hub', value: (overview.totalOrders || 0) - (overview.localFulfillments || 0) },
    ];

    return (
        <div className="space-y-8 animate-fadeIn">
            <div>
                <p className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-1">Command Center</p>
                <h1 className="text-3xl font-display text-white tracking-tight">Operational Intelligence</h1>
                <p className="text-slate-400 mt-2 text-sm max-w-2xl leading-relaxed">
                    Monitor global supply chain volume, regional node load, and financial efficiency across the entire network in real-time.
                </p>
            </div>

            {/* Top Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                    { label: 'Total Volume', value: overview.totalOrders || 0, icon: Package, color: 'text-indigo-400', bg: 'bg-indigo-500/10', sub: `${overview.localFulfillmentRate || 0}% locally sourced` },
                    { label: 'Active Returns', value: overview.pendingReturns || 0, icon: RotateCcw, color: 'text-amber-400', bg: 'bg-amber-500/10', sub: `${overview.processingReturns || 0} in inspection` },
                    { label: 'Network Nodes', value: warehouseStats.totalWarehouses || 0, icon: Factory, color: 'text-emerald-400', bg: 'bg-emerald-500/10', sub: `${warehouseStats.utilizationRate || 0}% total utilization` },
                    { label: 'OPEX Saved', value: `₹${costData.totalCostSaved || 0}`, icon: DollarSign, color: 'text-green-400', bg: 'bg-green-500/10', sub: `Avg ₹${costData.avgCostSavedPerOrder || 0} / order` },
                ].map(s => {
                    const Icon = s.icon;
                    return (
                        <div key={s.label} className="stat-card group">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 rounded-2xl ${s.bg} border border-slate-700/50 flex items-center justify-center group-hover:bg-slate-800 transition-colors`}>
                                    <Icon className={`w-6 h-6 ${s.color}`} />
                                </div>
                            </div>
                            <p className="text-4xl font-bold text-white mb-1">{s.value}</p>
                            <p className="text-sm text-slate-400 font-medium mb-1">{s.label}</p>
                            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{s.sub}</p>
                        </div>
                    );
                })}
            </div>

            {/* Sustainability & Simulation Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* CO2 Emissions */}
                <div className="surface-card p-6 border-l-4 border-emerald-500">
                    <div className="flex items-center gap-3 mb-6">
                        <Zap className="w-5 h-5 text-emerald-400" />
                        <h3 className="text-lg font-semibold text-white">CO₂ Reduction Tracker</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-slate-700/50 pb-4">
                            <span className="text-sm font-medium text-slate-400">Total CO₂ Saved</span>
                            <span className="text-2xl font-bold text-emerald-400">{co2Data.totalCO2Saved || 0} <span className="text-sm">kg</span></span>
                        </div>
                        <div className="flex justify-between items-center border-b border-slate-700/50 pb-4">
                            <span className="text-sm font-medium text-slate-400">Equiv. Trees Planted</span>
                            <span className="text-2xl font-bold text-emerald-400">{co2Data.treesEquivalent || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-slate-400">Logistics Distance Reduced</span>
                            <span className="text-2xl font-bold text-emerald-400">{co2Data.totalDistanceReduced || 0} <span className="text-sm">km</span></span>
                        </div>
                    </div>
                </div>

                {/* Demo Simulation Panel */}
                <div className="lg:col-span-2 surface-card p-6 border border-indigo-500/30 overflow-hidden relative">
                    <div className="flex items-center justify-between mb-4 relative z-10">
                        <div className="flex items-center gap-3">
                            <Activity className="w-5 h-5 text-indigo-400" />
                            <h3 className="text-lg font-semibold text-white">HyperLocal Sandbox Simulation</h3>
                        </div>
                        <button
                            onClick={runSimulation}
                            disabled={demoSimulating}
                            className={`btn-primary shadow-[0_0_15px_rgba(99,102,241,0.5)] text-sm px-5 py-2 whitespace-nowrap ${demoSimulating ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {demoSimulating ? 'Simulating...' : 'Run Demo Simulation'}
                        </button>
                    </div>

                    {!demoResult && !demoSimulating && (
                        <div className="flex flex-col items-center justify-center py-6 text-slate-500 relative z-10">
                            <p className="text-sm font-medium text-center">Trigger a simulation to demonstrate the end-to-end</p>
                            <p className="text-sm font-medium text-center mb-2">Order → Return → Inspection → Relabel → Local Dispatch flow.</p>
                        </div>
                    )}

                    {demoSimulating && (
                        <div className="flex items-center justify-center py-10 relative z-10">
                            <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                            <span className="ml-3 text-indigo-400 font-semibold animate-pulse">Running Neural Logistics Engine...</span>
                        </div>
                    )}

                    {demoResult && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 animate-fadeIn">
                            {/* Timeline */}
                            <div className="relative border-l border-indigo-500/30 ml-4 pl-4 space-y-4 max-h-[160px] overflow-y-auto custom-scrollbar">
                                {demoResult.demoRecord.timeline.map((step, idx) => (
                                    <div key={idx} className="relative">
                                        <div className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]"></div>
                                        <p className="text-xs font-bold text-white uppercase tracking-wider mb-0.5">{step.status}</p>
                                        <p className="text-[11px] text-slate-400">{step.note}</p>
                                    </div>
                                ))}
                            </div>
                            {/* Metrics Output */}
                            <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-700/50">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-700/50 pb-2">Simulation Metrics</p>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center bg-slate-800/50 p-2 rounded">
                                        <span className="text-xs text-slate-400">Nearest Inv Found:</span>
                                        <span className="text-xs font-bold text-white">{demoResult.metrics.delhiWH}</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-slate-800/50 p-2 rounded">
                                        <span className="text-xs text-slate-400">Mode:</span>
                                        <span className="text-xs font-bold text-indigo-400 capitalize whitespace-nowrap">Local Re-Fulfillment</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-slate-800/50 p-2 rounded">
                                        <span className="text-xs text-slate-400">Time Saved:</span>
                                        <span className="text-xs font-bold text-emerald-400">{demoResult.metrics.timeSaved}</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-slate-800/50 p-2 rounded">
                                        <span className="text-xs text-slate-400">Logistics Edge:</span>
                                        <span className="text-xs font-bold text-green-400">{demoResult.metrics.co2Saved}kg CO₂ Avoided</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Monthly Cost Savings */}
                <div className="lg:col-span-2 surface-card p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Activity className="w-5 h-5 text-indigo-400" />
                        <h3 className="text-lg font-semibold text-white">Monthly Logistics Savings (₹)</h3>
                    </div>
                    <div className="h-[280px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={costData.monthlySavings || []}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis dataKey="month" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                                <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                                <Tooltip cursor={{ fill: '#1e293b', opacity: 0.4 }} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#fff' }} />
                                <Bar dataKey="savings" fill="url(#colorSavings)" radius={[6, 6, 0, 0]} />
                                <defs>
                                    <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={1} />
                                        <stop offset="95%" stopColor="#818cf8" stopOpacity={0.6} />
                                    </linearGradient>
                                </defs>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Fulfillment Source Pie */}
                <div className="surface-card p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Target className="w-5 h-5 text-indigo-400" />
                        <h3 className="text-lg font-semibold text-white">Fulfillment Matrix</h3>
                    </div>
                    <div className="h-[250px] flex items-center justify-center relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%" cy="50%"
                                    innerRadius={65}
                                    outerRadius={90}
                                    paddingAngle={8}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#fff' }} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-2xl font-bold text-white">{overview.totalOrders || 0}</span>
                            <span className="text-xs text-slate-500 uppercase font-semibold">Total</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delivery Time & Warehouse Load */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Weekly Delivery Trend */}
                <div className="surface-card p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <Truck className="w-5 h-5 text-indigo-400" />
                        <h3 className="text-lg font-semibold text-white">Delivery Velocity Trend</h3>
                    </div>
                    <p className="text-xs text-slate-400 mb-6 font-medium">Local node vs Remote hub efficiency</p>
                    <div className="h-[220px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={deliveryData.weeklyTrend || []}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis dataKey="day" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                                <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#fff' }} />
                                <Line type="monotone" dataKey="localDeliveries" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} name="Local Node" />
                                <Line type="monotone" dataKey="remoteDeliveries" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} name="Remote Hub" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Warehouse Load */}
                <div className="surface-card p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Factory className="w-5 h-5 text-indigo-400" />
                        <h3 className="text-lg font-semibold text-white">Node Capacity Utilization</h3>
                    </div>
                    <div className="space-y-5 custom-scrollbar overflow-y-auto max-h-[220px] pr-2">
                        {(warehouseStats.warehouses || []).map(wh => (
                            <div key={wh._id} className="group">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-semibold text-slate-200">{wh.name}</span>
                                    <span className="text-[11px] font-bold text-slate-400 tracking-wider">
                                        <span className="text-white">{wh.currentLoad}</span> / {wh.capacity} ({wh.loadPercentage}%)
                                    </span>
                                </div>
                                <div className="w-full bg-slate-800 rounded-full h-2">
                                    <div className={`h-2 rounded-full progress-bar-fill ${wh.loadPercentage > 85 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' :
                                        wh.loadPercentage > 65 ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' :
                                            'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]'
                                        }`}
                                        style={{ width: `${wh.loadPercentage}%` }}>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Delivery Time Comparison */}
            <div className="surface-card overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 text-indigo-400 mb-2">
                            <Zap className="w-5 h-5" />
                            <h3 className="font-bold text-lg text-white">Velocity Engine Metrics</h3>
                        </div>
                        <p className="text-sm text-slate-400">Time saved globally through intelligent local routing vs standard paths.</p>
                    </div>
                    <div className="flex gap-8">
                        <div>
                            <p className="text-3xl font-display font-bold text-white mb-1">{deliveryData.avgLocalDeliveryTime || 0}<span className="text-lg text-slate-500">h</span></p>
                            <p className="text-xs text-indigo-300 font-semibold uppercase tracking-wider">Local Avg</p>
                        </div>
                        <div>
                            <p className="text-3xl font-display font-bold text-slate-300 mb-1">{deliveryData.avgRemoteDeliveryTime || 0}<span className="text-lg text-slate-500">h</span></p>
                            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Hub Avg</p>
                        </div>
                        <div className="pl-6 border-l border-slate-700/50">
                            <p className="text-3xl font-display font-bold text-emerald-400 mb-1">{deliveryData.timeReduction || '0%'}</p>
                            <p className="text-xs text-emerald-500/70 font-semibold uppercase tracking-wider">Velocity Gain</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Return Requests */}
            <div className="surface-card overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-800/60 bg-slate-900/30 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-semibold text-white">Live Logistics Routing</h3>
                        <p className="text-xs text-slate-400 mt-1 font-medium">Monitoring active reverse logistics and inspection pipelines.</p>
                    </div>
                    <span className="badge badge-info"><Clock className="w-3 h-3" /> Real-time</span>
                </div>

                <div className="divide-y divide-slate-800/60 custom-scrollbar max-h-[600px] overflow-y-auto">
                    {returns.slice(0, 10).map(ret => (
                        <div key={ret._id} className="p-6 hover:bg-slate-800/20 transition-colors">
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex flex-shrink-0 items-center justify-center mt-1 text-xl object-cover overflow-hidden">
                                        {ret.product?.image ? <img src={ret.product.image} alt="" className="w-full h-full object-cover" /> : <Package className="w-5 h-5 text-indigo-400" />}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-200">
                                            <span className="font-mono text-indigo-400 text-xs mr-2">#{ret.returnNumber?.substring(0, 8).toUpperCase()}</span>
                                            {ret.product?.name || 'Automated Logistics Item'}
                                        </p>
                                        <div className="flex gap-2 mt-1.5 flex-wrap">
                                            <span className="badge badge-neutral text-[10px]">{ret.category}</span>
                                            {ret.returnScore !== undefined && (
                                                <span className={`badge ${ret.returnScore > 70 ? 'badge-success' : ret.returnScore >= 40 ? 'badge-warning' : 'badge-danger'} text-[10px]`}>
                                                    Score: {ret.returnScore}
                                                </span>
                                            )}
                                            {ret.approvalStatus === 'approved' ? (
                                                <span className="badge badge-success text-[10px]">Approved</span>
                                            ) : (
                                                <span className="badge badge-warning text-[10px]">Pending Approval</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col md:items-end gap-1">
                                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                                        <Factory className="w-3.5 h-3.5 text-slate-500" />
                                        {ret.assignedWarehouse?.name || 'Awaiting Routing'}
                                    </div>
                                    {ret.inspectionResult ? (
                                        <span className={`badge ${ret.inspectionResult === 'passed' ? 'badge-success' : 'badge-danger'} text-[10px] mt-1`}>
                                            Insp: {ret.inspectionResult}
                                        </span>
                                    ) : (
                                        <span className="badge badge-neutral text-[10px] mt-1">Pending Inspection</span>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-semibold text-slate-800 text-sm mb-2">Origin</h4>
                                    <p className="text-slate-600 text-xs">{ret.originalDeliveryLocation?.address || 'N/A'}</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-semibold text-slate-800 text-sm mb-2">Pickup Target</h4>
                                    <p className="text-slate-600 text-xs">{ret.returnPickupLocation?.address || 'N/A'}</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-semibold text-slate-800 text-sm mb-2">Dest Node</h4>
                                    <p className="text-slate-600 text-xs">{ret.assignedWarehouse?.address || 'N/A'}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 text-xs mt-4 pt-4 border-t border-slate-800/40">
                                <span className="flex items-center gap-1.5 text-slate-400 font-medium">
                                    <Navigation className="w-3 h-3" />
                                    Route Distance: <span className="text-white font-bold">{ret.distanceBetweenLocations || 0} km</span>
                                </span>
                                <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                                    <Zap className="w-3 h-3" />
                                    Routing Saved: <span className="font-bold">{ret.distanceSaved || 0} km</span>
                                </span>
                            </div>
                        </div>
                    ))}
                    {returns.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-16 text-slate-500">
                            <Activity className="w-12 h-12 mb-4 opacity-20" />
                            <p className="text-sm font-medium">Network is entirely stable. No active return pipelines.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
