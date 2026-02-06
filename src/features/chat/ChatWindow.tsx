import React, { useState, useEffect, useRef } from 'react';
import { ref, onValue, push, serverTimestamp } from 'firebase/database';
import {db} from "../../core/config/firebase.ts";

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
    const scrollRef = useRef<HTMLDivElement>(null);

    // 1. Escuchar mensajes en tiempo real
    useEffect(() => {
        const chatRef = ref(db, `operation_chats/${operationId}/messages`);

        const unsubscribe = onValue(chatRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                // Convertir objeto de Firebase a Array ordenado
                const list = Object.values(data) as Message[];
                setMessages(list.sort((a, b) => a.timestamp - b.timestamp));
            }
        });

        return () => unsubscribe();
    }, [operationId]);

    // 2. Auto-scroll al recibir mensajes
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // 3. Enviar mensaje
    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const chatRef = ref(db, `operation_chats/${operationId}/messages`);
        await push(chatRef, {
            sender: 'AGENCY',
            text: inputText,
            timestamp: serverTimestamp(),
        });

        setInputText('');
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
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
                            padding: '8px 12px',
                            borderRadius: '15px',
                            maxWidth: '80%',
                            fontSize: '14px',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                        }}>
                            {msg.text}
                        </div>
                    );
                })}
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
                    cursor: 'pointer'
                }}>➤</button>
            </form>
        </div>
    );
};