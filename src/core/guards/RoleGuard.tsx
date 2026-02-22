// src/core/guards/RoleGuard.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface RoleGuardProps {
    allowedRoles: string[];
}

export const RoleGuard = ({ allowedRoles }: RoleGuardProps) => {
    const { user, isAuthenticated } = useAuth();

    // 1. Si no está autenticado, al login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // 2. Si el usuario aún no carga (prevención de undefined)
    if (!user) return null;

    // 3. Verificación de roles
    if (!allowedRoles.includes(user.role)) {
        const redirectPath = user.role === 'CUSTOMER' ? '/' : '/profile';
        return <Navigate to={redirectPath} replace />;
    }

    return <Outlet />;
};