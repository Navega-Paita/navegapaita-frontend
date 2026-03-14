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
// src/modules/operations/components/OperationModal.tsx
import type { Operation } from "../../shared/models/operation.model";

interface Props {
    open: boolean;
    onClose: () => void;
    onSuccess: (op: Operation) => void;
    operationToEdit?: Operation | null; // <-- Nueva prop
}

export const OperationModal: React.FC<Props> = ({ open, onClose, onSuccess, operationToEdit }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [form, setForm] = useState({
        tourName: '',
        dateTime: '',
    });

    // Efecto para detectar si estamos editando o creando
    useEffect(() => {
        if (open) {
            if (operationToEdit) {
                // Modo Edición: Cargamos data existente
                setForm({
                    tourName: operationToEdit.tourName,
                    dateTime: new Date(operationToEdit.dateTime).toISOString().slice(0, 16),
                });
            } else {
                // Modo Creación: Resetear a valores por defecto
                setForm({
                    tourName: '',
                    dateTime: new Date().toISOString().slice(0, 16),
                });
            }
            setError(null);
        }
    }, [open, operationToEdit]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const payload = {
                tourName: form.tourName,
                dateTime: new Date(form.dateTime).toISOString()
            };

            let result;
            if (operationToEdit) {
                result = await operationService.update(operationToEdit.id, payload);
            } else {
                result = await operationService.create(payload);
            }

            onSuccess(result);
            onClose();
        } catch (err: any) {
            setError(err.message || "Error al procesar la operación");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={loading ? undefined : onClose} fullWidth maxWidth="xs">
            <DialogTitle sx={{ fontWeight: 'bold' }}>
                {operationToEdit ? '📝 Editar Operación' : '🚢 Nueva Operación'}
            </DialogTitle>

            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        {error && <Alert severity="error">{error}</Alert>}

                        <TextField
                            label="Nombre del Tour"
                            required
                            fullWidth
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
                    <Button onClick={onClose} disabled={loading} color="inherit">
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        sx={{ bgcolor: operationToEdit ? '#1976d2' : '#2e7d32' }}
                    >
                        {loading ? 'Guardando...' : operationToEdit ? 'Actualizar' : 'Crear'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

