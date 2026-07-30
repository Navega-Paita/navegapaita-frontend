import React from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, Typography, Box
} from '@mui/material';
import type { Operation, OperationLog } from "../../shared/models/operation.model.ts";

interface Props {
    open: boolean;
    onClose: () => void;
    operation: Operation | null;
}

// Función auxiliar para traducir y formatear cada log al español
const formatLogAction = (log: OperationLog): { title: string; subtitle?: string } => {
    const actorName = log.actor?.firstName || 'Alguien';

    switch (log.action) {
        case 'ASSIGNED_WITH_VESSEL':
            return {
                title: `Se envió una solicitud a ${actorName}`,
                subtitle: log.reason || undefined,
            };
        case 'CONFIRMED':
            return {
                title: `${actorName} aceptó la solicitud`,
                subtitle: log.reason || undefined,
            };
        case 'REJECTED':
            return {
                title: `${actorName} rechazó la solicitud`,
                subtitle: log.reason || undefined,
            };
        case 'IN_PROGRESS':
            return {
                title: `${actorName} inició el viaje`,
                subtitle: log.reason || undefined,
            };
        case 'COMPLETED':
            return {
                title: `${actorName} terminó el viaje`,
                subtitle: log.reason || undefined,
            };
        case 'PENDING':
        case 'REQUESTED':
            return {
                title: `Operación creada / solicitada`,
                subtitle: log.reason || undefined,
            };
        default:
            // Fallback por si llega alguna otra acción nueva
            return {
                title: `${log.action} - por ${actorName}`,
                subtitle: log.reason || undefined,
            };
    }
};

export const OperationHistoryDialog: React.FC<Props> = ({ open, onClose, operation }) => {
    if (!operation) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: 'bold', color: '#141d38' }}>
                Historial de Actividad: {operation.tourName}
            </DialogTitle>
            <DialogContent dividers>
                {(!operation.logs || operation.logs.length === 0) && (
                    <Typography color="textSecondary">No hay registros para esta operación.</Typography>
                )}

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {operation.logs?.map((log, index) => {
                        const formatted = formatLogAction(log);

                        return (
                            <Box key={log.id} sx={{ position: 'relative', pl: 3, pb: 1 }}>
                                {/* Línea vertical decorativa */}
                                {index !== operation.logs!.length - 1 && (
                                    <Box sx={{
                                        position: 'absolute', left: 8, top: 20, bottom: 0,
                                        width: '2px', bgcolor: '#e0e0e0'
                                    }} />
                                )}
                                {/* Círculo indicador */}
                                <Box sx={{
                                    position: 'absolute', left: 0, top: 6,
                                    width: '18px', height: '18px', borderRadius: '50%',
                                    bgcolor: log.action === 'REJECTED' ? '#f44336' : '#4caf50',
                                    border: '3px solid white', boxShadow: 1
                                }} />

                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                    {formatted.title}
                                </Typography>

                                {formatted.subtitle && (
                                    <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary', mt: 0.5 }}>
                                        "{formatted.subtitle}"
                                    </Typography>
                                )}

                                <Typography variant="caption" sx={{ color: 'gray' }}>
                                    {new Date(log.createdAt).toLocaleString()}
                                </Typography>
                            </Box>
                        );
                    })}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="contained" sx={{ bgcolor: '#141d38' }}>
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    );
};