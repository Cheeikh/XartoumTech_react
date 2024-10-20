// MobileNavbar.jsx

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    Home, Menu, Moon, Sun, LogOut, X, Send, Search, MoreVertical,
    Smile, Paperclip, Mic, Play, Pause, Square, UserPlus,
    Video,
    Image as ImageIcon,
} from 'lucide-react';
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { SetTheme } from "../redux/theme";
import { Logout } from "../redux/userSlice";
import { makeRequest } from "../axios";
import { NoProfile } from "../assets";
import EmojiPicker from 'emoji-picker-react';

import { MediaPreviewModal } from '../components/Messagerie';
import { useSocket } from '../context/SocketContext';

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

    const [previewMedia, setPreviewMedia] = useState(null);
    const [mediaType, setMediaType] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadingMedia, setUploadingMedia] = useState(null);
    const [videoThumbnail, setVideoThumbnail] = useState(null);
    const [isPlayingPreview, setIsPlayingPreview] = useState(false);
    const audioPreviewRef = useRef(null);
    const [audioProgress, setAudioProgress] = useState({});
    const [audioDurations, setAudioDurations] = useState({});
    const [audioUrl, setAudioUrl] = useState(null);
    const audioChunksRef = useRef([]);
    const [isUploading, setIsUploading] = useState(false);
    const { socket } = useSocket();
    const [showMediaUploadOptions, setShowMediaUploadOptions] = useState(false);

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


    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file || !selectedConversation) return;

        const previewUrl = URL.createObjectURL(file);
        setPreviewMedia(previewUrl);
        setSelectedFile(file);
        setMediaType('image');
    };

    const handleVideoUpload = async (event) => {
        const file = event.target.files[0];
        if (!file || !selectedConversation) return;

        const previewUrl = URL.createObjectURL(file);
        setPreviewMedia(previewUrl);
        setSelectedFile(file);
        setMediaType('video');

        generateVideoThumbnail(file);
    };

    const generateVideoThumbnail = (file) => {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
            video.currentTime = 1;
        };
        video.oncanplay = () => {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
            const thumbnailUrl = canvas.toDataURL();
            setVideoThumbnail(thumbnailUrl);
        };
        video.src = URL.createObjectURL(file);
    };

    const handleConfirmMediaUpload = async () => {
        if (!selectedFile || !selectedConversation) return;

        const formData = new FormData();
        formData.append(mediaType, selectedFile);
        formData.append('conversationId', selectedConversation._id);

        setIsUploading(true);

        try {
            const tempMessage = {
                _id: Date.now(),
                sender: user,
                messageType: 'loading',
                content: `Chargement du ${mediaType}...`,
                createdAt: new Date(),
                previewUrl: mediaType === 'video' ? videoThumbnail : URL.createObjectURL(selectedFile),
            };
            setMessages(prevMessages => [...prevMessages, tempMessage]);

            const response = await makeRequest.post(`/messages/${mediaType}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setMessages(prevMessages => prevMessages.filter(msg => msg._id !== tempMessage._id));
            
            const newMessage = response.data;
            setMessages(prevMessages => [...prevMessages, newMessage]);
            
            // Émettre le message via socket
            if (socket) {
                socket.emit('sendMessage', {
                    ...newMessage,
                    conversationId: selectedConversation._id
                });
            }
        } catch (error) {
            console.error(`Erreur lors de l'envoi du ${mediaType}:`, error);
        } finally {
            setIsUploading(false);
            setPreviewMedia(null);
            setSelectedFile(null);
            setMediaType(null);
            setVideoThumbnail(null);
        }
    };

    const handleCancelMediaUpload = () => {
        setPreviewMedia(null);
        setSelectedFile(null);
        setMediaType(null);
        URL.revokeObjectURL(previewMedia);
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const audioUrl = URL.createObjectURL(audioBlob);
                setAudioBlob(audioBlob);
                setAudioUrl(audioUrl);
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (error) {
            console.error("Erreur lors de l'accès au microphone:", error);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const sendAudioMessage = async () => {
        if (!audioBlob || !selectedConversation) return;

        const formData = new FormData();
        formData.append('audio', audioBlob, 'audio.webm');
        formData.append('conversationId', selectedConversation._id);

        try {
            const response = await makeRequest.post('/messages/audio', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const newMessage = response.data;
            setMessages(prevMessages => [...prevMessages, newMessage]);

            if (socket) {
                socket.emit('sendMessage', {
                    ...newMessage,
                    conversationId: selectedConversation._id
                });
            }

            // Réinitialiser l'état de l'enregistrement audio
            setAudioBlob(null);
            setAudioUrl(null);
        } catch (error) {
            console.error("Erreur lors de l'envoi du message audio:", error);
        }
    };

    const handleMediaUpload = (event) => {
        const file = event.target.files[0];
        if (!file || !selectedConversation) return;

        if (file.type.startsWith('image/')) {
            handleImageUpload({ target: { files: [file] } });
        } else if (file.type.startsWith('video/')) {
            handleVideoUpload({ target: { files: [file] } });
        }
        setShowMediaUploadOptions(false); // Ferme les options après la sélection
    };

    const playAudio = (audioUrl, messageId) => {
        if (currentAudio) {
            currentAudio.pause();
        }
        const audio = new Audio(audioUrl);
        audio.addEventListener('loadedmetadata', () => {
            if (isFinite(audio.duration) && !isNaN(audio.duration)) {
                setAudioDurations(prev => ({
                    ...prev,
                    [messageId]: audio.duration
                }));
            } else {
                console.error('Invalid audio duration:', audio.duration);
                setAudioDurations(prev => ({
                    ...prev,
                    [messageId]: 0
                }));
            }
        });
        audio.addEventListener('timeupdate', () => {
            if (isFinite(audio.duration) && !isNaN(audio.duration)) {
                setAudioProgress(prev => ({
                    ...prev,
                    [messageId]: (audio.currentTime / audio.duration) * 100
                }));
            }
        });
        audio.play();
        setCurrentAudio(audio);
        setIsPlaying(messageId);
        audio.onended = () => {
            setIsPlaying(null);
            setCurrentAudio(null);
            setAudioProgress(prev => ({ ...prev, [messageId]: 0 }));
        };
    };

    const pauseAudio = () => {
        if (currentAudio) {
            currentAudio.pause();
            setIsPlaying(null);
        }
    };

    const seekAudio = (messageId, event) => {
        const progressBar = event.currentTarget;
        const clickPosition = (event.clientX - progressBar.getBoundingClientRect().left) / progressBar.offsetWidth;
        if (currentAudio && isPlaying === messageId) {
            const newTime = clickPosition * currentAudio.duration;
            currentAudio.currentTime = newTime;
            setAudioProgress(prev => ({
                ...prev,
                [messageId]: clickPosition * 100
            }));
        }
    };

    const formatAudioDuration = (duration) => {
        if (!duration || !isFinite(duration) || isNaN(duration)) return '0:00';
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    // Ajoutez cette fonction de rappel pour récupérer les messages
    const fetchMessages = useCallback(async () => {
        if (selectedConversation) {
            try {
                const response = await makeRequest.get(`/messages/messages/${selectedConversation._id}`);
                setMessages(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des messages:', error);
            }
        }
    }, [selectedConversation]);

    // Ajoutez cet effet pour mettre à jour les messages toutes les 2 secondes
    useEffect(() => {
        const interval = setInterval(() => {
            fetchMessages();
        }, 2000);

        return () => clearInterval(interval);
    }, [fetchMessages]);

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

                            className="w-full p-2 pl-10 bg-bgColor rounded-lg"
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

                                        className="p-2 hover:bg-bgColor cursor-pointer flex items-center space-x-3"
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

                                            className="p-2 hover:bg-bgColor cursor-pointer flex items-center space-x-3"
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

                                            {msg.messageType === 'image' && (
                                                <img src={msg.content} alt="Image" className="max-w-full h-auto rounded-lg" />
                                            )}
                                            {msg.messageType === 'video' && (
                                                <video controls className="max-w-full h-auto rounded-lg">
                                                    <source src={msg.content} type="video/mp4" />
                                                    Votre navigateur ne supporte pas la lecture de vidéos.
                                                </video>
                                            )}
                                            {msg.messageType === 'audio' && (
                                                <div className="flex items-center">
                                                    <button onClick={() => isPlaying === msg._id ? pauseAudio() : playAudio(msg.content, msg._id)}>
                                                        {isPlaying === msg._id ? <Pause size={20} /> : <Play size={20} />}
                                                    </button>
                                                    <div
                                                        className="w-32 h-1 bg-gray-300 rounded-full mx-2 cursor-pointer"
                                                        onClick={(e) => seekAudio(msg._id, e)}
                                                    >
                                                        <div
                                                            className="h-full bg-blue-500 rounded-full"
                                                            style={{ width: `${audioProgress[msg._id] || 0}%` }}
                                                        ></div>
                                                    </div>
                                                    <span>{formatAudioDuration(audioDurations[msg._id])}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>


                            {/* Zone de saisie modifiée */}
                            <div className="flex items-center space-x-2 relative">
                                <button 
                                    onClick={() => setShowEmojiPicker(!showEmojiPicker)} 
                                    disabled={isUploading || isRecording}
                                    className="absolute left-2 z-10"
                                >
                                    <Smile size={24} />
                                </button>
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}

                                    className="flex-1 p-2 pl-10 pr-10 rounded-full bg-bgColor"
                                    placeholder="Tapez un message"
                                    disabled={isUploading || isRecording}
                                />
                                <div className="absolute right-2 flex items-center space-x-2">
                                    <input
                                        type="file"
                                        accept="image/*,video/*"
                                        onChange={handleMediaUpload}
                                        style={{ display: 'none' }}
                                        id="media-upload"
                                        disabled={isUploading || isRecording}
                                    />
                                    <label htmlFor="media-upload" className={`cursor-pointer ${(isUploading || isRecording) ? 'opacity-50' : ''}`}>
                                        <ImageIcon size={24} />
                                    </label>
                                    {newMessage.trim() ? (
                                        <Send onClick={handleSendMessage} className={`text-[#9a00d7] cursor-pointer ${isUploading ? 'opacity-50' : ''}`} disabled={isUploading} />
                                    ) : audioBlob ? (
                                        <Send onClick={sendAudioMessage} className={`text-[#9a00d7] cursor-pointer ${isUploading ? 'opacity-50' : ''}`} disabled={isUploading} />
                                    ) : isRecording ? (
                                        <button onClick={stopRecording} disabled={isUploading}>
                                            <Square size={24} fill="red" />
                                        </button>
                                    ) : (
                                        <button onClick={startRecording} disabled={isUploading}>
                                            <Mic size={24} />
                                        </button>
                                    )}
                                </div>
                            </div>
                            
                            {isUploading && (
                                <div className="mt-2 text-center text-sm text-gray-500">
                                    Chargement en cours...
                                </div>
                            )}

                            {audioUrl && (
                                <div className="mt-2 flex items-center justify-center">
                                    <audio src={audioUrl} controls />
                                    <button onClick={() => { setAudioBlob(null); setAudioUrl(null); }} className="ml-2 text-red-500">
                                        Supprimer
                                    </button>
                                </div>
                            )}
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


            {showEmojiPicker && (
                <div className="absolute bottom-16 left-0">
                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
            )}

            {previewMedia && (
                <MediaPreviewModal 
                    file={previewMedia}
                    type={mediaType}
                    onConfirm={() => {
                        handleConfirmMediaUpload();
                        setPreviewMedia(null);
                        setMediaType(null);
                    }}
                    onCancel={handleCancelMediaUpload}
                />
            )}

            {audioUrl && (
                <audio ref={audioPreviewRef} src={audioUrl} onEnded={() => setIsPlayingPreview(false)} />
            )}
        </nav>
    );
};

export default MobileNavbar;
