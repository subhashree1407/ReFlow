import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User as UserIcon, Briefcase } from 'lucide-react';
import './Auth.css';

export default function AuthPage({ defaultMode = 'sign-in' }) {
    const [mode, setMode] = useState(defaultMode);

    // Login state
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    // Register state
    const [regName, setRegName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [regRole, setRegRole] = useState('user');

    const [error, setError] = useState('');
    const { login, register, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Trigger animation slightly after mount to replicate visual effect
    useEffect(() => {
        setTimeout(() => {
            setMode(defaultMode);
        }, 100);
    }, [defaultMode, location.pathname]);

    const toggle = () => {
        const target = mode === 'sign-in' ? '/register' : '/login';
        navigate(target);
        setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in');
        setError('');
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        const result = await login(loginEmail, loginPassword);
        handleAuthResult(result);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        const result = await register(regName, regEmail, regPassword, regRole);
        handleAuthResult(result, regRole);
    };

    const handleAuthResult = (result, forceRole) => {
        if (result.success) {
            const user = JSON.parse(localStorage.getItem('hyperlocal_user'));
            const role = forceRole || user.role;
            if (role === 'admin') navigate('/admin');
            else if (role === 'seller') navigate('/seller');
            else navigate('/dashboard');
        } else {
            setError(result.message);
        }
    };

    const quickLogin = async (role) => {
        const creds = { admin: 'admin@hyperlocal.com', seller: 'seller@hyperlocal.com', user: 'user@hyperlocal.com' };
        const pw = role === 'admin' ? 'admin123' : role === 'seller' ? 'seller123' : 'user123';
        const result = await login(creds[role], pw);
        handleAuthResult(result, role);
    };

    return (
        <div className={`auth-container ${mode}`}>
            {error && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[100] bg-red-100 border border-red-200 text-red-700 px-6 py-3 rounded-xl shadow-lg font-semibold animate-fadeIn">
                    {error}
                </div>
            )}

            {/* FORM SECTION */}
            <div className="row">
                {/* SIGN UP */}
                <div className="col align-items-center flex-col sign-up">
                    <div className="form-wrapper align-items-center">
                        <form className="form sign-up" onSubmit={handleRegister}>
                            <h2 className="text-3xl font-bold mb-6 text-slate-900 hidden-on-desktop tracking-tight">Sign Up</h2>
                            <div className="input-group">
                                <UserIcon />
                                <input type="text" placeholder="Full Name" value={regName} onChange={e => setRegName(e.target.value)} required />
                            </div>
                            <div className="input-group">
                                <Mail />
                                <input type="email" placeholder="Work Email" value={regEmail} onChange={e => setRegEmail(e.target.value)} required />
                            </div>
                            <div className="input-group">
                                <Lock />
                                <input type="password" placeholder="Password" value={regPassword} onChange={e => setRegPassword(e.target.value)} required />
                            </div>
                            <div className="input-group">
                                <Briefcase />
                                <select
                                    value={regRole}
                                    onChange={e => setRegRole(e.target.value)}
                                    className="w-full bg-[#f4f4f5] rounded-xl outline-none font-sans text-slate-800 transition-all focus:border-sky-500 focus:bg-white"
                                    style={{ padding: '1rem 1rem 1rem 3.2rem', border: '0.125rem solid transparent' }}
                                >
                                    <option value="user">Customer</option>
                                    <option value="seller">Seller</option>
                                </select>
                            </div>
                            <button type="submit" disabled={loading}>
                                {loading ? 'Creating...' : 'Sign up'}
                            </button>
                            <p>
                                <span>Already have an account?</span>
                                <b onClick={toggle} className="pointer text-sky-600 hover:text-sky-700 ml-1">Sign in here</b>
                            </p>
                        </form>
                    </div>
                </div>
                {/* END SIGN UP */}

                {/* SIGN IN */}
                <div className="col align-items-center flex-col sign-in">
                    <div className="form-wrapper align-items-center">
                        <form className="form sign-in" onSubmit={handleLogin}>
                            <h2 className="text-3xl font-bold mb-6 text-slate-900 hidden-on-desktop tracking-tight">Login</h2>
                            <div className="input-group">
                                <Mail />
                                <input type="email" placeholder="Work Email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required />
                            </div>
                            <div className="input-group">
                                <Lock />
                                <input type="password" placeholder="Password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required />
                            </div>
                            <button type="submit" disabled={loading}>
                                {loading ? 'Validating...' : 'Sign in'}
                            </button>

                            <div className="mt-8 pt-6 border-t border-slate-100">
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Quick Demo Access</p>
                                <div className="flex justify-center gap-2">
                                    {['user', 'seller', 'admin'].map(r => (
                                        <button key={r} type="button" onClick={() => quickLogin(r)} className="!bg-slate-50 !text-slate-600 border border-slate-200 !py-1.5 !text-xs !w-auto !px-4 hover:!bg-sky-50 hover:!text-sky-700 hover:!border-sky-200 capitalize !mt-0 !rounded-lg !shadow-none">
                                            {r}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <p className="mt-6">
                                <span>Don't have an account?</span>
                                <b onClick={toggle} className="pointer text-sky-600 hover:text-sky-700 ml-1">Sign up here</b>
                            </p>
                        </form>
                    </div>
                </div>
                {/* END SIGN IN */}
            </div>
            {/* END FORM SECTION */}

            {/* CONTENT SECTION */}
            <div className="row content-row">
                {/* SIGN IN CONTENT */}
                <div className="col align-items-center flex-col">
                    <div className="text sign-in">
                        <h2>Welcome Back</h2>
                        <p>Sign in to orchestrate your reverse logistics seamlessly.</p>
                    </div>
                </div>
                {/* END SIGN IN CONTENT */}

                {/* SIGN UP CONTENT */}
                <div className="col align-items-center flex-col">
                    <div className="text sign-up">
                        <h2>Join the Network</h2>
                        <p>Turn returns into profit with our smart hyperlocal fulfillment engine.</p>
                    </div>
                </div>
                {/* END SIGN UP CONTENT */}
            </div>
            {/* END CONTENT SECTION */}
        </div>
    );
}
