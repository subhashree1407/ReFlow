import { useState, useEffect } from 'react';
import API from '../../api';

export default function SellerDashboard() {
    const [products, setProducts] = useState([]);
    const [returns, setReturns] = useState([]);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        API.get('/products').then(res => setProducts(res.data)).catch(() => { });
        API.get('/returns').then(res => setReturns(res.data)).catch(() => { });
        API.get('/orders').then(res => setOrders(res.data)).catch(() => { });
    }, []);

    const stats = [
        { label: 'Products', value: products.length, icon: '📦', color: 'from-indigo-500 to-purple-500' },
        { label: 'Total Orders', value: orders.length, icon: '🛒', color: 'from-blue-500 to-cyan-500' },
        { label: 'Active Returns', value: returns.filter(r => !['in-local-pool', 'sent-back', 'transferred', 'rejected'].includes(r.status)).length, icon: '↩️', color: 'from-amber-500 to-orange-500' },
        { label: 'In Local Pool', value: returns.filter(r => r.status === 'in-local-pool').length, icon: '🏭', color: 'from-green-500 to-emerald-500' },
    ];

    const pendingApprovals = returns.filter(r => r.approvalStatus === 'pending');

    const toggleLocal = async (productId, current) => {
        try {
            await API.patch(`/products/${productId}/local-warehouse`, { allowLocalWarehouse: !current });
            setProducts(products.map(p => p._id === productId ? { ...p, allowLocalWarehouse: !current } : p));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Seller Studio</p>
                <h1 className="text-3xl font-display text-slate-900">Returns approvals, curated</h1>
                <p className="text-slate-500 mt-2">Manage products, approvals, and local inventory routing in one place.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map(s => (
                    <div key={s.label} className="stat-card surface-soft p-5">
                        <span className={`inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br ${s.color} text-white text-lg mb-3`}>{s.icon}</span>
                        <p className="text-2xl font-bold text-slate-800">{s.value}</p>
                        <p className="text-sm text-slate-500">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Products with Local Warehouse Toggle */}
            <div className="surface-card">
                <div className="px-5 py-4 border-b border-slate-100">
                    <h3 className="font-semibold text-slate-800">Local Warehouse Settings</h3>
                    <p className="text-xs text-slate-400 mt-1">Allow returns to remain in local pools for faster re-fulfillment.</p>
                </div>
                <div className="divide-y divide-slate-50">
                    {products.map(product => (
                        <div key={product._id} className="px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{product.image || '📦'}</span>
                                <div>
                                    <p className="font-medium text-slate-800">{product.name}</p>
                                    <p className="text-xs text-slate-400">SKU: {product.sku} • ₹{product.price}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs text-slate-500">{product.allowLocalWarehouse ? 'Local warehouse enabled' : 'Disabled'}</span>
                                <button onClick={() => toggleLocal(product._id, product.allowLocalWarehouse)}
                                    className={`relative w-11 h-6 rounded-full transition-colors ${product.allowLocalWarehouse ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                                    <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${product.allowLocalWarehouse ? 'left-5.5' : 'left-0.5'}`}></div>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Return Approval Requests */}
            <div className="surface-card">
                <div className="px-5 py-4 border-b border-slate-100">
                    <h3 className="font-semibold text-slate-800">Pending Return Approvals</h3>
                </div>
                <div className="divide-y divide-slate-50">
                    {pendingApprovals.map(ret => (
                        <div key={ret._id} className="px-5 py-4">
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <p className="font-medium text-slate-800">{ret.returnNumber} – {ret.product?.name}</p>
                                    <p className="text-xs text-slate-400">Category: {ret.category} • Order: {ret.order?.orderNumber}</p>
                                </div>
                                <span className="text-xs px-2 py-1 rounded-full bg-amber-50 text-amber-700">Pending Approval</span>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 my-3">
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-semibold text-slate-800 text-xs mb-1 uppercase tracking-wider">Original Delivery</h4>
                                    <p className="text-slate-600 text-xs">{ret.originalDeliveryLocation?.address || 'N/A'}</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-semibold text-slate-800 text-xs mb-1 uppercase tracking-wider">Return Pickup</h4>
                                    <p className="text-slate-600 text-xs">{ret.returnPickupLocation?.address || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-xs text-slate-500">
                                <span>📏 Distance: {ret.distanceBetweenLocations || 0} km</span>
                                <span>🏭 Nearest Warehouse: {ret.assignedWarehouse?.name || 'TBD'}</span>
                            </div>
                            <div className="flex gap-2 mt-3">
                                <ApprovalButton ret={ret} decision="approved" label="Approve Return" color="bg-emerald-600" onUpdate={(r) => setReturns(returns.map(x => x._id === r._id ? r : x))} />
                                <ApprovalButton ret={ret} decision="rejected" label="Reject (Electronics)" color="bg-rose-600" onUpdate={(r) => setReturns(returns.map(x => x._id === r._id ? r : x))} />
                            </div>
                        </div>
                    ))}
                    {pendingApprovals.length === 0 && (
                        <div className="px-5 py-8 text-center text-slate-400 text-sm">No pending approvals</div>
                    )}
                </div>
            </div>

            {/* Post-Approval Routing Decisions */}
            <div className="surface-card">
                <div className="px-5 py-4 border-b border-slate-100">
                    <h3 className="font-semibold text-slate-800">Routing Decisions (Approved Returns)</h3>
                </div>
                <div className="divide-y divide-slate-50">
                    {returns.filter(r => r.approvalStatus === 'approved' && r.sellerDecision === 'pending').map(ret => (
                        <div key={ret._id} className="px-5 py-4">
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <p className="font-medium text-slate-800">{ret.returnNumber} – {ret.product?.name}</p>
                                    <p className="text-xs text-slate-400">Status: {ret.status?.replace(/-/g, ' ')} • Warehouse: {ret.assignedWarehouse?.name}</p>
                                </div>
                            </div>
                            <div className="flex gap-2 mt-2">
                                <DecisionButton ret={ret} decision="keep-local" label="Keep in Local Pool" color="bg-emerald-600" onUpdate={(r) => setReturns(returns.map(x => x._id === r._id ? r : x))} />
                                <DecisionButton ret={ret} decision="return-original" label="Return to Original" color="bg-amber-600" onUpdate={(r) => setReturns(returns.map(x => x._id === r._id ? r : x))} />
                                <DecisionButton ret={ret} decision="transfer-high-demand" label="Transfer to High-Demand" color="bg-slate-700" onUpdate={(r) => setReturns(returns.map(x => x._id === r._id ? r : x))} />
                            </div>
                        </div>
                    ))}
                    {returns.filter(r => r.approvalStatus === 'approved' && r.sellerDecision === 'pending').length === 0 && (
                        <div className="px-5 py-8 text-center text-slate-400 text-sm">No routing decisions pending</div>
                    )}
                </div>
            </div>
        </div>
    );
}

function DecisionButton({ ret, decision, label, color, onUpdate }) {
    const handleClick = async () => {
        try {
            const { data } = await API.patch(`/returns/${ret._id}/seller-decision`, { decision });
            onUpdate(data);
        } catch (err) {
            console.error(err);
        }
    };
    return (
        <button onClick={handleClick} className={`px-3 py-1.5 text-xs text-white rounded-lg font-medium hover:opacity-90 transition ${color}`}>
            {label}
        </button>
    );
}

function ApprovalButton({ ret, decision, label, color, onUpdate }) {
    const handleClick = async () => {
        try {
            const { data } = await API.patch(`/returns/${ret._id}/approval`, { decision });
            onUpdate(data);
        } catch (err) {
            console.error(err);
        }
    };
    return (
        <button onClick={handleClick} className={`px-3 py-1.5 text-xs text-white rounded-lg font-medium hover:opacity-90 transition ${color}`}>
            {label}
        </button>
    );
}
