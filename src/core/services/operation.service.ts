import type { Operation } from '../../shared/models/operation.model';
import type { User } from '../../shared/models/user.model';
import type { Vessel } from '../../shared/models/vessel.model';

const API_URL = 'http://localhost:3000';

export const operationService = {
    // Retorna la lista de operaciones para la tabla principal
    async getAll(): Promise<Operation[]> {
        const response = await fetch(`${API_URL}/operations`);
        if (!response.ok) throw new Error('Error al cargar operaciones');
        return response.json();
    },

    async create(data: {
        tourName: string;
        dateTime: string;
    }): Promise<Operation> {
        const response = await fetch(`${API_URL}/operations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            // NestJS devuelve un array de strings si fallan varias validaciones del DTO
            const message = Array.isArray(errorData.message)
                ? errorData.message.join(', ')
                : errorData.message;

            throw new Error(message || 'Error al crear la operación');
        }

        return response.json();
    },

    async sendRequest(id: number, vesselId: number): Promise<Operation> {
        const response = await fetch(`${API_URL}/operations/${id}/send-request`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ vesselId })
        });

        if (!response.ok) {
            const errorData = await response.json();
            const message = Array.isArray(errorData.message)
                ? errorData.message.join(', ')
                : errorData.message;
            throw new Error(message || 'Error al enviar la solicitud');
        }

        return response.json();
    },

    async delete(id: number): Promise<void> {
        await fetch(`${API_URL}/operations/${id}`, { method: 'DELETE' });
    },

    // Retorna los pescadores con su perfil (DNI, status, etc.)
    async getFishermen(): Promise<User[]> {
        const response = await fetch(`${API_URL}/users/fishermen`);
        if (!response.ok) throw new Error('Error al cargar pescadores');
        return response.json();
    },

    // Retorna las embarcaciones para el diálogo de selección
    async getVessels(): Promise<Vessel[]> {
        const response = await fetch(`${API_URL}/vessels`);
        if (!response.ok) throw new Error('Error al cargar embarcaciones');
        return response.json();
    }
};