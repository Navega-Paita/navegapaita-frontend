// src/core/guards/RoleGuard.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface RoleGuardProps {
    allowedRoles: string[];
}

export const RoleGuard = ({ allowedRoles }: RoleGuardProps) => {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated) return <Navigate to="/login" replace />;

    if (!allowedRoles.includes(user.role)) {
        // Si intenta entrar a donde no debe, lo mandamos a su "casa"
        return <Navigate to={user.role === 'CUSTOMER' ? '/' : '/profile'} replace />;
    }

    return <Outlet />; // Renderiza las rutas hijas si tiene permiso
};