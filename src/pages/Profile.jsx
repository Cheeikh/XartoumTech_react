// Profile.jsx
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { TopBar, Loading, EditProfile, Stories } from "../components";
import { makeRequest } from "../axios";
import { NoProfile } from "../assets";
import { Grid, ChevronLeft, Settings, Heart, MessageCircle, X, Video, Image, Volume2, VolumeX, MapPin, Briefcase, Calendar } from "lucide-react";
import { UpdateProfileModal, UpdateFriends } from "../redux/userSlice";
import moment from "moment";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

const PostModal = ({ post, onClose, onPrevious, onNext, hasNext, hasPrevious }) => {
  const [isMuted, setIsMuted] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const { user } = useSelector((state) => state.user);
  
  if (!post) return null;

  const handleToggleMute = (e) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  const handleLike = async (e) => {
    e.stopPropagation();
    try {
      await makeRequest.post(`/posts/like/${post._id}`);
      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Erreur lors du like:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] overflow-y-auto"
    >
      <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm" onClick={onClose} />
      <div className="flex min-h-screen items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="z-[9999] bg-primary dark:bg-gray-800 w-full max-w-4xl rounded-lg overflow-hidden relative"
        >
          <div className="flex flex-col md:flex-row max-h-[90vh]">
            <div className="w-full md:w-2/3 relative flex items-center justify-center bg-black">
              {post.mediaType === "video" ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="relative w-full"
                >
                  <video
                    src={post.media}
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    controls={false}
                    className="max-w-full max-h-[80vh] object-contain"
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleToggleMute}
                    className="absolute bottom-4 right-4 bg-black/60 hover:bg-black/80 p-2 rounded-full backdrop-blur-sm transition-colors"
                  >
                    {isMuted ? (
                      <Volume2 className="text-white w-6 h-6 opacity-75 hover:opacity-100" />
                    ) : (
                      <VolumeX className="text-white w-6 h-6 opacity-75 hover:opacity-100" />
                    )}
                  </motion.button>
                </motion.div>
              ) : (
                <motion.img
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  src={post.media}
                  alt={post.description}
                  className="max-w-full max-h-[80vh] object-contain"
                />
              )}
              {hasPrevious && (
                <motion.button
                  whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.3)" }}
                  onClick={onPrevious}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/10 rounded-full p-2 backdrop-blur-sm transition-colors"
                >
                  <ChevronLeft className="text-white" size={24} />
                </motion.button>
              )}
              {hasNext && (
                <motion.button
                  whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.3)" }}
                  onClick={onNext}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/10 rounded-full p-2 backdrop-blur-sm transition-colors"
                >
                  <ChevronLeft className="text-white rotate-180" size={24} />
                </motion.button>
              )}
            </div>
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="w-full md:w-1/3 p-4 flex flex-col"
            >
              <div className="flex items-center mb-4">
                <motion.img
                  whileHover={{ scale: 1.1 }}
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
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleLike}
                  className="flex items-center gap-1"
                >
                  <Heart
                    size={20}
                    className={isLiked ? "text-red-500 fill-current" : ""}
                  />
                  {post.likes?.length || 0}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowComments(!showComments)}
                  className="flex items-center gap-1"
                >
                  <MessageCircle size={20} />
                  {post.comments?.length || 0}
                </motion.button>
              </div>
            </motion.div>
          </div>
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: "rgba(0, 0, 0, 0.4)" }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="absolute top-4 right-4 text-white bg-black/20 rounded-full p-2 backdrop-blur-sm transition-colors"
          >
            <X size={20} />
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
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
  const [friendRequestStatus, setFriendRequestStatus] = useState(null); // 'pending', 'received', null

  // Nouveaux états pour améliorer l'UX
  const [activeTab, setActiveTab] = useState("posts"); // "posts" ou "about"
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  // Réinitialiser les états lors du changement d'utilisateur
  useEffect(() => {
    setLoading(true);
    setPosts([]);
    setStories([]);
    setVideoThumbnails({});
    setSelectedPostIndex(null);
    setErrMsg("");
    setIsFollowing(false);
  }, [id]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const [userResponse, postsResponse, storiesResponse, friendRequestResponse] = await Promise.all([
          makeRequest.get(`/users/get-user/${id}`),
          makeRequest.get(`/posts/user/${id}`),
          makeRequest.get(`/stories/user/${id}`),
          makeRequest.post(`/users/get-friend-request`)
        ]);

        // Vérifier si l'utilisateur existe
        if (!userResponse.data.user) {
          setErrMsg("Utilisateur non trouvé");
          navigate("/");
          return;
        }

        const filteredPosts = postsResponse.data.data.filter(post => post.media);
        setPosts(filteredPosts);
        
        // Générer les vignettes uniquement pour les posts vidéo
        filteredPosts.forEach(post => {
          if (post.mediaType === 'video') {
            generateVideoThumbnail(post.media, post._id);
          }
        });

        setUserInfo(userResponse.data.user);
        setStories(storiesResponse.data.stories || []);
        
        // Vérifier si l'utilisateur courant suit déjà cet utilisateur
        const isCurrentlyFollowing = userResponse.data.user.followers?.includes(currentUser?.user?._id);
        setIsFollowing(isCurrentlyFollowing);

        // Vérifier le statut de la demande d'ami
        const friendRequests = friendRequestResponse.data.data || [];
        const pendingRequest = friendRequests.find(
          request => request.requestFrom._id === currentUser?.user?._id && request.requestTo === id
        );
        const receivedRequest = friendRequests.find(
          request => request.requestFrom._id === id && request.requestTo === currentUser?.user?._id
        );

        if (pendingRequest) {
          setFriendRequestStatus('pending');
        } else if (receivedRequest) {
          setFriendRequestStatus('received');
        } else {
          setFriendRequestStatus(null);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        setErrMsg("Échec du chargement des données du profil.");
        setLoading(false);
      }
    };

    if (id && currentUser?.user) {
      fetchUserData();
    }
  }, [id, currentUser?.user?._id, navigate]);

  const handleAcceptFriend = async () => {
    try {
      const response = await makeRequest.post("/users/accept-request", {
        rid: id,
        status: "Accepted"
      });
      
      if (response.data.success) {
        setIsFollowing(true);
        setFriendRequestStatus(null);
        // Mettre à jour la liste des amis dans Redux
        const friendsResponse = await makeRequest.get("/users/friends");
        if (friendsResponse.data.success) {
          dispatch(UpdateFriends(friendsResponse.data.data));
        }
        toast.success("Demande d'ami acceptée !");
      }
    } catch (error) {
      console.error("Erreur lors de l'acceptation de la demande:", error);
      toast.error("Échec de l'acceptation de la demande.");
    }
  };

  const handleFollowToggle = async () => {
    if (!currentUser?.user) {
      navigate("/login");
      return;
    }

    try {
      if (isFollowing) {
        // Si on suit déjà l'utilisateur, on le désabonne
        const response = await makeRequest.post("/users/unfollow", { requestTo: id });
        if (response.data.success) {
          setIsFollowing(false);
          setFriendRequestStatus(null);
          setUserInfo(prev => ({
            ...prev,
            followers: Array.isArray(prev.followers) 
              ? prev.followers.filter(f => f !== currentUser?.user._id)
              : []
          }));
          // Mettre à jour la liste des amis dans Redux
          const friendsResponse = await makeRequest.get("/users/friends");
          if (friendsResponse.data.success) {
            dispatch(UpdateFriends(friendsResponse.data.data));
          }
          toast.success("Désabonnement réussi");
        }
      } else {
        // Si on ne suit pas l'utilisateur, on envoie une demande d'ami
        const response = await makeRequest.post("/users/friend-request", { requestTo: id });
        if (response.data.success) {
          setFriendRequestStatus('pending');
          toast.success("Demande d'ami envoyée !");
          // Mettre à jour la liste des amis dans Redux
          const friendsResponse = await makeRequest.get("/users/friends");
          if (friendsResponse.data.success) {
            dispatch(UpdateFriends(friendsResponse.data.data));
          }
        }
      }
    } catch (error) {
      console.error("Erreur lors de la gestion du suivi :", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Échec de l'action de suivi/désabonnement.");
      }
    }
  };

  const openEditProfileModal = () => {
    if (id === currentUser?.user?._id) {
      dispatch(UpdateProfileModal(true));
    }
  };

  const isCurrentUserProfile = id === currentUser?.user?._id;

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

  // Fonction pour charger plus de posts
  const loadMorePosts = async () => {
    if (loadingMore || !hasMore) return;
    
    try {
      setLoadingMore(true);
      const response = await makeRequest.get(`/posts/user/${id}?page=${page + 1}`);
      const newPosts = response.data.data.filter(post => post.media);
      
      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts(prev => [...prev, ...newPosts]);
        setPage(prev => prev + 1);
        
        // Générer les vignettes pour les nouvelles vidéos
        newPosts.forEach(post => {
          if (post.mediaType === 'video') {
            generateVideoThumbnail(post.media, post._id);
          }
        });
      }
    } catch (error) {
      console.error("Erreur lors du chargement de plus de posts:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  // Observer pour le scroll infini
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMorePosts();
        }
      },
      { threshold: 0.5 }
    );

    const sentinel = document.getElementById('scroll-sentinel');
    if (sentinel) {
      observer.observe(sentinel);
    }

    return () => observer.disconnect();
  }, [hasMore, loadingMore]);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-bgColor flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Loading />
        </motion.div>
      </div>
    );
  }

  if (errMsg) {
    return (
      <div className="w-full min-h-screen bg-bgColor flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-lg"
        >
          {errMsg}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-bgColor transition-colors duration-300">
      <TopBar user={currentUser} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto px-4 py-8"
      >
        {/* En-tête du profil */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary rounded-2xl shadow-lg p-6 mb-8 transition-all duration-300"
        >
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
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative"
            >
                  <img
                      src={userInfo?.profileUrl || NoProfile}
                      alt={userInfo?.username}
                className="w-32 h-32 rounded-full object-cover border-4 border-[#9a00d7]"
              />
            </motion.div>
            
            <div className="flex-1">
              <div className="flex flex-wrap justify-center md:justify-start gap-8 mb-6">
                <motion.div whileHover={{ y: -5 }} className="text-center">
                  <p className="text-2xl font-bold text-ascent-1">{posts.length}</p>
                  <p className="text-ascent-2">Publications</p>
                </motion.div>
                <motion.div whileHover={{ y: -5 }} className="text-center">
                  <p className="text-2xl font-bold text-ascent-1">{userInfo?.followers?.length || 0}</p>
                  <p className="text-ascent-2">Followers</p>
                </motion.div>
                <motion.div whileHover={{ y: -5 }} className="text-center">
                  <p className="text-2xl font-bold text-ascent-1">{userInfo?.following?.length || 0}</p>
                  <p className="text-ascent-2">Suivi(e)s</p>
                </motion.div>
              </div>

              <div className="space-y-4">
                {userInfo?.profession && (
                  <div className="flex items-center gap-2 text-ascent-2">
                    <Briefcase size={18} />
                    <p>{userInfo.profession}</p>
                  </div>
                )}
                
                {userInfo?.location && (
                  <div className="flex items-center gap-2 text-ascent-2">
                    <MapPin size={18} />
                    <p>{userInfo.location}</p>
                  </div>
                )}

                <div className="flex items-center gap-2 text-ascent-2">
                  <Calendar size={18} />
                  <p>Membre depuis {moment(userInfo?.createdAt).format('MMMM YYYY')}</p>
                </div>
                
                {!isCurrentUserProfile && (
                  <div className="flex justify-center md:justify-start pt-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={friendRequestStatus === 'received' ? handleAcceptFriend : handleFollowToggle}
                      className={`px-6 py-2 rounded-xl transition-colors duration-300 ${
                        isFollowing
                          ? "bg-gray-200 hover:bg-gray-300 text-gray-800"
                          : friendRequestStatus === 'pending'
                          ? "bg-gray-200 hover:bg-gray-300 text-gray-800 cursor-not-allowed"
                          : friendRequestStatus === 'received'
                          ? "bg-[#9a00d7] hover:bg-[#7b00ab] text-white"
                          : "bg-[#9a00d7] hover:bg-[#7b00ab] text-white"
                      }`}
                      disabled={friendRequestStatus === 'pending'}
                    >
                      {isFollowing 
                        ? "Suivi" 
                        : friendRequestStatus === 'pending'
                        ? "En attente"
                        : friendRequestStatus === 'received'
                        ? "Accepter la demande"
                        : "Suivre"}
                    </motion.button>
                </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Navigation des onglets */}
        <div className="flex justify-center mb-8">
          <div className="bg-primary rounded-xl p-1 flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab("posts")}
              className={`px-6 py-2 rounded-lg transition-colors duration-300 ${
                activeTab === "posts"
                  ? "bg-[#9a00d7] text-white"
                  : "text-ascent-1 hover:bg-bgColor"
              }`}
            >
              Publications
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab("about")}
              className={`px-6 py-2 rounded-lg transition-colors duration-300 ${
                activeTab === "about"
                  ? "bg-[#9a00d7] text-white"
                  : "text-ascent-1 hover:bg-bgColor"
              }`}
            >
              À propos
            </motion.button>
          </div>
        </div>

        {/* Stories */}
        <AnimatePresence>
          {stories.length > 0 && activeTab === "posts" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8"
            >
              <Stories userStories={stories} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Contenu principal */}
        <AnimatePresence mode="wait">
          {activeTab === "posts" ? (
            <motion.div
              key="posts"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-primary rounded-2xl shadow-lg overflow-hidden transition-all duration-300"
            >
              <h3 className="text-lg font-semibold text-ascent-1 p-4 border-b border-ascent-2/10">
                Publications
              </h3>
              <div className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {posts.map((post, index) => (
                    <motion.div
                      key={post._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="aspect-square relative group cursor-pointer overflow-hidden rounded-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                      onClick={() => setSelectedPostIndex(index)}
                  >
                    {post.mediaType === "video" ? (
                        <div className="relative w-full h-full">
                          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                            {videoThumbnails[post._id] ? (
                              <img
                                src={videoThumbnails[post._id]}
                                alt="Video thumbnail"
                                className="w-full h-full object-cover"
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
                            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            muted
                            playsInline
                            loop
                            preload="metadata"
                            onLoadedMetadata={(e) => {
                              const video = e.target;
                              // Précharger à 10 secondes
                              if (video.duration > 10) {
                                video.currentTime = 10;
                              }
                            }}
                            onTimeUpdate={(e) => {
                              const video = e.target;
                              // Si on dépasse 20 secondes, revenir à 10 secondes
                              if (video.currentTime > 20) {
                                video.currentTime = 10;
                              }
                            }}
                            onMouseEnter={(e) => {
                              const video = e.target;
                              // Démarrer la lecture à partir de 10 secondes
                              video.currentTime = 10;
                              const playPromise = video.play();
                              if (playPromise !== undefined) {
                                playPromise.catch(error => {
                                  console.error("Erreur de lecture:", error);
                                });
                              }
                            }}
                            onMouseLeave={(e) => {
                              const video = e.target;
                              video.pause();
                              video.currentTime = 10; // Revenir à 10 secondes
                            }}
                          />
                          <div className="absolute top-2 right-2 bg-black/60 p-1 rounded-md">
                            <Video size={20} className="text-white" />
                          </div>
                          {/* Indicateur de lecture */}
                          <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span className="text-white text-xs">Lecture en cours</span>
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
                    </motion.div>
              ))}
            </div>
                
                {/* Sentinel pour le scroll infini */}
                {hasMore && (
                  <div id="scroll-sentinel" className="h-20 flex items-center justify-center">
                    {loadingMore && <Loading />}
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="about"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-primary rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-xl font-semibold text-ascent-1 mb-6">À propos</h3>
              <div className="space-y-6">
                {userInfo?.bio && (
                  <div>
                    <h4 className="text-lg font-medium text-ascent-1 mb-2">Biographie</h4>
                    <p className="text-ascent-2">{userInfo.bio}</p>
                </div>
                )}
                
                <div>
                  <h4 className="text-lg font-medium text-ascent-1 mb-2">Informations</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userInfo?.profession && (
                      <div className="flex items-center gap-3 text-ascent-2">
                        <Briefcase size={20} />
                        <span>{userInfo.profession}</span>
                      </div>
                    )}
                    {userInfo?.location && (
                      <div className="flex items-center gap-3 text-ascent-2">
                        <MapPin size={20} />
                        <span>{userInfo.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3 text-ascent-2">
                      <Calendar size={20} />
                      <span>A rejoint en {moment(userInfo?.createdAt).format('MMMM YYYY')}</span>
                    </div>
                  </div>
                </div>
                      </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal des posts */}
        <AnimatePresence>
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
        </AnimatePresence>
      </motion.div>
        {edit && <EditProfile />}
      </div>
  );
};

export default Profile;
