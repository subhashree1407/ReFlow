import { useState, useEffect } from 'react';
import API from '../../api';

export default function RepackagingPanel() {
    const [inventory, setInventory] = useState([]);

    useEffect(() => { loadData(); }, []);

    const loadData = () => {
        API.get('/inventory').then(res => {
            setInventory(res.data.filter(i => i.source === 'return' && i.inspectionStatus === 'passed'));
        }).catch(() => { });
    };

    const updateRepackaging = async (id, status) => {
        try {
            await API.patch(`/inventory/${id}/repackaging`, { repackagingStatus: status });
            loadData();
        } catch (err) { console.error(err); }
    };

    const statusColors = {
        'not-needed': 'bg-slate-100 text-slate-500', pending: 'bg-amber-100 text-amber-700',
        'in-progress': 'bg-blue-100 text-blue-700', done: 'bg-green-100 text-green-700'
    };

    const counts = {
        pending: inventory.filter(i => i.repackagingStatus === 'pending').length,
        'in-progress': inventory.filter(i => i.repackagingStatus === 'in-progress').length,
        done: inventory.filter(i => i.repackagingStatus === 'done').length,
    };

    return (
        <div className="space-y-8">
            <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Repackaging Studio</p>
                <h1 className="text-3xl font-display text-slate-900">Repackaging and labels</h1>
                <p className="text-slate-500 mt-2">Finalize inspected returns for local inventory release.</p>
            </div>

            {/* Status Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: 'Pending Repackaging', value: counts.pending, icon: '📋', color: 'border-amber-300 bg-amber-50' },
                    { label: 'In Progress', value: counts['in-progress'], icon: '🔧', color: 'border-blue-300 bg-blue-50' },
                    { label: 'Completed & Labeled', value: counts.done, icon: '✅', color: 'border-green-300 bg-green-50' },
                ].map(s => (
                    <div key={s.label} className={`stat-card rounded-xl p-5 border-2 ${s.color}`}>
                        <span className="text-2xl">{s.icon}</span>
                        <p className="text-2xl font-bold text-slate-800 mt-2">{s.value}</p>
                        <p className="text-sm text-slate-500">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Repackaging Pipeline */}
            <div className="surface-card p-5">
                <h3 className="font-semibold text-slate-800 mb-4">Repackaging → Label Generation Pipeline</h3>
                <div className="flex items-center gap-2 mb-6">
                    {['pending', 'in-progress', 'done'].map((step, i) => (
                        <div key={step} className="flex items-center flex-1">
                            <div className={`flex-1 text-center py-4 rounded-xl ${statusColors[step]} border`}>
                                <p className="text-xl font-bold">{counts[step]}</p>
                                <p className="text-xs font-medium capitalize mt-1">{step === 'done' ? 'Labeled ✓' : step.replace(/-/g, ' ')}</p>
                            </div>
                            {i < 2 && <span className="mx-1 text-slate-300 text-lg">→</span>}
                        </div>
                    ))}
                </div>
            </div>

            {/* Items Table */}
            <div className="surface-card">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-slate-500 border-b border-slate-100">
                                <th className="px-5 py-3 font-medium">Product</th>
                                <th className="px-5 py-3 font-medium">Warehouse</th>
                                <th className="px-5 py-3 font-medium">Condition</th>
                                <th className="px-5 py-3 font-medium">Repackaging Status</th>
                                <th className="px-5 py-3 font-medium">Label</th>
                                <th className="px-5 py-3 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventory.map(item => (
                                <tr key={item._id} className="border-b border-slate-50 hover:bg-slate-50 transition">
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-2">
                                            <span>{item.product?.image || '📦'}</span>
                                            <span className="font-medium text-slate-700">{item.product?.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3 text-slate-600">{item.warehouse?.name}</td>
                                    <td className="px-5 py-3 capitalize text-slate-600">{item.condition}</td>
                                    <td className="px-5 py-3">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[item.repackagingStatus]}`}>
                                            {item.repackagingStatus?.replace(/-/g, ' ')}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3">
                                        {item.labelGenerated ? (
                                            <span className="text-green-600 text-xs font-medium">🏷️ Generated</span>
                                        ) : (
                                            <span className="text-slate-400 text-xs">Pending</span>
                                        )}
                                    </td>
                                    <td className="px-5 py-3">
                                        {item.repackagingStatus === 'pending' && (
                                            <button onClick={() => updateRepackaging(item._id, 'in-progress')}
                                                className="px-2.5 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition">Start</button>
                                        )}
                                        {item.repackagingStatus === 'in-progress' && (
                                            <button onClick={() => updateRepackaging(item._id, 'done')}
                                                className="px-2.5 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition">Complete & Label</button>
                                        )}
                                        {item.repackagingStatus === 'done' && (
                                            <span className="text-xs text-green-600">✓ Ready</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {inventory.length === 0 && (
                        <div className="text-center py-10 text-slate-400 text-sm">No items awaiting repackaging</div>
                    )}
                </div>
            </div>
        </div>
    );
}
