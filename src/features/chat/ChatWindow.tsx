import React, { useState, useEffect, useRef } from 'react';
import { ref, onValue, push, serverTimestamp } from 'firebase/database';
import { db } from "../../core/config/firebase.ts";
import { operationService } from '../../core/services/operation.service';

interface Message {
    sender: 'FISHERMAN' | 'AGENCY';
    text: string;
    timestamp: number;
}

interface ChatWindowProps {
    operationId: number;
    onClose: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ operationId, onClose }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // 1. Escuchar mensajes en tiempo real
    useEffect(() => {
        const chatRef = ref(db, `operation_chats/${operationId}/messages`);

        const unsubscribe = onValue(chatRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                // Convertir objeto de Firebase a Array ordenado (Corregido el sort)
                const list = Object.values(data) as Message[];
                setMessages(list.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0)));
            }
        });

        return () => unsubscribe();
    }, [operationId]);

    // 2. Auto-scroll al recibir mensajes
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // 3. Enviar mensaje
    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const currentText = inputText;
        setInputText('');

        // 1. Guardar en Firebase Realtime Database
        const chatRef = ref(db, `operation_chats/${operationId}/messages`);
        await push(chatRef, {
            sender: 'AGENCY',
            text: currentText,
            timestamp: serverTimestamp(),
        });

        // 2. Disparar Notificación Push al Pescador vía Backend
        try {
            await operationService.sendChatNotification(operationId, currentText);
        } catch (error) {
            console.error("Error al disparar la push notification:", error);
        }
    };

    // Función auxiliar para formatear el timestamp a hora (ej: 03:45 p. m. o 15:45)
    const formatTime = (timestamp: number) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: '0px',
            right: '20px',
            width: '320px',
            height: '400px',
            backgroundColor: 'white',
            borderRadius: '10px 10px 0 0',
            boxShadow: '0 5px 40px rgba(0,0,0,0.16)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 9999,
            fontFamily: 'sans-serif',
            border: '1px solid #ddd'
        }}>
            {/* Header Azul */}
            <div style={{
                backgroundColor: '#0084FF',
                color: 'white',
                padding: '10px 15px',
                borderRadius: '10px 10px 0 0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontWeight: 'bold'
            }}>
                <span>🚢 Chat: Op # {operationId}</span>
                <button onClick={onClose} style={{
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '16px'
                }}>✕</button>
            </div>

            {/* Área de mensajes */}
            <div style={{
                flex: 1,
                padding: '15px',
                overflowY: 'auto',
                backgroundColor: '#f9f9f9',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
            }}>
                {messages.map((msg, i) => {
                    const isAgency = msg.sender === 'AGENCY';
                    return (
                        <div key={i} style={{
                            alignSelf: isAgency ? 'flex-end' : 'flex-start',
                            backgroundColor: isAgency ? '#0084FF' : '#E4E6EB',
                            color: isAgency ? 'white' : 'black',
                            padding: '6px 10px 6px 12px', // Padding más compacto
                            borderRadius: '14px',
                            maxWidth: '85%',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                            display: 'flex',
                            alignItems: 'flex-end', // Alinea el texto y la hora de manera horizontal
                            gap: '8px', // Espacio sutil entre el texto y la hora
                        }}>
                            {/* Texto del mensaje */}
                            <span style={{ fontSize: '13px', wordBreak: 'break-word', flex: 1 }}>
                {msg.text}
            </span>

                            {/* Hora sutil y pequeña al lado del texto */}
                            <span style={{
                                fontSize: '9.5px',
                                color: isAgency ? 'rgba(255, 255, 255, 0.75)' : 'rgba(0, 0, 0, 0.45)',
                                whiteSpace: 'nowrap',
                                marginBottom: '1px', // Pequeño ajuste para alinear con la base del texto
                            }}>
                {formatTime(msg.timestamp)}
            </span>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input inferior */}
            <form onSubmit={sendMessage} style={{
                padding: '10px',
                borderTop: '1px solid #ddd',
                display: 'flex',
                gap: '5px'
            }}>
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Escribe a la embarcación..."
                    style={{
                        flex: 1,
                        padding: '8px 12px',
                        borderRadius: '20px',
                        border: '1px solid #ddd',
                        outline: 'none'
                    }}
                />
                <button type="submit" style={{
                    backgroundColor: '#0084FF',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '35px',
                    height: '35px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>➤</button>
            </form>
        </div>
    );
};