import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, X, Heart, MessageCircle, Share, ChevronDown, Plus, Image, Video } from 'lucide-react';
import { useSelector } from 'react-redux';
import { makeRequest } from '../axios';
import { useNavigate } from 'react-router-dom';
import { TextInput, CustomButton } from "../components";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from 'framer-motion';

const StoryModal = ({ story, onClose, onPrevious, onNext, hasPrevious, hasNext }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="absolute inset-0 bg-black bg-opacity-90 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-md h-[80vh] bg-primary rounded-xl overflow-hidden shadow-2xl"
      >
        {/* ... reste du contenu du modal ... */}
      </motion.div>
    </motion.div>
  );
};

const Stories = ({ userStories }) => {
  const [stories, setStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const storiesContainerRef = useRef(null);
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const [showCreateStoryPopup, setShowCreateStoryPopup] = useState(false);
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [creating, setCreating] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [likes, setLikes] = useState({});
  const [comments, setComments] = useState({});
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isPaused, setIsPaused] = useState(false);
  const { user } = useSelector((state) => state.user);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Vérifier si nous sommes sur le profil de l'utilisateur connecté
  const isCurrentUserProfile = userStories ? userStories[0]?.user?._id === user?.user?._id : false;

  useEffect(() => {
    if (userStories) {
      // Si des stories spécifiques sont fournies, les utiliser
      setStories(userStories);
    } else {
      // Sinon, charger toutes les stories
    fetchStories();
    }
  }, [userStories]);

  const fetchStories = async () => {
    try {
      const response = await makeRequest.get("/stories");
      const groupedStories = groupStoriesByUser(response.data.stories);
      setStories(groupedStories);
    } catch (error) {
      console.error("Erreur lors de la récupération des stories:", error);
    }
  };

  const groupStoriesByUser = (stories) => {
    const groupedStories = stories.reduce((acc, story) => {
      const existingUserStory = acc.find(s => s.user._id === story.user._id);
      if (existingUserStory) {
        existingUserStory.content.push(...story.content);
      } else {
        acc.push({ ...story, content: [...story.content] });
      }
      return acc;
    }, []);
    return groupedStories;
  };

  useEffect(() => {
    if (selectedStory && !isPaused) {
      const currentContent = selectedStory.content[currentContentIndex];
      if (currentContent.type === 'image') {
        const timer = setInterval(() => {
          setProgress((prevProgress) => {
            if (prevProgress >= 100) {
              clearInterval(timer);
              handleNextContent();
              return 0;
            }
            return prevProgress + 1;
          });
        }, currentContent.duration / 100);

        return () => clearInterval(timer);
      } else if (currentContent.type === 'video' && videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(error => {
          console.error("Erreur de lecture vidéo:", error);
          setVideoError(true);
        });
        const timer = setInterval(() => {
          if (!videoRef.current.paused) {
            setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
          }
          if (videoRef.current.ended) {
            clearInterval(timer);
            handleNextContent();
          }
        }, 100);

        return () => clearInterval(timer);
      }
    }
  }, [selectedStory, currentContentIndex, isPaused]);

  const handleStoryClick = (story) => {
    setSelectedStory(story);
    setCurrentContentIndex(0);
    setProgress(0);
    setIsDescriptionExpanded(false);
  };

  const closeStory = () => {
    setSelectedStory(null);
    setCurrentContentIndex(0);
    setProgress(0);
    setIsDescriptionExpanded(false);
  };

  const handleNextContent = () => {
    if (currentContentIndex < selectedStory.content.length - 1) {
      setCurrentContentIndex(currentContentIndex + 1);
      setProgress(0);
      setIsDescriptionExpanded(false);
    } else {
      handleNextStory();
    }
  };

  const handlePrevContent = () => {
    if (currentContentIndex > 0) {
      setCurrentContentIndex(currentContentIndex - 1);
      setProgress(0);
      setIsDescriptionExpanded(false);
    } else {
      handlePrevStory();
    }
  };

  const handleNextStory = () => {
    const currentStoryIndex = stories.findIndex(story => story._id === selectedStory._id);
    if (currentStoryIndex < stories.length - 1) {
      setSelectedStory(stories[currentStoryIndex + 1]);
      setCurrentContentIndex(0);
      setProgress(0);
      setIsDescriptionExpanded(false);
    } else {
      closeStory();
    }
  };

  const handlePrevStory = () => {
    const currentStoryIndex = stories.findIndex(story => story._id === selectedStory._id);
    if (currentStoryIndex > 0) {
      setSelectedStory(stories[currentStoryIndex - 1]);
      setCurrentContentIndex(stories[currentStoryIndex - 1].content.length - 1);
      setProgress(0);
      setIsDescriptionExpanded(false);
    }
  };

  const handleScrollLeft = () => {
    if (storiesContainerRef.current) {
      storiesContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
      setScrollPosition(storiesContainerRef.current.scrollLeft - 200);
    }
  };

  const handleScrollRight = () => {
    if (storiesContainerRef.current) {
      storiesContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
      setScrollPosition(storiesContainerRef.current.scrollLeft + 200);
    }
  };

  const toggleDescriptionExpanded = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  const handleVideoError = () => {
    console.error("Erreur de chargement de la vidéo");
    setVideoError(true);
  };

  const handleCreateStory = () => {
    setShowCreateStoryPopup(true);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) { // 10 MB limit
        setErrMsg("Le fichier est trop volumineux. Taille maximale : 10 MB");
        return;
      }
      setFile(selectedFile);
      setImagePreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleStorySubmit = async (data) => {
    try {
      if (!file) {
        setErrMsg("Veuillez sélectionner un fichier média");
        return;
      }

      setCreating(true);
      setErrMsg("");
      setSuccessMsg("");

      const formData = new FormData();
      formData.append("description", data.description);
      formData.append("media", file);
      formData.append("duration", file.type.startsWith("image/") ? 5000 : 0); // 5 secondes pour les images, 0 pour les vidéos

      const response = await makeRequest.post("/stories/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          // Mettez à jour l'état de progression ici si vous voulez afficher une barre de progression
        },
      });

      setSuccessMsg("Story créée avec succès !");
      setCreating(false);
      setFile(null);
      setImagePreview(null);
      reset();
      setShowCreateStoryPopup(false);
      fetchStories(); // Rafraîchir la liste des stories
    } catch (error) {
      console.error("Erreur lors de la création de la story:", error);
      setErrMsg(error.response?.data?.message || "Échec de la création de la story.");
      setCreating(false);
    }
  };

  const handleLike = async (storyId, contentIndex) => {
    try {
      const response = await makeRequest.post(`/stories/${storyId}/like`, { contentIndex });
      console.log("Réponse du serveur pour le like:", response.data);
      
      setLikes(prevLikes => ({
        ...prevLikes,
        [storyId]: {
          ...(prevLikes[storyId] || {}),
          [contentIndex]: response.data.likes
        }
      }));
    } catch (error) {
      console.error("Erreur lors du like de la story:", error);
    }
  };

  const handleComment = async (storyId, contentIndex) => {
    try {
      const response = await makeRequest.post(`/stories/${storyId}/comment`, { contentIndex, comment: newComment });
      setComments(prevComments => ({
        ...prevComments,
        [storyId]: {
          ...(prevComments[storyId] || {}),
          [contentIndex]: response.data.comments
        }
      }));
      setNewComment('');
    } catch (error) {
      console.error("Erreur lors de l'ajout du commentaire:", error);
    }
  };

  const toggleComments = () => {
    setShowComments(!showComments);
    setIsPaused(!showComments);
    if (showComments) {
      // Si on ferme les commentaires, on réinitialise le progrès
      setProgress(0);
    }
  };

  useEffect(() => {
    if (selectedStory) {
      const storyId = selectedStory._id;
      const contentIndex = currentContentIndex;
      
      const fetchLikesAndComments = async () => {
        try {
          const [likesResponse, commentsResponse] = await Promise.all([
            makeRequest.get(`/stories/${storyId}/likes/${contentIndex}`),
            makeRequest.get(`/stories/${storyId}/comments/${contentIndex}`)
          ]);
          
          setLikes(prevLikes => ({
            ...prevLikes,
            [storyId]: {
              ...(prevLikes[storyId] || {}),
              [contentIndex]: likesResponse.data.likes
            }
          }));
          
          setComments(prevComments => ({
            ...prevComments,
            [storyId]: {
              ...(prevComments[storyId] || {}),
              [contentIndex]: commentsResponse.data.comments
            }
          }));
        } catch (error) {
          console.error("Erreur lors de la récupération des likes et commentaires:", error);
        }
      };
  
      fetchLikesAndComments();
    }
  }, [selectedStory, currentContentIndex]);

  const handleStoryHover = (story) => {
    const video = document.querySelector(`#story-preview-${story._id}`);
    if (video && story.content[0].type === 'video') {
      video.play().catch(error => {
        console.error("Erreur de lecture:", error);
      });
    }
  };

  const handleStoryLeave = (story) => {
    const video = document.querySelector(`#story-preview-${story._id}`);
    if (video && story.content[0].type === 'video') {
      video.pause();
      video.currentTime = 0;
    }
  };

  return (
    <div className="relative">
      <AnimatePresence>
        {scrollPosition > 0 && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
        onClick={handleScrollLeft} 
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-primary rounded-full p-2 shadow-lg z-10 hover:bg-bgColor transition-all duration-300"
          >
            <ChevronLeft size={24} className="text-ascent-1" />
          </motion.button>
        )}
      </AnimatePresence>
      
      <div 
        ref={storiesContainerRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth py-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {isCurrentUserProfile && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-shrink-0 flex flex-col items-center cursor-pointer text-ascent-1"
            onClick={handleCreateStory}
          >
            <div className="w-20 h-20 rounded-full border-4 border-[#9a00d7] flex items-center justify-center bg-gray-200 hover:bg-gray-300 transition-colors duration-300">
            <Plus size={32} color="#9a00d7" />
          </div>
            <p className="mt-2 text-sm font-medium">Créer</p>
          </motion.div>
        )}

        {stories.map((story, index) => (
          <motion.div
            key={story._id}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-shrink-0 flex flex-col items-center cursor-pointer group"
            onClick={() => handleStoryClick(story)}
            onMouseEnter={() => handleStoryHover(story)}
            onMouseLeave={() => handleStoryLeave(story)}
          >
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#9a00d7] to-[#7b00ab] animate-spin-slow" />
              <div className="absolute inset-[3px] rounded-full bg-primary">
                {story.content[0]?.type === 'video' ? (
                  <video
                    id={`story-preview-${story._id}`}
                    src={story.content[0].url}
                    className="w-full h-full rounded-full object-cover"
                    muted
                    playsInline
                    loop
                  />
                ) : (
                  <img
                    src={story.user.profileUrl}
                    alt={story.user.firstName}
                    className="w-full h-full rounded-full object-cover"
                  />
                )}
              </div>
            </div>
            <p className="mt-2 text-sm font-medium text-ascent-1 group-hover:text-[#9a00d7] transition-colors duration-300">
              {story.user.firstName}
            </p>
          </motion.div>
                  ))}
                </div>

      <AnimatePresence>
        {storiesContainerRef.current && scrollPosition < storiesContainerRef.current.scrollWidth - storiesContainerRef.current.clientWidth && (
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            onClick={handleScrollRight}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-primary rounded-full p-2 shadow-lg z-10 hover:bg-bgColor transition-all duration-300"
          >
            <ChevronRight size={24} className="text-ascent-1" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedStory && (
          <StoryModal
            story={selectedStory}
            onClose={() => setSelectedStory(null)}
            onPrevious={handlePrevStory}
            onNext={handleNextStory}
            hasPrevious={currentStoryIndex > 0}
            hasNext={currentStoryIndex < stories.length - 1}
          />
        )}
      </AnimatePresence>

      {/* Modal de création de story */}
      <AnimatePresence>
      {showCreateStoryPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-primary rounded-lg p-6 w-full max-w-md text-ascent-1 max-h-[80vh] overflow-y-auto relative"
            >
            <h2 className="text-2xl font-bold mb-4">Créer une story</h2>
            <form onSubmit={handleSubmit(handleStorySubmit)}>
              <TextInput
                name="description"
                placeholder="Description de votre story"
                register={register("description", {
                  required: "Une description est requise",
                  maxLength: {
                    value: 200,
                    message: "La description ne doit pas dépasser 200 caractères"
                  }
                })}
                error={errors.description ? errors.description.message : ""}
              />
  
              <div className="mt-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/,video/"
                  />
                  <div className="bg-bgColor rounded-full p-2">
                    {file?.type?.startsWith("image/") ? (
                      <Image size={24} />
                    ) : file?.type?.startsWith("video/") ? (
                      <Video size={24} />
                    ) : (
                      <Plus size={24} />
                    )}
                  </div>
                  <span>Ajouter un média (max 10 MB)</span>
                </label>
              </div>
  
              {imagePreview && (
                <div className="mt-4">
                  {file?.type?.startsWith("image/") ? (
                    <img
                      src={imagePreview}
                      alt="Aperçu"
                      className="rounded-lg max-h-[50vh] w-auto mx-auto"
                    />
                  ) : file?.type?.startsWith("video/") ? (
                    <video
                      src={imagePreview}
                      className="w-auto rounded-lg max-h-[50vh] mx-auto"
                      controls
                    />
                  ) : null}
                </div>
              )}
  
              {errMsg && (
                <p className="text-red-500 mt-2">{errMsg}</p>
              )}
  
              {successMsg && (
                <p className="text-green-500 mt-2">{successMsg}</p>
              )}
  
              <div className="flex justify-end mt-4">
                <CustomButton
                  type="button"
                  title="Annuler"
                  containerStyles="bg-bgColor mr-2 py-1 px-2 rounded-md"
                  onClick={() => setShowCreateStoryPopup(false)}
                />
                <CustomButton
                  type="submit"
                  title={creating ? "Création..." : "Créer"}
                  containerStyles="bg-[#9a00d7] text-white py-1 px-2 rounded-md"
                  disabled={creating || !file}
                />
              </div>
            </form>
            </motion.div>
          </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
};

export default Stories;
