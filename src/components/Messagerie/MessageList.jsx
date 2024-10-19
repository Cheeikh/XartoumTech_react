import React from 'react';
import { NoProfile } from '../../assets';
import { Play, Pause } from 'lucide-react';

const MessageList = ({ 
  messages, 
  user, 
  isPlaying, 
  pauseAudio, 
  playAudio, 
  seekAudio, 
  audioProgress, 
  audioDurations, 
  formatDate, 
  formatAudioDuration 
}) => {
  return (
    <div className="flex-1 p-4 md:p-8 overflow-y-auto bg-primary">
      {messages.map((msg, index) => {
        const isCurrentUser = msg.sender?._id === user?._id;
        const isConsecutive = index > 0 && messages[index - 1].sender?._id === msg.sender?._id;
        return (
          <div
            key={msg._id}
            className={`mb-4 flex ${
              isCurrentUser ? "justify-end" : "justify-start"
            } ${isConsecutive ? "mt-1" : "mt-4"}`}
          >
            {!isCurrentUser && !isConsecutive && (
              <img
                src={msg.sender?.profileUrl || NoProfile}
                alt={msg.sender?.firstName}
                className="object-cover w-8 h-8 mr-3 rounded-full self-end"
              />
            )}
            {!isCurrentUser && isConsecutive && <div className="w-8 mr-3" />}
            <div
              className={`max-w-[70%] ${
                isCurrentUser
                  ? "bg-secondary text-ascent-1"
                  : "bg-bgColor text-ascent-1"
              } rounded-2xl p-3 shadow-md`}
            >
              {msg.messageType === "text" && (
                <p className="break-words text-sm leading-relaxed ">{msg.content}</p>
              )}
              {msg.messageType === "audio" && (
                <div className="flex items-center space-x-2 bg-opacity-50 bg-primary rounded-full p-2 w-64">
                  {isPlaying === msg._id ? (
                    <Pause
                      onClick={pauseAudio}
                      className="cursor-pointer text-purple w-6 h-6"
                    />
                  ) : (
                    <Play
                      onClick={() => playAudio(msg.content, msg._id)}
                      className="cursor-pointer text-purple w-6 h-6"
                    />
                  )}
                  <div 
                    className="flex-1 h-1 bg-gray-300 rounded-full overflow-hidden cursor-pointer"
                    onClick={(e) => seekAudio(msg._id, e)}
                  >
                    <div 
                      className="h-full bg-purple" 
                      style={{ width: `${audioProgress[msg._id] || 0}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-700">
                    {formatAudioDuration(audioDurations[msg._id])}
                  </span>
                </div>
              )}
              {msg.messageType === "image" && (
                <img 
                  src={msg.content} 
                  alt="Image envoyée" 
                  className="max-w-full h-auto max-h-60 rounded-lg object-contain" 
                />
              )}
              {msg.messageType === "video" && (
                <video 
                  src={msg.content} 
                  controls 
                  className="max-w-full h-auto max-h-60 rounded-lg object-contain"
                >
                  Votre navigateur ne supporte pas la lecture de vidéos.
                </video>
              )}
              {msg.messageType === "loading" && (
                <div className="flex flex-col items-center space-y-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-current"></div>
                  <span className="text-sm">{msg.content}</span>
                  {msg.previewUrl && (
                    <div className="w-32 h-32 overflow-hidden rounded-lg">
                      <img 
                        src={msg.previewUrl} 
                        alt="Aperçu" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  )}
                </div>
              )}
              <p className="mt-1 text-xs text-right opacity-70">
                {formatDate(msg.createdAt)}
              </p>
            </div>
            {isCurrentUser && !isConsecutive && (
              <img
                src={user?.profileUrl || NoProfile}
                alt={user?.firstName}
                className="object-cover w-8 h-8 ml-3 rounded-full self-end"
              />
            )}
            {isCurrentUser && isConsecutive && <div className="w-8 ml-3" />}
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;
