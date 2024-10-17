import React, { useState, useEffect, useRef } from 'react';
import { Search, MoreVertical, Paperclip, Smile, Mic, Send, UserPlus, X, Home, Play, Square, Pause } from 'lucide-react';
import { makeRequest } from "../axios";
import { NoProfile } from "../assets";
import { useNavigate } from 'react-router-dom';
import EmojiPicker from 'emoji-picker-react';
import { 
   Image as ImageIcon 
} from 'lucide-react';


const MessagerieView = () => {
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

    const formData = new FormData();
    formData.append('image', file);
    formData.append('conversationId', selectedConversation._id);

    try {
      const response = await makeRequest.post('/messages/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setMessages([...messages, response.data]);
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'image:", error);
    }
  };

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
                     {msg.messageType === 'image' && (
            <img src={msg.content} alt="Image envoyée" className="max-w-full h-auto rounded" />
          )}
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
    />
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
