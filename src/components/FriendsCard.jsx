// Importation des bibliothèques et fichiers nécessaires
import React, { useEffect } from "react";
import { Link } from "react-router-dom"; // Utilisé pour créer des liens de navigation vers les profils d'amis
import { NoProfile } from "../assets"; // Image par défaut si un utilisateur n'a pas de photo de profil
import { makeRequest } from "../axios"; // Instance d'axios pour les requêtes HTTP
import { useSelector, useDispatch } from "react-redux"; // Hooks de Redux pour accéder à l'état et dispatcher des actions
import { UpdateFriends } from "../redux/userSlice"; // Action Redux pour mettre à jour la liste d'amis

// Composant FriendsCard : affiche la liste d'amis de l'utilisateur
const FriendsCard = () => {
  const dispatch = useDispatch(); // Hook pour dispatcher des actions Redux
  const { friends } = useSelector((state) => state.user); // Sélecteur pour récupérer la liste des amis depuis le store Redux

  // Fonction asynchrone pour récupérer les amis depuis l'API
  const fetchFriends = async () => {
    try {
      const response = await makeRequest.get("/users/friends"); // Requête GET vers l'endpoint pour récupérer la liste d'amis
      if (response.data.success) { // Vérifie si la réponse de l'API est réussie
        dispatch(UpdateFriends(response.data.data)); // Met à jour la liste d'amis dans le store Redux avec les données récupérées
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des amis:", error); // Gestion des erreurs en cas d'échec de la requête
    }
  };

  // useEffect est utilisé pour exécuter fetchFriends au montage du composant (comme componentDidMount)
  useEffect(() => {
    fetchFriends(); // Appelle la fonction de récupération des amis
  }, []); // Le tableau vide signifie que cette fonction s'exécute une seule fois au montage du composant

  // Rendu du composant
  return (
    <div className="w-full bg-primary shadow-sm rounded-lg px-6 py-5">
      {/* En-tête de la carte avec le titre "Amis" et le nombre d'amis */}
      <div className="flex items-center justify-between text-ascent-1 pb-2 border-b border-[#9a00d7]">
        <span>Amis</span>
        <span>{friends.length}</span> {/* Affiche le nombre total d'amis */}
      </div>

      {/* Section où la liste des amis sera affichée */}
      <div className="w-full flex flex-col gap-4 pt-4">
        {/* Si la liste des amis n'est pas vide, on les mappe et on affiche un lien pour chaque ami */}
        {friends.length > 0 ? (
          friends.map((friend, index) => (
            // Utilisation du composant Link pour permettre la navigation vers le profil de l'ami
            <Link
              to={"/profile/" + friend?._id} // Lien vers le profil de l'ami en utilisant son ID
              key={`${friend?._id}-${index}`} // Clé unique pour chaque élément de la liste, combinant l'ID de l'ami et l'index
              className="w-full flex gap-4 items-center cursor-pointer"
            >
              {/* Affichage de la photo de profil de l'ami, avec une image par défaut si aucune n'est fournie */}
              <img
                src={friend?.profileUrl ?? NoProfile} // Si l'ami n'a pas de profil, affiche NoProfile
                alt={friend?.firstName} // Utilise le prénom de l'ami comme texte alternatif (alt)
                className="w-10 h-10 object-cover rounded-full" // Style de l'image (taille et forme circulaire)
              />
              <div className="flex-1">
                {/* Affiche le nom complet de l'ami */}
                <p className="text-base font-medium text-ascent-1">
                  {friend?.firstName} {friend?.lastName}
                </p>
                {/* Affiche la profession de l'ami ou un texte par défaut s'il n'y en a pas */}
                <span className="text-sm text-ascent-2">
                  {friend?.profession ?? "No Profession"} {/* Si la profession n'est pas définie, affiche "No Profession" */}
                </span>
              </div>
            </Link>
          ))
        ) : (
          // Message à afficher si l'utilisateur n'a pas d'amis dans sa liste
          <p className="text-center text-ascent-2">Aucun ami à afficher</p>
        )}
      </div>
    </div>
  );
};

export default FriendsCard; // Exporte le composant pour pouvoir l'utiliser ailleurs
