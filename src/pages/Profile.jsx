import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Loading, TopBar } from "../components";
import { makeRequest } from "../axios";
import { NoProfile } from "../assets";
import { Grid, Image, X, Heart, MessageCircle, Send, ChevronLeft, ChevronRight } from "lucide-react";

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [errMsg, setErrMsg] = useState("");
  const [activeTab, setActiveTab] = useState("posts");
  const [postsPerRow, setPostsPerRow] = useState(3);
  const [selectedPostIndex, setSelectedPostIndex] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const userResponse = await makeRequest.get(`/users/get-user/${id}`);
        setUserInfo(userResponse.data.user);

        const postsResponse = await makeRequest.get(`/posts/user/${id}`);
        setPosts(postsResponse.data.data.filter(post => post.media));

        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        setErrMsg("Échec du chargement des données du profil.");
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setPostsPerRow(1);
      } else if (window.innerWidth < 1024) {
        setPostsPerRow(2);
      } else {
        setPostsPerRow(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleFollow = async () => {
    try {
      await makeRequest.post("/users/friend-request", { requestTo: id });
      setUserInfo(prev => ({ ...prev, isFollowing: true }));
    } catch (error) {
      console.error("Erreur lors de l'envoi de la demande d'ami:", error);
      setErrMsg("Échec de l'envoi de la demande d'ami.");
    }
  };

  const cardClass = theme === "light" ? "bg-white" : "bg-gray-800";
 

    const PostModal = ({ postIndex, onClose, onPrevious, onNext }) => {
      if (postIndex === null) return null;
      const post = posts[postIndex];
      
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center ">
          <div className="absolute inset-0 bg-black opacity-75 backdrop-blur-sm"></div>
          <div className="z-10 bg-primary dark:bg-gray-800 w-full max-w-4xl rounded-lg overflow-hidden relative">
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-2/3 relative flex items-center justify-center bg-black">
                {post.mediaType === 'video' ? (
                  <video src={post.media} controls className="max-w-full max-h-[80vh] object-contain" />
                ) : (
                  <img src={post.media} alt={post.description} className="max-w-full max-h-[80vh] object-contain" />
                )}
                {postIndex > 0 && (
                  <button onClick={onPrevious} className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-primary dark:bg-gray-800 rounded-full p-1 shadow-lg">
                    <ChevronLeft size={24} />
                  </button>
                )}
                {postIndex < posts.length - 1 && (
                  <button onClick={onNext} className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary dark:bg-gray-800 rounded-full p-1 shadow-lg">
                    <ChevronRight size={24} />
                  </button>
                )}
              </div>
              <div className="w-full md:w-1/3 p-4 flex flex-col">
                <div className="flex items-center mb-4">
                  <img src={userInfo?.profileUrl || NoProfile} alt={userInfo?.username} className="w-10 h-10 rounded-full mr-3" />
                  <span className="font-semibold">{userInfo?.username}</span>
                </div>
                <p className="mb-4">{post.description}</p>
                <div className="flex space-x-4 mb-4">
                  <Heart size={24} />
                  <MessageCircle size={24} />
                  <Send size={24} />
                </div>
                <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="absolute top-4 right-4  bg-gray-800 rounded-full p-2 shadow-lg hover:bg-gray-700 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>
      );
    };

  return (
    <div className="w-full h-screen flex flex-col px-0 lg:px-10 2xl:px-40 bg-bgColor lg:rounded-lg">
      <TopBar />
      <div className="flex-1 flex flex-col px-4 gap-6 overflow-y-auto rounded-lg h-full bg-primary mt-5 pt-5 text-ascent-1">
      {loading ? (
          <Loading />
        ) : (
          <>
            {errMsg && <p className="text-red-500 mb-4">{errMsg}</p>}
            <div className='flex flex-col md:flex-row mb-8 '>
              <div className='w-full md:w-1/3 flex justify-center mb-6 md:mb-0'>
                <img
                  src={userInfo?.profileUrl || NoProfile}
                  alt={userInfo?.username}
                  className='w-32 h-32 rounded-full border-2 border-gray-300'
                />
              </div>
              <div className='w-full md:w-2/3 bg-primary'>
                <div className='flex flex-col md:flex-row items-center mb-4'>
                  <h1 className='text-xl font-semibold mr-4'>{userInfo?.username}</h1>
                  {currentUser._id !== id && (
                    <button 
                      onClick={handleFollow}
                      className={`button px-4 py-1 rounded font-semibold mt-2 md:mt-0`}
                    >
                      {userInfo?.isFollowing ? "Suivi" : "Suivre"}
                    </button>
                  )}
                </div>
                <div className='flex justify-center md:justify-start space-x-8 mb-4'>
                  <span><strong>{posts.length}</strong> publications</span>
                  <span><strong>{userInfo?.friends?.length}</strong> abonnés</span>
                  <span><strong>{userInfo?.friends?.length}</strong> abonnements</span>
                </div>
                <div className='text-sm'>
                  <p className='font-semibold'>{userInfo?.firstName} {userInfo?.lastName}</p>
                  <p>{userInfo?.profession}</p>
                  <p>{userInfo?.location}</p>
                </div>
              </div>
            </div>

            <div className={`${cardClass} rounded-lg shadow-sm`}>
              <div className="flex border-b border-gray-300">
                <button
                  className={`flex-1 py-3 text-center ${activeTab === 'posts' ? 'border-t-2 border-blue-500' : ''}`}
                  onClick={() => setActiveTab('posts')}
                >
                  <Grid size={16} className="inline mr-2" /> Publications
                </button>
                <button
                  className={`flex-1 py-3 text-center ${activeTab === 'tagged' ? 'border-t-2 border-blue-500' : ''}`}
                  onClick={() => setActiveTab('tagged')}
                >
                  <Image size={16} className="inline mr-2" /> Identifié
                </button>
              </div>
              
              <div className={`grid grid-cols-${postsPerRow} gap-1 p-1`}>
                {posts.map((post, index) => (
                  <div 
                    key={post._id} 
                    className="aspect-square relative group cursor-pointer"
                    onClick={() => setSelectedPostIndex(index)}
                  >
                    {post.mediaType === 'video' ? (
                      <video 
                        src={post.media} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img 
                        src={post.media} 
                        alt={post.description} 
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <p className="text-white text-sm">{post.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <PostModal 
              postIndex={selectedPostIndex}
              onClose={() => setSelectedPostIndex(null)}
              onPrevious={() => setSelectedPostIndex(prev => Math.max(0, prev - 1))}
              onNext={() => setSelectedPostIndex(prev => Math.min(posts.length - 1, prev + 1))}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
