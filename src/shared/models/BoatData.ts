export interface BoatData {
    id: string;
    activeTripId?: string;
    lastLocation?: LocationPoint;
    path?: [number, number][]; // Formato Leaflet [lat, lng]
}