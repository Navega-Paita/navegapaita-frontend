import React from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, Typography, Box, Divider
} from '@mui/material';
import type { Operation } from "../../shared/models/operation.model.ts";

interface Props {
    open: boolean;
    onClose: () => void;
    operation: Operation | null;
}

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
                    {operation.logs?.map((log, index) => (
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
                                {log.action}
                                {log.actor && ` - por ${log.actor.firstName}`}
                            </Typography>

                            {log.reason && (
                                <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary', mt: 0.5 }}>
                                    "{log.reason}"
                                </Typography>
                            )}

                            <Typography variant="caption" sx={{ color: 'gray' }}>
                                {new Date(log.createdAt).toLocaleString()}
                            </Typography>
                        </Box>
                    ))}
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