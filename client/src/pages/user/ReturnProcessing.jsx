import { useState, useEffect } from 'react';
import API from '../../api';

export default function ReturnProcessing() {
    const [returns, setReturns] = useState([]);
    const [orders, setOrders] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        orderId: '',
        reason: '',
        returnPickupAddress: '',
        returnPickupLocation: { lat: '', lng: '' }
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        API.get('/returns').then(res => setReturns(res.data)).catch(() => { });
        API.get('/orders').then(res => setOrders(res.data.filter(o => o.status === 'delivered'))).catch(() => { });
    };

    const handleReturn = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                orderId: formData.orderId,
                reason: formData.reason,
                returnPickupAddress: formData.returnPickupAddress,
                returnPickupLocation: {
                    lat: Number(formData.returnPickupLocation.lat),
                    lng: Number(formData.returnPickupLocation.lng)
                }
            };
            await API.post('/returns', payload);
            setShowForm(false);
            setFormData({ orderId: '', reason: '', returnPickupAddress: '', returnPickupLocation: { lat: '', lng: '' } });
            loadData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to initiate return');
        }
    };

    const selectedOrder = orders.find(o => o._id === formData.orderId);
    const pickupLocation = {
        lat: Number(formData.returnPickupLocation.lat),
        lng: Number(formData.returnPickupLocation.lng),
        address: formData.returnPickupAddress
    };

    const originalLocation = selectedOrder?.deliveryLocation ? {
        lat: selectedOrder.deliveryLocation.lat,
        lng: selectedOrder.deliveryLocation.lng,
        address: selectedOrder.deliveryAddress
    } : null;

    const pipelineSteps = ['initiated', 'pickup-scheduled', 'picked-up', 'received', 'inspecting', 'repackaging', 'relabeled', 'in-local-pool'];
    const pipelineLabels = {
        initiated: 'Initiated', 'pickup-scheduled': 'Pickup Scheduled', 'picked-up': 'Picked Up',
        received: 'Received', inspecting: 'Inspecting', repackaging: 'Repackaging',
        relabeled: 'Relabeled', 'in-local-pool': 'In Local Pool'
    };

    const getStepColor = (step, currentStatus) => {
        const currentIdx = pipelineSteps.indexOf(currentStatus);
        const stepIdx = pipelineSteps.indexOf(step);
        if (currentStatus === 'sent-back' || currentStatus === 'transferred') return 'bg-orange-100 text-orange-700 border-orange-300';
        if (currentStatus === 'rejected') return 'bg-red-100 text-red-700 border-red-300';
        if (stepIdx < currentIdx) return 'bg-green-100 text-green-700 border-green-300';
        if (stepIdx === currentIdx) return 'bg-indigo-100 text-indigo-700 border-indigo-400 ring-2 ring-indigo-200';
        return 'bg-slate-50 text-slate-400 border-slate-200';
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Returns Studio</p>
                    <h1 className="text-3xl font-display text-slate-900">Initiate a fashion return</h1>
                    <p className="text-slate-500 mt-2">Capture a new pickup location and follow every step of the process.</p>
                </div>
                <button onClick={() => setShowForm(!showForm)} className="accent-button text-sm">
                    + Create Return
                </button>
            </div>

            {/* Initiate Return Form */}
            {showForm && (
                <div className="surface-card p-6 animate-fadeIn">
                    <h3 className="font-semibold text-slate-800 mb-1">Initiate a Return</h3>
                    <p className="text-xs text-slate-400 mb-4">We only accept clothing, footwear, apparel, and fashion accessories.</p>
                    <form onSubmit={handleReturn} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Select Order</label>
                            <select value={formData.orderId} onChange={e => setFormData({ ...formData, orderId: e.target.value })}
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-200" required>
                                <option value="">Choose a delivered order...</option>
                                {orders.map(o => (
                                    <option key={o._id} value={o._id}>{o.orderNumber} – {o.product?.name} (₹{o.totalPrice})</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Reason for Return</label>
                            <textarea value={formData.reason} onChange={e => setFormData({ ...formData, reason: e.target.value })}
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-200"
                                rows="3" placeholder="Describe why you want to return this product..." required />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Pickup Latitude</label>
                                <input
                                    value={formData.returnPickupLocation.lat}
                                    onChange={e => setFormData({
                                        ...formData,
                                        returnPickupLocation: { ...formData.returnPickupLocation, lat: e.target.value }
                                    })}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-200"
                                    placeholder="28.5355"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Pickup Longitude</label>
                                <input
                                    value={formData.returnPickupLocation.lng}
                                    onChange={e => setFormData({
                                        ...formData,
                                        returnPickupLocation: { ...formData.returnPickupLocation, lng: e.target.value }
                                    })}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-200"
                                    placeholder="77.3910"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Pickup Address</label>
                                <input
                                    value={formData.returnPickupAddress}
                                    onChange={e => setFormData({ ...formData, returnPickupAddress: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-200"
                                    placeholder="Enter pickup address"
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                <h4 className="font-semibold text-slate-800 text-sm mb-2">Original Delivery Location</h4>
                                <p className="text-slate-600 text-xs">{originalLocation?.address || 'N/A'}</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                <h4 className="font-semibold text-slate-800 text-sm mb-2">Return Pickup Location</h4>
                                <p className="text-slate-600 text-xs">{pickupLocation?.address || 'N/A'}</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button type="submit" className="accent-button text-sm">Submit Return</button>
                            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition">Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Returns List */}
            {returns.map(ret => (
                <div key={ret._id} className="surface-card p-6 slide-in">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="font-semibold text-slate-800">{ret.returnNumber}</h3>
                            <p className="text-sm text-slate-500">{ret.product?.name} • {ret.category} • Order: {ret.order?.orderNumber}</p>
                        </div>
                        <div className="text-right">
                            <span className="inline-flex items-center gap-1 text-xs font-medium bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full capitalize">
                                {ret.status?.replace(/-/g, ' ')}
                            </span>
                            {ret.assignedWarehouse && (
                                <p className="text-xs text-slate-400 mt-1">📍 {ret.assignedWarehouse.name}</p>
                            )}
                        </div>
                    </div>

                    {/* Pipeline */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {pipelineSteps.map(step => (
                            <div key={step} className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${getStepColor(step, ret.status)}`}>
                                {pipelineLabels[step]}
                            </div>
                        ))}
                    </div>

                    {/* Distance & Info */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                        {ret.returnScore !== undefined && (
                            <span className="font-bold text-indigo-600 px-2 py-0.5 bg-indigo-50 rounded">
                                AI Score: {ret.returnScore}
                            </span>
                        )}
                        {ret.recommendationStatus && (
                            <span className={`font-semibold px-2 py-0.5 rounded capitalize ${ret.recommendationStatus === 'approve' ? 'bg-emerald-100 text-emerald-700' :
                                ret.recommendationStatus === 'manual-review' ? 'bg-amber-100 text-amber-700' :
                                    'bg-red-100 text-red-700'
                                }`}>
                                Rec: {ret.recommendationStatus}
                            </span>
                        )}
                        <span>📏 Distance (delivery → pickup): {ret.distanceBetweenLocations || 0} km</span>
                        <span>✅ Approval: {ret.approvalStatus || 'pending'}</span>
                        <span>📝 Reason: {ret.reason}</span>
                        {ret.sellerDecision !== 'pending' && (
                            <span className="text-amber-700 font-medium">🏪 Seller: {ret.sellerDecision?.replace(/-/g, ' ')}</span>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                            <h4 className="font-semibold text-slate-800 text-sm mb-2">Original Delivery</h4>
                            <p className="text-slate-600 text-xs">{ret.originalDeliveryLocation?.address || 'N/A'}</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                            <h4 className="font-semibold text-slate-800 text-sm mb-2">Return Pickup</h4>
                            <p className="text-slate-600 text-xs">{ret.returnPickupLocation?.address || 'N/A'}</p>
                        </div>
                    </div>
                </div>
            ))}

            {returns.length === 0 && !showForm && (
                <div className="surface-card p-10 text-center text-slate-400">
                    <p className="text-4xl mb-3">↩️</p>
                    <p className="font-medium">No returns yet</p>
                </div>
            )}
        </div>
    );
}
