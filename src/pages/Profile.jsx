// Profile.jsx
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { TopBar, Loading, EditProfile, Stories } from "../components";
import { makeRequest } from "../axios";
import { NoProfile } from "../assets";
import { Grid, ChevronLeft, Settings, Heart, MessageCircle, X, Video, Image } from "lucide-react";
import { UpdateProfileModal } from "../redux/userSlice";
import moment from "moment";

const PostModal = ({ post, onClose, onPrevious, onNext, hasNext, hasPrevious }) => {
  if (!post) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-75 backdrop-blur-sm" onClick={onClose}></div>
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
            {hasPrevious && (
                    <button
                        onClick={onPrevious}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 rounded-full p-2 backdrop-blur-sm transition-colors"
                    >
                <ChevronLeft className="text-white" size={24} />
                    </button>
                )}
            {hasNext && (
                    <button
                        onClick={onNext}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 rounded-full p-2 backdrop-blur-sm transition-colors"
                    >
                <ChevronLeft className="text-white rotate-180" size={24} />
                    </button>
                )}
              </div>
              <div className="w-full md:w-1/3 p-4 flex flex-col">
                <div className="flex items-center mb-4">
                  <img
                src={post.userId?.profileUrl || NoProfile}
                alt={post.userId?.firstName}
                      className="w-10 h-10 rounded-full mr-3"
                  />
              <div>
                <p className="font-semibold text-ascent-1">
                  {post.userId?.firstName} {post.userId?.lastName}
                </p>
                <p className="text-sm text-ascent-2">
                  {moment(post.createdAt).fromNow()}
                </p>
              </div>
            </div>
            <p className="text-ascent-1 mb-4">{post.description}</p>
            <div className="flex items-center gap-4 text-ascent-2">
              <button className="flex items-center gap-1">
                <Heart size={20} /> {post.likes?.length || 0}
              </button>
              <button className="flex items-center gap-1">
                <MessageCircle size={20} /> {post.comments?.length || 0}
            </button>
            </div>
          </div>
          </div>
          <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white bg-black/20 hover:bg-black/40 rounded-full p-2 backdrop-blur-sm transition-colors"
          >
          <X size={20} />
          </button>
        </div>
    </div>
  );
};

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.user);
  const { edit } = useSelector((state) => state.user);
  
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [errMsg, setErrMsg] = useState("");
  const [selectedPostIndex, setSelectedPostIndex] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [stories, setStories] = useState([]);
  const [videoThumbnails, setVideoThumbnails] = useState({});

  const generateVideoThumbnail = (videoUrl, postId) => {
    const video = document.createElement('video');
    video.crossOrigin = "anonymous";
    video.src = videoUrl;
    
    video.onerror = () => {
      console.error("Erreur de chargement de la vidéo:", video.error);
      setVideoThumbnails(prev => ({
        ...prev,
        [postId]: null
      }));
    };

    try {
      video.load();
      video.currentTime = 10;

      video.addEventListener('loadeddata', () => {
        try {
          video.currentTime = 10;
        } catch (e) {
          console.error("Erreur lors du positionnement de la vidéo:", e);
        }
      });

      video.addEventListener('seeked', () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          try {
            const thumbnailUrl = canvas.toDataURL();
            setVideoThumbnails(prev => ({
              ...prev,
              [postId]: thumbnailUrl
            }));
          } catch (e) {
            console.error("Erreur lors de la génération de la vignette:", e);
            setVideoThumbnails(prev => ({
              ...prev,
              [postId]: null
            }));
          }
        } catch (e) {
          console.error("Erreur lors du dessin de la vidéo:", e);
        }
      });
    } catch (e) {
      console.error("Erreur lors du chargement de la vidéo:", e);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const [userResponse, postsResponse, storiesResponse] = await Promise.all([
          makeRequest.get(`/users/get-user/${id}`),
          makeRequest.get(`/posts/user/${id}`),
          makeRequest.get(`/stories/user/${id}`)
        ]);

        const filteredPosts = postsResponse.data.data.filter(post => post.media);
        setPosts(filteredPosts);
        
        filteredPosts.forEach(post => {
          if (post.mediaType === 'video') {
            generateVideoThumbnail(post.media, post._id);
          }
        });

        setUserInfo(userResponse.data.user);
        setStories(storiesResponse.data.stories || []);
        setIsFollowing(userResponse.data.user.followers?.includes(currentUser?.user._id));
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        setErrMsg("Échec du chargement des données du profil.");
        setLoading(false);
      }
    };

    if (id) fetchUserData();
  }, [id, currentUser?.user._id]);

  const handleFollowToggle = async () => {
    try {
      const response = await makeRequest.post(
        isFollowing ? "/users/unfollow" : "/users/friend-request",
        { requestTo: id }
      );

      if (response.data.success) {
        setIsFollowing(!isFollowing);
        setUserInfo(prev => ({
          ...prev,
          followers: isFollowing 
            ? prev.followers.filter(f => f !== currentUser?.user._id)
            : [...prev.followers, currentUser?.user._id]
        }));
      }
    } catch (error) {
      console.error("Erreur lors de la gestion du suivi :", error);
      setErrMsg("Échec de l'action de suivi/désabonnement.");
    }
  };

  const openEditProfileModal = () => {
    dispatch(UpdateProfileModal(true));
  };

  const isCurrentUserProfile = id === currentUser?.user._id;

  return (
    <div className="w-full min-h-screen bg-bgColor transition-colors duration-300">
        <TopBar user={currentUser} />
      <div className="max-w-7xl mx-auto px-4 py-8">
          {loading ? (
              <Loading />
          ) : (
              <>
            {errMsg && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {errMsg}
              </div>
            )}
            
            {/* En-tête du profil */}
            <div className="bg-primary rounded-2xl shadow-lg p-6 mb-8 transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                <button 
                  className="p-2 hover:bg-bgColor rounded-full transition-colors duration-300" 
                  onClick={() => navigate(-1)}
                >
                  <ChevronLeft size={24} className="text-ascent-1" />
                  </button>
                <h2 className="text-2xl font-bold text-ascent-1">
                    {userInfo?.firstName} {userInfo?.lastName}
                  </h2>
                {isCurrentUserProfile && (
                  <button 
                    className="p-2 hover:bg-bgColor rounded-full transition-colors duration-300"
                    onClick={openEditProfileModal}
                  >
                    <Settings size={24} className="text-ascent-1" />
                  </button>
                )}
                </div>

              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="relative">
                  <img
                      src={userInfo?.profileUrl || NoProfile}
                      alt={userInfo?.username}
                    className="w-32 h-32 rounded-full object-cover border-4 border-[#9a00d7]"
                  />
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-wrap justify-center md:justify-start gap-8 mb-6">
                      <div className="text-center">
                      <p className="text-2xl font-bold text-ascent-1">{posts.length}</p>
                      <p className="text-ascent-2">Publications</p>
                      </div>
                      <div className="text-center">
                      <p className="text-2xl font-bold text-ascent-1">{userInfo?.followers?.length || 0}</p>
                      <p className="text-ascent-2">Followers</p>
                      </div>
                      <div className="text-center">
                      <p className="text-2xl font-bold text-ascent-1">{userInfo?.following?.length || 0}</p>
                      <p className="text-ascent-2">Suivi(e)s</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {userInfo?.profession && (
                      <p className="text-ascent-2 text-center md:text-left">
                        {userInfo.profession}
                      </p>
                    )}
                    
                    {!isCurrentUserProfile && (
                      <div className="flex justify-center md:justify-start">
                          <button
                              onClick={handleFollowToggle}
                          className={`px-6 py-2 rounded-xl transition-colors duration-300 ${
                                  isFollowing
                              ? "bg-gray-200 hover:bg-gray-300 text-gray-800"
                              : "bg-[#9a00d7] hover:bg-[#7b00ab] text-white"
                              }`}
                          >
                            {isFollowing ? "Suivi" : "Suivre"}
                          </button>
                      </div>
                      )}
                  </div>
                </div>
              </div>
            </div>

            {/* Stories */}
            {stories.length > 0 && (
              <div className="mb-8">
                <Stories userStories={stories} />
              </div>
            )}

            {/* Publications */}
            <div className="bg-primary rounded-2xl shadow-lg overflow-hidden transition-all duration-300">
              <h3 className="text-lg font-semibold text-ascent-1 p-4 border-b border-ascent-2/10">
                Publications
              </h3>
              <div className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {posts.map((post, index) => (
                    <div
                      key={post._id}
                      className="aspect-square relative group cursor-pointer overflow-hidden rounded-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                      onClick={() => setSelectedPostIndex(index)}
                    >
                      {post.mediaType === "video" ? (
                        <div className="relative w-full h-full group">
                          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                            {videoThumbnails[post._id] ? (
                              <img
                                src={videoThumbnails[post._id]}
                                alt="Video thumbnail"
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                              />
                            ) : (
                              <div className="flex flex-col items-center">
                                <Video size={40} className="text-white opacity-50 mb-2" />
                                <span className="text-white text-sm opacity-50">Aperçu vidéo</span>
                              </div>
                            )}
                          </div>
                          <video 
                            src={post.media}
                            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110"
                            muted
                            playsInline
                            loop
                            preload="metadata"
                            autoPlay={false}
                            onLoadedData={(e) => {
                              e.target.currentTime = 0;
                            }}
                            onMouseEnter={(e) => {
                              try {
                                e.target.currentTime = 0;
                                e.target.play();
                              } catch (err) {
                                console.error("Erreur de lecture:", err);
                              }
                            }}
                            onMouseLeave={(e) => {
                              try {
                                e.target.pause();
                                e.target.currentTime = 0;
                              } catch (err) {
                                console.error("Erreur lors de la pause:", err);
                              }
                            }}
                          />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="absolute top-2 right-2 bg-black/60 p-1 rounded-md">
                            <Video size={20} className="text-white" />
                          </div>
                        </div>
                      ) : (
                        <div className="relative w-full h-full">
                          <img
                            src={post.media}
                            alt={post.description}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute top-2 right-2 bg-black/60 p-1 rounded-md">
                            <Image size={20} className="text-white" />
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
                        <p className="text-white text-sm line-clamp-2 mb-2">
                          {post.description}
                        </p>
                        <div className="flex items-center justify-between text-white">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Heart size={18} className="text-white" fill={post.likes?.includes(currentUser?.user?._id) ? "white" : "none"} /> 
                              {post.likes?.length || 0}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle size={18} /> 
                              {post.comments?.length || 0}
                            </span>
                          </div>
                          <span className="text-xs opacity-80">
                            {moment(post.createdAt).fromNow()}
                          </span>
                        </div>
                      </div>
                      </div>
                  ))}
                </div>
              </div>
                </div>

            {selectedPostIndex !== null && (
                <PostModal
                post={posts[selectedPostIndex]}
                    onClose={() => setSelectedPostIndex(null)}
                onPrevious={() => setSelectedPostIndex(prev => prev - 1)}
                onNext={() => setSelectedPostIndex(prev => prev + 1)}
                hasPrevious={selectedPostIndex > 0}
                hasNext={selectedPostIndex < posts.length - 1}
              />
            )}
              </>
          )}
        </div>
        {edit && <EditProfile />}
      </div>
  );
};

export default Profile;
