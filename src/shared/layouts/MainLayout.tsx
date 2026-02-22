import { Outlet } from 'react-router-dom';

import Header from './../components/Header/Header.tsx';
import Footer from './../components/Footer/Footer';

export default function MainLayout() {
    return (
        <div className="main-layout">
            <Header />
            <main>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}