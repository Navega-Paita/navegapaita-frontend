// src/services/ai.service.ts
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function sendChatMessage(message: string, history: any[]) {
    try {
        const response = await fetch(`${API_URL}/ai-chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, history }),
        });

        if (!response.ok) {
            throw new Error('Error al comunicarse con el asistente virtual.');
        }

        return await response.json();
    } catch (error) {
        console.error('Error en aiService:', error);
        throw error;
    }
}