import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux"; // Importer useSelector
import { useParams } from "react-router-dom";
import { Loading, TopBar, PostCard } from "../components";
import { makeRequest } from "../axios";
import { NoProfile } from "../assets";

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme); // Sélectionner le thème depuis Redux
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const userResponse = await makeRequest.get(`/users/get-user/${id}`);
        setUserInfo(userResponse.data.user);

        const postsResponse = await makeRequest.get(`/posts/user/${id}`);
        setPosts(postsResponse.data.data);

        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        setErrMsg("Échec du chargement des données du profil.");
        setLoading(false);
      }
    };

    fetchUserData();

    // Désactiver le défilement
    // document.body.style.overflow = 'hidden';

    // Réactiver le défilement lors du démontage du composant
    return () => {
      document.body.style.overflow = 'visible';
    };
  }, [id]);

  const handleFollow = async () => {
    try {
      await makeRequest.post("/users/friend-request", { requestTo: id });
      // Mettre à jour l'état local pour refléter le changement
      setUserInfo(prev => ({ ...prev, isFollowing: true }));
    } catch (error) {
      console.error("Erreur lors de l'envoi de la demande d'ami:", error);
      setErrMsg("Échec de l'envoi de la demande d'ami.");
    }
  };

  // Définir les classes de thème
  const containerClass = theme === "light" ? "bg-white text-black" : "bg-gray-900 text-white";
  const cardClass = theme === "light" ? "bg-gray-100" : "bg-gray-800";
  const buttonClass = theme === "light" 
    ? "bg-blue-500 text-white hover:bg-blue-600" 
    : "bg-blue-700 text-white hover:bg-blue-800";

  return (
    <div className={`${containerClass} min-h-screen bg-bgColor`}>
      <TopBar />
      <div className='max-w-5xl  mx-auto pt-8 px-4 overflow-scroll bg-bgColor'>
        {loading ? (
          <Loading />
        ) : (
          <>
            {errMsg && <p className="text-red-500">{errMsg}</p>}
            {/* En-tête du profil */}
            <div className='flex mb-8 '>
              <div className='w-1/3 flex justify-center'>
                <img
                  src={userInfo?.profileUrl || NoProfile}
                  alt={userInfo?.username}
                  className='w-40 h-40 rounded-full'
                />
              </div>
              <div className='w-2/3'>
                <div className='flex items-center mb-4'>
                  <h1 className='text-2xl font-light mr-4'>{userInfo?.username}</h1>
                  {currentUser._id !== id && (
                    <button 
                      onClick={handleFollow}
                      className={`px-4 py-1 rounded font-semibold`}
                    >
                      {userInfo?.isFollowing ? "Suivi" : "Suivre"}
                    </button>
                  )}
                </div>
                <div className='flex mb-4'>
                  <span className='mr-8'><strong>{posts.length}</strong> publications</span>
                  <span className='mr-8'><strong>{userInfo?.friends?.length}</strong> abonnés</span>
                  <span><strong>{userInfo?.friends?.length}</strong> abonnements</span>
                </div>
                <div>
                  <p className='font-semibold'>{userInfo?.firstName} {userInfo?.lastName}</p>
                  <p>{userInfo?.profession}</p>
                  <p>{userInfo?.location}</p>
                </div>
              </div>
            </div>

            {/* Grille de publications */}
            <div className='grid grid-cols-3 gap-1 overflow-scroll bg-primary rounded-lg'>
              {posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  user={currentUser}
                  deletePost={() => {}} // Implémenter si nécessaire
                  likePost={() => {}}   // Implémenter si nécessaire
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
