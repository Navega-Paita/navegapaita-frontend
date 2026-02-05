import React, { useEffect, useState } from 'react';
import { socketService } from "../../core/services/socket.service";
import { operationService } from "../../core/services/operation.service";
import type { Operation } from "../../shared/models/operation.model";
import type { User } from "../../shared/models/user.model";
import type { Vessel } from "../../shared/models/vessel.model";
import type { FishermanStatus } from "../../shared/models/user.model";

export const Dashboard: React.FC = () => {
    const [operations, setOperations] = useState<Operation[]>([]);
    const [fishermen, setFishermen] = useState<User[]>([]);
    const [vessels, setVessels] = useState<Vessel[]>([]);

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
            <h1>Dashboard de Control Pesquero</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '20px' }}>

                {/* COLUMNA IZQUIERDA: OPERACIONES */}
                <section>
                    <h3>Operaciones Turísticas</h3>
                    <table border={1} style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ backgroundColor: '#f4f4f4' }}>
                        <tr>
                            <th>ID</th>
                            <th>Tour</th>
                            <th>Estado</th>
                            <th>Pescador</th>
                            <th>Motivo</th>
                        </tr>
                        </thead>
                        <tbody>
                        {operations.map(op => (
                            <tr key={op.id} style={{ textAlign: 'center' }}>
                                <td>{op.id}</td>
                                <td>{op.tourName}</td>
                                <td style={{ fontWeight: 'bold', color: getStatusColor(op.status) }}>
                                    {op.status}
                                </td>
                                <td>{op.fisherman ? `${op.fisherman.firstName} ${op.fisherman.lastName}` : '---'}</td>
                                <td style={{ color: 'red', fontSize: '0.8em' }}>{op.rejectionReason || '-'}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
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