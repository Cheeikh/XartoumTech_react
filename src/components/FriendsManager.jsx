// Imports nécessaires
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Utilisé pour la navigation interne
import { BsPersonFillAdd } from "react-icons/bs"; // Icône utilisée pour ajouter un ami
import { useSelector, useDispatch } from "react-redux"; // Hooks Redux pour accéder et modifier le state
import { makeRequest } from "../axios"; // Fonction pour effectuer des requêtes HTTP
import { CustomButton, Loading } from "../components"; // Composants personnalisés pour les boutons et les indicateurs de chargement
import { NoProfile } from "../assets"; // Image par défaut si un utilisateur n'a pas d'image de profil
import { UpdateFriends } from "../redux/userSlice"; // Action Redux pour mettre à jour la liste des amis dans le state

// Composant FriendsManager
const FriendsManager = () => {
  // On extrait l'utilisateur courant du state via Redux
  const { user } = useSelector((state) => state.user);

  // Hooks useState pour gérer différents états locaux :
  const [friendRequests, setFriendRequests] = useState([]); // Requêtes d'amis reçues
  const [suggestedFriends, setSuggestedFriends] = useState([]); // Suggestions d'amis
  const [errMsg, setErrMsg] = useState(""); // Message d'erreur
  const [successMsg, setSuccessMsg] = useState(""); // Message de succès
  const [loading, setLoading] = useState(false); // Indicateur de chargement

  const dispatch = useDispatch(); // Utilisé pour envoyer des actions à Redux

  // useEffect est utilisé pour charger les données d'amis une fois que l'utilisateur est disponible
  useEffect(() => {
    if (user) {
      fetchFriendsData(); // Fonction pour charger les données des amis (demandes et suggestions)
    }
    // Le tableau de dépendance inclut 'user', donc ce hook se déclenche lorsque 'user' change
  }, [user]);

  // Fonction pour charger les données relatives aux amis : requêtes d'amis et suggestions
  const fetchFriendsData = async () => {
    try {
      setLoading(true); // On active le mode de chargement
      setErrMsg(""); // Réinitialise les messages d'erreur et de succès
      setSuccessMsg("");

      // On effectue deux requêtes en parallèle : récupération des demandes d'amis et des suggestions
      const [friendRequestsResponse, suggestedFriendsResponse] =
        await Promise.all([
          makeRequest.post(`/users/get-friend-request`), // Récupère les demandes d'amis
          makeRequest.post(`/users/suggested-friends`), // Récupère les suggestions d'amis
        ]);

      // Stocke les résultats des demandes d'amis
      const friendRequests = friendRequestsResponse.data.data || [];
      setFriendRequests(friendRequests);

      // Filtre les suggestions pour exclure les utilisateurs qui ont déjà envoyé une demande
      const suggestedFriends = suggestedFriendsResponse.data.data || [];
      const filteredSuggestions = suggestedFriends.filter(
        (suggested) =>
          !friendRequests.some(
            (request) => request.requestFrom._id === suggested._id
          )
      );
      setSuggestedFriends(filteredSuggestions); // Met à jour la liste des suggestions
    } catch (error) {
      console.error("Erreur lors du chargement des données d'amis :", error);
      setErrMsg("Échec du chargement des données d'amis."); // Affiche un message d'erreur
    } finally {
      setLoading(false); // Fin du mode de chargement
    }
  };

  // Fonction pour mettre à jour la liste des amis (après acceptation ou refus d'une demande)
  const updateFriendsList = async () => {
    try {
      const response = await makeRequest.get("/users/friends"); // Récupère la liste des amis
      if (response.data.success) {
        dispatch(UpdateFriends(response.data.data)); // Met à jour la liste des amis dans le state Redux
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la liste d'amis:", error);
    }
  };

  // Fonction pour accepter une demande d'ami
  const handleAcceptFriend = async (requestId) => {
    try {
      await makeRequest.post("/users/accept-request", {
        rid: requestId,
        status: "Accepted", // Envoie l'état 'Accepted' pour cette requête
      });
      setSuccessMsg("Demande d'ami acceptée !");
      fetchFriendsData(); // Recharge les données après l'acceptation
      updateFriendsList(); // Met à jour la liste des amis
    } catch (error) {
      console.error("Erreur lors de l'acceptation de la demande :", error);
      setErrMsg("Échec de l'acceptation de la demande.");
    }
  };

  // Fonction pour refuser une demande d'ami
  const handleDenyFriend = async (requestId) => {
    try {
      await makeRequest.post("/users/accept-request", {
        rid: requestId,
        status: "Denied", // Envoie l'état 'Denied' pour cette requête
      });
      setSuccessMsg("Demande d'ami refusée !");
      fetchFriendsData(); // Recharge les données après le refus
      updateFriendsList(); // Met à jour la liste des amis
    } catch (error) {
      console.error("Erreur lors du refus de la demande :", error);
      setErrMsg("Échec du refus de la demande.");
    }
  };

  // Fonction pour envoyer une demande d'ami
  const handleSendFriendRequest = async (friendId) => {
    try {
      await makeRequest.post("/users/friend-request", {
        requestTo: friendId, // L'ID de l'utilisateur à qui on envoie la demande
      });
      setSuccessMsg("Demande d'ami envoyée !");
      fetchFriendsData(); // Recharge les données après l'envoi de la demande
    } catch (error) {
      console.error("Erreur lors de l'envoi de la demande d'ami :", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErrMsg(error.response.data.message); // Affiche un message d'erreur spécifique du backend
      } else {
        setErrMsg("Échec de l'envoi de la demande d'ami.");
      }
    }
  };

  // Rendu du composant : deux sections (demandes d'amis et amis suggérés)
  return (
    <div className="hidden lg:flex flex-col w-1/4 gap-8 overflow-y-auto w-auto">
      {loading ? (
        <Loading /> // Si les données sont en cours de chargement, on affiche le composant de chargement
      ) : (
        <>
          {/* Messages d'erreur ou de succès */}
          {errMsg && (
            <div className="text-red-500 text-center">{errMsg}</div>
          )}
          {successMsg && (
            <div className="text-green-500 text-center">{successMsg}</div>
          )}

          {/* DEMANDES D'AMIS */}
          <div className="w-full bg-primary shadow-sm rounded-lg px-6 py-5">
            <div className="flex items-center justify-between text-xl text-ascent-1 pb-2 border-b border-[#9a00d7]">
              <span>Demandes d'Ami</span>
              <span>{friendRequests?.length}</span>
            </div>

            {/* Affichage des demandes d'amis */}
            <div className="w-full flex flex-col gap-4 pt-4">
              {friendRequests?.map(({ _id, requestFrom: from }) => (
                <div key={_id} className="flex items-center justify-between">
                  <Link
                    to={`/profile/${from._id}`}
                    className="w-full flex gap-4 items-center cursor-pointer"
                  >
                    <img
                      src={from?.profileUrl ?? NoProfile} // Utilise l'image de profil ou l'image par défaut
                      alt={from?.firstName}
                      className="w-10 h-10 object-cover rounded-full"
                    />
                    <div className="flex-1">
                      <p className="text-base font-medium text-ascent-1">
                        {from?.firstName} {from?.lastName}
                      </p>
                      <span className="text-sm text-ascent-2">
                        {from?.profession ?? "Pas de Profession"}
                      </span>
                    </div>
                  </Link>

                  {/* Boutons pour accepter ou refuser la demande */}
                  <div className="flex gap-1">
                    <CustomButton
                      title="Accepter"
                      onClick={() => handleAcceptFriend(_id)} // Accepte la demande
                      containerStyles="bg-[#9a00d7] text-xs text-ascent-1 px-1.5 py-1 rounded-full"
                    />
                    <CustomButton
                      title="Refuser"
                      onClick={() => handleDenyFriend(_id)} // Refuse la demande
                      containerStyles="border border-[#666] text-xs text-ascent-1 px-1.5 py-1 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AMIS SUGGÉRÉS */}
          <div className="w-full bg-primary shadow-sm rounded-lg px-6 py-5">
            <div className="flex items-center justify-between text-xl text-ascent-1 pb-2 border-b border-[#9a00d7]">
              <span>Suggestions d'Ami</span>
            </div>

            {/* Affichage des suggestions d'amis */}
            <div className="w-full flex flex-col gap-4 pt-4">
              {suggestedFriends?.map((suggested) => (
                <div
                  key={suggested._id}
                  className="w-full flex items-center gap-4"
                >
                  <Link
                    to={`/profile/${suggested._id}`}
                    className="w-full flex gap-4 items-center cursor-pointer"
                  >
                    <img
                      src={suggested?.profileUrl ?? NoProfile}
                      alt={suggested?.firstName}
                      className="w-10 h-10 object-cover rounded-full"
                    />
                    <div className="flex-1">
                      <p className="text-base font-medium text-ascent-1">
                        {suggested?.firstName} {suggested?.lastName}
                      </p>
                      <span className="text-sm text-ascent-2">
                        {suggested?.profession ?? "Pas de Profession"}
                      </span>
                    </div>
                  </Link>

                  {/* Bouton pour envoyer une demande d'ami */}
                  <CustomButton
                    title={<BsPersonFillAdd size={20} />}
                    onClick={() => handleSendFriendRequest(suggested._id)} // Envoie une demande d'ami
                    containerStyles="text-ascent-1 text-2xl border border-[#666] px-1.5 py-1 rounded-full"
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FriendsManager; // On exporte le composant pour l'utiliser ailleurs