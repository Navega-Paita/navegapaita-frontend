import {Routes, Route, Navigate} from 'react-router-dom'
import HomePage from './features/home/HomePage'
import AboutPage from './features/about/AboutPage'
import PackagesPage from './features/packages/PackagesPage'
import ContactPage from './features/contact/ContactPage'
import WishlistPage from './features/wishlist/WishlistPage'
import PackageDetail from "./features/packageDetail/PackageDetail";
import SearchPage from './features/search/SearchPage';
import { FleetMap } from './features/monitoring/components/FleetMap';
import { Dashboard } from './features/dashboard/Dashboard';
import {ChatWindow} from "./features/chat/ChatWindow.tsx";
import {VesselForm} from "./features/vessels/VesselForm.tsx";
import PackageCreatePage from "./features/packages/PackageForm.tsx";
import LoginPage from "./features/authentication/LoginPage.tsx";
import RegisterPage from "./features/authentication/RegisterPage.tsx";


export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/sobre-paita" element={<AboutPage />} />
            <Route path="/contacto" element={<ContactPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/perfil" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registro" element={<RegisterPage />} />
            <Route path="/buscar/:slug" element={<PackageDetail />} />
            <Route path="/buscar" element={<SearchPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/embarcaciones" element={<VesselForm />} />
            <Route path="/crear-paquete" element={<PackageCreatePage />} />
            <Route path="/chat" element={<ChatWindow operationId={1} onClose={function(): void {
                throw new Error("Function not implemented.")
            } } />} />
            <Route path="/monitoreo" element={
                <div style={{ padding: '20px' }}>
                    <h1>Panel de Monitoreo de Embarcaciones</h1>
                    <FleetMap />
                </div>
            } />

        </Routes>
    )
}