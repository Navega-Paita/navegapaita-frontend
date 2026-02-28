// src/core/services/user.service.ts

import type {UpdateUserDto} from "../../shared/dtos/update-user.dto.ts";
import type { CreateUserDto } from "../../shared/dtos/create-user.dto.ts";

export interface UserStaffDto {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: 'ADMIN' | 'OPERATOR' | 'FISHERMAN';
}

class UserService {
    private baseUrl = 'http://localhost:3000/users'; // Ajusta a tu API

    async getStaffMembers(): Promise<UserStaffDto[]> {
        const currentUserId = localStorage.getItem('userId');

        const response = await fetch(`${this.baseUrl}/staff?currentUserId=${currentUserId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) throw new Error('Error al cargar staff');
        return response.json();
    }

    async deleteUser(id: number): Promise<void> {
        const token = localStorage.getItem('access_token');
        await fetch(`${this.baseUrl}/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
    }

    async updateUser(id: number, data: UpdateUserDto): Promise<void> {
        const response = await fetch(`${this.baseUrl}/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al actualizar el usuario');
        }

        console.log(`LOG: Usuario ${id} actualizado correctamente`);
    }

    async createOperator(data: Omit<CreateUserDto, 'role'>): Promise<void> {
        const response = await fetch(`${this.baseUrl}/operator`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al crear operador');
        }
    }

    // Aquí irían update y create...
}

export const userService = new UserService();