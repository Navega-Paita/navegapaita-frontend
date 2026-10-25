import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Button, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, Chip,
    IconButton, Card, CardContent, Divider, Avatar,
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, MenuItem, Stack,
    List, Tooltip,
    ListItem, ListItemText, CircularProgress
} from '@mui/material';
import {
    AddCircle as AddCircleIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    History as HistoryIcon,
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
import { ChatWindow } from "../chat/ChatWindow.tsx";
import type { SignalAlert, SignalAlertsMap} from "../../shared/models/signalAlert.ts";
import { OperationModal} from "./OperationModal.tsx";
import Grid from "@mui/material/Grid";
import { OperationHistoryDialog } from "./OperationHistoryDialog.tsx";

const STATUS_COLORS = {
    AVAILABLE: '#4caf50', // Verde
    BUSY: '#ff9800',      // Naranja/Amarillo
    OFFLINE: '#9e9e9e',   // Gris
};

export const Dashboard: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [operations, setOperations] = useState<Operation[]>([]);
    const [fishermen, setFishermen] = useState<User[]>([]);
    const [vessels, setVessels] = useState<Vessel[]>([]);
    const alertAudio = new Audio('/sounds/alert-sound.mp3');
    const [activeChatId, setActiveChatId] = useState<number | null>(null);

    // 🟢 Estado para almacenar los chats que tienen mensajes nuevos sin leer del pescador
    const [unreadChats, setUnreadChats] = useState<Record<number, boolean>>({});

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
    const [historyOpen, setHistoryOpen] = useState(false);
    const [selectedOp, setSelectedOp] = useState<Operation | null>(null);
    const [isLoadingLogs, setIsLoadingLogs] = useState(false);
    const [operationToEdit, setOperationToEdit] = useState<Operation | null>(null);

    const handleOpenAssign = (id: number, tourName: string) => {
        setVesselModal({
            open: true,
            opId: id,
            opName: tourName
        });
    };

    const checkVesselOnBreak = (vessel: Vessel, operations: Operation[], currentOpId: number | null) => {
        const operation = operations.find((op: Operation) => op.id === currentOpId);

        // Casteamos 'vessel.owner' como any para acceder de forma segura a availabilityExceptions sin alterar el modelo
        const owner = vessel.owner as any;
        if (!operation || !owner?.availabilityExceptions) return null;

        const opDate = new Date(operation.dateTime);
        const opDayTime = new Date(opDate.getFullYear(), opDate.getMonth(), opDate.getDate()).getTime();

        const conflict = owner.availabilityExceptions.find((ex: any) => {
            const start = new Date(ex.startDate);
            const end = new Date(ex.endDate);

            const startDay = new Date(start.getFullYear(), ex.month !== undefined ? ex.month : start.getMonth(), start.getDate()).getTime();
            const endDay = new Date(end.getFullYear(), ex.month !== undefined ? ex.month : end.getMonth(), end.getDate()).getTime();

            return opDayTime >= startDay && opDayTime <= endDay;
        });

        return conflict ? conflict.reason : null;
    };

    const handleViewLogs = async (operation: Operation) => {
        setIsLoadingLogs(true);
        try {
            const fullOp = await operationService.getById(operation.id);
            setSelectedOp(fullOp);
            setHistoryOpen(true);
        } catch (error) {
            console.error("Error al cargar historial:", error);
        } finally {
            setIsLoadingLogs(false);
        }
    };

    const handleDelete = async (id: number) => {
        const confirmed = window.confirm("¿Estás seguro de que deseas eliminar esta operación? Esta acción no se puede deshacer.");
        if (confirmed) {
            try {
                await operationService.delete(id);
                toast.success("Operación eliminada");
            } catch (error: any) {
                console.error(error.message);
            }
        }
    };

    const handleEdit = (operation: Operation) => {
        setOperationToEdit(operation);
        setIsModalOpen(true);
    };

    const handleOpenCreate = () => {
        setOperationToEdit(null);
        setIsModalOpen(true);
    };

    // 🟢 EFECTO PARA ESCUCHAR MENSAJES NUEVOS EN TIEMPO REAL EN LOS CHATS ACTIVOS
    useEffect(() => {
        if (operations.length === 0) return;

        const unsubscribes: (() => void)[] = [];

        operations.forEach((op) => {
            // Escuchamos únicamente operaciones confirmadas o en curso
            if (['CONFIRMED', 'IN_PROGRESS'].includes(op.status)) {
                const chatRef = ref(db, `operation_chats/${op.id}/messages`);

                const unsubscribe = onValue(chatRef, (snapshot) => {
                    const data = snapshot.val();
                    if (data) {
                        const messages = Object.values(data) as any[];
                        const lastMessage = messages[messages.length - 1];

                        // Si el último mensaje fue enviado por el pescador y el chat no está abierto actualmente
                        if (lastMessage && lastMessage.sender === 'FISHERMAN') {
                            // Validar que el mensaje sea reciente para no disparar alertas retroactivas al cargar
                            const isRecent = lastMessage.timestamp && (Date.now() - lastMessage.timestamp < 10000);

                            if (isRecent && activeChatId !== op.id) {
                                // Reproducir beep sutil de notificación
                                const chatAudio = new Audio('/sounds/alert-sound.mp3');
                                chatAudio.play().catch(() => {});

                                toast(`💬 Nuevo mensaje de ${op.fisherman?.firstName || 'Pescador'} en: ${op.tourName}`, {
                                    position: 'bottom-right',
                                    duration: 4000,
                                });

                                // Marcar con indicador de no leído
                                setUnreadChats((prev) => ({ ...prev, [op.id]: true }));
                            }
                        }
                    }
                });

                unsubscribes.push(unsubscribe);
            }
        });

        return () => {
            unsubscribes.forEach((unsub) => unsub());
        };
    }, [operations, activeChatId]);

    useEffect(() => {
        const signalRef = ref(db, 'signal_alerts');
        const alertAudio = new Audio('/sounds/emergency-beep.mp3');

        const unsubscribe = onValue(signalRef, (snapshot) => {
            const alerts = snapshot.val() as SignalAlertsMap | null;

            if (alerts) {
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

            if (data && data.trigger > Date.now() - 5000) {
                alertAudio.currentTime = 0;
                alertAudio.play().catch(err => console.log("Audio esperando interacción del usuario."));

                toast.error((t) => (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minWidth: '220px' }}>
                    <span>
                        <strong>⚠️ EMERGENCIA:</strong> {data.lastIncident.description}
                    </span>
                        <button
                            onClick={() => {
                                alertAudio.pause();
                                toast.dismiss(t.id);
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

        socketService.onOperationUpdate((updatedOp) => {
            setOperations((prev) => {
                const index = prev.findIndex(op => op.id === updatedOp.id);
                if (index !== -1) {
                    const newOps = [...prev];
                    newOps[index] = updatedOp;
                    return newOps;
                }
                return [updatedOp, ...prev];
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
                                    status: data.status as FishermanStatus
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

        socketService.onOperationDeleted((deletedId) => {
            setOperations((prev) => prev.filter(op => op.id !== deletedId));
        });

        return () => {
            socketService.socket.off('operationUpdate');
            socketService.socket.off('operationDeleted');
            socketService.socket.off('resourceStatusUpdate');
        };
    }, []);

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
                                            {['PENDING', 'REQUESTED', 'REJECTED'].includes(op.status) ? (
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    color={
                                                        op.status === 'REJECTED' ? "error" :
                                                            op.status === 'REQUESTED' ? "warning" : "primary"
                                                    }
                                                    startIcon={<SyncIcon />}
                                                    onClick={() => handleOpenAssign(op.id, op.tourName)}
                                                    sx={{
                                                        borderRadius: '8px',
                                                        textTransform: 'none',
                                                        fontWeight: 600,
                                                        borderWidth: op.status === 'REJECTED' ? 2 : 1,
                                                    }}
                                                >
                                                    {op.status === 'REJECTED' ? 'Reintentar' :
                                                        op.status === 'REQUESTED' ? 'Reenviar' : 'Solicitar'}
                                                </Button>
                                            ) : (
                                                /* 🟢 BOTÓN DE CHAT CON INDICADOR VISUAL (BADGE / PUNTO ROJO) */
                                                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                                                    <IconButton
                                                        onClick={() => {
                                                            setActiveChatId(op.id);
                                                            // Al abrir el chat, limpiamos la alerta de no leído para esta operación
                                                            setUnreadChats((prev) => ({ ...prev, [op.id]: false }));
                                                        }}
                                                        disabled={!['CONFIRMED', 'IN_PROGRESS'].includes(op.status)}
                                                        color="primary"
                                                    >
                                                        <ChatIcon />
                                                    </IconButton>
                                                    {unreadChats[op.id] && (
                                                        <span
                                                            style={{
                                                                position: 'absolute',
                                                                top: 6,
                                                                right: 6,
                                                                width: 10,
                                                                height: 10,
                                                                backgroundColor: '#f44336',
                                                                borderRadius: '50%',
                                                                border: '2px solid white'
                                                            }}
                                                        />
                                                    )}
                                                </Box>
                                            )}
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                size="small"
                                                disabled={isLoadingLogs}
                                                onClick={() => handleViewLogs(op)}
                                                sx={{ color: '#141d38', mr: 0.5 }}
                                            >
                                                {isLoadingLogs && selectedOp?.id === op.id ? (
                                                    <CircularProgress size={20} color="inherit" />
                                                ) : (
                                                    <HistoryIcon fontSize="small" />
                                                )}
                                            </IconButton>
                                            <IconButton size="small" onClick={() => handleEdit(op)}><EditIcon fontSize="small" /></IconButton>
                                            <IconButton size="small" color="error" onClick={() => handleDelete(op.id)}><DeleteIcon fontSize="small" /></IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>

                <Grid size={{ xs: 12, lg: 3 }}>
                    <Stack spacing={3}>
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
                                                    <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Box
                                                            sx={{
                                                                width: 8,
                                                                height: 8,
                                                                borderRadius: '50%',
                                                                bgcolor: STATUS_COLORS[f.fishermanProfile?.status as keyof typeof STATUS_COLORS] || STATUS_COLORS.OFFLINE
                                                            }}
                                                        />
                                                        <Typography variant="caption" sx={{ fontWeight: 'medium', color: 'text.secondary' }}>
                                                            {f.fishermanProfile?.status || 'OFFLINE'}
                                                        </Typography>
                                                    </Box>
                                                }
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </CardContent>
                        </Card>

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

            <OperationHistoryDialog
                open={historyOpen}
                onClose={() => setHistoryOpen(false)}
                operation={selectedOp}
            />

            <Dialog
                open={vesselModal.open}
                onClose={() => {
                    setVesselModal({ ...vesselModal, open: false });
                    setSelectedVesselId('');
                }}
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                    Asignar pescador
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                        Tour: <strong>{vesselModal.opName}</strong>
                    </Typography>

                    <TextField
                        select
                        fullWidth
                        label="Embarcaciones Disponibles"
                        required
                        value={selectedVesselId}
                        onChange={(e) => setSelectedVesselId(e.target.value)}
                        error={Boolean(selectedVesselId && checkVesselOnBreak(vessels.find(v => String(v.id) === selectedVesselId)!, operations, vesselModal.opId))}
                    >
                        {vessels
                            .filter(v => v.status === 'OPERATIVE')
                            .map((v) => {
                                const breakReason = checkVesselOnBreak(v, operations, vesselModal.opId);
                                const onBreak = breakReason !== null;

                                return (
                                    <MenuItem
                                        key={v.id}
                                        value={String(v.id)}
                                        disabled={onBreak}
                                        sx={{
                                            py: 1.5,
                                            borderBottom: '1px solid #f0f0f0',
                                            '&.Mui-disabled': {
                                                backgroundColor: '#fff5f5',
                                                opacity: 0.8
                                            }
                                        }}
                                    >
                                        <Tooltip
                                            title={onBreak ? `No disponible: ${breakReason}` : ""}
                                            placement="right"
                                            arrow
                                        >
                                            <Box sx={{ width: '100%' }}>
                                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                    <Box>
                                                        <Typography variant="subtitle2" sx={{ fontWeight: onBreak ? 'normal' : 'bold' }}>
                                                            {v.name}
                                                        </Typography>
                                                        <Typography variant="caption" color="textSecondary">
                                                            Propietario: {v.owner?.firstName ? `${v.owner.firstName} ${v.owner.lastName || ''}` : 'Sin propietario'}
                                                        </Typography>
                                                    </Box>

                                                    {onBreak && (
                                                        <Chip
                                                            size="small"
                                                            label="En Descanso 💤"
                                                            color="error"
                                                            variant="outlined"
                                                            sx={{ height: 20, fontSize: '0.65rem', fontWeight: 'bold' }}
                                                        />
                                                    )}
                                                </Stack>
                                            </Box>
                                        </Tooltip>
                                    </MenuItem>
                                );
                            })}
                    </TextField>
                </DialogContent>
                <DialogActions sx={{ p: 2, bgcolor: '#f8fafc' }}>
                    <Button onClick={() => setVesselModal({ ...vesselModal, open: false })}>
                        Cancelar
                    </Button>
                    <Button
                        variant="contained"
                        color="warning"
                        disabled={!selectedVesselId}
                        onClick={async () => {
                            try {
                                await operationService.sendRequest(Number(vesselModal.opId), Number(selectedVesselId));
                                setVesselModal({ ...vesselModal, open: false });
                                setSelectedVesselId('');
                                toast.success("Solicitud enviada correctamente");
                            } catch (err: any) {
                                toast.error(err.message);
                            }
                        }}
                        sx={{ fontWeight: 'bold', textTransform: 'none' }}
                    >
                        🚀 Enviar Solicitud
                    </Button>
                </DialogActions>
            </Dialog>

            <OperationModal
                open={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setOperationToEdit(null);
                }}
                operationToEdit={operationToEdit}
                onSuccess={(updatedOp) => {
                    toast.success(operationToEdit ? "Operación actualizada" : "Operación creada");
                }}
            />
        </Box>
    );
};