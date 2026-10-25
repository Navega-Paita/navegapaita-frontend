// src/core/services/socket.service.ts
import { io, Socket } from 'socket.io-client';
import type { Operation } from "../../shared/models/operation.model.ts";
import type { ResourceUpdatePayload } from "../../shared/models/resource.model.ts";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class SocketService {
    public socket: Socket;

    constructor() {
        // 🟢 Usamos la variable de entorno centralizada
        this.socket = io(API_URL, {
            autoConnect: true,
        });
    }

    // Cambiamos 'any' por la interfaz 'Operation'
    onOperationUpdate(callback: (data: Operation) => void) {
        this.socket.on('operationUpdate', callback);
    }

    // Cambiamos 'any' por la interfaz 'ResourceUpdatePayload'
    onResourceUpdate(callback: (data: ResourceUpdatePayload) => void) {
        this.socket.on('resourceStatusUpdate', callback);
    }

    onOperationDeleted(callback: (id: number) => void) {
        this.socket.on('operationDeleted', callback);
    }

    disconnect() {
        this.socket.disconnect();
    }
}

export const socketService = new SocketService();