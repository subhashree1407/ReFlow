import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box } from 'lucide-react';

export default function Register() {
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
    const [error, setError] = useState('');
    const { register, loading } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const result = await register(form.name, form.email, form.password, form.role);
        if (result.success) {
            if (form.role === 'admin') navigate('/admin');
            else if (form.role === 'seller') navigate('/seller');
            else navigate('/dashboard');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="min-h-screen page-backdrop flex items-center justify-center p-6">
            <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="surface-card p-10 text-white bg-gradient-to-br from-sky-500 to-sky-700 border-0">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                            <Box className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Reverse Logistics</h1>
                            <p className="text-xs text-sky-100 font-medium">Post-Purchase Re-Fulfillment</p>
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight mb-4">Create a workspace for premium returns.</h2>
                    <p className="text-sky-100 mb-8 leading-relaxed">Onboard your team in minutes and orchestrate approvals, inspections, and local inventory.</p>
                    <div className="rounded-2xl overflow-hidden border border-white/20 shadow-xl">
                        <img src="/brand/warehouse.svg" alt="Warehouse dashboard" className="w-full h-auto opacity-90 mix-blend-overlay" />
                    </div>
                </div>

                <div className="surface-card p-10">
                    <div className="mb-6">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-bold">Get started</p>
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">Create your account</h2>
                        <p className="text-sm text-slate-500 mt-2">Choose the role that best describes your workspace.</p>
                    </div>
                    {error && <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition" required />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Work Email</label>
                            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition" required />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                            <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition" required />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Role</label>
                            <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition bg-white">
                                <option value="user">Customer</option>
                                <option value="seller">Seller</option>
                            </select>
                        </div>
                        <div className="pt-2">
                            <button type="submit" disabled={loading} className="w-full btn-primary">
                                {loading ? 'Creating account...' : 'Create Account'}
                            </button>
                        </div>
                    </form>
                    <p className="text-center mt-6 text-sm text-slate-500">
                        Already have an account? <Link to="/login" className="text-sky-600 font-semibold hover:text-sky-700 transition">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
