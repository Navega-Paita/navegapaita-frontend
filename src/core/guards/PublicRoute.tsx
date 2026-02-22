// src/core/guards/PublicRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const PublicRoute = () => {
    const { user, isAuthenticated } = useAuth();

    if (isAuthenticated && user) {
        // Si ya está logueado, lo mandamos a su ruta según rol
        const role = user.role;
        if (role === 'ADMIN' || role === 'AGENCY') return <Navigate to="/dashboard" replace />;
        if (role === 'FISHERMAN') return <Navigate to="/profile" replace />;
        return <Navigate to="/" replace />;
    }

    // Si no está logueado, puede ver el Login o Registro
    return <Outlet />;
};