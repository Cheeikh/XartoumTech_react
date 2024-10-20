import React from 'react';
import { Search, Plus, ChevronLeft } from 'lucide-react';
import { NoProfile } from '../../assets';

const ConversationList = ({ 
  conversations, 
  searchTerm, 
  searchResults, 
  handleSearch, 
  handleCreateConversation, 
  handleSelectConversation, 
  formatDate, 
  user, 
  handleHomeClick, 
  showNewChat,
  setShowNewChat,
  contacts
}) => {
  return (
    <div className="flex flex-col w-1/4 overflow-hidden">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <ChevronLeft
            className="w-6 h-6 mr-2 text-gray-600 cursor-pointer"
            onClick={handleHomeClick}
          />
          <h2 className="text-xl font-semibold">Chats</h2>
        </div>
        <Plus
          className="flex items-center justify-center w-5 h-5 text-ascent-1 text-sm rounded-full bg-secondary cursor-pointer"
          onClick={() => setShowNewChat(true)}
        />
      </div>

      <div className="p-4 bg-bgColor">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="w-full p-2 pl-8 bg-bgColor rounded-full border border-purple-300"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-bgColor">
        {showNewChat ? (
          contacts.map((contact) => (
            <div
              key={contact._id}
              className="flex items-center p-2 mb-1 ml-4 mr-8 cursor-pointer w-[92%] bg-primary hover:bg-bgColor rounded-lg"
              onClick={() => handleCreateConversation(contact)}
            >
              <img
                src={contact.profileUrl || NoProfile}
                alt={contact.firstName}
                className="w-12 h-12 mr-3 rounded-full"
              />
              <div>
                <p className="font-semibold">
                  {contact.firstName} {contact.lastName}
                </p>
              </div>
            </div>
          ))
        ) : searchTerm ? (
          searchResults.map((user) => (
            <div
              key={user._id}
              className="flex items-center p-2 mb-1 ml-4 mr-8 cursor-pointer w-[92%] bg-primary hover:bg-bgColor rounded-lg"
              onClick={() => handleCreateConversation(user)}
            >
              <img
                src={user.profileUrl || NoProfile}
                alt={user.firstName}
                className="w-12 h-12 mr-3 rounded-full"
              />
              <div>
                <p className="font-semibold">
                  {user.firstName} {user.lastName}
                </p>
              </div>
            </div>
          ))
        ) : (
          conversations.map((conv) => {
            const participant = conv.participants?.find(
              (p) => p._id !== user?._id
            );
            if (!participant) return null;
            return (
              <div
                key={conv._id}
                className="flex items-center justify-between p-2 mb-1 ml-4 mr-8 cursor-pointer w-[92%] bg-primary hover:bg-bgColor rounded-lg"
                onClick={() => handleSelectConversation(conv)}
              >
                <div className="flex items-center">
                  <img
                    src={participant.profileUrl || NoProfile}
                    alt={participant.firstName}
                    className="w-12 h-12 mr-3 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">
                      {participant.firstName} {participant.lastName}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {conv.lastMessage?.content}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">
                    {formatDate(conv.updatedAt)}
                  </div>
                  {conv.unreadCount > 0 && (
                    <div className="flex items-center justify-center w-5 h-5 mt-1 text-xs text-ascent-1 bg-purple-600 rounded-full">
                      {conv.unreadCount}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ConversationList;
