// MobileNavbar.jsx
import React, { useState, useRef, useEffect } from 'react';
import {
    Home, Menu, Moon, Sun, LogOut, X, Send, Search, MoreVertical,
    Smile, Paperclip, Mic, Play, Pause, Square, UserPlus,
} from 'lucide-react';
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { SetTheme } from "../redux/theme";
import { Logout } from "../redux/userSlice";
import { makeRequest } from "../axios";
import { NoProfile } from "../assets";
import EmojiPicker from 'emoji-picker-react';

const MobileNavbar = ({ isMenuOpen, setIsMenuOpen }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { theme } = useSelector((state) => state.theme);
    const [isExpanded, setIsExpanded] = useState(false);
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [user, setUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const messagesEndRef = useRef(null);
    const navRef = useRef(null);
    const startY = useRef(null);
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const mediaRecorderRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentAudio, setCurrentAudio] = useState(null);

    useEffect(() => {
        fetchUser();
        fetchConversations();
        fetchContacts();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchUser = async () => {
        try {
            const response = await makeRequest.get('/users/get-user');
            setUser(response.data.user);
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        }
    };

    const fetchConversations = async () => {
        try {
            const response = await makeRequest.get('/messages/conversations');
            setConversations(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des conversations:', error);
        }
    };

    const fetchContacts = async () => {
        try {
            const response = await makeRequest.get('/users/friends');
            setContacts(response.data.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des contacts:', error);
        }
    };

    const handleSelectConversation = async (conversation) => {
        setSelectedConversation(conversation);
        try {
            const response = await makeRequest.get(`/messages/messages/${conversation._id}`);
            setMessages(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des messages:', error);
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedConversation) return;

        try {
            const response = await makeRequest.post('/messages/messages', {
                conversationId: selectedConversation._id,
                content: newMessage,
            });

            setMessages([...messages, response.data]);
            setNewMessage('');
        } catch (error) {
            console.error('Erreur lors de l\'envoi du message:', error);
        }
    };

    const handleSearch = async (e) => {
        const term = e.target.value;
        setSearchTerm(term);

        if (term.length > 0) {
            try {
                const response = await makeRequest.get(`/users/search?term=${term}`);
                setSearchResults(response.data);
            } catch (error) {
                console.error('Erreur lors de la recherche d\'utilisateurs:', error);
            }
        } else {
            setSearchResults([]);
        }
    };

    const handleEmojiClick = (emojiObject) => {
        setNewMessage((prevMessage) => prevMessage + emojiObject.emoji);
        setShowEmojiPicker(false);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const toggleDarkMode = () => {
        const themeValue = theme === "light" ? "dark" : "light";
        dispatch(SetTheme(themeValue));
    };

    const handleHomeClick = () => {
        navigate('/'); // Redirige vers la page d'accueil
    };

    const handleTouchStart = (e) => {
        startY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
        if (startY.current === null) return;

        const currentY = e.touches[0].clientY;
        const diff = startY.current - currentY;

        if (diff > 50) {
            setIsExpanded(true);
        } else if (diff < -50) {
            setIsExpanded(false);
        }
    };

    const handleTouchEnd = () => {
        startY.current = null;
    };

    useEffect(() => {
        const nav = navRef.current;
        nav.addEventListener('touchstart', handleTouchStart);
        nav.addEventListener('touchmove', handleTouchMove);
        nav.addEventListener('touchend', handleTouchEnd);

        return () => {
            nav.removeEventListener('touchstart', handleTouchStart);
            nav.removeEventListener('touchmove', handleTouchMove);
            nav.removeEventListener('touchend', handleTouchEnd);
        };
    }, []);

    // Fonctions supplémentaires pour l'enregistrement audio, l'envoi de fichiers, etc.
    // Vous pouvez réutiliser les fonctions de MessagerieView ici.

    return (
        <nav
            ref={navRef}
            className={`fixed bottom-0 left-0 right-0 bg-primary shadow-lg z-10 text-ascent-1 transition-all duration-300 ease-in-out ${
                isExpanded ? 'h-[80vh]' : 'h-16'
            }`}
        >
            {isExpanded && (
                <div className="p-4 h-[calc(80vh-4rem)] overflow-y-auto flex flex-col">
                    {/* Barre de recherche */}
                    <div className="relative mb-4">
                        <input
                            type="text"
                            placeholder="Rechercher ou démarrer une nouvelle discussion"
                            className="w-full p-2 pl-10 bg-gray-100 rounded-lg"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                        <Search className="absolute left-2 top-2 text-gray-500" />
                    </div>

                    {/* Liste des conversations ou résultats de recherche */}
                    {!selectedConversation ? (
                        <div className="flex-1 overflow-y-auto">
                            {searchTerm ? (
                                searchResults.map((user) => (
                                    <div
                                        key={user._id}
                                        className="p-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-3"
                                        onClick={() => handleSelectConversation({ participants: [user], _id: user._id })}
                                    >
                                        <img src={user.profileUrl || NoProfile} alt="Profile" className="w-8 h-8 rounded-full" />
                                        <p className="font-semibold">{user.firstName} {user.lastName}</p>
                                    </div>
                                ))
                            ) : (
                                conversations.map((conv) => {
                                    const participant = conv.participants?.find((p) => p._id !== user?._id);
                                    if (!participant) return null;
                                    return (
                                        <div
                                            key={conv._id}
                                            className="p-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-3"
                                            onClick={() => handleSelectConversation(conv)}
                                        >
                                            <img src={participant.profileUrl || NoProfile} alt="Profile" className="w-8 h-8 rounded-full" />
                                            <div>
                                                <p className="font-semibold">{participant.firstName} {participant.lastName}</p>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col flex-1">
                            {/* En-tête du chat */}
                            <div className="flex items-center space-x-2 mb-2">
                                <X onClick={() => setSelectedConversation(null)} className="text-gray-500 cursor-pointer" />
                                {(() => {
                                    const participant = selectedConversation.participants?.find((p) => p._id !== user?._id);
                                    return (
                                        <>
                                            <img src={participant?.profileUrl || NoProfile} alt="Profile" className="w-8 h-8 rounded-full" />
                                            <div>
                                                <p className="font-semibold">{participant?.firstName}</p>
                                            </div>
                                        </>
                                    );
                                })()}
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto mb-2">
                                {messages.map((msg) => (
                                    <div
                                        key={msg._id}
                                        className={`mb-2 flex ${msg.sender?._id === user?._id ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[70%] p-2 rounded-lg ${
                                                msg.sender?._id === user?._id ? 'bg-[#9a00d7]' : 'bg-primary'
                                            }`}
                                        >
                                            {msg.messageType === 'text' && <p>{msg.content}</p>}
                                            {/* Gérer les autres types de messages */}
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Zone de saisie */}
                            <div className="flex items-center space-x-2 ">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    className="flex-1 p-2 rounded-full bg-bgColor"
                                    placeholder="Tapez un message"
                                />
                                <Send onClick={handleSendMessage} className="text-[#9a00d7] cursor-pointer" />
                            </div>
                        </div>
                    )}
                </div>
            )}
            <div className="flex justify-around items-center h-16">
                <Link to="/" className="hover:text-blue-500 dark:hover:text-blue-400">
                    <Home size={24} />
                </Link>

                <button
                    className="hover:text-blue-500 dark:hover:text-blue-400"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                <button
                    className="hover:text-blue-500 dark:hover:text-blue-400"
                    onClick={toggleDarkMode}
                >
                    {theme === "dark" ? <Sun size={24} /> : <Moon size={24} />}
                </button>

                <button
                    className="hover:text-blue-500 dark:hover:text-blue-400"
                    onClick={() => dispatch(Logout())}
                >
                    <LogOut size={24} />
                </button>
            </div>
        </nav>
    );
};

export default MobileNavbar;
