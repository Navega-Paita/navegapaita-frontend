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