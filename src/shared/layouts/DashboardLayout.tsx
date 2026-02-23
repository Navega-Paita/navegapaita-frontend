import { Outlet } from 'react-router-dom';

import Header from './../components/Header/Header.tsx';

export default function DashboardLayout() {
    return (
        <div className="main-layout">
            <Header />
            <main>
                <Outlet />
            </main>
        </div>
    );
}