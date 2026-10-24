// src/layouts/MainLayout.tsx (o la ruta exacta donde lo tengas guardado)
import { Outlet } from 'react-router-dom';
import Header from './../components/Header/Header.tsx';
import Footer from './../components/Footer/Footer';
import { TouristChatWidget} from "../../features/chat/TouristChatWidget.tsx";

export default function MainLayout() {
    return (
        <div className="main-layout" style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />
            <main style={{ flex: 1 }}>
                <Outlet />
            </main>
            <Footer />

            {/* 🟢 2. Renderizamos el chat flotante de IA exclusivo para el público/turistas */}
            <TouristChatWidget />
        </div>
    );
}