import React, { useState } from 'react';
import { Camera, Edit2, Scissors, Star, Heart, MessageCircle, Ruler } from 'lucide-react';
import ButtonModal from "../components/ButtonModal";
import Modal from "../components/Modal";

const MesVentes = () => {
    const [activeTab, setActiveTab] = useState('produits');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [models, setModels] = useState([
        {
            id: 1,
            title: "Costume trois pièces bleu marine",
            price: "1200 CFA",
            description: "Costume sur mesure en laine 150's",
            likes: { length: 156 },
            comments: { length: 23 }
        },
        {
            id: 2,
            title: "Robe de soirée rouge",
            price: "890 CFA",
            description: "Robe en soie avec dentelle",
            likes: { length: 89 },
            comments: { length: 12 }
        },
        {
            id: 3,
            title: "Smoking noir",
            price: "1500 CFA",
            description: "Smoking en laine et soie",
            likes: { length: 234 },
            comments: { length: 45 }
        }
    ]);

    const userData = {
        firstname: "Thomas",
        lastname: "Mercier",
        email: "thomas.mercier@atelier.com",
        phone: "+33 6 12 34 56 78",
        address: "15 Avenue de la Mode, 75008 Paris",
        photo: "/api/placeholder/400/400",
        rating: 4.9,
        bio: "Maître tailleur depuis 20 ans, spécialisé dans la confection sur mesure.",
        followers: 1842,
        following: 245,
        specialites: ["Costumes sur mesure", "Robes de mariée", "Tenues de soirée"]
    };

    const handleAddModel = (newModel) => {
        setModels([...models, { ...newModel, id: models.length + 1 }]);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 bg-gradient-to-b from-purple-50 to-white min-h-screen">
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-purple-600">
                            {userData.firstname} {userData.lastname}
                        </h1>
                        <div className="flex items-center gap-2 mt-2 text-purple-500">
                            <Scissors className="w-5 h-5"/>
                            <span>Maître Tailleur</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 bg-blue">
                        <ButtonModal onClick={() => setIsModalOpen(true)}/>
                    </div>
                </div>

            </div>

            {/* Bouton pour ouvrir le modal */}


            {/* Modal pour ajouter un nouveau modèle */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddModel}
            />

            {/* Liste des créations */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-2xl font-bold text-purple-600 mb-6">Mes Créations</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {models.map((model) => (
                        <div
                            key={model.id}
                            className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                        >
                            <div className="relative aspect-[3/4]">
                                <img
                                    src={model.photo}
                                    alt={model.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow-md">
                                    <span className="text-purple-600 font-bold">{model.price}</span>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-lg mb-2">{model.title}</h3>
                                <p className="text-gray-600 text-sm mb-3">{model.description}</p>
                                <div className="flex justify-between items-center">
                                    <div className="flex gap-4 text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Heart className="w-4 h-4"/>
                                            {model.likes.length}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MessageCircle className="w-4 h-4"/>
                                            {model.comments.length}
                                        </span>
                                    </div>
                                    <button className="bg-purple-600 text-white px-4 py-2 rounded-full text-sm hover:bg-purple-700">
                                        Commander
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MesVentes;
