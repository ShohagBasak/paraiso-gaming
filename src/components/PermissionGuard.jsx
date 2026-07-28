import React, { useContext, useEffect } from 'react';
import { Navigate } from 'react-router';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const PermissionGuard = ({ permission, children }) => {
    const { user, loading } = useContext(AuthContext);

    useEffect(() => {
        if (!loading && user) {
            const hasPerm = 
                user.role === 'master' || 
                permission === 'tickets' ||
                (permission === 'users' ? false : (user.role === 'admin' && user.permissions?.includes(permission)));
            
            if (!hasPerm) {
                toast.error("Access denied. You do not have permission to view that section.");
            }
        }
    }, [user, loading, permission]);

    if (loading) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const hasPerm = 
        user.role === 'master' || 
        permission === 'tickets' ||
        (permission === 'users' ? false : (user.role === 'admin' && user.permissions?.includes(permission)));

    if (!hasPerm) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default PermissionGuard;
