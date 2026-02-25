import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../api';
import { Package, Truck, CheckCircle2, RotateCcw, AlertCircle, ShoppingBag, Target } from 'lucide-react';

export default function UserDashboard() {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [stats, setStats] = useState({ total: 0, active: 0, delivered: 0, returned: 0 });

    useEffect(() => {
        API.get('/orders').then(res => {
            setOrders(res.data);
            setStats({
                total: res.data.length,
                active: res.data.filter(o => ['placed', 'confirmed', 'shipped', 'out-for-delivery'].includes(o.status)).length,
                delivered: res.data.filter(o => o.status === 'delivered').length,
                returned: res.data.filter(o => ['return-initiated', 'returned'].includes(o.status)).length
            });
        }).catch(() => { });
    }, []);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'delivered': return <span className="badge badge-success"><CheckCircle2 className="w-3 h-3" /> Delivered</span>;
            case 'returned':
            case 'return-initiated': return <span className="badge badge-danger"><RotateCcw className="w-3 h-3" /> {status.replace(/-/g, ' ')}</span>;
            case 'out-for-delivery':
            case 'shipped': return <span className="badge badge-info"><Truck className="w-3 h-3" /> {status.replace(/-/g, ' ')}</span>;
            case 'placed':
            case 'confirmed': return <span className="badge badge-primary"><Package className="w-3 h-3" /> {status}</span>;
            default: return <span className="badge badge-neutral">{status}</span>;
        }
    };

    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <p className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-1">Customer Workspace</p>
                    <h1 className="text-3xl font-display text-white tracking-tight">Welcome back, {user?.name?.split(' ')[0]}</h1>
                    <p className="text-slate-400 mt-2 text-sm max-w-xl leading-relaxed">
                        Track your recent fashion purchases, ongoing deliveries, and seamless returns.
                    </p>
                </div>
                <div className="surface-soft p-4 flex items-center gap-4 border border-indigo-500/20 bg-indigo-500/5">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                        <Target className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-white">HyperLocal Priority</p>
                        <p className="text-xs text-indigo-300/80">Fast local pickups & premium inspection.</p>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                    { label: 'Total Orders', value: stats.total, icon: ShoppingBag, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
                    { label: 'Active Deliveries', value: stats.active, icon: Truck, color: 'text-amber-400', bg: 'bg-amber-500/10' },
                    { label: 'Delivered', value: stats.delivered, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                    { label: 'Returns', value: stats.returned, icon: RotateCcw, color: 'text-pink-400', bg: 'bg-pink-500/10' },
                ].map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.label} className="stat-card group">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 rounded-2xl ${stat.bg} border border-slate-700/50 flex items-center justify-center group-hover:bg-slate-800 transition-colors`}>
                                    <Icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                            </div>
                            <p className="text-4xl font-bold text-white mb-1">{stat.value}</p>
                            <p className="text-sm text-slate-400 font-medium">{stat.label}</p>
                        </div>
                    );
                })}
            </div>

            {/* Local Fulfillment Banner */}
            {orders.some(o => o.fulfilledFromLocal) && (
                <div className="surface-card p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-emerald-500/20">
                    <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-1">Eco-Fulfillment</p>
                            <h3 className="font-semibold text-lg text-white">Local routing active</h3>
                            <p className="text-slate-400 text-sm mt-0.5">
                                {orders.filter(o => o.fulfilledFromLocal).length} of your orders arrived faster via neighborhood nodes.
                            </p>
                        </div>
                    </div>
                    <button className="btn-primary text-sm whitespace-nowrap">View impact</button>
                </div>
            )}

            {/* Recent Orders Table */}
            <div className="surface-card overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-800/60 bg-slate-900/30">
                    <h3 className="text-lg font-semibold text-white">Recent Orders</h3>
                    <p className="text-xs text-slate-400 mt-1">Real-time status of your active purchases.</p>
                </div>
                <div className="overflow-x-auto custom-scrollbar pb-2">
                    <table className="modern-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Product Overview</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Fulfillment</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.slice(0, 10).map(order => (
                                <tr key={order._id} className="group">
                                    <td className="font-mono text-indigo-400 text-xs font-medium tracking-wide">
                                        #{order.orderNumber?.substring(0, 8).toUpperCase()}
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-slate-800 flex justify-center items-center object-cover overflow-hidden">
                                                {order.product?.image && order.product.image.length > 2 ? (
                                                    <img src={order.product.image} alt={order.product.name} className="w-full h-full object-cover" />
                                                ) : <ShoppingBag className="w-5 h-5 text-slate-500" />}
                                            </div>
                                            <span className="font-semibold text-slate-200 truncate max-w-[150px]">{order.product?.name || 'Fashion Item'}</span>
                                        </div>
                                    </td>
                                    <td className="font-bold text-slate-200">₹{order.totalPrice}</td>
                                    <td>{getStatusBadge(order.status)}</td>
                                    <td>
                                        {order.fulfilledFromLocal ? (
                                            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                                                <Target className="w-3.5 h-3.5" /> Local Node
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 font-medium bg-slate-800 px-2.5 py-1 rounded-lg">
                                                Standard
                                            </span>
                                        )}
                                    </td>
                                    <td className="text-slate-400 font-medium text-sm">{new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {orders.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-16 text-slate-500">
                            <ShoppingBag className="w-12 h-12 mb-4 opacity-20" />
                            <p className="text-sm font-medium">No order history available right now.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
