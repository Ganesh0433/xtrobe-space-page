import React, { useState, useEffect, useRef } from "react";
import { FiSend, FiPlus } from "react-icons/fi";
import { FaRobot, FaUser, FaTrash } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from 'prism-react-renderer';
import { useRouter } from "next/router";

const SessionItem = ({ 
    session, 
    currentSessionId, 
    setCurrentSessionId, 
    shouldScroll, 
    deleteSession, 
    updateSessionName 
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(session.name);
    
    const handleNameChange = (e) => {
        setEditedName(e.target.value);
    };

    const handleNameBlur = () => {
        if (editedName.trim() !== session.name) {
            updateSessionName(session.id, editedName.trim());
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleNameBlur();
        }
    };

    return (
        <div
            onClick={() => {
                if (!isEditing) {
                    setCurrentSessionId(session.id);
                    shouldScroll.current = true;
                }
            }}
            className={`flex items-center justify-between p-3 mx-2 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors ${
                currentSessionId === session.id ? 'bg-gray-800' : ''
            }`}
        >
            {isEditing ? (
                <input
                    type="text"
                    value={editedName}
                    onChange={handleNameChange}
                    onBlur={handleNameBlur}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    className="flex-1 bg-transparent border-b border-gray-600 focus:outline-none focus:border-blue-500 text-sm text-white"
                />
            ) : (
                <span 
                    className="truncate text-sm text-gray-300 flex-1"
                    onDoubleClick={() => setIsEditing(true)}
                >
                    {session.name}
                </span>
            )}
            {currentSessionId === session.id && !isEditing && (
                <div className="flex items-center">
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsEditing(true);
                        }}
                        className="text-gray-400 hover:text-blue-400 p-1 mr-1"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                    <button 
                        onClick={(e) => deleteSession(session.id, e)}
                        className="text-gray-400 hover:text-red-400 p-1"
                    >
                        <FaTrash className="text-xs" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default function Xtrobot() {
    const [isClient, setIsClient] = useState(false);
    const router = useRouter();
    
    // Session management with proper SSR handling
    const [sessions, setSessions] = useState([]);
    const [currentSessionId, setCurrentSessionId] = useState('');
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        setIsClient(true);
        
        // Initialize sessions from localStorage only on client side
        try {
            const savedSessions = localStorage.getItem('xtrobot-sessions');
            const savedCurrentSession = localStorage.getItem('xtrobot-current-session');
            
            if (savedSessions) {
                setSessions(JSON.parse(savedSessions));
                setCurrentSessionId(savedCurrentSession || JSON.parse(savedSessions)[0]?.id || '');
            } else {
                const newSession = {
                    id: Date.now().toString(),
                    name: "New Chat",
                    messages: [
                        {
                            sender: "bot",
                            text: "Hello! I'm Xtrobot, your AI assistant. How can I help you today?"
                        }
                    ]
                };
                setSessions([newSession]);
                setCurrentSessionId(newSession.id);
            }
            setInitialized(true);
        } catch (e) {
            console.error("Error initializing sessions:", e);
            const newSession = {
                id: Date.now().toString(),
                name: "New Chat",
                messages: [
                    {
                        sender: "bot",
                        text: "Hello! I'm Xtrobot, your AI assistant. How can I help you today?"
                    }
                ]
            };
            setSessions([newSession]);
            setCurrentSessionId(newSession.id);
            setInitialized(true);
        }
    }, []);

    const currentSession = sessions.find(s => s.id === currentSessionId) || sessions[0];
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    
    // Refs for scroll management
    const chatRef = useRef(null);
    const isUserScrolling = useRef(false);
    const scrollTimeout = useRef(null);
    const lastScrollHeight = useRef(0);
    const shouldScroll = useRef(true);
    const scrollAnimationRef = useRef(null);

    // Save sessions to localStorage
    useEffect(() => {
        if (initialized && isClient) {
            try {
                localStorage.setItem('xtrobot-sessions', JSON.stringify(sessions));
                localStorage.setItem('xtrobot-current-session', currentSessionId);
            } catch (e) {
                console.error("Error saving sessions:", e);
            }
        }
    }, [sessions, currentSessionId, initialized, isClient]);

    // Scroll management
    useEffect(() => {
        const chatElement = chatRef.current;
        if (!chatElement) return;

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = chatElement;
            const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
            
            if (!isNearBottom || scrollTop < lastScrollHeight.current) {
                isUserScrolling.current = true;
                clearTimeout(scrollTimeout.current);
                scrollTimeout.current = setTimeout(() => {
                    isUserScrolling.current = false;
                }, 1500);
            }
            
            lastScrollHeight.current = scrollTop;
        };

        chatElement.addEventListener('scroll', handleScroll);
        return () => {
            chatElement.removeEventListener('scroll', handleScroll);
            clearTimeout(scrollTimeout.current);
            cancelAnimationFrame(scrollAnimationRef.current);
        };
    }, []);

    // Smooth scroll to bottom when needed
    useEffect(() => {
        if (!chatRef.current || !shouldScroll.current || isUserScrolling.current) return;

        const chatElement = chatRef.current;
        const targetScroll = chatElement.scrollHeight;
        const initialScroll = chatElement.scrollTop;
        const distance = targetScroll - initialScroll;
        const duration = Math.min(300, distance * 0.5);

        let startTime = null;

        const animateScroll = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const easeProgress = easeOutCubic(progress);
            
            chatElement.scrollTop = initialScroll + distance * easeProgress;
            
            if (progress < 1) {
                scrollAnimationRef.current = requestAnimationFrame(animateScroll);
            }
        };

        scrollAnimationRef.current = requestAnimationFrame(animateScroll);

        return () => cancelAnimationFrame(scrollAnimationRef.current);
    }, [currentSession?.messages, loading]);

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    // Session management functions
    const createNewSession = () => {
        const newSession = {
            id: Date.now().toString(),
            name: "New Chat",
            messages: [
                {
                    sender: "bot",
                    text: "Hello! I'm Xtrobot, your AI assistant. How can I help you today?"
                }
            ]
        };
        setSessions(prev => [newSession, ...prev]);
        setCurrentSessionId(newSession.id);
        setInput("");
        shouldScroll.current = true;
    };

    const deleteSession = (id, e) => {
        e.stopPropagation();
        setSessions(prev => prev.filter(session => session.id !== id));
        if (currentSessionId === id) {
            setCurrentSessionId(sessions.length > 1 ? sessions[1].id : '');
        }
    };

    const updateSessionName = (id, newName) => {
        setSessions(prev => prev.map(session => 
            session.id === id ? { ...session, name: newName } : session
        ));
    };

    const sendMessage = async () => {
        if (!input.trim() || !currentSession) return;

        const userMessage = { sender: "user", text: input };
        const updatedMessages = [...currentSession.messages, userMessage];
        
        setSessions(prev => prev.map(session => 
            session.id === currentSessionId 
                ? { ...session, messages: updatedMessages } 
                : session
        ));
        
        setInput("");
        setLoading(true);
        shouldScroll.current = true;

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: input }),
            });
            const data = await response.json();
            animateAiResponse(data.reply);
        } catch (error) {
            console.error("Error:", error);
            const errorMessage = { sender: "bot", text: "Sorry, I encountered an error. Please try again." };
            setSessions(prev => prev.map(session => 
                session.id === currentSessionId 
                    ? { ...session, messages: [...session.messages, errorMessage] } 
                    : session
            ));
            setLoading(false);
        }
    };

    const animateAiResponse = (fullText) => {
        let displayedText = "";
        let i = 0;
        
        setSessions(prev => prev.map(session => 
            session.id === currentSessionId 
                ? { ...session, messages: [...session.messages, { sender: "bot", text: "" }] } 
                : session
        ));
        
        const interval = setInterval(() => {
            if (i >= fullText.length) {
                clearInterval(interval);
                setLoading(false);
                
                if (currentSession?.messages?.length <= 2) {
                    const firstUserMessage = currentSession.messages.find(m => m.sender === "user");
                    if (firstUserMessage) {
                        const newName = firstUserMessage.text.slice(0, 30);
                        updateSessionName(currentSessionId, newName);
                    }
                }
                return;
            }
            
            displayedText += fullText[i];
            setSessions(prev => prev.map(session => 
                session.id === currentSessionId 
                    ? { 
                        ...session, 
                        messages: session.messages.map((msg, idx, arr) => 
                            idx === arr.length - 1 ? { ...msg, text: displayedText } : msg
                        )
                    } 
                    : session
            ));
            i++;
        }, 20);

        return () => clearInterval(interval);
    };

    if (!isClient || !initialized) {
        return (
            <div className="flex h-screen bg-gray-900 text-gray-100">
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-pulse">Loading...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-900 text-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-gray-950 border-r border-gray-800 flex flex-col">
                <button 
                    onClick={createNewSession}
                    className="flex items-center justify-center space-x-2 m-4 p-3 rounded-lg border border-gray-700 hover:bg-gray-800 transition-colors"
                >
                    <FiPlus className="text-gray-400" />
                    <span className="text-gray-300">New Chat</span>
                </button>
                
                <div className="flex-1 overflow-y-auto">
                    {sessions.map(session => (
                        <SessionItem
                            key={session.id}
                            session={session}
                            currentSessionId={currentSessionId}
                            setCurrentSessionId={setCurrentSessionId}
                            shouldScroll={shouldScroll}
                            deleteSession={deleteSession}
                            updateSessionName={updateSessionName}
                        />
                    ))}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="p-4 bg-gray-950 border-b border-gray-800 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <FaRobot className="text-xl text-blue-400" />
                        <h1 className="text-lg font-semibold text-gray-200">Xtrobot</h1>
                    </div>
                    <div className="text-sm text-gray-400 truncate max-w-xs">
                        {currentSession?.name || "New Chat"}
                    </div>
                </header>

                {/* Chat Messages */}
                <div 
                    ref={chatRef} 
                    className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-900"
                >
                    {currentSession?.messages?.map((msg, index) => (
                        <div 
                            key={index} 
                            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div className={`flex max-w-3xl w-full ${msg.sender === "user" ? "justify-end" : ""}`}>
                                {msg.sender === "bot" && (
                                    <div className="flex-shrink-0 mr-4 mt-1">
                                        <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                                            <FaRobot className="text-blue-400" />
                                        </div>
                                    </div>
                                )}
                                
                                <div className={`flex-1 ${msg.sender === "user" ? "flex justify-end" : ""}`}>
                                    <div
                                        className={`text-sm ${msg.sender === "user" 
                                            ? "bg-blue-600 text-white rounded-tl-xl rounded-tr-xl rounded-bl-xl" 
                                            : "bg-gray-800 text-gray-100 rounded-tl-xl rounded-tr-xl rounded-br-xl border border-gray-700"
                                        } p-4`}
                                    >
                                        {msg.sender === "user" ? (
                                            <div className="flex items-center">
                                                <div className="mr-2">
                                                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                                                        <FaUser className="text-white text-sm" />
                                                    </div>
                                                </div>
                                                <div className="max-w-[calc(100%-3rem)]">
                                                    {msg.text}
                                                </div>
                                            </div>
                                        ) : (
                                            <ReactMarkdown
                                                components={{
                                                    code({node, inline, className, children, ...props}) {
                                                        const match = /language-(\w+)/.exec(className || '');
                                                        return !inline && match ? (
                                                            <SyntaxHighlighter
                                                                language={match[1]}
                                                                style={null}
                                                                customStyle={{
                                                                    backgroundColor: '#1e293b',
                                                                    borderRadius: '6px',
                                                                    padding: '12px',
                                                                    overflowX: 'auto',
                                                                    margin: '8px 0'
                                                                }}
                                                                {...props}
                                                            >
                                                                {String(children).replace(/\n$/, '')}
                                                            </SyntaxHighlighter>
                                                        ) : (
                                                            <code className={`${className} bg-gray-700 px-1 py-0.5 rounded`} {...props}>
                                                                {children}
                                                            </code>
                                                        );
                                                    },
                                                    a({node, ...props}) {
                                                        return <a className="text-blue-400 hover:underline" {...props} />
                                                    },
                                                    table({node, ...props}) {
                                                        return <div className="overflow-x-auto">
                                                            <table className="min-w-full border-collapse" {...props} />
                                                        </div>
                                                    },
                                                    th({node, ...props}) {
                                                        return <th className="border border-gray-600 px-4 py-2 text-left bg-gray-800" {...props} />
                                                    },
                                                    td({node, ...props}) {
                                                        return <td className="border border-gray-600 px-4 py-2" {...props} />
                                                    }
                                                }}
                                            >
                                                {msg.text}
                                            </ReactMarkdown>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="flex justify-start">
                            <div className="flex max-w-3xl w-full">
                                <div className="flex-shrink-0 mr-4 mt-1">
                                    <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                                        <FaRobot className="text-blue-400" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="bg-gray-800 text-gray-100 rounded-tl-xl rounded-tr-xl rounded-br-xl border border-gray-700 p-4 text-sm">
                                        <div className="flex space-x-2">
                                            <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"></div>
                                            <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                            <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Box */}
                <div className="p-4 bg-gray-950 border-t border-gray-800">
                    <div className="max-w-3xl mx-auto">
                        <div className="relative flex items-center">
                            <input
                                type="text"
                                className="flex-1 bg-gray-800 text-gray-100 p-3 pl-4 pr-12 rounded-xl outline-none border border-gray-700 focus:border-blue-500 transition-all"
                                placeholder="Message Xtrobot..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                disabled={loading}
                            />
                            <button
                                className={`absolute right-2 p-2 rounded-lg ${input.trim() ? 'bg-blue-600 text-white hover:bg-blue-700' : 'text-gray-500'} transition-colors`}
                                onClick={sendMessage}
                                disabled={loading || !input.trim()}
                            >
                                <FiSend className="text-lg" />
                            </button>
                        </div>
                        <p className="text-xs text-center text-gray-500 mt-2">
                            Xtrobot can make mistakes. Consider checking important information.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}