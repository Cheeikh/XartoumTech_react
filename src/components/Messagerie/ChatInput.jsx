import React from 'react';
import { Smile, ImageIcon, Video, Send, Mic, Play, Pause, Square, Trash2 } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';

const ChatInput = ({
  showEmojiPicker,
  setShowEmojiPicker,
  handleEmojiClick,
  handleImageUpload,
  handleVideoUpload,
  newMessage,
  setNewMessage,
  isRecording,
  audioBlob,
  isPaused,
  resumeRecording,
  pauseRecording,
  stopRecording,
  audioUrl,
  isPlayingPreview,
  playRecording,
  deleteRecording,
  sendAudioMessage,
  handleSendMessage,
  startRecording
}) => {
  return (
    <div className="p-4 bg-primary rounded-bl-lg rounded-br-lg">
      <div className="flex items-center px-4 py-2 space-x-3 bg-bgColor rounded-full">
        <div className="relative">
          <Smile
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="w-6 h-6 cursor-pointer text-[##6b7280]"
          />
          {showEmojiPicker && (
            <div className="absolute left-0 bottom-10">
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}
        </div>

        <label htmlFor="image-upload" className="cursor-pointer">
          <ImageIcon className="w-6 h-6 text-[##6b7280]" />
        </label>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />

        <label htmlFor="video-upload" className="cursor-pointer">
          <Video className="w-6 h-6 text-[##6b7280]" />
        </label>
        <input
          id="video-upload"
          type="file"
          accept="video/*"
          className="hidden"
          onChange={handleVideoUpload}
        />

        {!isRecording && !audioBlob && (
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 p-2 text-sm bg-primary border border-[#d1d5db] rounded-lg outline-none placeholder-bgColor"
            placeholder="Type a message here..."
          />
        )}

        {isRecording && (
          <div className="flex-1 flex items-center justify-between p-2 bg-[#dcfce7] rounded-full">
            <span className="text-[#22c55e]">
              {isPaused ? "Enregistrement en pause" : "Enregistrement en cours..."}
            </span>
            <div className="flex space-x-2">
              {isPaused ? (
                <Play
                  onClick={resumeRecording}
                  className="w-6 h-6 cursor-pointer text-[#22c55e]"
                />
              ) : (
                <Pause
                  onClick={pauseRecording}
                  className="w-6 h-6 cursor-pointer text-[#22c55e]"
                />
              )}
              <Square
                onClick={stopRecording}
                className="w-6 h-6 cursor-pointer text-[#22c55e]"
              />
            </div>
          </div>
        )}

        {audioUrl && !isRecording && (
          <div className="flex-1 flex items-center justify-between p-2 bg-[#dcfce7] rounded-full">
            <span className="text-[#22c55e]">Audio enregistré</span>
            <div className="flex space-x-2">
              {isPlayingPreview ? (
                <Pause
                  onClick={playRecording}
                  className="w-6 h-6 cursor-pointer text-[#22c55e]"
                />
              ) : (
                <Play
                  onClick={playRecording}
                  className="w-6 h-6 cursor-pointer text-[#22c55e]"
                />
              )}
              <Trash2
                onClick={deleteRecording}
                className="w-6 h-6 cursor-pointer text-[#ef4444]"
              />
            </div>
          </div>
        )}

        {newMessage || audioUrl ? (
          <Send
            onClick={audioUrl ? sendAudioMessage : handleSendMessage}
            className="w-8 h-8 p-1 ml-3 text-ascent-1 rounded-full cursor-pointer bg-purple"
          />
        ) : (
          <Mic
            onClick={startRecording}
            className="w-6 h-6 ml-3 rounded-lg cursor-pointer text-purple"
          />
        )}
      </div>
    </div>
  );
};

export default ChatInput;
