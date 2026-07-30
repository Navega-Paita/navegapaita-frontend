// src/modules/operations/components/OperationModal.tsx
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
    MenuItem
} from '@mui/material';
import { operationService} from "../../core/services/operation.service.ts";
import { packageService } from "../../core/services/package.service"; // 🟢 Importar packageService
import type { Operation} from "../../shared/models/operation.model.ts";
import type { Package } from "../../shared/models/package"; // 🟢 Importar tipo Package

interface Props {
    open: boolean;
    onClose: () => void;
    onSuccess: (op: Operation) => void;
    operationToEdit?: Operation | null;
}

export const OperationModal: React.FC<Props> = ({ open, onClose, onSuccess, operationToEdit }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [packages, setPackages] = useState<Package[]>([]); // 🟢 Estado para almacenar los paquetes

    const [form, setForm] = useState({
        tourName: '',
        dateTime: '',
        packageId: 1, // 🟢 Valor por defecto 1
    });

    // Cargar paquetes al abrir el modal
    useEffect(() => {
        if (open) {
            packageService.getAllPackagesAdmin()
                .then((data) => setPackages(data))
                .catch((err) => console.error("Error al cargar paquetes:", err));

            if (operationToEdit) {
                setForm({
                    tourName: operationToEdit.tourName,
                    dateTime: new Date(operationToEdit.dateTime).toISOString().slice(0, 16),
                    packageId: operationToEdit.package?.id || 1, // 🟢 Cargar el paquete actual o 1 por defecto
                });
            } else {
                setForm({
                    tourName: '',
                    dateTime: new Date().toISOString().slice(0, 16),
                    packageId: 1, // 🟢 Por defecto ID 1
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
                dateTime: new Date(form.dateTime).toISOString(),
                packageId: Number(form.packageId), // 🟢 Enviar el packageId seleccionado
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
        <Dialog open={open} onClose={loading ? undefined : onClose} fullWidth maxWidth="sm">
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

                        {/* 🟢 Selector de Paquetes con información relevante */}
                        <TextField
                            select
                            label="Paquete Asociado"
                            required
                            fullWidth
                            value={form.packageId}
                            onChange={(e) => setForm({ ...form, packageId: Number(e.target.value) })}
                            disabled={loading}
                        >
                            {packages.map((pkg) => (
                                <MenuItem key={pkg.id} value={pkg.id}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontWeight: 500 }}>{pkg.title}</span>
                                        <span style={{ fontSize: '0.75rem', color: '#666' }}>
                                            Duración: {pkg.duration || 'N/D'} | Precio: ${pkg.price || 0}
                                        </span>
                                    </Box>
                                </MenuItem>
                            ))}
                        </TextField>
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