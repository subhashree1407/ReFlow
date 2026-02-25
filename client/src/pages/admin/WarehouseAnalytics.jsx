import { useState, useEffect } from 'react';
import API from '../../api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';

export default function WarehouseAnalytics() {
    const [costData, setCostData] = useState({});
    const [deliveryData, setDeliveryData] = useState({});
    const [overview, setOverview] = useState({});

    useEffect(() => {
        API.get('/analytics/cost-savings').then(res => setCostData(res.data)).catch(() => { });
        API.get('/analytics/delivery-optimization').then(res => setDeliveryData(res.data)).catch(() => { });
        API.get('/analytics/overview').then(res => setOverview(res.data)).catch(() => { });
    }, []);

    return (
        <div className="space-y-8">
            <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Analytics Studio</p>
                <h1 className="text-3xl font-display text-slate-900">Warehouse analytics</h1>
                <p className="text-slate-500 mt-2">Cost savings, delivery optimization, and return performance signals.</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Cost Saved', value: `₹${costData.totalCostSaved || 0}`, icon: '💰', desc: `₹${costData.avgCostSavedPerOrder || 0} avg/order`, color: 'from-green-500 to-emerald-500' },
                    { label: 'Total Time Saved', value: `${costData.totalTimeSaved || 0}h`, icon: '⏱️', desc: `${costData.avgTimeSavedPerOrder || 0}h avg/order`, color: 'from-blue-500 to-cyan-500' },
                    { label: 'Local Fulfillment Rate', value: `${costData.localFulfillmentRate || 0}%`, icon: '🎯', desc: `${costData.localFulfillmentCount || 0} orders`, color: 'from-indigo-500 to-purple-500' },
                    { label: 'Processing Returns', value: overview.processingReturns || 0, icon: '🔄', desc: `${overview.pendingReturns || 0} pending`, color: 'from-amber-500 to-orange-500' },
                ].map(s => (
                    <div key={s.label} className="stat-card surface-soft p-5">
                        <span className={`inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br ${s.color} text-white text-lg mb-3`}>{s.icon}</span>
                        <p className="text-2xl font-bold text-slate-800">{s.value}</p>
                        <p className="text-sm text-slate-500">{s.label}</p>
                        <p className="text-xs text-slate-400 mt-1">{s.desc}</p>
                    </div>
                ))}
            </div>

            {/* Cost Savings Chart */}
            <div className="surface-card p-5">
                <h3 className="font-semibold text-slate-800 mb-4">Monthly Cost Savings Trend (₹)</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={costData.monthlySavings || []}>
                        <defs>
                            <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Area type="monotone" dataKey="savings" stroke="#6366f1" strokeWidth={2} fill="url(#colorSavings)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Delivery Trend */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="surface-card p-5">
                    <h3 className="font-semibold text-slate-800 mb-4">Weekly Delivery Performance</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={deliveryData.weeklyTrend || []}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Line type="monotone" dataKey="localDeliveries" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} name="Local" />
                            <Line type="monotone" dataKey="remoteDeliveries" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} name="Remote" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Savings Breakdown */}
                <div className="surface-card p-5">
                    <h3 className="font-semibold text-slate-800 mb-4">Savings Breakdown</h3>
                    <div className="space-y-4">
                        <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-green-800">Shipping Cost Reduction</span>
                                <span className="text-lg font-bold text-green-700">₹{costData.totalCostSaved || 0}</span>
                            </div>
                            <div className="w-full bg-green-200 rounded-full h-2">
                                <div className="h-2 rounded-full bg-green-600 progress-bar-fill" style={{ width: '72%' }}></div>
                            </div>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-blue-800">Delivery Time Optimization</span>
                                <span className="text-lg font-bold text-blue-700">{deliveryData.timeReduction || '77%'}</span>
                            </div>
                            <div className="w-full bg-blue-200 rounded-full h-2">
                                <div className="h-2 rounded-full bg-blue-600 progress-bar-fill" style={{ width: '77%' }}></div>
                            </div>
                        </div>
                        <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-purple-800">Carbon Footprint Reduction</span>
                                <span className="text-lg font-bold text-purple-700">~45%</span>
                            </div>
                            <div className="w-full bg-purple-200 rounded-full h-2">
                                <div className="h-2 rounded-full bg-purple-600 progress-bar-fill" style={{ width: '45%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Insights Banner */}
            <div className="surface-card p-6" style={{ backgroundColor: 'var(--ink-900)', color: '#fff' }}>
                <h3 className="font-bold text-lg mb-3">💡 Key Insights</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-white/5 rounded-lg p-4 backdrop-blur">
                        <p className="text-slate-300 mb-1">Most Efficient Route</p>
                        <p className="font-semibold">Delhi Hub → Noida</p>
                        <p className="text-xs text-slate-400 mt-1">15km avg, 0.4h delivery</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 backdrop-blur">
                        <p className="text-slate-300 mb-1">Highest Demand Zone</p>
                        <p className="font-semibold">Mumbai Central</p>
                        <p className="text-xs text-slate-400 mt-1">Demand score: 95</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 backdrop-blur">
                        <p className="text-slate-300 mb-1">Best Local Pool Rate</p>
                        <p className="font-semibold">Gurgaon Warehouse</p>
                        <p className="text-xs text-slate-400 mt-1">68% return reuse rate</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
