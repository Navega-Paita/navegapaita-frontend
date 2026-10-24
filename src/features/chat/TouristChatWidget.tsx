import React, { useState, useRef, useEffect } from 'react';

interface ChatMessage {
    sender: 'user' | 'ai';
    text: string;
    packages?: any[];
}

const SESSION_STORAGE_KEY = 'n_paita_tourist_chat_history';

export const TouristChatWidget: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    // Cargar historial desde sessionStorage al iniciar
    const [messages, setMessages] = useState<ChatMessage[]>(() => {
        const saved = sessionStorage.getItem(SESSION_STORAGE_KEY);
        if (saved) {
            try { return JSON.parse(saved); } catch (e) { /* ignore */ }
        }
        return [
            { sender: 'ai', text: '¡Hola! 🌊 Bienvenido a Navega Paita. ¿Te gustaría conocer nuestros paquetes turísticos disponibles hoy?' }
        ];
    });

    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Guardar en sessionStorage cada vez que el chat cambie
    useEffect(() => {
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(messages));
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOpen]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = input;
        setInput('');

        const updatedMessages: ChatMessage[] = [...messages, { sender: 'user', text: userMsg }];
        setMessages(updatedMessages);
        setLoading(true);

        try {
            // Mapeamos el historial al formato que espera el backend
            const historyForBackend = updatedMessages.slice(0, -1).map(m => ({
                role: m.sender === 'user' ? 'user' : 'assistant',
                parts: [{ text: m.text }]
            }));

            const response = await fetch('http://localhost:3000/ai-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg, history: historyForBackend }),
            });

            const data = await response.json();

            setMessages(prev => [
                ...prev,
                { sender: 'ai', text: data.reply, packages: data.packages }
            ]);
        } catch (error) {
            setMessages(prev => [...prev, { sender: 'ai', text: 'Ups, ocurrió un error de conexión con el servidor.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 99999, fontFamily: 'sans-serif' }}>
            {!isOpen ? (
                <button
                    onClick={() => setIsOpen(true)}
                    style={{
                        backgroundColor: '#0084FF', color: 'white', border: 'none', borderRadius: '50px',
                        padding: '12px 20px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                        fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px'
                    }}
                >
                    💬 ¿Buscas un Viaje? Pregúntanos
                </button>
            ) : (
                <div style={{
                    width: '360px', height: '520px', backgroundColor: 'white', borderRadius: '12px',
                    boxShadow: '0 5px 25px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', overflow: 'hidden',
                    border: '1px solid #ddd'
                }}>
                    {/* Header */}
                    <div style={{ backgroundColor: '#0084FF', color: 'white', padding: '12px 15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold' }}>
                        <span>🌴 Asistente Turístico Paita</span>
                        <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '16px' }}>✕</button>
                    </div>

                    {/* Área de Mensajes */}
                    <div style={{ flex: 1, padding: '15px', overflowY: 'auto', backgroundColor: '#f8f9fa', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {messages.map((msg, index) => (
                            <div key={index} style={{
                                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                backgroundColor: msg.sender === 'user' ? '#0084FF' : '#E4E6EB',
                                color: msg.sender === 'user' ? 'white' : 'black',
                                padding: '10px 14px', borderRadius: '12px', maxWidth: '85%', fontSize: '13px', lineHeight: '1.4'
                            }}>
                                <div>{msg.text}</div>

                                {/* Renderizado de Tarjetas de Paquetes si la IA los incluye */}
                                {msg.packages && msg.packages.length > 0 && (
                                    <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {msg.packages.map((pkg: any, pIdx: number) => (
                                            <div key={pIdx} style={{
                                                backgroundColor: 'white', color: '#333', padding: '8px 10px', borderRadius: '8px',
                                                border: '1px solid #ddd', fontSize: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                            }}>
                                                <strong style={{ color: '#0084FF' }}>{pkg.name}</strong>
                                                <p style={{ margin: '4px 0', color: '#666' }}>{pkg.description}</p>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginTop: '6px' }}>
                                                    <span>S/ {pkg.price}</span>
                                                    <span style={{ color: '#0084FF' }}>{pkg.duration}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                        {loading && <div style={{ alignSelf: 'flex-start', color: '#888', fontSize: '12px', fontStyle: 'italic' }}>Escribiendo...</div>}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Inferior */}
                    <form onSubmit={handleSend} style={{ padding: '10px', borderTop: '1px solid #ddd', display: 'flex', gap: '8px', backgroundColor: 'white' }}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ej: ¿Qué paquetes tienen disponibles?"
                            style={{ flex: 1, padding: '8px 12px', borderRadius: '20px', border: '1px solid #ddd', outline: 'none', fontSize: '13px' }}
                        />
                        <button type="submit" style={{ backgroundColor: '#0084FF', color: 'white', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer' }}>➤</button>
                    </form>
                </div>
            )}
        </div>
    );
};