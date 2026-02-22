import { useState } from 'react';
import { Box, TextField, Button, Typography, Container, Paper, Alert } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { authService} from "../../core/services/auth.service.ts";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await authService.login(email, password);
            navigate('/'); // Redirigir al home tras éxito
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <Container maxWidth="xs" sx={{ py: 8 }}>
            <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
                    <Typography variant="h5" align="center" gutterBottom fontWeight={600}>
                        Iniciar Sesión
                    </Typography>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth label="Email" margin="normal"
                            value={email} onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <TextField
                            fullWidth label="Contraseña" type="password" margin="normal"
                            value={password} onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <Button
                            fullWidth variant="contained" type="submit"
                            sx={{ mt: 3, mb: 2, py: 1.5, fontWeight: 'bold' }}
                        >
                            Entrar
                        </Button>
                    </form>

                    <Typography align="center" variant="body2">
                        ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
                    </Typography>
                </Paper>
            </Box>
        </Container>
    );
}