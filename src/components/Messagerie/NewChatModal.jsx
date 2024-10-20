import React, { useMemo } from 'react';
import { X, Search } from 'lucide-react';
import { NoProfile } from '../../assets';

const NewChatModal = ({ isOpen, onClose, contacts, conversations, handleCreateConversation, searchTerm, handleSearch, user }) => {
  const availableContacts = useMemo(() => {
    if (!isOpen) return [];
    const existingParticipants = new Set(
      conversations.flatMap(conv => 
        conv.participants.map(p => p._id).filter(id => id !== user._id)
      )
    );
    return contacts.filter(contact => !existingParticipants.has(contact._id));
  }, [isOpen, contacts, conversations, user]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-primary rounded-lg w-96 max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Nouvelle discussion</h2>
          <X onClick={onClose} className="cursor-pointer" />
        </div>
        <div className="p-4">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Rechercher un contact"
              className="w-full p-2 pl-8 bg-bgColor rounded-full"
              value={searchTerm}
              onChange={handleSearch}
            />
            <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
          </div>
          <div className="overflow-y-auto max-h-[50vh]">
            {availableContacts.length > 0 ? (
              availableContacts.map((contact) => (
                <div
                  key={contact._id}
                  className="flex items-center p-2 hover:bg-bgColor cursor-pointer rounded-lg"
                  onClick={() => {
                    handleCreateConversation(contact);
                    onClose();
                  }}
                >
                  <img
                    src={contact.profileUrl || NoProfile}
                    alt={contact.firstName}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <p className="font-semibold">
                    {contact.firstName} {contact.lastName}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">Aucun nouveau contact disponible</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewChatModal;
