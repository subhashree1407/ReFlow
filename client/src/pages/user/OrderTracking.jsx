import { useState, useEffect } from 'react';
import API from '../../api';

export default function OrderTracking() {
    const [orders, setOrders] = useState([]);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        API.get('/orders').then(res => setOrders(res.data)).catch(() => { });
    }, []);

    const steps = ['placed', 'confirmed', 'shipped', 'out-for-delivery', 'delivered'];
    const stepLabels = { placed: 'Placed', confirmed: 'Confirmed', shipped: 'Shipped', 'out-for-delivery': 'Out for Delivery', delivered: 'Delivered' };

    const getStepIndex = (status) => {
        if (status === 'return-initiated' || status === 'returned') return 5;
        return steps.indexOf(status);
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Order Studio</p>
                    <h1 className="text-3xl font-display text-slate-900">Track your fashion deliveries</h1>
                    <p className="text-slate-500 mt-2">Every step, from boutique pickup to doorstep delivery.</p>
                </div>
                <div className="surface-soft p-4 flex items-center gap-4">
                    <img src="/brand/returns.svg" alt="Tracking" className="w-24 h-16 object-cover rounded-xl" />
                    <div>
                        <p className="text-sm font-semibold text-slate-800">Smart tracking</p>
                        <p className="text-xs text-slate-500">Live events and local fulfillment insights.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Order List */}
                <div className="lg:col-span-1 surface-card overflow-hidden">
                    <div className="px-4 py-4 border-b border-slate-100">
                        <h3 className="font-semibold text-slate-800 text-sm">Your Orders</h3>
                        <p className="text-xs text-slate-400 mt-1">Select to view a full timeline.</p>
                    </div>
                    <div className="divide-y divide-slate-50 max-h-[600px] overflow-y-auto">
                        {orders.map(order => (
                            <button key={order._id} onClick={() => setSelected(order)}
                                className={`w-full px-4 py-3 text-left hover:bg-amber-50 transition ${selected?._id === order._id ? 'bg-amber-50 border-l-4 border-amber-400' : ''}`}>
                                <div className="flex items-center justify-between">
                                    <span className="font-medium text-sm text-amber-700">{order.orderNumber}</span>
                                    <span className="text-xs text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</span>
                                </div>
                                <p className="text-sm text-slate-600 mt-0.5 truncate">{order.product?.name}</p>
                                <p className="text-xs text-slate-400 mt-0.5 capitalize">{order.status?.replace(/-/g, ' ')}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Order Detail & Timeline */}
                <div className="lg:col-span-2">
                    {selected ? (
                        <div className="surface-card p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800">{selected.orderNumber}</h3>
                                    <p className="text-sm text-slate-500">{selected.product?.name}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-bold text-slate-800">₹{selected.totalPrice}</p>
                                    {selected.fulfilledFromLocal && (
                                        <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">⚡ Local Delivery</span>
                                    )}
                                </div>
                            </div>

                            {/* Progress Steps */}
                            <div className="relative">
                                <div className="flex items-center justify-between">
                                    {steps.map((step, i) => {
                                        const currentIdx = getStepIndex(selected.status);
                                        const isDone = i <= currentIdx;
                                        const isCurrent = i === currentIdx;
                                        return (
                                            <div key={step} className="flex flex-col items-center flex-1">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition
                          ${isDone ? 'bg-amber-500 border-amber-500 text-white' : 'border-slate-300 text-slate-400'}
                          ${isCurrent ? 'ring-4 ring-amber-100' : ''}`}>
                                                    {isDone ? '✓' : i + 1}
                                                </div>
                                                <p className={`text-xs mt-2 text-center ${isDone ? 'text-amber-700 font-medium' : 'text-slate-400'}`}>
                                                    {stepLabels[step]}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="absolute top-4 left-0 right-0 h-0.5 bg-slate-200 -z-10 mx-10"></div>
                                <div className="absolute top-4 left-0 h-0.5 bg-amber-500 -z-10 mx-10 transition-all"
                                    style={{ width: `${Math.min(getStepIndex(selected.status) / (steps.length - 1) * 100, 100)}%` }}></div>
                            </div>

                            {/* Timeline */}
                            <div>
                                <h4 className="font-semibold text-slate-800 mb-3">Timeline</h4>
                                <div className="space-y-3">
                                    {selected.timeline?.slice().reverse().map((event, i) => (
                                        <div key={i} className="flex gap-3 slide-in" style={{ animationDelay: `${i * 100}ms` }}>
                                            <div className="flex flex-col items-center">
                                                <div className={`w-3 h-3 rounded-full ${i === 0 ? 'bg-indigo-600' : 'bg-slate-300'}`}></div>
                                                {i < selected.timeline.length - 1 && <div className="w-0.5 flex-1 bg-slate-200"></div>}
                                            </div>
                                            <div className="pb-3">
                                                <p className="text-sm font-medium text-slate-700 capitalize">{event.status?.replace(/-/g, ' ')}</p>
                                                <p className="text-xs text-slate-400">{new Date(event.timestamp).toLocaleString()}</p>
                                                {event.note && <p className="text-xs text-slate-500 mt-1">{event.note}</p>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Savings Info */}
                            {selected.fulfilledFromLocal && (selected.costSaved > 0 || selected.timeSaved > 0) && (
                                <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                                    <h4 className="font-semibold text-emerald-800 mb-2">🎉 HyperLocal Savings</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-2xl font-bold text-emerald-700">₹{selected.costSaved}</p>
                                            <p className="text-xs text-emerald-600">Shipping Cost Saved</p>
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-emerald-700">{selected.timeSaved}h</p>
                                            <p className="text-xs text-emerald-600">Delivery Time Saved</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="surface-card p-10 text-center text-slate-400">
                            <p className="text-4xl mb-3">📋</p>
                            <p className="font-medium">Select an order to view tracking details</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
