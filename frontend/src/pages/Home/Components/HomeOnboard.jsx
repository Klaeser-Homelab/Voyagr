import React, { useState, useEffect } from 'react';
import VoyagrAvatar from '../../../assets/marie.png';
import Headshot1 from '../../../assets/headshot_1.png';
import Headshot2 from '../../../assets/headshot_2.png';
import Headshot3 from '../../../assets/headshot_3.png';
import { useUser } from '../../../context/UserContext';

function HomeOnboard({ isOpen, onClose }) {
    const { user, updateUser } = useUser();
    const [name, setName] = useState('');
    const [nameSubmitted, setNameSubmitted] = useState(false);
    const [selectedHeadshot, setSelectedHeadshot] = useState('');
    const [messages, setMessages] = useState([]);
    const [currentInput, setCurrentInput] = useState('');
    const [showHeadshotSelection, setShowHeadshotSelection] = useState(false);

    if (!isOpen) return null;

    const headshotOptions = [
        { key: 'headshot_1', src: Headshot1, alt: 'Option 1' },
        { key: 'headshot_2', src: Headshot2, alt: 'Option 2' },
        { key: 'headshot_3', src: Headshot3, alt: 'Option 3' }
    ];

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            // Initial message from Voyagr
            setMessages([
                {
                    id: 1,
                    sender: 'voyagr',
                    text: "Hi there! I'm Voyagr. What's your name?",
                    timestamp: new Date()
                }
            ]);
        }
    }, [isOpen]);

    const handleNameSubmit = () => {
        if (currentInput.trim()) {
            const userName = currentInput.trim();
            setName(userName);
            
            // Add user's message
            const userMessage = {
                id: messages.length + 1,
                sender: 'user',
                text: userName,
                timestamp: new Date()
            };
            
            setMessages(prev => [...prev, userMessage]);
            setCurrentInput('');
            setNameSubmitted(true);
            
            // Add Voyagr's response after a short delay
            setTimeout(() => {
                const voyagrResponse = {
                    id: messages.length + 2,
                    sender: 'voyagr',
                    text: `Nice to meet you, ${userName}! Now, please choose your avatar:`,
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, voyagrResponse]);
                setShowHeadshotSelection(true);
            }, 1000);
        }
    };

    const handleHeadshotSelect = (headshotKey) => {
        setSelectedHeadshot(headshotKey);
        
        // Add user selection message
        const headshotMessage = {
            id: messages.length + 1,
            sender: 'user',
            text: `Selected ${headshotOptions.find(h => h.key === headshotKey).alt}`,
            headshot: headshotKey,
            timestamp: new Date()
        };
        
        setMessages(prev => [...prev, headshotMessage]);
        setShowHeadshotSelection(false);
        
        // Add final Voyagr message
        setTimeout(() => {
            const finalMessage = {
                id: messages.length + 2,
                sender: 'voyagr',
                text: "Perfect! You're all set. Welcome aboard! 🚀",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, finalMessage]);
            
            // Save user data and close after another delay
            setTimeout(() => {
                updateUser({
                    display_name: name,
                    avatar: headshotKey
                });
                onClose();
            }, 2000);
        }, 1000);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleNameSubmit();
        }
    };

    const renderMessage = (message) => {
        const isVoyagr = message.sender === 'voyagr';
        
        return (
            <div key={message.id} className={`flex ${isVoyagr ? 'justify-start' : 'justify-end'} mb-4`}>
                <div className={`flex ${isVoyagr ? 'flex-row' : 'flex-row-reverse'} items-end gap-2 max-w-xs`}>
                    <img 
                        src={isVoyagr ? VoyagrAvatar : (message.headshot ? headshotOptions.find(h => h.key === message.headshot)?.src : '')} 
                        alt={isVoyagr ? 'Voyagr' : 'You'}
                        className="w-8 h-8 rounded-full"
                    />
                    <div className={`px-4 py-2 rounded-2xl ${
                        isVoyagr 
                            ? 'bg-gray-100 text-gray-800' 
                            : 'bg-blue-500 text-white'
                    }`}>
                        <p className="text-sm">{message.text}</p>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md h-96 mx-4 flex flex-col">
                {/* Header */}
                <div className="p-4 border-b bg-gray-50 rounded-t-lg">
                    <div className="flex items-center gap-3">
                        <img src={VoyagrAvatar} alt="Voyagr" className="w-10 h-10 rounded-full" />
                        <div>
                            <div className="font-semibold text-gray-800">Voyagr</div>
                            <div className="text-xs text-gray-500">Getting Started</div>
                        </div>
                    </div>
                </div>
                
                {/* Messages Container */}
                <div className="flex-1 p-4 overflow-y-auto">
                    {messages.map(renderMessage)}
                    
                    {/* Headshot Selection */}
                    {showHeadshotSelection && (
                        <div className="flex justify-center mb-4">
                            <div className="flex gap-4">
                                {headshotOptions.map((headshot) => (
                                    <div
                                        key={headshot.key}
                                        className="flex flex-col items-center gap-2 cursor-pointer p-3 rounded-lg hover:bg-gray-100 transition-colors"
                                        onClick={() => handleHeadshotSelect(headshot.key)}
                                    >
                                        <img 
                                            src={headshot.src} 
                                            alt={headshot.alt} 
                                            className="w-16 h-16 rounded-full border-2 border-gray-200 hover:border-blue-500 transition-colors"
                                        />
                                        <div className="text-xs text-gray-600 font-medium">
                                            {headshot.alt}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Input Area */}
                {!nameSubmitted && !showHeadshotSelection && (
                    <div className="p-4 border-t bg-gray-50">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={currentInput}
                                onChange={(e) => setCurrentInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type your name..."
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                autoFocus
                            />
                            <button 
                                onClick={handleNameSubmit}
                                disabled={!currentInput.trim()}
                                className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                            >
                                Send
                            </button>
                        </div>
                    </div>
                )}
                
                {/* Footer message */}
                <div className="p-3 text-center">
                    <p className="text-xs text-gray-500 italic">
                        You may be surprised that I don't look like a large chunk of space metal. 
                        Well you know what they say, dress for the job you want. So here I am, 
                        I want to be a scientist, so I'll dress like Marie Curie.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default HomeOnboard;