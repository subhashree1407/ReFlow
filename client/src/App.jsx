import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import AuthPage from './pages/AuthPage';
import UserDashboard from './pages/user/Dashboard';
import OrderTracking from './pages/user/OrderTracking';
import ReturnProcessing from './pages/user/ReturnProcessing';
import SellerDashboard from './pages/seller/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';
import WarehouseMonitor from './pages/admin/WarehouseMonitor';
import InventoryPanel from './pages/admin/InventoryPanel';
import InspectionPanel from './pages/admin/InspectionPanel';
import RepackagingPanel from './pages/admin/RepackagingPanel';
import SmartDispatch from './pages/admin/SmartDispatch';
import WarehouseAnalytics from './pages/admin/WarehouseAnalytics';

import Home from './pages/Home';

function PageWrapper({ children }) {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 p-6 animate-fadeIn">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl transition-all duration-300">
                {children}
            </div>
        </div>
    );
}

function ProtectedRoute({ children, roles }) {
    const { user } = useAuth();
    const location = useLocation();
    if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
    if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
    return <>{children}</>;
}

function RoleRedirect() {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" />;
    if (user.role === "admin") return <Navigate to="/admin" />;
    if (user.role === "seller") return <Navigate to="/seller" />;
    return <Navigate to="/dashboard" />;
}

function AppRoutes() {
    const { user } = useAuth();
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={user ? <RoleRedirect /> : <AuthPage defaultMode="sign-in" />} />
            <Route path="/register" element={user ? <RoleRedirect /> : <AuthPage defaultMode="sign-up" />} />
            <Route path="/dashboard" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                <Route index element={<UserDashboard />} />
                <Route path="orders" element={<OrderTracking />} />
                <Route path="returns" element={<ReturnProcessing />} />
            </Route>
            <Route path="/seller" element={<ProtectedRoute roles={['seller', 'admin']}><Layout /></ProtectedRoute>}>
                <Route index element={<SellerDashboard />} />
                <Route path="decisions" element={<SellerDashboard />} />
                <Route path="products" element={<SellerDashboard />} />
            </Route>
            <Route path="/admin" element={<ProtectedRoute roles={['admin']}><Layout /></ProtectedRoute>}>
                <Route index element={<AdminDashboard />} />
                <Route path="warehouses" element={<WarehouseMonitor />} />
                <Route path="inventory" element={<InventoryPanel />} />
                <Route path="inspection" element={<InspectionPanel />} />
                <Route path="repackaging" element={<RepackagingPanel />} />
                <Route path="dispatch" element={<SmartDispatch />} />
                <Route path="analytics" element={<WarehouseAnalytics />} />
            </Route>
            <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </BrowserRouter>
    );
}