// src/features/monitoring/hooks/useFleetTracking.ts
import { useEffect, useState } from 'react';
import { ref, onValue, off } from 'firebase/database';
import { db } from '../../../core/config/firebase';
import type {BoatData} from "../../../shared/models/BoatData.ts";

export const useFleetTracking = () => {
    const [boats, setBoats] = useState<Record<string, BoatData>>({});

    useEffect(() => {
        const fishermenRef = ref(db, 'fishermen');

        const unsubscribeFishermen = onValue(fishermenRef, (snapshot) => {
            const data = snapshot.val();
            if (!data) {
                setBoats({});
                return;
            }

            const currentIds = Object.keys(data);

            setBoats((prev) => {
                const newBoats = { ...prev };

                // 1. Limpiar pescadores que ya no existen en DB
                Object.keys(newBoats).forEach(id => {
                    if (!currentIds.includes(id)) delete newBoats[id];
                });

                currentIds.forEach((id) => {
                    const boat = data[id];
                    const tripId = boat.activeTripId;

                    // 2. Si NO hay viaje activo, reseteamos el path y la ubicación
                    // para que desaparezcan del mapa
                    if (!tripId) {
                        delete newBoats[id]; // Esto hace que el marcador desaparezca totalmente
                        return;
                    }

                    // 3. Si hay viaje, actualizamos o creamos la entrada
                    newBoats[id] = {
                        ...newBoats[id],
                        ...boat,
                        id
                    };

                    // Escuchar puntos solo si hay un tripId nuevo o diferente
                    const pointsRef = ref(db, `tripPoints/${tripId}`);
                    onValue(pointsRef, (pSnapshot) => {
                        const pointsData = pSnapshot.val() || {};
                        const path = Object.values(pointsData)
                            .sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
                            .map((p: any) => [p.lat, p.lng] as [number, number]);

                        setBoats((current) => ({
                            ...current,
                            [id]: { ...current[id], path }
                        }));
                    }, { onlyOnce: false });
                });

                return newBoats;
            });
        });

        return () => off(fishermenRef);
    }, []);

    return { boats };
};