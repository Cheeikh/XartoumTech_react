// Profile.jsx
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { TopBar, Loading } from "../components";
import { makeRequest } from "../axios";
import { NoProfile } from "../assets";
import {
  Grid,
  Image as ImageIcon,
  X,
  Heart,
  MessageCircle,
  Send,
  ChevronLeft,
  ChevronRight,
  Settings,
  Film,
  Bookmark,
  UserPlus,
} from "lucide-react";

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [errMsg, setErrMsg] = useState("");
  const [activeTab, setActiveTab] = useState("publications");
  const [selectedPostIndex, setSelectedPostIndex] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const userResponse = await makeRequest.get(`/users/get-user/${id}`);
        setUserInfo(userResponse.data.user);

        const postsResponse = await makeRequest.get(`/posts/user/${id}`);
        setPosts(postsResponse.data.data.filter((post) => post.media));

        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        setErrMsg("Échec du chargement des données du profil.");
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  const handleFollow = async () => {
    try {
      await makeRequest.post("/users/friend-request", { requestTo: id });
      setUserInfo((prev) => ({ ...prev, isFollowing: true }));
    } catch (error) {
      console.error("Erreur lors de l'envoi de la demande d'ami:", error);
      setErrMsg("Échec de l'envoi de la demande d'ami.");
    }
  };

  const handleUnfollow = async () => {
    try {
      await makeRequest.post("/users/unfollow", { userId: id });
      setUserInfo((prev) => ({ ...prev, isFollowing: false }));
    } catch (error) {
      console.error("Erreur lors du désabonnement:", error);
      setErrMsg("Échec du désabonnement.");
    }
  };

  const PostModal = ({ postIndex, onClose, onPrevious, onNext }) => {
    if (postIndex === null) return null;
    const post = posts[postIndex];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-75 backdrop-blur-sm"></div>
          <div className="z-10 bg-primary dark:bg-gray-800 w-full max-w-4xl rounded-lg overflow-hidden relative">
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-2/3 relative flex items-center justify-center bg-black">
                {post.mediaType === "video" ? (
                    <video
                        src={post.media}
                        controls
                        className="max-w-full max-h-[80vh] object-contain"
                    />
                ) : (
                    <img
                        src={post.media}
                        alt={post.description}
                        className="max-w-full max-h-[80vh] object-contain"
                    />
                )}
                {postIndex > 0 && (
                    <button
                        onClick={onPrevious}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-primary dark:bg-gray-800 rounded-full p-1 shadow-lg"
                    >
                      <ChevronLeft size={24} />
                    </button>
                )}
                {postIndex < posts.length - 1 && (
                    <button
                        onClick={onNext}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary dark:bg-gray-800 rounded-full p-1 shadow-lg"
                    >
                      <ChevronRight size={24} />
                    </button>
                )}
              </div>
              <div className="w-full md:w-1/3 p-4 flex flex-col">
                <div className="flex items-center mb-4">
                  <img
                      src={userInfo?.profileUrl || NoProfile}
                      alt={userInfo?.username}
                      className="w-10 h-10 rounded-full mr-3"
                  />
                  <span className="font-semibold">
                  {userInfo?.firstName} {userInfo?.lastName}
                </span>
                </div>
                <p className="mb-4">{post.description}</p>
                <div className="flex space-x-4 mb-4">
                  <Heart size={24} />
                  <MessageCircle size={24} />
                  <Send size={24} />
                </div>
                <p className="text-sm text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <button
                onClick={onClose}
                className="absolute top-4 right-4 bg-gray-800 rounded-full p-2 shadow-lg hover:bg-gray-700 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>
    );
  };

  const isCurrentUserProfile = id === currentUser?._id;

  const renderTabContent = () => {
    switch (activeTab) {
      case "publications":
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1 p-1">
              {posts.map((post, index) => (
                  <div
                      key={post._id}
                      className="aspect-square relative group cursor-pointer"
                      onClick={() => setSelectedPostIndex(index)}
                  >
                    {post.mediaType === "video" ? (
                        <video src={post.media} className="w-full h-full object-cover" />
                    ) : (
                        <img
                            src={post.media}
                            alt={post.description}
                            className="w-full h-full object-cover"
                        />
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <p className="text-white text-sm text-center px-2">{post.description}</p>
                    </div>
                  </div>
              ))}
            </div>
        );
      case "reels":
      case "enregistrements":

      default:
        return null;
    }
  };
  console.log()

  return (
      <div className="w-full min-h-screen bg-bgColor">
        <TopBar />
        <div className="max-w-7xl mx-auto mt-4 px-4">
          {loading ? (
              <Loading />
          ) : (
              <>
                {errMsg && <p className="text-red-500 mb-4">{errMsg}</p>}
                <div className="flex items-center justify-between mb-6">
                  <button className="p-2" onClick={() => navigate(-1)}>
                    <ChevronLeft size={24} />
                  </button>
                  <h2 className="text-xl font-bold">
                    {userInfo?.firstName} {userInfo?.lastName}
                  </h2>
                  <button className="p-2">
                    <Settings size={24} />
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row items-center mb-6">
                  <img
                      src={userInfo?.profileUrl || NoProfile}
                      alt={userInfo?.username}
                      className="w-24 h-24 rounded-full border-2 border-[#C124FF] mb-4 sm:mb-0 sm:mr-8"
                  />
                  <div className="text-center sm:text-left">
                    <div className="flex justify-around sm:justify-start sm:space-x-12 mb-4">
                      <div className="text-center">
                        <p className="font-bold text-lg">{posts.length}</p>
                        <p className="text-gray-600">Publications</p>
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-lg">{userInfo?.followers?.length || 0}</p>
                        <p className="text-gray-600">Followers</p>
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-lg">{userInfo?.following?.length || 0}</p>
                        <p className="text-gray-600">Suivi(e)s</p>
                      </div>
                    </div>
                    <p className="text-sm mb-4 mt-3">{userInfo?.profession}</p>
                    <div className="flex flex-col sm:flex-row sm:space-x-2">
                      {isCurrentUserProfile ? (
                          <button className="px-3 py-1 bg-[#C124FF] text-white rounded-md text-sm mb-2 sm:mb-0">
                            Modifier le profil
                          </button>
                      ) : (
                          <button
                              onClick={userInfo?.isFollowing ? handleUnfollow : handleFollow}
                              className={`px-3 py-1 rounded-md text-sm mb-2 sm:mb-0 ${
                                  userInfo?.isFollowing
                                      ? "bg-gray-300 text-black"
                                      : "bg-[#C124FF] text-white"
                              }`}
                          >
                            {userInfo?.isFollowing ? "Suivi" : "Suivre"}
                          </button>
                      )}
                      <button className="px-3 py-1 bg-[#C124FF] text-white rounded-md text-sm">
                        Voir l'archive
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4 mb-8 overflow-x-auto">
                  {[...Array(7)].map((_, index) => (
                      <div key={index} className="flex-shrink-0">
                        <img
                            src={posts[index]?.media || NoProfile}
                            alt={`Story ${index + 1}`}
                            className="w-16 h-16 rounded-full border-2 border-[#C124FF]"
                        />
                      </div>
                  ))}
                </div>

                <div className="flex border-t border-gray-300">
                  <button
                      className={`flex-1 py-3 text-center ${
                          activeTab === "publications"
                              ? "border-t-2 border-[#C124FF] text-[#C124FF]"
                              : "text-gray-500"
                      }`}
                      onClick={() => setActiveTab("publications")}
                  >
                    <Grid size={20} className="inline-block mr-1" />
                    Publications
                  </button>
                  <button
                      className={`flex-1 py-3 text-center ${
                          activeTab === "reels"
                              ? "border-t-2 border-[#C124FF] text-[#C124FF]"
                              : "text-gray-500"
                      }`}
                      onClick={() => setActiveTab("reels")}
                  >
                    <Film size={20} className="inline-block mr-1" />
                    Réels
                  </button>
                  <button
                      className={`flex-1 py-3 text-center ${
                          activeTab === "enregistrements"
                              ? "border-t-2 border-[#C124FF] text-[#C124FF]"
                              : "text-gray-500"
                      }`}
                      onClick={() => setActiveTab("enregistrements")}
                  >
                    <Bookmark size={20} className="inline-block mr-1" />
                    Enregistrements
                  </button>

                </div>

                {renderTabContent()}

                <PostModal
                    postIndex={selectedPostIndex}
                    onClose={() => setSelectedPostIndex(null)}
                    onPrevious={() => setSelectedPostIndex((prev) => Math.max(0, prev - 1))}
                    onNext={() =>
                        setSelectedPostIndex((prev) => Math.min(posts.length - 1, prev + 1))
                    }
                />
              </>
          )}
        </div>
      </div>
  );
};

export default Profile;
