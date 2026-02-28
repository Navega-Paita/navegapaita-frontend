import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Alert,
    CircularProgress
} from '@mui/material';
import { operationService } from "../../core/services/operation.service";

interface Props {
    open: boolean;
    onClose: () => void;
    onSuccess: (newOp: any) => void;
}

export const OperationModal: React.FC<Props> = ({ open, onClose, onSuccess }) => {
    // Estado para la carga y errores
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Estado del formulario
    const [form, setForm] = useState({
        tourName: '',
        dateTime: new Date().toISOString().slice(0, 16),
    });

    // Limpiar el formulario y errores cuando el modal se abre/cierra
    useEffect(() => {
        if (open) {
            setForm({
                tourName: '',
                dateTime: new Date().toISOString().slice(0, 16),
            });
            setError(null);
        }
    }, [open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            // Validamos que el nombre no esté vacío (espacios en blanco)
            if (!form.tourName.trim()) {
                throw new Error("El nombre del tour es obligatorio");
            }

            const payload = {
                tourName: form.tourName,
                dateTime: new Date(form.dateTime).toISOString()
            };

            const result = await operationService.create(payload);

            onSuccess(result);
            onClose();
        } catch (err: any) {
            // Capturamos el mensaje de error del backend o del throw manual
            setError(err.message || "Ocurrió un error al crear la operación");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={loading ? undefined : onClose} // Evita cerrar mientras guarda
            fullWidth
            maxWidth="xs"
        >
            <DialogTitle sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                🚢 Nueva Operación Turística
            </DialogTitle>

            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>

                        {error && (
                            <Alert severity="error" variant="filled" sx={{ mb: 1 }}>
                                {error}
                            </Alert>
                        )}

                        <TextField
                            label="Nombre del Tour"
                            placeholder="Ej: Tour Islas Ballestas"
                            required
                            fullWidth
                            autoFocus
                            value={form.tourName}
                            onChange={(e) => setForm({ ...form, tourName: e.target.value })}
                            disabled={loading}
                        />

                        <TextField
                            label="Fecha y Hora de Salida"
                            type="datetime-local"
                            required
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            value={form.dateTime}
                            onChange={(e) => setForm({ ...form, dateTime: e.target.value })}
                            disabled={loading}
                        />
                    </Box>
                </DialogContent>

                <DialogActions sx={{ p: 2, bgcolor: '#f9f9f9' }}>
                    <Button
                        onClick={onClose}
                        disabled={loading}
                        color="inherit"
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                        sx={{
                            backgroundColor: '#2e7d32',
                            '&:hover': { backgroundColor: '#1b5e20' }
                        }}
                    >
                        {loading ? 'Guardando...' : 'Crear Operación'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};


