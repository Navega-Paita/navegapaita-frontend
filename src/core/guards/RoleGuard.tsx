// src/core/guards/RoleGuard.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface RoleGuardProps {
    allowedRoles: string[];
}

export const RoleGuard = ({ allowedRoles }: RoleGuardProps) => {
    const { user, isAuthenticated } = useAuth();

    // LOG DE DEBUG
    console.log("--- DEBUG ROLE GUARD ---");
    console.log("1. ¿Está autenticado?:", isAuthenticated);
    console.log("2. Usuario en estado:", user);
    console.log("3. Rol del usuario:", user?.role);
    console.log("4. Roles permitidos para esta ruta:", allowedRoles);
    console.log("5. ¿El rol está en la lista?:", allowedRoles.includes(user?.role));

    if (!isAuthenticated) {
        console.warn("DEBUG: No autenticado, redirigiendo a login");
        return <Navigate to="/login" replace />;
    }

    if (!user) {
        console.warn("DEBUG: Esperando a que el usuario cargue...");
        return null;
    }

    if (!allowedRoles.includes(user.role)) {
        console.error(`DEBUG: Acceso denegado. El rol ${user.role} no está en [${allowedRoles}]`);
        const redirectPath = user.role === 'CUSTOMER' ? '/' : '/profile';
        return <Navigate to={redirectPath} replace />;
    }

    console.log("DEBUG: Acceso concedido ✅");
    return <Outlet />;
};