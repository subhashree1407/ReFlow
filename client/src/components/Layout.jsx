import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard, Package, RotateCcw, Box, CheckCircle,
    Truck, BarChart2, Factory, LogOut, CheckCircle2
} from 'lucide-react';

const navItems = {
    user: [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/orders', label: 'My Orders', icon: Package },
        { path: '/returns', label: 'Returns', icon: RotateCcw },
    ],
    seller: [
        { path: '/seller', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/seller/decisions', label: 'Return Decisions', icon: RotateCcw },
        { path: '/seller/products', label: 'Products', icon: Package },
    ],
    admin: [
        { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/admin/warehouses', label: 'Warehouses', icon: Factory },
        { path: '/admin/inventory', label: 'Inventory', icon: Box },
        { path: '/admin/inspection', label: 'Inspection', icon: CheckCircle },
        { path: '/admin/repackaging', label: 'Repackaging', icon: Package },
        { path: '/admin/dispatch', label: 'Smart Dispatch', icon: Truck },
        { path: '/admin/analytics', label: 'Analytics', icon: BarChart2 },
    ]
};

export default function Layout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const items = navItems[user?.role] || navItems.user;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className="w-72 flex-shrink-0 flex flex-col bg-white border-r border-slate-200 shadow-xl z-20">
                {/* Logo */}
                <div className="p-8 border-b border-slate-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
                            <Box className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-slate-900 font-bold text-lg tracking-tight leading-tight">Reverse<br />Logistics</h1>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-6 px-4 overflow-y-auto custom-scrollbar">
                    <div className="space-y-1">
                        <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest px-4 mb-4">Menu</p>
                        {items.map((item) => {
                            const Icon = item.icon;
                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    end={item.path === '/dashboard' || item.path === '/seller' || item.path === '/admin'}
                                    className={({ isActive }) =>
                                        `group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                            ? 'bg-sky-50 text-sky-600'
                                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                        }`
                                    }
                                >
                                    <Icon className="w-5 h-5 opacity-80 group-hover:opacity-100 transition-opacity" strokeWidth={2} />
                                    {item.label}
                                </NavLink>
                            );
                        })}
                    </div>
                </nav>

                {/* User Info */}
                <div className="p-6 border-t border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 border border-slate-300 font-medium flex items-center justify-center text-slate-600">
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-slate-800 text-sm font-semibold truncate">{user?.name}</p>
                            <p className="text-slate-500 text-[11px] font-medium uppercase tracking-wider mt-0.5">
                                {user?.role}
                            </p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Logout"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col bg-slate-50 relative z-10 overflow-hidden">
                {/* Subtle Grid Background */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] pointer-events-none"></div>

                {/* Top Bar */}
                <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200 px-8 py-5 flex items-center justify-between sticky top-0 z-30">
                    <div>
                        <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">
                            {user?.role === 'admin' ? 'Command Center' : user?.role === 'seller' ? 'Seller Hub' : 'Customer Workspace'}
                        </h2>
                    </div>
                    <div className="flex items-center gap-5">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span className="text-emerald-700 text-xs font-semibold tracking-wide">System Online</span>
                        </div>
                        <button className="bg-slate-900 text-white hover:bg-slate-800 px-4 py-2 rounded-lg text-sm font-semibold shadow-lg shadow-slate-900/10 transition-all active:scale-95">
                            Create Report
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative z-20">
                    <div className="max-w-7xl mx-auto pb-12">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
}
