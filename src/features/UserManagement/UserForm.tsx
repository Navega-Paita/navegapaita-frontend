import React, { useState } from 'react';
import { TextField, Button, Box, Alert } from '@mui/material';
import { userService } from '../../core/services/user.service';

interface UserFormProps {
    onSuccess: () => void;
}

export const UserForm: React.FC<UserFormProps> = ({ onSuccess }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (formData.password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres");
            return;
        }

        setLoading(true);
        try {
            // Construimos el DTO completo que espera el backend
            const payload = {
                ...formData,
                role: 'OPERATOR', // Agregamos el rol explícitamente
            };

            await userService.createOperator(payload);
            onSuccess();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            {error && <Alert severity="error">{error}</Alert>}

            <TextField
                label="Nombre"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
            <TextField
                label="Apellido"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />
            <TextField
                label="Correo Electrónico"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <TextField
                label="Contraseña"
                type="password"
                required
                helperText="Mínimo 6 caracteres"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />

            <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{ mt: 2, py: 1.5 }}
            >
                {loading ? 'Registrando...' : 'Registrar Operador'}
            </Button>
        </Box>
    );
};