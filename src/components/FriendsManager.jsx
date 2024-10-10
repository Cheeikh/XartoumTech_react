// FriendsManager.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// Assurez-vous d'importer les bonnes icônes et composants
import { BsPersonFillAdd } from "react-icons/bs";
import { useSelector } from "react-redux";
import { makeRequest } from "../axios";
import { CustomButton, Loading } from "../components";
import { NoProfile } from "../assets";

const FriendsManager = () => {
  const { user } = useSelector((state) => state.user);
  const [friendRequests, setFriendRequests] = useState([]);
  const [suggestedFriends, setSuggestedFriends] = useState([]);
  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchFriendsData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchFriendsData = async () => {
    try {
      setLoading(true);
      setErrMsg("");
      setSuccessMsg("");

      const [friendRequestsResponse, suggestedFriendsResponse] =
        await Promise.all([
          makeRequest.post(`/users/get-friend-request`),
          makeRequest.post(`/users/suggested-friends`),
        ]);

      setFriendRequests(friendRequestsResponse.data.data || []);
      setSuggestedFriends(suggestedFriendsResponse.data.data || []);
    } catch (error) {
      console.error("Erreur lors du chargement des données d'amis :", error);
      setErrMsg("Échec du chargement des données d'amis.");
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptFriend = async (requestId) => {
    try {
      await makeRequest.post("/users/accept-request", {
        rid: requestId,
        status: "Accepted",
      });
      console.log("Demande d'ami acceptée :", requestId);
      setSuccessMsg("Demande d'ami acceptée !");
      // Rafraîchir les données
      fetchFriendsData();
    } catch (error) {
      console.error("Erreur lors de l'acceptation de la demande :", error);
      setErrMsg("Échec de l'acceptation de la demande.");
    }
  };

  const handleDenyFriend = async (requestId) => {
    try {
      await makeRequest.post("/users/accept-request", {
        rid: requestId,
        status: "Denied",
      });
      console.log("Demande d'ami refusée :", requestId);
      setSuccessMsg("Demande d'ami refusée !");
      // Rafraîchir les données
      fetchFriendsData();
    } catch (error) {
      console.error("Erreur lors du refus de la demande :", error);
      setErrMsg("Échec du refus de la demande.");
    }
  };

  const handleSendFriendRequest = async (friendId) => {
    try {
      await makeRequest.post("/users/friend-request", {
        requestTo: friendId,
      });
      console.log("Demande d'ami envoyée à :", friendId);
      setSuccessMsg("Demande d'ami envoyée !");
      // Rafraîchir les données
      fetchFriendsData();
    } catch (error) {
      console.error("Erreur lors de l'envoi de la demande d'ami :", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErrMsg(error.response.data.message); // Afficher le message d'erreur du backend
      } else {
        setErrMsg("Échec de l'envoi de la demande d'ami.");
      }
    }
  };

  return (
    <div className="hidden lg:flex flex-col w-1/4 gap-8 overflow-y-auto">
      {loading ? (
        <Loading />
      ) : (
        <>
          {/* Messages d'erreur ou de succès */}
          {errMsg && (
            <div className="text-red-500 text-center">{errMsg}</div>
          )}
          {successMsg && (
            <div className="text-green-500 text-center">{successMsg}</div>
          )}

          {/* FRIEND REQUESTS */}
          <div className="w-full bg-primary shadow-sm rounded-lg px-6 py-5">
            <div className="flex items-center justify-between text-xl text-ascent-1 pb-2 border-b border-[#66666645]">
              <span>Demandes d'Ami</span>
              <span>{friendRequests?.length}</span>
            </div>

            <div className="w-full flex flex-col gap-4 pt-4">
              {friendRequests?.map(({ _id, requestFrom: from }) => (
                <div key={_id} className="flex items-center justify-between">
                  <Link
                    to={`/profile/${from._id}`}
                    className="w-full flex gap-4 items-center cursor-pointer"
                  >
                    <img
                      src={from?.profileUrl ?? NoProfile}
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

                  <div className="flex gap-1">
                    <CustomButton
                      title="Accepter"
                      onClick={() => handleAcceptFriend(_id)}
                      containerStyles="bg-[#0444a4] text-xs text-white px-1.5 py-1 rounded-full"
                    />
                    <CustomButton
                      title="Refuser"
                      onClick={() => handleDenyFriend(_id)}
                      containerStyles="border border-[#666] text-xs text-ascent-1 px-1.5 py-1 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SUGGESTED FRIENDS */}
          <div className="w-full bg-primary shadow-sm rounded-lg px-5 py-5">
            <div className="flex items-center justify-between text-lg text-ascent-1 border-b border-[#66666645]">
              <span>Ami·e·s Suggéré·e·s</span>
            </div>
            <div className="w-full flex flex-col gap-4 pt-4">
              {suggestedFriends?.map((friend) => (
                <div
                  className="flex items-center justify-between"
                  key={friend._id}
                >
                  <Link
                    to={`/profile/${friend._id}`}
                    className="w-full flex gap-4 items-center cursor-pointer"
                  >
                    <img
                      src={friend?.profileUrl ?? NoProfile}
                      alt={friend?.firstName}
                      className="w-10 h-10 object-cover rounded-full"
                    />
                    <div className="flex-1">
                      <p className="text-base font-medium text-ascent-1">
                        {friend?.firstName} {friend?.lastName}
                      </p>
                      <span className="text-sm text-ascent-2">
                        {friend?.profession ?? "Pas de Profession"}
                      </span>
                    </div>
                  </Link>

                  <div className="flex gap-1">
                    <button
                      className="bg-[#0444a430] text-sm text-white p-1 rounded"
                      onClick={() => handleSendFriendRequest(friend._id)}
                      title="Ajouter en ami"
                    >
                      <BsPersonFillAdd size={20} className="text-[#0f52b6]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FriendsManager;
