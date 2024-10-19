import React from 'react';
import { Search, Settings } from 'lucide-react';
import { NoProfile } from '../../assets';

const ChatHeader = ({ selectedConversation, user }) => {
  const participant = selectedConversation.participants?.find(
    (p) => p._id !== user?._id
  );

  return (
    <div className="flex items-center justify-between pt-4 pb-4 pl-8 pr-8 bg-primary rounded-tl-lg rounded-tr-lg">
      <div className="flex items-center">
        <img
          src={participant?.profileUrl || NoProfile}
          alt={participant?.firstName}
          className="w-10 h-10 mr-3 rounded-full"
        />
        <div>
          <p className="font-semibold">
            {participant?.firstName} {participant?.lastName}
          </p>
          <p className="text-sm text-">En ligne</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <Search className="w-5 h-5 text-gray-500 cursor-pointer" />
        <Settings className="w-5 h-5 text-gray-500 cursor-pointer" />
      </div>
    </div>
  );
};

export default ChatHeader;
