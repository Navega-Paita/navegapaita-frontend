import React, { useEffect, useState } from 'react';
import { socketService } from "../../core/services/socket.service";
import { operationService } from "../../core/services/operation.service";
import type { Operation } from "../../shared/models/operation.model";
import type { User } from "../../shared/models/user.model";
import type { Vessel } from "../../shared/models/vessel.model";
import type { FishermanStatus } from "../../shared/models/user.model";
import { ref, onValue } from "firebase/database";
import {db} from "../../core/config/firebase.ts";
import { toast, Toaster } from "react-hot-toast";
import alertSound from '../../assets/sounds/alert-sound.mp3'; // Ajusta los ../ según tu nivel de carpeta
import type { SignalAlert, SignalAlertsMap} from "../../shared/models/signalAlert.ts";
import { ChatWindow} from "../chat/ChatWindow.tsx";
import { OperationModal} from "./OperationModal.tsx";
import AddCircleIcon from '@mui/icons-material/AddCircle'; // Opcional para el icono
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem } from '@mui/material';


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

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            {/* Contenedor de notificaciones */}
            <Toaster position="top-right" reverseOrder={false} />



            <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '20px' }}>

                {/* COLUMNA IZQUIERDA: OPERACIONES */}
                <section>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between', // Esto empuja a los hijos a los extremos
                            alignItems: 'center',
                            marginBottom: '20px',
                            width: '100%'
                        }}
                    >
                        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
                            Dashboard de Control Pesquero
                        </h1>

                        <button
                            onClick={() => setIsModalOpen(true)}
                            style={{
                                backgroundColor: '#2e7d32',
                                color: 'white',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                transition: 'background-color 0.2s'
                            }}
                            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#1b5e20')}
                            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#2e7d32')}
                        >
                            <AddCircleIcon fontSize="small" />
                            Crear Operación
                        </button>
                    </div>
                    <table border={1} style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ backgroundColor: '#f4f4f4' }}>
                        <tr>
                            <th>Tour</th>
                            <th>Estado</th>
                            <th>Pescador</th>
                            <th>Embarcacion</th>
                            <th>Seguimiento</th>
                            <th>Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        {operations.map(op => {
                            // Definimos si el chat debe estar habilitado
                            const canSendRequest = op.status === 'PENDING';
                            const isChatEnabled = ['CONFIRMED', 'IN_PROGRESS', 'COMPLETED'].includes(op.status);

                            return (
                                <tr key={op.id} style={{ textAlign: 'center' }}>
                                    <td>{op.tourName}</td>
                                    <td style={{ fontWeight: 'bold', color: getStatusColor(op.status) }}>
                                        {op.status}
                                    </td>
                                    <td>{op.fisherman ? `${op.fisherman.firstName} ${op.fisherman.lastName}` : '---'}</td>
                                    <td> {op.vessel ? `${op.vessel.name}` : '---'}</td>

                                    {/* COLUMNA: SOLICITUD / CHAT */}
                                    <td>
                                        {/* Ahora permitimos el botón si está PENDING o REQUESTED */}
                                        {op.status === 'PENDING' || op.status === 'REQUESTED' ? (
                                            <button
                                                onClick={() => handleOpenAssign(op.id, op.tourName)}
                                                style={{
                                                    backgroundColor: op.status === 'REQUESTED' ? '#ef6c00' : '#ff9800', // Un naranja más oscuro si ya se envió
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '5px 10px',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    fontWeight: op.status === 'REQUESTED' ? 'bold' : 'normal'
                                                }}
                                            >
                                                {/* Cambio dinámico de texto según el estado */}
                                                {op.status === 'REQUESTED' ? '🔄 Volver a enviar solicitud' : '📩 Enviar Solicitud'}
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => isChatEnabled && setActiveChatId(op.id)}
                                                disabled={!isChatEnabled}
                                                style={{
                                                    color: isChatEnabled ? '#0084FF' : '#999',
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: isChatEnabled ? 'pointer' : 'default'
                                                }}
                                            >
                                                {isChatEnabled ? '💬 Abrir Chat' : 'Chat cerrado'}
                                            </button>
                                        )}
                                    </td>

                                    {/* Columna: Acciones */}
                                    <td>
                                        <button onClick={() => handleEdit(op)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✏️</button>
                                        <button onClick={() => handleDelete(op.id)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>🗑️</button>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                    {/* 3. Renderizado condicional de la ventana flotante */}
                    {activeChatId && (
                        <ChatWindow
                            operationId={activeChatId}
                            onClose={() => setActiveChatId(null)}
                        />
                    )}
                </section>

                {/* COLUMNA DERECHA: RECURSOS */}
                <aside>
                    <div style={{ marginBottom: '30px' }}>
                        <h4>Pescadores</h4>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {fishermen.map(f => (
                                <li key={f.id} style={{ marginBottom: '8px', borderBottom: '1px solid #eee' }}>
                                    {f.firstName} -
                                    <span style={{ color: f.fishermanProfile?.status === 'AVAILABLE' ? 'green' : 'orange' }}>
                                        {f.fishermanProfile?.status}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4>Embarcaciones</h4>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {vessels.map(v => (
                                <li key={v.id} style={{ marginBottom: '8px', borderBottom: '1px solid #eee' }}>
                                    {v.name} -
                                    <span style={{ color: v.status === 'OPERATIVE' ? 'green' : 'red' }}>
                                        {v.status}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                </aside>
            </div>

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

        </div>
    );
};

// Helper para colores de estado
const getStatusColor = (status: string) => {
    switch (status) {
        case 'REQUESTED': return '#EAB308'; // Amarillo
        case 'CONFIRMED': return '#22C55E'; // Verde
        case 'REJECTED': return '#EF4444';  // Rojo
        case 'IN_PROGRESS': return '#3B82F6'; // Azul
        default: return '#6B7280'; // Gris
    }
};