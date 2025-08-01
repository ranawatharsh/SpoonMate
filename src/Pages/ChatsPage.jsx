import React, { useState, useEffect } from 'react';

// The ConversationItem now takes an `onClick` prop
const ConversationItem = ({ conversation, onClick }) => {
    const { otherParticipant, lastMessage, updatedAt } = conversation;
    const formatDate = (dateString) => new Date(dateString).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

    return (
        <button onClick={onClick} className="w-full text-left flex items-center gap-4 p-3 hover:bg-gray-100 rounded-lg transition-colors">
            <div className="w-14 h-14 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                <img src={otherParticipant.photos?.[0] || `https://placehold.co/100x100/FFC0CB/4A4A4A?text=${otherParticipant.name.charAt(0)}`} alt={otherParticipant.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-grow overflow-hidden">
                <div className="flex justify-between items-center">
                    <h3 className="font-bold text-gray-800 truncate">{otherParticipant.name}</h3>
                    <p className="text-xs text-gray-500 flex-shrink-0">{formatDate(updatedAt)}</p>
                </div>
                <p className="text-sm text-gray-600 truncate">{lastMessage || "Say hi!"}</p>
            </div>
        </button>
    );
};

// This page now takes a prop to handle selecting a conversation
const ChatsPage = ({ userInfo, onConversationSelect }) => {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchConversations = async () => {
            if (!userInfo || !userInfo.token) return setLoading(false);
            try {
                setLoading(true);
                const response = await fetch('http://127.0.0.1:5000/api/chats', {
                    headers: { 'Authorization': `Bearer ${userInfo.token}` },
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.message || 'Could not fetch chats');
                setConversations(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchConversations();
    }, [userInfo]);

    if (loading) return <div className="flex-grow flex items-center justify-center"><p>Loading chats...</p></div>;
    if (error) return <div className="flex-grow flex items-center justify-center"><p className="text-red-500">{error}</p></div>;

    return (
        <div className="w-full max-w-md mx-auto p-4 pb-20">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Matches & Chats</h1>
            {conversations.length > 0 ? (
                <div className="space-y-2">
                    {conversations.map(convo => (
                        <ConversationItem key={convo._id} conversation={convo} onClick={() => onConversationSelect(convo)} />
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500 mt-8">You have no matches yet. Keep swiping!</p>
            )}
        </div>
    );
};

export default ChatsPage;