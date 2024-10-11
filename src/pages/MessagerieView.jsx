import React, { useState, useEffect, useRef } from 'react';
import { Search, MoreVertical, Paperclip, Smile, Mic, Send, UserPlus, X } from 'lucide-react';
import { makeRequest } from "../axios";

const MessagerieView = () => {
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

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/3 bg-white border-r overflow-hidden flex flex-col">
        <div className="bg-gray-200 p-4 flex justify-between items-center">
          <img src={user?.profileUrl || "/api/placeholder/40/40"} alt="Profile" className="w-10 h-10 rounded-full" />
          <div className="flex space-x-4">
            <UserPlus onClick={() => setShowNewChat(true)} className="text-gray-500 cursor-pointer" />
            <MoreVertical className="text-gray-500 cursor-pointer" />
          </div>
        </div>
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
        <div className="flex-1 overflow-y-auto">
          {searchTerm ? (
            searchResults.map((user) => (
              <div 
                key={user._id} 
                className="p-4 hover:bg-gray-100 cursor-pointer flex items-center space-x-3"
                onClick={() => handleCreateConversation(user)}
              >
                <img src={user.profileUrl || "/api/placeholder/50/50"} alt="Profile" className="w-12 h-12 rounded-full" />
                <p className="font-semibold">{user.firstName} {user.lastName}</p>
              </div>
            ))
          ) : (
            conversations.map((conv) => {
              const participant = conv.participants.find(p => p._id !== user?._id);
              return (
                <div 
                  key={conv._id} 
                  className="p-4 hover:bg-gray-100 cursor-pointer flex items-center space-x-3"
                  onClick={() => handleSelectConversation(conv)}
                >
                  <img src={participant.profileUrl || "/api/placeholder/50/50"} alt="Profile" className="w-12 h-12 rounded-full" />
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
                <img src={contact.profileUrl || "/api/placeholder/50/50"} alt="Profile" className="w-12 h-12 rounded-full" />
                <p className="font-semibold">{contact.firstName} {contact.lastName}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="w-2/3 flex flex-col">
        {selectedConversation ? (
          <>
            <div className="bg-gray-200 p-4 flex items-center space-x-4">
              <img src={selectedConversation.participants.find(p => p._id !== user?._id).profilePicture || "/api/placeholder/40/40"} alt="Profile" className="w-10 h-10 rounded-full" />
              <div>
                <p className="font-semibold">{selectedConversation.participants.find(p => p._id !== user?._id).firstName}</p>
                <p className="text-sm text-gray-500">En ligne</p>
              </div>
              <div className="ml-auto">
                <Search className="text-gray-500 cursor-pointer" />
                <MoreVertical className="text-gray-500 cursor-pointer ml-4" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 bg-[#e5ded8]">
              {messages.map((msg) => (
                <div 
                  key={msg._id} 
                  className={`mb-4 flex ${msg.sender._id === user?._id ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[70%] p-3 rounded-lg ${msg.sender._id === user?._id ? 'bg-[#dcf8c6]' : 'bg-white'}`}>
                    <p>{msg.content}</p>
                    <p className="text-xs text-gray-500 text-right mt-1">{formatDate(msg.createdAt)}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 bg-gray-200 flex items-center space-x-2">
              <Smile className="text-gray-500 cursor-pointer" />
              <Paperclip className="text-gray-500 cursor-pointer" />
              <input 
                type="text" 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 p-2 rounded-full"
                placeholder="Tapez un message"
              />
              {newMessage ? (
                <Send onClick={handleSendMessage} className="text-gray-500 cursor-pointer" />
              ) : (
                <Mic className="text-gray-500 cursor-pointer" />
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