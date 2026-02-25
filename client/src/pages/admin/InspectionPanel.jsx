import { useState, useEffect } from 'react';
import API from '../../api';

export default function InspectionPanel() {
    const [returns, setReturns] = useState([]);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        loadReturns();
    }, []);

    const loadReturns = () => {
        API.get('/returns').then(res => {
            setReturns(res.data.filter(r => ['received', 'inspecting', 'repackaging', 'in-local-pool', 'sent-back', 'rejected'].includes(r.status)));
        }).catch(() => { });
    };

    const updateInspection = async (id, condition) => {
        try {
            await API.patch(`/returns/${id}/inspect`, { condition });
            loadReturns();
        } catch (err) { console.error(err); }
    };

    const filtered = filter === 'all' ? returns : returns.filter(r => {
        if (filter === 'pending') return r.inspectionResult === 'pending';
        return r.inspectionResult === filter;
    });

    const counts = {
        all: returns.length,
        pending: returns.filter(r => r.inspectionResult === 'pending').length,
        'Like New': returns.filter(r => r.inspectionResult === 'Like New').length,
        'Good': returns.filter(r => r.inspectionResult === 'Good').length,
        'Damaged': returns.filter(r => r.inspectionResult === 'Damaged').length,
        'Reject': returns.filter(r => r.inspectionResult === 'Reject').length,
    };

    const statusColors = {
        pending: 'bg-amber-100 text-amber-700',
        'Like New': 'bg-emerald-100 text-emerald-700',
        'Good': 'bg-blue-100 text-blue-700',
        'Damaged': 'bg-orange-100 text-orange-700',
        'Reject': 'bg-red-100 text-red-700'
    };

    return (
        <div className="space-y-8 animate-fadeIn">
            <div>
                <p className="text-xs uppercase tracking-[0.2em] text-indigo-400 font-bold mb-1">Inspection Studio</p>
                <h1 className="text-3xl font-display text-white tracking-tight">Condition Classification</h1>
                <p className="text-slate-400 mt-2 text-sm max-w-2xl">Classify condition of incoming returns to automatically route them for local resale, discount, or seller return.</p>
            </div>

            {/* Pipeline Overview */}
            <div className="flex gap-3 flex-wrap">
                {['all', 'pending', 'Like New', 'Good', 'Damaged', 'Reject'].map(f => (
                    <button key={f} onClick={() => setFilter(f)}
                        className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${filter === f ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]' : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'}`}>
                        {f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f]})
                    </button>
                ))}
            </div>

            {/* Inspection Items */}
            <div className="surface-card overflow-hidden">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="modern-table">
                        <thead>
                            <tr className="text-left text-slate-400">
                                <th>Return ID</th>
                                <th>Product Overview</th>
                                <th>Assigned Node</th>
                                <th>Condition</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(item => (
                                <tr key={item._id} className="group hover:bg-slate-800/30 transition-colors">
                                    <td className="font-mono text-indigo-400 text-xs font-semibold">
                                        #{item.returnNumber?.substring(0, 8).toUpperCase()}
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-slate-800 flex justify-center items-center object-cover overflow-hidden">
                                                {item.product?.image ? <img src={item.product?.image} className="w-full h-full object-cover" /> : '📦'}
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-200">{item.product?.name}</p>
                                                <p className="text-xs text-slate-500">SKU: {item.product?.sku}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="text-slate-400 font-medium text-sm">{item.assignedWarehouse?.name || 'N/A'}</td>
                                    <td>
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusColors[item.inspectionResult] || 'bg-slate-800 text-slate-400'}`}>
                                            {item.inspectionResult || 'Pending'}
                                        </span>
                                    </td>
                                    <td>
                                        {item.inspectionResult === 'pending' || item.inspectionResult === 'inspecting' ? (
                                            <div className="flex gap-2">
                                                <button onClick={() => updateInspection(item._id, 'Like New')}
                                                    className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-bold hover:bg-emerald-500 hover:text-white transition">Like New</button>
                                                <button onClick={() => updateInspection(item._id, 'Good')}
                                                    className="px-3 py-1.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg text-xs font-bold hover:bg-blue-500 hover:text-white transition">Good</button>
                                                <button onClick={() => updateInspection(item._id, 'Damaged')}
                                                    className="px-3 py-1.5 bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-lg text-xs font-bold hover:bg-orange-500 hover:text-white transition">Damaged</button>
                                                <button onClick={() => updateInspection(item._id, 'Reject')}
                                                    className="px-3 py-1.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-xs font-bold hover:bg-red-500 hover:text-white transition">Reject</button>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                                                ✓ Classified
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filtered.length === 0 && (
                        <div className="text-center py-16 text-slate-500 text-sm">
                            <p className="text-3xl mb-3">📦</p>
                            <p className="font-medium">No items in this category</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
