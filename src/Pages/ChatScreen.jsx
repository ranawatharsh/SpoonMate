import React, { useState, useEffect, useRef } from 'react';

// A component for a single chat bubble
const MessageBubble = ({ message, isOwnMessage }) => (
    // The `justify-end` and `justify-start` classes align the bubbles left or right
    <div className={`flex w-full ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
        <div 
            className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl ${
                // The background color and text color change based on who sent the message
                isOwnMessage 
                ? 'bg-[#FF6B6B] text-white' 
                : 'bg-gray-200 text-gray-800'
            }`}
        >
            <p>{message.text}</p>
        </div>
    </div>
);

// The main chat screen component
const ChatScreen = ({ userInfo, conversation, onBack }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        const fetchMessages = async () => {
            if (!userInfo || !conversation) return;
            setLoading(true);
            try {
                const response = await fetch(`http://127.0.0.1:5000/api/chats/${conversation._id}/messages`, {
                    headers: { 'Authorization': `Bearer ${userInfo.token}` },
                });
                const data = await response.json();
                if (!response.ok) throw new Error('Failed to fetch messages');
                setMessages(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchMessages();
    }, [userInfo, conversation]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const response = await fetch(`http://127.0.0.1:5000/api/chats/${conversation._id}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userInfo.token}`,
                },
                body: JSON.stringify({ text: newMessage }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error('Failed to send message');
            
            setMessages(prevMessages => [...prevMessages, data]);
            setNewMessage('');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="h-full w-full max-w-md mx-auto flex flex-col">
            <header className="flex items-center gap-4 p-3 border-b bg-white sticky top-0 z-10">
                <button onClick={onBack} className="text-2xl font-bold text-gray-600 hover:text-black transition-colors">←</button>
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                    <img src={conversation.otherParticipant.photos?.[0] || `https://placehold.co/100x100/FFC0CB/4A4A4A?text=${conversation.otherParticipant.name.charAt(0)}`} alt={conversation.otherParticipant.name} className="w-full h-full object-cover" />
                </div>
                <h2 className="font-bold text-gray-800">{conversation.otherParticipant.name}</h2>
            </header>

            <main className="flex-grow p-4 space-y-4 overflow-y-auto">
                {loading ? <p>Loading messages...</p> : messages.map(msg => (
                    <MessageBubble key={msg._id} message={msg} isOwnMessage={msg.sender._id === userInfo._id} />
                ))}
                <div ref={messagesEndRef} />
            </main>

            <footer className="p-3 bg-white border-t sticky bottom-0">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-grow p-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-[#FF6B6B] outline-none"
                    />
                    <button type="submit" className="bg-[#FF6B6B] text-white rounded-full p-3 transform hover:scale-110 transition-transform">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.428A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                    </button>
                </form>
            </footer>
        </div>
    );
};

export default ChatScreen;
