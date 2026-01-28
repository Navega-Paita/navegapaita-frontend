import { Box } from '@mui/material';
import Header from './shared/components/Header/Header';
import Footer from './shared/components/Footer/Footer';
import AppRoutes from './routes';

function App(){
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            <Box component="main" sx={{ flexGrow: 1 }}>
                <AppRoutes />
            </Box>
            <Footer />
        </Box>
    );
}

export default App;