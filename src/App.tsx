import { Box } from '@mui/material';
import AppRoutes from './routes';

function App(){
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Box component="main" sx={{ flexGrow: 1 }}>
                <AppRoutes />
            </Box>
        </Box>
    );
}

export default App;