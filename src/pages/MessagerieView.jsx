import React, { useState, useEffect, useRef, useCallback } from "react";
import { makeRequest } from "../axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { TopBar } from "../components";
import {
  ConversationList,
  ChatHeader,
  MessageList,
  ChatInput,
  MediaPreviewModal,
  NewChatModal
} from '../components/Messagerie';

const MessagerieView = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState(null);
  const [showNewChat, setShowNewChat] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const messagesEndRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const audioChunksRef = useRef([]);
  const [previewMedia, setPreviewMedia] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadingMedia, setUploadingMedia] = useState(null);
  const [videoThumbnail, setVideoThumbnail] = useState(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const audioPreviewRef = useRef(null);
  const [audioProgress, setAudioProgress] = useState({});
  const [audioDurations, setAudioDurations] = useState({});
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [socket, setSocket] = useState(null);

  // Fonction pour récupérer les messages
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

  // Effet pour initialiser la connexion socket
  useEffect(() => {
    const newSocket = io("http://localhost:8000");
    setSocket(newSocket);
    return () => newSocket.close();
  }, []);

  // Effet pour écouter les nouveaux messages via socket
  useEffect(() => {
    if (socket === null) return;

    socket.on('receiveMessage', (message) => {
      if (selectedConversation && message.conversationId === selectedConversation._id) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [socket, selectedConversation]);

  // Effet pour actualiser les messages toutes les 2 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchMessages();
    }, 2000);

    return () => clearInterval(interval);
  }, [fetchMessages]);

  useEffect(() => {
    if (audioBlob) {
      console.log('Audio Blob mis à jour:', audioBlob);
      // Vous pouvez effectuer des actions supplémentaires ici
    }
  }, [audioBlob]);

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSelectConversation = async (conversation) => {
    if (selectedConversation) {
      socket.emit('leaveRoom', selectedConversation._id);
    }
    setSelectedConversation(conversation);
    socket.emit('joinRoom', conversation._id);
    await fetchMessages();
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const response = await makeRequest.post('/messages/messages', {
        conversationId: selectedConversation._id,
        content: newMessage
      });

      socket.emit('sendMessage', response.data);
      setMessages([...messages, response.data]);
      setNewMessage('');
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
    }
  };

  const handleCreateConversation = async (contact) => {
    try {
      const response = await makeRequest.post('/messages/conversations', {
        participantId: contact._id
      });
      setConversations([response.data, ...conversations]);
      setSelectedConversation(response.data);
      setShowNewChat(false);
    } catch (error) {
      console.error('Erreur lors de la création de la conversation:', error);
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

  const formatDate = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleHomeClick = () => {
    navigate('/'); // Redirige vers la page d'accueil
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const options = { mimeType: 'audio/webm' };
      mediaRecorderRef.current = new MediaRecorder(stream, options);
  
      audioChunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
      };
  
      mediaRecorderRef.current.start();
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

  const handleConfirmVideoUpload = async () => {
    if (!selectedFile || !selectedConversation) return;

    const formData = new FormData();
    formData.append('video', selectedFile);
    formData.append('conversationId', selectedConversation._id);

    setUploadingMedia('video');

    try {
      const tempMessage = {
        _id: Date.now(),
        sender: user,
        messageType: 'loading',
        content: 'Chargement de la vidéo...',
        createdAt: new Date(),
        previewUrl: videoThumbnail,
      };
      setMessages([...messages, tempMessage]);

      const response = await makeRequest.post('/messages/video', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setMessages(prevMessages => prevMessages.filter(msg => msg._id !== tempMessage._id));
      setMessages(prevMessages => [...prevMessages, response.data]);
    } catch (error) {
      console.error("Erreur lors de l'envoi de la vidéo:", error);
    } finally {
      setUploadingMedia(null);
      setPreviewMedia(null);
      setSelectedFile(null);
      setMediaType(null);
      setVideoThumbnail(null);
    }
  };

  const handleConfirmImageUpload = async () => {
    if (!selectedFile || !selectedConversation) return;

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('conversationId', selectedConversation._id);

    setUploadingMedia('image');

    try {
      const tempMessage = {
        _id: Date.now(),
        sender: user,
        messageType: 'loading',
        content: 'Chargement de l\'image...',
        createdAt: new Date(),
        previewUrl: URL.createObjectURL(selectedFile),
      };
      setMessages([...messages, tempMessage]);

      const response = await makeRequest.post('/messages/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setMessages(prevMessages => prevMessages.filter(msg => msg._id !== tempMessage._id));
      setMessages(prevMessages => [...prevMessages, response.data]);
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'image:", error);
    } finally {
      setUploadingMedia(null);
      setPreviewMedia(null);
      setSelectedFile(null);
      setMediaType(null);
    }
  };

  const handleCancelMediaUpload = () => {
    setPreviewMedia(null);
    setSelectedFile(null);
    setMediaType(null);
    URL.revokeObjectURL(previewMedia);
  };

  const sendAudioMessage = async () => {
    if (!audioBlob || !selectedConversation) return;
  
    const formData = new FormData();
    const audioFile = new File([audioBlob], 'audio.webm', { type: audioBlob.type });
    formData.append('audio', audioFile);
    formData.append('conversationId', selectedConversation._id);
  
    try {
      const tempMessage = {
        _id: Date.now(),
        sender: user,
        messageType: 'loading',
        content: 'Envoi du message audio...',
        createdAt: new Date(),
      };
      setMessages([...messages, tempMessage]);

      const response = await makeRequest.post('/messages/audio', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setMessages(prevMessages => prevMessages.filter(msg => msg._id !== tempMessage._id));
      setMessages(prevMessages => [...prevMessages, response.data]);
      
      deleteRecording();
    } catch (error) {
      console.error("Erreur lors de l'envoi du message audio:", error);
    }
  };
  

  const handleEmojiClick = (emojiObject) => {
    setNewMessage(prevMessage => prevMessage + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !selectedConversation) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('conversationId', selectedConversation._id);

    try {
      const response = await makeRequest.post('/messages/file', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setMessages([...messages, response.data]);
    } catch (error) {
      console.error("Erreur lors de l'envoi du fichier:", error);
    }
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

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    }
  };

  const playRecording = () => {
    if (audioUrl) {
      if (isPlayingPreview) {
        audioPreviewRef.current.pause();
        setIsPlayingPreview(false);
      } else {
        audioPreviewRef.current.play();
        setIsPlayingPreview(true);
      }
    }
  };

  const deleteRecording = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    audioChunksRef.current = [];
    if (audioPreviewRef.current) {
      audioPreviewRef.current.pause();
      audioPreviewRef.current.currentTime = 0;
    }
    setIsPlayingPreview(false);
  };

  const formatAudioDuration = (duration) => {
    if (!duration || !isFinite(duration) || isNaN(duration)) return '0:00';
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleOpenNewChatModal = () => {
    setIsNewChatModalOpen(true);
  };

  const handleCloseNewChatModal = () => {
    setIsNewChatModalOpen(false);
  };

  console.log("user", user);

  return (
    <div className="flex flex-col h-screen bg-bgColor">
      <TopBar onSearch={handleSearch}/>

      <div className="flex flex-1 overflow-hidden text-ascent-1">
        <ConversationList 
          conversations={conversations}
          searchTerm={searchTerm}
          searchResults={searchResults}
          handleSearch={handleSearch}
          handleCreateConversation={handleCreateConversation}
          handleSelectConversation={handleSelectConversation}
          formatDate={formatDate}
          user={user}
          handleHomeClick={handleHomeClick}
          showNewChat={showNewChat}
          setShowNewChat={handleOpenNewChatModal}
          contacts={contacts}
        />

        <div className="flex flex-col flex-1 mt-8 mb-8 ml-4 mr-10 bg-primary rounded-xl">
          {selectedConversation ? (
            <>
              <ChatHeader selectedConversation={selectedConversation} user={user} />
              <MessageList 
                messages={messages}
                user={user}
                isPlaying={isPlaying}
                pauseAudio={pauseAudio}
                playAudio={playAudio}
                seekAudio={seekAudio}
                audioProgress={audioProgress}
                audioDurations={audioDurations}
                formatDate={formatDate}
                formatAudioDuration={formatAudioDuration}
              />
              <ChatInput 
                showEmojiPicker={showEmojiPicker}
                setShowEmojiPicker={setShowEmojiPicker}
                handleEmojiClick={handleEmojiClick}
                handleImageUpload={handleImageUpload}
                handleVideoUpload={handleVideoUpload}
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                isRecording={isRecording}
                audioBlob={audioBlob}
                isPaused={isPaused}
                resumeRecording={resumeRecording}
                pauseRecording={pauseRecording}
                stopRecording={stopRecording}
                audioUrl={audioUrl}
                isPlayingPreview={isPlayingPreview}
                playRecording={playRecording}
                deleteRecording={deleteRecording}
                sendAudioMessage={sendAudioMessage}
                handleSendMessage={handleSendMessage}
                startRecording={startRecording}
              />
            </>
          ) : (
            <div className="flex items-center justify-center flex-1 p-8 bg-primary rounded-lg">
              <p className="text-lg text-gray-500">
                Sélectionnez une conversation pour commencer à discuter
              </p>
            </div>
          )}
        </div>
      </div>

      {previewMedia && (
        <MediaPreviewModal 
          file={previewMedia}
          type={mediaType}
          onConfirm={() => {
            mediaType === 'video' ? handleConfirmVideoUpload() : handleConfirmImageUpload();
            setPreviewMedia(null);
            setMediaType(null);
          }}
          onCancel={handleCancelMediaUpload}
        />
      )}

      {audioUrl && (
        <audio ref={audioPreviewRef} src={audioUrl} onEnded={() => setIsPlayingPreview(false)} />
      )}

      <NewChatModal
        isOpen={isNewChatModalOpen}
        onClose={handleCloseNewChatModal}
        contacts={contacts}
        conversations={conversations}
        handleCreateConversation={handleCreateConversation}
        searchTerm={searchTerm}
        handleSearch={handleSearch}
        user={user}
      />
    </div>
  );
};

export default MessagerieView;
