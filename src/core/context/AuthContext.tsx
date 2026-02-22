// src/core/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
    user: any;
    login: (data: any) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<any>(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const login = (data: any) => {
        // 1. Guardar en Storage
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('userId', data.user.id);

        // 2. ¡MUY IMPORTANTE! Actualizar el estado de React inmediatamente
        // Esto disparará el re-render de los Guards con los nuevos datos
        setUser(data.user);
    };

    const logout = () => {
        localStorage.clear();
        setUser(null);
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout,
            isAuthenticated: !!user
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe estar dentro de un AuthProvider");
    }
    return context;
};