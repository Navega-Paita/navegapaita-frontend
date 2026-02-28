export interface CreateUserDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: 'ADMIN' | 'OPERATOR' | 'FISHERMAN';
    // Opcionales para el rol FISHERMAN
    dni?: string;
    phone?: string;
    address?: string;
    emergencyContact?: string;
}