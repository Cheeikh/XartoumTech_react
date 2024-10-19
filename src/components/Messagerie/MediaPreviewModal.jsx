import React from 'react';

const MediaPreviewModal = ({ file, type, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-primary p-4 rounded-lg max-w-lg w-full max-h-[90vh] flex flex-col">
        <h2 className="text-lg font-bold mb-2">Aperçu du média</h2>
        <div className="flex-1 overflow-auto mb-4">
          {type === 'image' ? (
            <img 
              src={file} 
              alt="Aperçu" 
              className="max-w-full h-auto max-h-[60vh] object-contain mx-auto" 
            />
          ) : (
            <video 
              src={file} 
              controls 
              className="max-w-full h-auto max-h-[60vh] object-contain mx-auto"
            >
              Votre navigateur ne supporte pas la lecture de vidéos.
            </video>
          )}
        </div>
        <div className="flex justify-end space-x-2">
          <button onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors">Annuler</button>
          <button onClick={onConfirm} className="px-4 py-2 bg-purple-600 text-ascent-1 rounded-lg hover:bg-purple-700 transition-colors">Envoyer</button>
        </div>
      </div>
    </div>
  );
};

export default MediaPreviewModal;
