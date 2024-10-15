import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Loading, TopBar } from "../components"; // Importation de composants personnalisés
import { makeRequest } from "../axios"; // Importation de la fonction pour faire des requêtes axios
import { NoProfile } from "../assets"; // Image par défaut pour un profil
import { Grid, Image, X, Heart, MessageCircle, Send, ChevronLeft, ChevronRight } from "lucide-react"; // Importation d'icônes

const Profile = () => {
  const { id } = useParams(); // Récupération de l'ID de l'utilisateur à partir des paramètres de l'URL
  const { user: currentUser } = useSelector((state) => state.user); // Récupération de l'utilisateur actuel depuis le store Redux
  const { theme } = useSelector((state) => state.theme); // Récupération du thème depuis le store Redux
  const [userInfo, setUserInfo] = useState(null); // État pour stocker les informations de l'utilisateur
  const [loading, setLoading] = useState(true); // État pour gérer le chargement
  const [posts, setPosts] = useState([]); // État pour stocker les publications de l'utilisateur
  const [errMsg, setErrMsg] = useState(""); // État pour stocker les messages d'erreur
  const [activeTab, setActiveTab] = useState("posts"); // État pour gérer l'onglet actif
  const [postsPerRow, setPostsPerRow] = useState(3); // État pour gérer le nombre de publications par ligne
  const [selectedPostIndex, setSelectedPostIndex] = useState(null); // État pour gérer l'index de la publication sélectionnée

  // Hook pour récupérer les données de l'utilisateur
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true); // Début du chargement
        // Requête pour obtenir les informations de l'utilisateur
        const userResponse = await makeRequest.get(`/users/get-user/${id}`);
        setUserInfo(userResponse.data.user); // Mise à jour des informations de l'utilisateur

        // Requête pour obtenir les publications de l'utilisateur
        const postsResponse = await makeRequest.get(`/posts/user/${id}`);
        // Filtrage des publications pour garder celles avec des médias
        setPosts(postsResponse.data.data.filter(post => post.media));

        setLoading(false); // Fin du chargement
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        setErrMsg("Échec du chargement des données du profil."); // Message d'erreur
        setLoading(false); // Fin du chargement en cas d'erreur
      }
    };

    fetchUserData(); // Appel de la fonction pour récupérer les données de l'utilisateur
  }, [id]); // Dépendance pour réexécuter le useEffect si l'ID change

  // Hook pour gérer le redimensionnement de la fenêtre
  useEffect(() => {
    const handleResize = () => {
      // Détermine le nombre de publications par ligne en fonction de la largeur de la fenêtre
      if (window.innerWidth < 640) {
        setPostsPerRow(1); // 1 publication par ligne pour les écrans petits
      } else if (window.innerWidth < 1024) {
        setPostsPerRow(2); // 2 publications pour les écrans moyens
      } else {
        setPostsPerRow(3); // 3 publications pour les grands écrans
      }
    };

    handleResize(); // Appel initial de la fonction de redimensionnement
    window.addEventListener('resize', handleResize); // Écouteur d'événement pour le redimensionnement
    return () => window.removeEventListener('resize', handleResize); // Nettoyage de l'écouteur d'événement
  }, []);

  // Fonction pour gérer le suivi d'un utilisateur
  const handleFollow = async () => {
    try {
      await makeRequest.post("/users/friend-request", { requestTo: id }); // Envoi d'une demande de suivi
      setUserInfo(prev => ({ ...prev, isFollowing: true })); // Mise à jour des informations de l'utilisateur pour indiquer qu'il suit
    } catch (error) {
      console.error("Erreur lors de l'envoi de la demande d'ami:", error);
      setErrMsg("Échec de l'envoi de la demande d'ami."); // Message d'erreur
    }
  };

  // Classe CSS pour le fond en fonction du thème
  const cardClass = theme === "light" ? "bg-white" : "bg-gray-800";

  // Composant modal pour afficher les détails d'une publication
  const PostModal = ({ postIndex, onClose, onPrevious, onNext }) => {
    if (postIndex === null) return null; // Si aucun index n'est sélectionné, ne rien afficher
    const post = posts[postIndex]; // Récupération de la publication sélectionnée

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center ">
        <div className="absolute inset-0 bg-black opacity-75 backdrop-blur-sm"></div>
        <div className="z-10 bg-primary dark:bg-gray-800 w-full max-w-4xl rounded-lg overflow-hidden relative">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-2/3 relative flex items-center justify-center bg-black">
              {post.mediaType === 'video' ? (
                <video src={post.media} controls className="max-w-full max-h-[80vh] object-contain" /> // Affichage d'une vidéo
              ) : (
                <img src={post.media} alt={post.description} className="max-w-full max-h-[80vh] object-contain" /> // Affichage d'une image
              )}
              {postIndex > 0 && (
                <button onClick={onPrevious} className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-primary dark:bg-gray-800 rounded-full p-1 shadow-lg">
                  <ChevronLeft size={24} /> // Bouton précédent
                </button>
              )}
              {postIndex < posts.length - 1 && (
                <button onClick={onNext} className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary dark:bg-gray-800 rounded-full p-1 shadow-lg">
                  <ChevronRight size={24} /> // Bouton suivant
                </button>
              )}
            </div>
            <div className="w-full md:w-1/3 p-4 flex flex-col">
              <div className="flex items-center mb-4">
                <img src={userInfo?.profileUrl || NoProfile} alt={userInfo?.username} className="w-10 h-10 rounded-full mr-3" /> // Image de profil de l'utilisateur
                <span className="font-semibold">{userInfo?.username}</span> // Nom d'utilisateur
              </div>
              <p className="mb-4">{post.description}</p> // Description de la publication
              <div className="flex space-x-4 mb-4">
                <Heart size={24} /> // Icône pour aimer
                <MessageCircle size={24} /> // Icône pour commenter
                <Send size={24} /> // Icône pour envoyer
              </div>
              <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p> // Date de création de la publication
            </div>
          </div>
          <button 
            onClick={onClose} // Action de fermeture du modal
            className="absolute top-4 right-4  bg-gray-800 rounded-full p-2 shadow-lg hover:bg-gray-700 transition-colors"
          >
            <X size={24} /> // Icône de fermeture
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-screen flex flex-col px-0 lg:px-10 2xl:px-40 bg-bgColor lg:rounded-lg">
      <TopBar /> // Affichage de la barre supérieure
      <div className="flex-1 flex flex-col px-4 gap-6 overflow-y-auto rounded-lg h-full bg-primary mt-5 pt-5 text-ascent-1">
        {loading ? (
          <Loading /> // Affichage d'un indicateur de chargement
        ) : (
          <>
            {errMsg && <p className="text-red-500 mb-4">{errMsg}</p>} // Affichage du message d'erreur si présent
            <div className='flex flex-col md:flex-row mb-8 '>
              <div className='w-full md:w-1/3 flex justify-center mb-6 md:mb-0'>
                <img
                  src={userInfo?.profileUrl || NoProfile}
                  alt={userInfo?.username}
                  className='w-32 h-32 rounded-full border-2 border-gray-300' // Image de profil
                />
              </div>
              <div className='w-full md:w-2/3 flex flex-col justify-center'>
                <h1 className='text-3xl font-bold mb-2'>{userInfo?.username}</h1>
                <p className='text-gray-600'>{userInfo?.bio || "Cet utilisateur n'a pas encore de bio."}</p> // Bio de l'utilisateur
                <button 
                  onClick={handleFollow}
                  className={`mt-4 px-4 py-2 rounded ${userInfo?.isFollowing ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-500'}`} // Bouton de suivi
                >
                  {userInfo?.isFollowing ? "Suivi" : "Suivre"}
                </button>
              </div>
            </div>

            {/* Onglets pour afficher les publications et les autres informations */}
            <div className='flex space-x-4 mb-6'>
              <button onClick={() => setActiveTab("posts")} className={`flex-1 py-2 text-center rounded ${activeTab === "posts" ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Publications</button>
              <button onClick={() => setActiveTab("info")} className={`flex-1 py-2 text-center rounded ${activeTab === "info" ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Informations</button>
            </div>

            {activeTab === "posts" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {posts.length > 0 ? posts.map((post, index) => (
                  <div key={post.id} className={`${cardClass} rounded-lg shadow-md p-4 cursor-pointer`} onClick={() => setSelectedPostIndex(index)}>
                    <img src={post.media} alt={post.description} className="rounded-lg mb-2" /> // Publication
                    <h2 className="font-semibold">{post.title}</h2> // Titre de la publication
                    <p className="text-sm text-gray-600">{new Date(post.createdAt).toLocaleDateString()}</p> // Date de la publication
                  </div>
                )) : <p>Aucune publication trouvée.</p>} // Message si aucune publication
              </div>
            ) : (
              <div>
                {/* Affichage d'autres informations sur l'utilisateur */}
                <p>Informations supplémentaires sur l'utilisateur.</p>
              </div>
            )}
          </>
        )}
      </div>
      {/* Modal pour afficher les détails d'une publication */}
      {selectedPostIndex !== null && (
        <PostModal 
          postIndex={selectedPostIndex}
          onClose={() => setSelectedPostIndex(null)} // Action de fermeture du modal
          onPrevious={() => setSelectedPostIndex(selectedPostIndex - 1)} // Action pour la publication précédente
          onNext={() => setSelectedPostIndex(selectedPostIndex + 1)} // Action pour la publication suivante
        />
      )}
    </div>
  );
};

export default Profile; // Exportation du composant Profile
