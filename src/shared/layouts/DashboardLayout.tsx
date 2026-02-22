import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

import Header from './../components/Header/Header.tsx';

export default function DashboardLayout() {
    return (
        <Box sx={{ display: 'flex' }}>
            <Header />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Outlet />
            </Box>
        </Box>
    );
}