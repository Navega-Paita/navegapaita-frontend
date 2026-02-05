export interface SignalAlert {
    tripId: string;
    fishermanId: string;
    lastSeen: string;
    minutesSilent: number;
    trigger: number;
}

// Para el objeto que viene de Firebase (un diccionario de alertas)
export interface SignalAlertsMap {
    [key: string]: SignalAlert;
}