// src/core/services/user.service.ts

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

    // Aquí irían update y create...
}

export const userService = new UserService();