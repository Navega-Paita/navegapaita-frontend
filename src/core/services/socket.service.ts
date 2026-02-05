// src/core/services/socket.service.ts
import { io, Socket } from 'socket.io-client';
import type {Operation} from "../../shared/models/operation.model.ts";
import type {ResourceUpdatePayload} from "../../shared/models/resource.model.ts";

class SocketService {
    public socket: Socket;

    constructor() {
        // Ajusta la URL según tu backend
        this.socket = io('http://localhost:3000', {
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

    disconnect() {
        this.socket.disconnect();
    }
}

export const socketService = new SocketService();