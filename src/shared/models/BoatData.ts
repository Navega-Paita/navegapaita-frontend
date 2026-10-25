export interface BoatData {
    id: string;
    activeTripId?: string;
    lastLocation?: LocationPoint;
    path?: [number, number][]; // Formato Leaflet [lat, lng]
}

export interface LocationPoint {
    lat: number;
    lng: number;
    speed?: number;
    timestamp?: number | string;
}