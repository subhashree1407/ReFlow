import { useState, useEffect } from 'react';
import API from '../../api';
import { Package, Target, Factory, Filter, CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';

export default function InventoryPanel() {
    const [inventory, setInventory] = useState([]);
    const [filter, setFilter] = useState({ warehouse: '', localOnly: false });
    const [warehouses, setWarehouses] = useState([]);

    useEffect(() => {
        API.get('/warehouses').then(res => setWarehouses(res.data)).catch(() => { });
        loadInventory();
    }, []);

    const loadInventory = () => {
        const params = new URLSearchParams();
        if (filter.warehouse) params.set('warehouse', filter.warehouse);
        if (filter.localOnly) params.set('isLocalPool', 'true');
        API.get(`/inventory?${params}`).then(res => setInventory(res.data)).catch(() => { });
    };

    useEffect(() => { loadInventory(); }, [filter]);

    const localCount = inventory.filter(i => i.isLocalPool).length;
    const originalCount = inventory.filter(i => !i.isLocalPool).length;

    const getStatusBadge = (status) => {
        switch (status) {
            case 'passed':
            case 'done': return <span className="badge badge-success"><CheckCircle2 className="w-3 h-3" /> {status}</span>;
            case 'failed': return <span className="badge badge-danger"><XCircle className="w-3 h-3" /> {status}</span>;
            case 'in-progress':
            case 'inspecting': return <span className="badge badge-info"><Clock className="w-3 h-3" /> {status}</span>;
            case 'pending': return <span className="badge badge-warning"><AlertCircle className="w-3 h-3" /> {status}</span>;
            default: return <span className="badge badge-neutral">{status}</span>;
        }
    };

    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <p className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-1">Inventory Studio</p>
                    <h1 className="text-3xl font-display text-white tracking-tight">Warehouse Analytics</h1>
                    <p className="text-slate-400 mt-2 text-sm max-w-xl leading-relaxed">
                        Monitor active stock across local pools and origin warehouses. Track inspection pipelines and real-time repackaging status.
                    </p>
                </div>

                <div className="flex flex-wrap gap-3 items-center bg-slate-900/50 p-1.5 rounded-xl border border-slate-800">
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <select
                            value={filter.warehouse}
                            onChange={e => setFilter({ ...filter, warehouse: e.target.value })}
                            className="appearance-none bg-slate-800 text-slate-200 text-sm font-medium py-2 pl-9 pr-8 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all cursor-pointer"
                        >
                            <option value="">All Warehouses</option>
                            {warehouses.map(wh => <option key={wh._id} value={wh._id}>{wh.name}</option>)}
                        </select>
                    </div>
                    <button
                        onClick={() => setFilter({ ...filter, localOnly: !filter.localOnly })}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter.localOnly
                                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 border border-indigo-400'
                                : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white'
                            }`}
                    >
                        <Target className="w-4 h-4" />
                        Local Pool Only
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="stat-card">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center">
                            <Package className="w-6 h-6 text-slate-300" />
                        </div>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">Total</span>
                    </div>
                    <p className="text-4xl font-bold text-white mb-1">{inventory.length}</p>
                    <p className="text-sm text-slate-400 font-medium">Items in network</p>
                </div>

                <div className="stat-card group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
                            <Target className="w-6 h-6 text-indigo-400" />
                        </div>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">+12%</span>
                    </div>
                    <p className="text-4xl font-bold text-white mb-1">{localCount}</p>
                    <p className="text-sm text-indigo-300/70 font-medium">Local pool accelerated</p>
                </div>

                <div className="stat-card">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center">
                            <Factory className="w-6 h-6 text-slate-400" />
                        </div>
                    </div>
                    <p className="text-4xl font-bold text-white mb-1">{originalCount}</p>
                    <p className="text-sm text-slate-400 font-medium">Standard fulfillment</p>
                </div>
            </div>

            {/* Inventory Data Table */}
            <div className="surface-card overflow-hidden">
                <div className="p-5 border-b border-slate-800/60 bg-slate-900/30 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white">Live Inventory Feed</h3>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-dot"></span>
                        <span className="text-xs font-medium text-slate-400">Syncing real-time</span>
                    </div>
                </div>

                <div className="overflow-x-auto custom-scrollbar pb-2">
                    <table className="modern-table">
                        <thead>
                            <tr>
                                <th>Product Details</th>
                                <th>Location</th>
                                <th>Quantity</th>
                                <th>Condition</th>
                                <th>Inspection</th>
                                <th>Repackaging</th>
                                <th>Routing</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventory.slice(0, 50).map(item => (
                                <tr key={item._id} className="group">
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xl shadow-inner object-cover overflow-hidden">
                                                {item.product?.image && item.product.image.length > 2 ? (
                                                    <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span>📦</span>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-200 truncate max-w-[180px]">{item.product?.name || 'Unknown Product'}</p>
                                                <p className="text-xs text-slate-500 font-mono mt-0.5">{item.product?.sku || 'SKU-00000'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-2 text-slate-300 font-medium">
                                            <Factory className="w-3.5 h-3.5 text-slate-500" />
                                            {item.warehouse?.name || 'Unassigned'}
                                        </div>
                                    </td>
                                    <td>
                                        <span className="inline-flex items-center justify-center min-w-[32px] px-2 py-1 rounded-lg bg-slate-800 border border-slate-700 text-sm font-bold text-white">
                                            {item.quantity}
                                        </span>
                                    </td>
                                    <td className="capitalize text-slate-300 font-medium">{item.condition}</td>
                                    <td>{getStatusBadge(item.inspectionStatus)}</td>
                                    <td>{getStatusBadge(item.repackagingStatus)}</td>
                                    <td>
                                        {item.isLocalPool ? (
                                            <span className="flex items-center gap-1.5 text-indigo-400 text-xs font-bold">
                                                <Target className="w-3.5 h-3.5" /> Fast-Track
                                            </span>
                                        ) : (
                                            <span className="text-slate-500 text-xs font-medium">Standard</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {inventory.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-16 text-slate-500">
                            <Box className="w-12 h-12 mb-4 opacity-20" />
                            <p className="text-sm font-medium">No inventory items found matching your filters</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
