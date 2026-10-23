import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '../context/AuthContext';

// Pages
import Landing from '../pages/Landing';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import CheckNews from '../pages/CheckNews';
import ResultPage from '../pages/ResultPage';
import History from '../pages/History';
import SavedNews from '../pages/SavedNews';
import Profile from '../pages/Profile';
import Assistant from '../pages/Assistant';

// Admin Pages
import AdminLogin from '../pages/admin/AdminLogin';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminReports from '../pages/admin/AdminReports';
import AdminSources from '../pages/admin/AdminSources';
import AdminAnalytics from '../pages/admin/AdminAnalytics';
import AdminML from '../pages/admin/AdminML';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated || user?.role !== 'admin') return <Navigate to="/admin/login" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  if (isAuthenticated) return <Navigate to={user?.role === 'admin' ? '/admin/dashboard' : '/dashboard'} replace />;
  return children;
};

const AppRoutes = () => (
  <Routes>
    {/* Public */}
    <Route path="/" element={<Landing />} />
    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
    <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

    {/* User Protected */}
    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    <Route path="/check" element={<ProtectedRoute><CheckNews /></ProtectedRoute>} />
    <Route path="/result/:id" element={<ProtectedRoute><ResultPage /></ProtectedRoute>} />
    <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
    <Route path="/saved" element={<ProtectedRoute><SavedNews /></ProtectedRoute>} />
    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
    <Route path="/assistant" element={<ProtectedRoute><Assistant /></ProtectedRoute>} />

    {/* Admin */}
    <Route path="/admin/login" element={<AdminLogin />} />
    <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
    <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
    <Route path="/admin/reports" element={<AdminRoute><AdminReports /></AdminRoute>} />
    <Route path="/admin/sources" element={<AdminRoute><AdminSources /></AdminRoute>} />
    <Route path="/admin/analytics" element={<AdminRoute><AdminAnalytics /></AdminRoute>} />
    <Route path="/admin/ml" element={<AdminRoute><AdminML /></AdminRoute>} />

    {/* Fallback */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export const AppRouter = () => (
  <BrowserRouter>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </BrowserRouter>
);
