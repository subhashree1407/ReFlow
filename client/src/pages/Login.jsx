import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, loading } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const result = await login(email, password);
        if (result.success) {
            const user = JSON.parse(localStorage.getItem('hyperlocal_user'));
            if (user.role === 'admin') navigate('/admin');
            else if (user.role === 'seller') navigate('/seller');
            else navigate('/dashboard');
        } else {
            setError(result.message);
        }
    };

    const quickLogin = async (role) => {
        const creds = { admin: 'admin@hyperlocal.com', seller: 'seller@hyperlocal.com', user: 'user@hyperlocal.com' };
        const pw = role === 'admin' ? 'admin123' : role === 'seller' ? 'seller123' : 'user123';
        setEmail(creds[role]);
        setPassword(pw);
        const result = await login(creds[role], pw);
        if (result.success) {
            if (role === 'admin') navigate('/admin');
            else if (role === 'seller') navigate('/seller');
            else navigate('/dashboard');
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
                    <h2 className="text-3xl font-bold tracking-tight mb-4">Turn returns into profit.</h2>
                    <p className="text-sky-100 mb-8 leading-relaxed">Smarter tracking and exchange-first returns to improve customer experiences and capture more revenue for your brand.</p>
                    <div className="rounded-2xl overflow-hidden border border-white/20 shadow-xl">
                        <img src="/brand/hero-fashion.svg" alt="Fashion logistics" className="w-full h-auto opacity-90 mix-blend-overlay" />
                    </div>
                </div>

                <div className="surface-card p-10">
                    <div className="mb-6">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-bold">Welcome back</p>
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">Sign in to continue</h2>
                        <p className="text-sm text-slate-500 mt-2">Use your credentials or access a demo role.</p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-700 rounded-lg text-sm">{error}</div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Work Email</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
                                placeholder="you@brand.com" required />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
                                placeholder="••••••••" required />
                        </div>
                        <button type="submit" disabled={loading} className="w-full btn-primary mt-2">
                            {loading ? 'Signing in...' : 'Log in'}
                        </button>
                    </form>

                    <div className="mt-8 border-t border-slate-100 pt-6">
                        <p className="text-sm text-slate-500 font-medium mb-3">Quick demo access</p>
                        <div className="flex gap-2">
                            {['user', 'seller', 'admin'].map(role => (
                                <button key={role} onClick={() => quickLogin(role)}
                                    className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hover:bg-sky-50 hover:text-sky-700 hover:border-sky-200 transition capitalize">
                                    {role}
                                </button>
                            ))}
                        </div>
                    </div>

                    <p className="text-center mt-8 text-sm text-slate-500">
                        New to Reverse Logistics? <Link to="/register" className="text-sky-600 font-semibold hover:text-sky-700 transition-colors">Sign up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
