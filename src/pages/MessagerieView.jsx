import React, { useState, useEffect, useRef } from 'react';
import { Search, MoreVertical, Paperclip, Smile, Mic, Send, UserPlus, X, Home, Play, Square, Pause, Video } from 'lucide-react';
import { makeRequest } from "../axios";
import { NoProfile } from "../assets";
import { useNavigate } from 'react-router-dom';
import EmojiPicker from 'emoji-picker-react';
import { 
   Image as ImageIcon 
} from 'lucide-react';
/* const LoadingAnimation = () => (
  <div className="flex justify-center items-center space-x-2 bg-white p-3 rounded-lg">
    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
  </div>
); */
// Composant de prévisualisation vidéo/image
const MediaPreviewModal = ({ file, type, onConfirm, onCancel }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl max-w-4xl w-full mx-4 overflow-hidden">
        {/* En-tête */}
        <div className="bg-gradient-to-r from-[#9a00d7] to-[#7b00aa] p-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              {type === 'video' ? <Video size={24} /> : <ImageIcon size={24} />}
              Aperçu du {type === 'video' ? 'de la vidéo' : 'de l\'image'}
            </h3>
            <button 
              onClick={onCancel}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Corps */}
        <div className="p-6">
          <div className="relative w-full aspect-video mb-6 bg-black rounded-xl overflow-hidden shadow-inner">
            {type === 'video' ? (
              <>
                <video
                  ref={videoRef}
                  src={file}
                  className="w-full h-full object-contain"
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={togglePlay}
                      className="text-white hover:text-[#9a00d7] transition-colors"
                    >
                      {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                    </button>
                    <div className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#9a00d7]" 
                        style={{ width: `${(currentTime / duration) * 100}%` }}
                      />
                    </div>
                    <span className="text-white text-sm">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <img 
                src={file} 
                alt="Aperçu" 
                className="w-full h-full object-contain"
              />
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-4 justify-end">
            <button 
              onClick={onCancel}
              className="px-6 py-3 rounded-xl border-2 border-gray-300 font-medium text-gray-600 hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              <X size={20} />
              Annuler
            </button>
            <button 
              onClick={onConfirm}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#9a00d7] to-[#7b00aa] text-white font-medium hover:opacity-90 transition-opacity flex items-center gap-2 shadow-lg shadow-purple-500/30"
            >
              <Send size={20} />
              Envoyer
            </button>
          </div>
        </div>

        {/* Pied de page */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <p className="text-sm text-gray-500 text-center">
            Cliquez sur "Envoyer" pour partager {type === 'video' ? 'la vidéo' : 'l\'image'} dans la conversation
          </p>
        </div>
      </div>
    </div>
  );
};
const ImagePreviewModal = ({ image, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl max-w-3xl w-full mx-4 overflow-hidden transform transition-all">
      {/* En-tête du modal */}
      <div className="bg-gradient-to-r from-[#9a00d7] to-[#7b00aa] p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <ImageIcon size={24} />
            Aperçu de l'image
          </h3>
          <button 
            onClick={onCancel}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      {/* Corps du modal */}
      <div className="p-6">
        <div className="relative w-full aspect-video mb-6 bg-black/5 rounded-xl overflow-hidden shadow-inner">
          <img 
            src={image} 
            alt="Aperçu" 
            className="w-full h-full object-contain"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-end">
          <button 
            onClick={onCancel}
            className="px-6 py-3 rounded-xl border-2 border-gray-300 font-medium text-gray-600 hover:bg-gray-100 transition-colors flex items-center gap-2"
          >
            <X size={20} />
            Annuler
          </button>
          <button 
            onClick={onConfirm}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#9a00d7] to-[#7b00aa] text-white font-medium hover:opacity-90 transition-opacity flex items-center gap-2 shadow-lg shadow-purple-500/30"
          >
            <Send size={20} />
            Envoyer
          </button>
        </div>
      </div>

      {/* Pied de page optionnel avec des informations sur l'image */}
      <div className="border-t border-gray-200 p-4 bg-gray-50">
        
        <p className="text-sm text-gray-500 text-center">
          Cliquez sur "Envoyer" pour partager l'image dans la conversation
        </p>
      </div>
    </div>
  </div>
);
const VideoMessage = ({ src }) => (
  <div className="relative w-64 h-36 overflow-hidden rounded-lg">
    <video src={src} controls className="w-full h-full object-cover">
      Votre navigateur ne supporte pas la lecture de vidéos.
    </video>
  </div>
);
const MessagerieView = () => {
  const [previewMedia, setPreviewMedia] = useState(null);

  const [mediaType, setMediaType] = useState(null);

  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState(null);
  const [showNewChat, setShowNewChat] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const messagesEndRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  
  


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
  const fetchMessages = async () => {
    try {
      const response = await makeRequest.get(`/messages/messages/${selectedConversation._id}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des messages:', error);
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
        content: newMessage
      });

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
  
      const chunks = [];
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        console.log('Audio Blob:', blob);
        setAudioBlob(blob);
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
  const handleVideoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !selectedConversation) return;

    // Créer l'URL de l'aperçu
    const previewUrl = URL.createObjectURL(file);
    setPreviewMedia(previewUrl);
    setSelectedFile(file);
    setMediaType('video');
  };

  const handleConfirmVideoUpload = async () => {
    if (!selectedFile || !selectedConversation) return;

    const formData = new FormData();
    formData.append('video', selectedFile);
    
    formData.append('conversationId', selectedConversation._id);

    setIsUploading(true);

    try {
      const response = await makeRequest.post('/messages/video', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setMessages([...messages, response.data]);
    } catch (error) {
      console.error("Erreur lors de l'envoi de la vidéo:", error);
    } finally {
      setIsUploading(false);
      setPreviewMedia(null);
      setSelectedFile(null);
      setMediaType(null);
      await fetchMessages();
    }
  };

  const handleCancelMediaUpload = () => {
    setPreviewMedia(null);
    setSelectedFile(null);
    setMediaType(null);
    URL.revokeObjectURL(previewMedia); // Libérer la mémoire
  };

  

  const sendAudioMessage = async () => {
    if (!audioBlob || !selectedConversation) return;
  
    const formData = new FormData();
    const audioFile = new File([audioBlob], 'audio.webm', { type: audioBlob.type });
    formData.append('audio', audioFile);
    formData.append('conversationId', selectedConversation._id);
  
    // Loggez le contenu de formData
    for (let pair of formData.entries()) {
      if (pair[0] === 'audio') {
        console.log(`${pair[0]}:`, pair[1], 'Size:', pair[1].size);
      } else {
        console.log(`${pair[0]}:`, pair[1]);
      }
    }
  
    try {
      const response = await makeRequest.post('/messages/audio', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessages([...messages, response.data]);
      setAudioBlob(null);
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

  const playAudio = (audioUrl) => {
    if (currentAudio) {
      currentAudio.pause();
    }
    const audio = new Audio(audioUrl);
    audio.play();
    setCurrentAudio(audio);
    setIsPlaying(true);
    audio.onended = () => {
      setIsPlaying(false);
      setCurrentAudio(null);
    };
  };

  const pauseAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      setIsPlaying(false);
    }
  };
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !selectedConversation) return;

    // Créer l'URL de l'aperçu
    const previewUrl = URL.createObjectURL(file);
    setPreviewImage(previewUrl);
    setSelectedFile(file);
  };
  const handleConfirmImageUpload = async () => {
    if (!selectedFile || !selectedConversation) return;

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('conversationId', selectedConversation._id);

    setIsUploading(true);

    try {
      const response = await makeRequest.post('/messages/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setMessages([...messages, response.data]);
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'image:", error);
    } finally {
      setIsUploading(false);
      setPreviewImage(null);
      setSelectedFile(null);
    }
  };
  const handleCancelImageUpload = () => {
    setPreviewImage(null);
    setSelectedFile(null);
  };

  const ImageMessage = ({ src }) => (
    <div className="relative w-48 h-48 overflow-hidden rounded-lg">
      <img src={src} alt="Image envoyée" className="object-cover w-full h-full" />
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Liste des conversations */}
      <div className="w-1/3 bg-white border-r overflow-hidden flex flex-col">
        {/* En-tête */}
        <div className="bg-gray-200 p-4 flex justify-between items-center">
          <img src={user?.profileUrl || NoProfile} alt="Profile" className="w-10 h-10 rounded-full" />
          <div className="flex space-x-4">
            <Home onClick={handleHomeClick} className="text-gray-500 cursor-pointer" />
            <UserPlus onClick={() => setShowNewChat(true)} className="text-gray-500 cursor-pointer" />
            <MoreVertical className="text-gray-500 cursor-pointer" />
          </div>
        </div>
        {/* Barre de recherche */}
        <div className="bg-white p-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher ou démarrer une nouvelle discussion"
              className="w-full p-2 pl-10 bg-gray-100 rounded-lg"
              value={searchTerm}
              onChange={handleSearch}
            />
            <Search className="absolute left-2 top-2 text-gray-500" />
          </div>
        </div>
        {/* Liste des conversations ou résultats de recherche */}
        <div className="flex-1 overflow-y-auto">
          {searchTerm ? (
            searchResults.map((user) => (
              <div 
                key={user._id} 
                className="p-4 hover:bg-gray-100 cursor-pointer flex items-center space-x-3"
                onClick={() => handleCreateConversation(user)}
              >
                <img src={user.profileUrl || NoProfile} alt="Profile" className="w-12 h-12 rounded-full" />
                <p className="font-semibold">{user.firstName} {user.lastName}</p>
              </div>
            ))
          ) : (
            conversations.map((conv) => {
              const participant = conv.participants?.find(p => p._id !== user?._id);
              if (!participant) return null;
              return (
                <div 
                  key={conv._id} 
                  className="p-4 hover:bg-gray-100 cursor-pointer flex items-center space-x-3"
                  onClick={() => handleSelectConversation(conv)}
                >
                  <img src={participant.profileUrl || NoProfile} alt="Profile" className="w-12 h-12 rounded-full" />
                  <div>
                    <p className="font-semibold">{participant.firstName} {participant.lastName}</p>
                    <p className="text-sm text-gray-500 truncate">{conv.lastMessage?.content}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
        {previewMedia && (
        <MediaPreviewModal 
          file={previewMedia}
          type={mediaType}
          onConfirm={mediaType === 'video' ? handleConfirmVideoUpload : handleConfirmImageUpload}
          onCancel={handleCancelMediaUpload}
        />
      )}
      </div>

      {/* Nouvelle discussion */}
      {showNewChat && (
        <div className="absolute left-1/3 top-0 w-1/3 h-full bg-white z-10 flex flex-col">
          <div className="bg-gray-200 p-4 flex items-center">
            <X onClick={() => setShowNewChat(false)} className="text-gray-500 cursor-pointer mr-4" />
            <h2 className="text-lg font-semibold">Nouvelle discussion</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {contacts.map((contact) => (
              <div 
                key={contact._id} 
                className="p-4 hover:bg-gray-100 cursor-pointer flex items-center space-x-3"
                onClick={() => handleCreateConversation(contact)}
              >
                <img src={contact.profileUrl || NoProfile} alt="Profile" className="w-12 h-12 rounded-full" />
                <p className="font-semibold">{contact.firstName} {contact.lastName}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Zone de chat */}
      <div className="w-2/3 flex flex-col">
        {selectedConversation ? (
          <>
            {/* En-tête du chat */}
            <div className="bg-gray-200 p-4 flex items-center space-x-4">
              {(() => {
                const participant = selectedConversation.participants?.find(p => p._id !== user?._id);
                return (
                  <>
                    <img src={participant?.profileUrl || NoProfile} alt="Profile" className="w-10 h-10 rounded-full" />
                    <div>
                      <p className="font-semibold">{participant?.firstName}</p>
                      <p className="text-sm text-gray-500">En ligne</p>
                    </div>
                  </>
                );
              })()}
              <div className="ml-auto">
                <Search className="text-gray-500 cursor-pointer" />
                <MoreVertical className="text-gray-500 cursor-pointer ml-4" />
              </div>
            </div>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-[#e5ded8]">
              {/* Ajouter le modal d'aperçu d'image */}
      
              {messages.map((msg) => (
                <div 
                  key={msg._id} 
                  className={`mb-4 flex ${msg.sender?._id === user?._id ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[70%] p-3 rounded-lg ${msg.sender?._id === user?._id ? 'bg-[#dcf8c6]' : 'bg-white'}`}>
                    {msg.messageType === 'text' && <p>{msg.content}</p>}
                    {msg.messageType === 'audio' && (
                      <div className="flex items-center space-x-2">
                        {isPlaying && currentAudio?.src === msg.content ? (
                          <Pause onClick={pauseAudio} className="cursor-pointer text-[#9a00d7]-500" />
                        ) : (
                          <Play onClick={() => playAudio(msg.content)} className="cursor-pointer text-[#9a00d7]-500" />
                        )}
                        <span>Message audio</span>
                      </div>
                    )}
                    {msg.messageType === 'file' && (
                      <a href={msg.content} target="_blank" rel="noopener noreferrer" className="text-[#9a00d7]-500 underline">
                        Fichier joint
                      </a>
                    )}
            {msg.messageType === 'image' && <ImageMessage src={msg.content} />}
            {msg.messageType === 'video' && <VideoMessage src={msg.content} />}
                    <p className="text-xs text-gray-500 text-right mt-1">{formatDate(msg.createdAt)}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-gray-200 flex items-center space-x-2">
    <div className="relative">
      <Smile onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="text-gray-500 cursor-pointer" />
      {showEmojiPicker && (
        <div className="absolute bottom-10 left-0">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}
    </div>
    {previewImage && (
        <ImagePreviewModal 
          image={previewImage}
          onConfirm={handleConfirmImageUpload}
          onCancel={handleCancelImageUpload}
        />
      )}
    <label htmlFor="file-upload" className="cursor-pointer">
      <Paperclip className="text-gray-500" />
    </label>
    <input
      id="file-upload"
      type="file"
      className="hidden"
      onChange={handleFileUpload}
    />

    <label htmlFor="image-upload" className="cursor-pointer">
      <ImageIcon className="text-gray-500" />
    </label>
    <input
      id="image-upload"
      type="file"
      accept="image/*"
      className="hidden"
      onChange={handleImageUpload}
      disabled={isUploading}
    />
       <label htmlFor="video-upload" className="cursor-pointer">
          <Video className="text-gray-500" />
        </label>
        <input
          id="video-upload"
          type="file"
          accept="video/*"
          className="hidden"
          onChange={handleVideoUpload}
          disabled={isUploading}
        />
    
     {isUploading && (
                <div className="flex-1 p-2 rounded-full bg-blue-100 text-blue-500 text-center">
                  Chargement de l'image...
                </div>
              )}
              {!isRecording && !audioBlob && (
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 p-2 rounded-full"
                  placeholder="Tapez un message"
                />
              )}
              {isRecording && (
                <div className="flex-1 p-2 rounded-full bg-red-100 text-red-500 text-center">
                  Enregistrement en cours...
                </div>
              )}
              {audioBlob && !isRecording && (
                <div className="flex-1 p-2 rounded-full bg-green-100 text-green-500 text-center">
                  Audio enregistré
                </div>
              )}
              {newMessage || audioBlob ? (
                <Send onClick={audioBlob ? sendAudioMessage : handleSendMessage} className="text-[#9a00d7]-500 cursor-pointer" />
              ) : isRecording ? (
                <Square onClick={stopRecording} className="text-red-500 cursor-pointer" />
              ) : (
                <Mic onClick={startRecording} className="text-gray-500 cursor-pointer" />
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full bg-[#f8f9fa]">
            <p className="text-xl text-gray-500">Sélectionnez une conversation pour commencer à chatter</p>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default MessagerieView;
