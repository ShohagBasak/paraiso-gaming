import { useContext } from 'react';
import { Navigate } from 'react-router';
import { AuthContext } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0f14] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-cyan-400 font-bold uppercase tracking-widest text-sm">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) return <Navigate to="/login" replace />;
    if (user.role !== 'admin' && user.role !== 'master') return <Navigate to="/" replace />;

    return children;
};

export default AdminRoute;
