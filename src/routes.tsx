import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './features/home/HomePage';
import AboutPage from './features/about/AboutPage';
import ContactPage from './features/contact/ContactPage';
import WishlistPage from './features/wishlist/WishlistPage';
import PackageDetail from "./features/packageDetail/PackageDetail";
import SearchPage from './features/search/SearchPage';
import { FleetMap } from './features/monitoring';
import { Dashboard } from './features/dashboard/Dashboard';
import { ChatWindow } from "./features/chat/ChatWindow.tsx";
import { VesselForm } from "./features/vessels/VesselForm.tsx";
import PackageCreatePage from "./features/packages/PackageForm.tsx";
import LoginPage from "./features/authentication/LoginPage.tsx";
import RegisterPage from "./features/authentication/RegisterPage.tsx";

// Importaciones de Layouts y Guards
import { RoleGuard } from './core/guards/RoleGuard';
import DashboardLayout from "./shared/layouts/DashboardLayout.tsx";
import MainLayout from "./shared/layouts/MainLayout.tsx";
import {PublicRoute} from "./core/guards/PublicRoute.tsx";
import ProfilePage from "./features/profile/profilePage.tsx";

export default function AppRoutes() {
    return (
        <Routes>
            {/* ==========================================================
                GRUPO 1: LAYOUT PRINCIPAL (Público y Customer)
               ========================================================== */}
            <Route element={<MainLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/sobre-paita" element={<AboutPage />} />
                <Route path="/contacto" element={<ContactPage />} />
                <Route path="/buscar" element={<SearchPage />} />
                <Route path="/buscar/:slug" element={<PackageDetail />} />

                {/* Solo accesible si estás logueado como CUSTOMER */}
                <Route element={<RoleGuard allowedRoles={['CUSTOMER']} />}>
                    <Route path="/wishlist" element={<WishlistPage />} />
                    <Route path="/perfil" element={<ProfilePage />} />
                </Route>
            </Route>

            {/* ==========================================================
                GRUPO 2: RUTAS DE AUTENTICACIÓN (Sin Layout o Layout simple)
               ========================================================== */}
            <Route element={<PublicRoute />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/registro" element={<RegisterPage />} />
            </Route>

            {/* ==========================================================
                GRUPO 3: DASHBOARD ADMINISTRATIVO (Admin y Agency)
               ========================================================== */}
            <Route element={<RoleGuard allowedRoles={['ADMIN', 'AGENCY']} />}>
                <Route element={<DashboardLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/embarcaciones" element={<VesselForm />} />
                    <Route path="/crear-paquete" element={<PackageCreatePage />} />
                    <Route path="/monitoreo" element={
                        <div style={{ padding: '20px' }}>
                            <h1>Panel de Monitoreo de Embarcaciones</h1>
                            <FleetMap />
                        </div>
                    } />
                    <Route path="/chat" element={
                        <ChatWindow operationId={1} onClose={() => {}} />
                    } />
                </Route>
            </Route>

            {/* ==========================================================
                GRUPO 4: RUTAS DEL PESCADOR
               ========================================================== */}
            <Route element={<RoleGuard allowedRoles={['FISHERMAN']} />}>
                {/* Aquí puedes crear un FishermanLayout si es distinto */}
                <Route path="/perfil" element={<div>Perfil del Pescador</div>} />
            </Route>

            {/* Fallback para rutas no encontradas */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}