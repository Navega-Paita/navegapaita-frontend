import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Button, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, Chip,
    IconButton, Card, CardContent, Divider, Avatar,
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, MenuItem, Stack,
    List,
    ListItem, ListItemText
} from '@mui/material';
import {
    AddCircle as AddCircleIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    ChatBubbleOutline as ChatIcon,
    Send as SendIcon,
    DirectionsBoat as BoatIcon,
    Person as PersonIcon,
    Sync as SyncIcon
} from '@mui/icons-material';
import { socketService } from "../../core/services/socket.service";
import { operationService } from "../../core/services/operation.service";
import type { Operation } from "../../shared/models/operation.model";
import type { User, FishermanStatus } from "../../shared/models/user.model";
import type { Vessel } from "../../shared/models/vessel.model";
import { ref, onValue } from "firebase/database";
import { db } from "../../core/config/firebase.ts";
import { toast, Toaster } from "react-hot-toast";
import alertSound from '../../assets/sounds/alert-sound.mp3';
import { ChatWindow } from "../chat/ChatWindow.tsx";
import type { SignalAlert, SignalAlertsMap} from "../../shared/models/signalAlert.ts";
import { OperationModal} from "./OperationModal.tsx";
import Grid from "@mui/material/Grid";

export const Dashboard: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [operations, setOperations] = useState<Operation[]>([]);
    const [fishermen, setFishermen] = useState<User[]>([]);
    const [vessels, setVessels] = useState<Vessel[]>([]);
    const alertAudio = new Audio(alertSound);
    const [activeChatId, setActiveChatId] = useState<number | null>(null);
    const [vesselModal, setVesselModal] = useState<{
        open: boolean;
        opId: number | null;
        opName: string;
    }>({
        open: false,
        opId: null,
        opName: ''
    });
    const [selectedVesselId, setSelectedVesselId] = useState<string>('');

    const handleOpenAssign = (id: number, tourName: string) => {
        setVesselModal({
            open: true,
            opId: id,
            opName: tourName
        });
    };

    const handleDelete = async (id: number) => {
        const confirmed = window.confirm("¿Estás seguro de que deseas eliminar esta operación? Esta acción no se puede deshacer.");
        if (confirmed) {
            try {
                // Aquí llamarías a operationService.delete(id) cuando lo tengas
                console.log("Eliminando operación:", id);
                // await operationService.delete(id);
                // toast.success("Operación eliminada");
            } catch (error: any) {
                console.error(error.message);
            }
        }
    };

    const handleEdit = (operation: Operation) => {
        console.log("Editando operación:", operation);
        // Aquí abrirías el modal de edición pasando los datos de la operación actual
        // setSelectedOperation(operation);
        // setIsEditModalOpen(true);
    };

    useEffect(() => {
        const signalRef = ref(db, 'signal_alerts');
        const alertAudio = new Audio('/assets/sounds/emergency-beep.mp3');

        const unsubscribe = onValue(signalRef, (snapshot) => {
            // Tipamos la data que viene de Firebase
            const alerts = snapshot.val() as SignalAlertsMap | null;

            if (alerts) {
                // Ahora 'a' es reconocido como SignalAlert, eliminando el error de ESLint
                const anyNew = Object.values(alerts).some((a: SignalAlert) =>
                    a.trigger > Date.now() - 10000
                );

                if (anyNew) {
                    alertAudio.play().catch(e => console.warn("Audio bloqueado:", e));

                    toast.error("🚨 ALERTA DE SEGUIMIENTO: Se ha perdido la conexión GPS con una embarcación activa.", {
                        duration: Infinity,
                        icon: '📡'
                    });
                }
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const alertRef = ref(db, 'incidents_alerts');

        const unsubscribe = onValue(alertRef, (snapshot) => {
            const data = snapshot.val();

            // Verificamos que el trigger sea reciente (últimos 5 segundos)
            if (data && data.trigger > Date.now() - 5000) {

                // 1. Sonar alerta usando la constante externa
                alertAudio.currentTime = 0;
                alertAudio.play().catch(err => console.log("Audio esperando interacción del usuario."));

                // 2. Mostrar notificación persistente con botón de cierre (X)
                toast.error((t) => (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minWidth: '220px' }}>
                    <span>
                        <strong>⚠️ EMERGENCIA:</strong> {data.lastIncident.description}
                    </span>
                        <button
                            onClick={() => {
                                alertAudio.pause(); // Detiene el sonido al cerrar
                                toast.dismiss(t.id); // Cierra el toast específico
                            }}
                            style={{
                                background: 'transparent',
                                border: '1px solid #713200',
                                borderRadius: '4px',
                                marginLeft: '10px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                padding: '2px 6px'
                            }}
                        >
                            X
                        </button>
                    </div>
                ), {
                    duration: Infinity,
                    position: 'top-right',
                    style: {
                        border: '2px solid red',
                        padding: '16px',
                        color: '#713200',
                        fontWeight: 'bold'
                    },
                });
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        // 1. Carga inicial de datos
        const loadInitialData = async () => {
            try {
                const [ops, fish, ves] = await Promise.all([
                    operationService.getAll(),
                    operationService.getFishermen(),
                    operationService.getVessels()
                ]);
                setOperations(ops);
                setFishermen(fish);
                setVessels(ves);
            } catch (error) {
                console.error("Error cargando datos iniciales:", error);
            }
        };

        loadInitialData();

        // 2. Escuchar Sockets
        socketService.onOperationUpdate((updatedOp) => {
            setOperations((prev) => {
                const index = prev.findIndex(op => op.id === updatedOp.id);
                if (index !== -1) {
                    const newOps = [...prev];
                    newOps[index] = updatedOp;
                    return newOps;
                }
                return [updatedOp, ...prev]; // Si es nueva, arriba
            });
        });

        socketService.onResourceUpdate((data) => {
            if (data.type === 'FISHERMAN') {
                setFishermen(prev => prev.map(f =>
                    f.id === (data.userId || data.id)
                        ? {
                            ...f,
                            fishermanProfile: f.fishermanProfile
                                ? {
                                    ...f.fishermanProfile,
                                    status: data.status as FishermanStatus // <-- CASTING SEGURO
                                }
                                : undefined
                        }
                        : f
                ));
            } else if (data.type === 'VESSEL') {
                setVessels(prev => prev.map(v =>
                    v.id === data.id ? { ...v, status: data.status } : v
                ));
            }
        });

        return () => {
            socketService.socket.off('operationUpdate');
            socketService.socket.off('resourceStatusUpdate');
        };
    }, []);

    // Helper para Renderizar Chips de Estado
    const renderStatusChip = (status: string) => {
        const colors: any = {
            'PENDING': { bg: '#fff3e0', text: '#ef6c00', label: 'Pendiente' },
            'REQUESTED': { bg: '#fffde7', text: '#fbc02d', label: 'Solicitado' },
            'CONFIRMED': { bg: '#e8f5e9', text: '#2e7d32', label: 'Confirmado' },
            'IN_PROGRESS': { bg: '#e3f2fd', text: '#1565c0', label: 'En Curso' },
            'REJECTED': { bg: '#ffebee', text: '#c62828', label: 'Rechazado' },
        };
        const config = colors[status] || { bg: '#f5f5f5', text: '#757575', label: status };
        return <Chip label={config.label} sx={{ bgcolor: config.bg, color: config.text, fontWeight: 'bold', borderRadius: '6px' }} size="small" />;
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f8f9fa', minHeight: '100vh' }}>
            <Toaster position="top-right" />

            {/* HEADER DEL DASHBOARD */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#141d38' }}>
                        Control de Operaciones
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Monitoreo de embarcaciones y tours.
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddCircleIcon />}
                    onClick={() => setIsModalOpen(true)}
                    sx={{
                        bgcolor: '#2e7d32',
                        borderRadius: '10px',
                        px: 3,
                        py: 1.2,
                        textTransform: 'none',
                        fontWeight: 'bold',
                        '&:hover': { bgcolor: '#1b5e20' }
                    }}
                >
                    Nueva Operación
                </Button>
            </Box>

            <Grid container spacing={3}>
                {/* COLUMNA IZQUIERDA: TABLA */}
                <Grid size={{ xs: 12, lg: 9 }}>
                    <TableContainer component={Paper} sx={{ borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                        <Table>
                            <TableHead sx={{ bgcolor: '#f1f3f5' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Tour</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Estado</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Asignación</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Seguimiento</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {operations.map((op) => (
                                    <TableRow key={op.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{op.tourName}</Typography>
                                        </TableCell>
                                        <TableCell align="center">{renderStatusChip(op.status)}</TableCell>
                                        <TableCell>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Box>
                                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                        {op.fisherman ? `${op.fisherman.firstName}` : 'Sin Pescador'}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ display: 'block', color: 'primary.main' }}>
                                                        {op.vessel?.name || '---'}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        </TableCell>
                                        <TableCell align="center">
                                            {op.status === 'PENDING' || op.status === 'REQUESTED' ? (
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    color={op.status === 'REQUESTED' ? "warning" : "primary"}
                                                    startIcon={op.status === 'REQUESTED' ? <SyncIcon /> : <SendIcon />}
                                                    onClick={() => handleOpenAssign(op.id, op.tourName)}
                                                    sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}
                                                >
                                                    {op.status === 'REQUESTED' ? 'Reenviar' : 'Solicitar'}
                                                </Button>
                                            ) : (
                                                <IconButton
                                                    onClick={() => setActiveChatId(op.id)}
                                                    disabled={!['CONFIRMED', 'IN_PROGRESS'].includes(op.status)}
                                                    color="primary"
                                                >
                                                    <ChatIcon />
                                                </IconButton>
                                            )}
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton size="small" onClick={() => handleEdit(op)}><EditIcon fontSize="small" /></IconButton>
                                            <IconButton size="small" color="error" onClick={() => handleDelete(op.id)}><DeleteIcon fontSize="small" /></IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>

                {/* COLUMNA DERECHA: RECURSOS */}
                <Grid size={{ xs: 12, lg: 3 }}>
                    <Stack spacing={3}>
                        {/* CARD PESCADORES */}
                        <Card sx={{ borderRadius: '15px', bgcolor: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                            <CardContent>
                                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1, fontWeight: 700 }}>
                                    <PersonIcon color="primary" /> Pescadores
                                </Typography>
                                <List sx={{ width: '100%' }}>
                                    {fishermen.map(f => (
                                        <ListItem key={f.id} sx={{ px: 0, py: 1 }}>
                                            <ListItemText
                                                primary={f.firstName}
                                                secondary={
                                                    <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: f.fishermanProfile?.status === 'AVAILABLE' ? '#4caf50' : '#ff9800' }} />
                                                        {f.fishermanProfile?.status}
                                                    </Box>
                                                }
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </CardContent>
                        </Card>

                        {/* CARD EMBARCACIONES */}
                        <Card sx={{ borderRadius: '15px', bgcolor: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                            <CardContent>
                                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1, fontWeight: 700 }}>
                                    <BoatIcon color="primary" /> Embarcaciones
                                </Typography>
                                <List>
                                    {vessels.map(v => (
                                        <ListItem key={v.id} sx={{ px: 0, py: 1 }}>
                                            <ListItemText
                                                primary={v.name}
                                                secondary={
                                                    <Typography variant="caption" sx={{ color: v.status === 'OPERATIVE' ? 'green' : 'red', fontWeight: 'bold' }}>
                                                        ● {v.status}
                                                    </Typography>
                                                }
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </CardContent>
                        </Card>
                    </Stack>
                </Grid>
            </Grid>

            {activeChatId && (
                <ChatWindow
                    operationId={activeChatId}
                    onClose={() => setActiveChatId(null)}
                />
            )}

            <Dialog
                open={vesselModal.open}
                onClose={() => setVesselModal({ ...vesselModal, open: false })}
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle sx={{ fontWeight: 'bold' }}>
                    🚢 Asignar Embarcación
                </DialogTitle>
                <DialogContent>
                    <p style={{ fontSize: '0.9em', color: '#666', marginBottom: '15px' }}>
                        Tour: <strong>{vesselModal.opName}</strong>
                    </p>

                    <TextField
                        select
                        fullWidth
                        label="Asignar Embarcación (Operativas)"
                        required
                        // Usamos el estado que ya tienes definido: selectedVesselId
                        value={selectedVesselId}
                        onChange={(e) => setSelectedVesselId(e.target.value)}
                        helperText={vessels.filter(v => v.status === 'OPERATIVE').length === 0 ? "No hay embarcaciones operativas" : ""}
                    >
                        {vessels
                            .filter(v => v.status === 'OPERATIVE')
                            .map((v) => (
                                // Importante: value como String para que coincida con el estado selectedVesselId
                                <MenuItem key={v.id} value={String(v.id)}>
                                    {v.name} ({v.registrationNumber})
                                </MenuItem>
                            ))}
                    </TextField>
                </DialogContent>
                <DialogActions sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                    <Button onClick={() => setVesselModal({ ...vesselModal, open: false })}>
                        Cancelar
                    </Button>
                    <Button
                        variant="contained"
                        color="warning"
                        disabled={!selectedVesselId}
                        onClick={async () => {
                            try {
                                // Usamos vesselModal.opId que guardamos al abrir el modal
                                await operationService.sendRequest(Number(vesselModal.opId), Number(selectedVesselId));

                                // Limpiamos y cerramos
                                setVesselModal({ ...vesselModal, open: false });
                                setSelectedVesselId('');
                                toast.success("Solicitud enviada correctamente");
                            } catch (err: any) {
                                alert(err.message);
                            }
                        }}
                    >
                        🚀 Enviar Solicitud
                    </Button>
                </DialogActions>
            </Dialog>

            <OperationModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={(newOp) => {
                    toast.success("Operación creada y asignada correctamente");
                }}
            />
        </Box>
    );
};