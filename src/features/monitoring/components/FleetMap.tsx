// src/features/monitoring/components/FleetMap.tsx
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useFleetTracking } from '../hooks/useFleetTracking';
import boatIconImg from '../../../assets/icons/boat-icon.png'; // Ajusta la ruta a tu carpeta assets
import type {BoatData} from "../../../shared/models/BoatData.ts";

interface LocationPoint {
    lat: number;
    lng: number;
    speed: number;
    timestamp: string;
}

// Icono personalizado para la lancha (RF5.7)
const boatIcon = new L.Icon({
    iconUrl: boatIconImg,
    iconSize: [38, 38],     // Tamaño de la imagen
    iconAnchor: [19, 38],   // [Mitad del ancho, Total del alto] <- LA PUNTA
    popupAnchor: [0, -38],  // Para que el popup salga arriba del pin
});

// src/features/monitoring/components/FleetMap.tsx

export const FleetMap = () => {
    const { boats } = useFleetTracking() as { boats: Record<string, BoatData> };

    return (
        <MapContainer
            center={[-11.49, -77.20]}
            zoom={14} // Un poco más de zoom para ver mejor la precisión
            style={{ height: '500px', width: '100%' }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
            />

            {Object.entries(boats).map(([id, boat]) => {
                // 🛠️ LA MEJORA CLAVE:
                // Si hay una ruta (path), usamos el último punto de la ruta para el marcador.
                // Esto garantiza que el icono siempre esté EXACTAMENTE donde termina la línea azul.
                const hasPath = boat.path && boat.path.length > 0;
                const markerPosition: [number, number] | null = hasPath
                    ? boat.path![boat.path!.length - 1]
                    : (boat.lastLocation ? [boat.lastLocation.lat, boat.lastLocation.lng] : null);

                return (
                    <div key={id}>
                        {/* RF5.7: Marcador vinculado al final de la ruta */}
                        {markerPosition && (
                            <Marker
                                position={markerPosition}
                                icon={boatIcon}
                            >
                                <Popup>
                                    <strong>Embarcación: {id}</strong> <br />
                                    Velocidad: {(boat.lastLocation?.speed ?? 0 * 3.6).toFixed(1)} km/h
                                </Popup>
                            </Marker>
                        )}

                        {/* RF5.8: Polyline */}
                        {hasPath && (
                            <Polyline
                                positions={boat.path!}
                                pathOptions={{
                                    color: 'blue',
                                    weight: 4,
                                    opacity: 0.7
                                }}
                                smoothFactor={2.0}
                            />
                        )}
                    </div>
                );
            })}
        </MapContainer>
    );
};