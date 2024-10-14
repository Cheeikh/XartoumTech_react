// Frontend - Home.jsx
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
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

const Home = () => {
  const { user, edit } = useSelector((state) => state.user);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState([]);
  const [stories, setStories] = useState([]);

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
    }
  }, [user]);

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  return (
    <div className="w-full h-screen flex flex-col px-0 lg:px-10 2xl:px-40 bg-bgColor lg:rounded-lg">
      <TopBar />

      <div className="w-full flex gap-2 lg:gap-4 pt-5 flex-grow overflow-hidden h-full">
        {/* LEFT */}
        <div className="hidden md:flex flex-col w-1/3 lg:w-1/4 gap-6 overflow-y-auto">
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
    </div>
  );
};

export default Home;
