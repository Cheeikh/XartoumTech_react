import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeRequest } from "../axios";
import { motion, AnimatePresence } from 'framer-motion';
import {
  EditProfile,
  FriendsCard,
  Loading,
  PostCard,
  ProfileCard,
  TopBar,
  PostCreator,
  FriendsManager,
  Stories,
  MobileNavbar
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const postsResponse = await makeRequest.get(`/posts/get-posts`);
        setPosts(postsResponse.data.data || []);
        const storiesResponse = await makeRequest.get(`/stories`);
        setStories(storiesResponse.data.data || []);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du fetch des données:", error);
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
      setUserCredits(newCreditBalance);
      dispatch({ type: 'UPDATE_USER_CREDITS', payload: newCreditBalance });
      setSuccessMsg(`Achat de crédits réussi ! Nouveau solde : ${newCreditBalance} crédit(s)`);
    } catch (error) {
      console.error("Erreur lors de l'achat de crédits:", error);
      setErrMsg("Échec de l'achat de crédits.");
    }
  };

  return (
    <div className="w-full h-screen flex flex-col px-0 lg:px-10 2xl:px-40 bg-bgColor lg:rounded-lg">
      <div className="hidden md:block">
        <TopBar user={user}/>
      </div>

      <div className="md:hidden">
        <MobileNavbar
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
        />
      </div>

      <div className="w-full flex gap-2 lg:gap-4 pt-5 flex-grow overflow-hidden h-full">
        <div className="hidden md:flex flex-col w-1/4 lg:w-1/5 gap-6 overflow-y-auto">
          <CreditPurchase currentCredits={userCredits} onPurchase={handlePurchase} />
          <ProfileCard user={user} />
          <FriendsCard />
        </div>

        <div className="flex-1 flex flex-col px-4 gap-6 overflow-y-auto rounded-lg">
          <Stories stories={stories} />
          <PostCreator onPostCreated={handlePostCreated} />

          {loading ? (
            <Loading />
          ) : posts?.length > 0 ? (
            posts.map((post) => <PostCard key={post._id} post={post} />)
          ) : (
            <div className="flex w-full h-full items-center justify-center">
              <p className="text-lg text-ascent-2">Aucun post disponible</p>
            </div>
          )}
        </div>

        <div className="hidden md:flex flex-col w-1/4 lg:w-1/5 gap-6 overflow-y-auto">
          <FriendsManager />
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div
              className="fixed inset-0 bg-black opacity-50"
              onClick={() => setIsMenuOpen(false)}
            ></div>
            <motion.div
              key="mobile-menu"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3 }}
              className="relative w-auto bg-primary p-4 overflow-y-auto"
            >
              <MobileNavbar
                isMenuOpen={isMenuOpen}
                setIsMenuOpen={setIsMenuOpen}
              />
              <ProfileCard user={user} />
              <FriendsCard />
              <FriendsManager />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {edit && <EditProfile />}
    </div>
  );
};

export default Home;