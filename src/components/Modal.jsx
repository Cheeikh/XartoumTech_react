import { X } from 'lucide-react';
import {useState} from "react"; // Importer l'icône de fermeture

const Modal = ({ isOpen, onClose, onSubmit }) => {
    const [newModel, setNewModel] = useState({
        title: '',
        description: '',
        price: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewModel({
            ...newModel,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(newModel);
        onClose(); // Fermer le modal après la soumission
    };

    // Vérifiez que le modal ne s'affiche que si isOpen est vrai
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                    aria-label="Close modal"
                >
                    <X className="w-6 h-6"/>
                </button>
                <h2 className="text-xl font-bold mb-4">Ajouter un nouveau modèle</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Titre</label>
                        <input
                            type="text"
                            name="title"
                            value={newModel.title}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg bg-gray-100" // Ajoutez bg-gray-100 pour l'arrière-plan
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            name="description"
                            value={newModel.description}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg bg-gray-100"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Prix</label>
                        <input
                            type="number"
                            name="price"
                            value={newModel.price}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg bg-gray-100"
                            required
                        />
                    </div>
                    <div className="flex justify-end">
                        <button type="button" onClick={onClose}
                                className="mr-2 bg-gray-500 text-white px-4 py-2 rounded-lg">
                            Annuler
                        </button>
                        <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded-lg">
                            Ajouter
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Modal;
