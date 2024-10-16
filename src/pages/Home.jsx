import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeRequest } from "../axios";
import {
  EditProfile,
  FriendsCard,
  Loading,
  PostCard,
  ProfileCard,
  TopBar,
  PostCreator,
  FriendsManager,
  Stories
} from "../components";
import CreditPurchase from "../components/CreditPurchase";

const Home = () => {
  const dispatch = useDispatch();
  const { user, edit } = useSelector((state) => state.user);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [stories, setStories] = useState([]);
  const [userCredits, setUserCredits] = useState(user?.dailyPostCredits || 0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setErrMsg("");
        setSuccessMsg("");

        // Appel des données des posts
        const postsResponse = await makeRequest.get(`/posts/get-posts`);
        setPosts(postsResponse.data.data || []);

        // Appel des données des stories
        const storiesResponse = await makeRequest.get(`/stories`);
        setStories(storiesResponse.data.data || []);

        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du fetch des données:", error);
        setErrMsg("Échec du chargement des données.");
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
      setUserCredits(user.dailyPostCredits || 0);
    }
  }, [user]);

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const handlePurchase = async (newCreditBalance) => {
    try {
      // Mise à jour du state local des crédits
      setUserCredits(newCreditBalance);

      // Mise à jour du state global de l'utilisateur avec les nouveaux crédits
      dispatch({ type: 'UPDATE_USER_CREDITS', payload: newCreditBalance });

      setSuccessMsg(`Achat de crédits réussi ! Nouveau solde : ${newCreditBalance} crédit(s)`);
    } catch (error) {
      console.error("Erreur lors de l'achat de crédits:", error);
      setErrMsg("Échec de l'achat de crédits.");
    }
  };

  return (
    <div className="w-full h-screen flex flex-col px-0 lg:px-10 2xl:px-40 bg-bgColor lg:rounded-lg">
      <TopBar />
      <div className="w-full flex gap-2 lg:gap-4 pt-5 flex-grow overflow-hidden h-full">
        {/* LEFT */}
        <div className="hidden md:flex flex-col w-1/3 lg:w-1/4 gap-6 overflow-y-auto">
          <CreditPurchase currentCredits={userCredits} onPurchase={handlePurchase} />
          <ProfileCard user={user} />
          <FriendsCard />
        </div>

        {/* CENTER */}
        <div className="flex-1 flex flex-col px-4 gap-6 overflow-y-auto rounded-lg">
          <Stories stories={stories} />
          <PostCreator onPostCreated={handlePostCreated} />

          {loading ? (
            <Loading />
          ) : posts?.length > 0 ? (
            posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))
          ) : (
            <div className="flex w-full h-full items-center justify-center">
              <p className="text-lg text-ascent-2">Aucun post disponible</p>
            </div>
          )}
        </div>

        {/* RIGHT */}
        <FriendsManager/>
      </div>
      
      {edit && <EditProfile/>}

      {/* Affichage des messages de succès ou d'erreur */}
      {successMsg && <div className="text-green-500">{successMsg}</div>}
      {errMsg && <div className="text-red-500">{errMsg}</div>}
    </div>
  );
};

export default Home;