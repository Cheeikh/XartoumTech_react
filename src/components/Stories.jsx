import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, X, Heart, MessageCircle, Share, ChevronDown, Plus, Image, Video } from 'lucide-react';
import { useSelector } from 'react-redux';
import { makeRequest } from '../axios';
import { useNavigate } from 'react-router-dom';
import { TextInput, CustomButton } from "../components";
import { useForm } from "react-hook-form";

function Stories() {
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

  useEffect(() => {
    fetchStories();
  }, []);

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

  return (
    <div className="relative">
      <button 
        onClick={handleScrollLeft} 
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-primary rounded-full p-1 shadow-md z-10"
        style={{ display: scrollPosition > 0 ? 'block' : 'none' }}
      >
        <ChevronLeft size={24} />
      </button>
      
      <div 
        ref={storiesContainerRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth" 
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="flex-shrink-0 flex flex-col items-center cursor-pointer text-ascent-1" onClick={handleCreateStory}>
          <div className="w-20 h-20 rounded-full border-4 border-[#9a00d7] flex items-center justify-center bg-gray-200">
            <Plus size={32} color="#9a00d7" />
          </div>
          <p className="mt-2 text-sm">Créer</p>
        </div>
        {stories.map((story) => (
          <div key={story._id} className="flex-shrink-0 flex flex-col items-center cursor-pointer" onClick={() => handleStoryClick(story)}>
            <img src={story.user.profileUrl} alt={story.user.firstName} className="w-20 h-20 rounded-full border-4 border-[#9a00d7]" />
            <p className="mt-2 text-sm text-ascent-1">{story.user.firstName}</p>
          </div>
        ))}
      </div>
  
      <button 
        onClick={handleScrollRight} 
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-primary rounded-full p-1 shadow-md z-10"
        style={{ display: storiesContainerRef.current && scrollPosition < storiesContainerRef.current.scrollWidth - storiesContainerRef.current.clientWidth ? 'block' : 'none' }}
      >
        <ChevronRight size={24} />
      </button>
  
      {selectedStory && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-40">
          {/* Contenu du modal des stories */}
          <div className="relative w-full max-w-md h-[80vh]">
            {/* Barre de progression */}
            <div className="absolute top-0 left-0 right-0 flex">
              {selectedStory.content.map((_, index) => (
                <div key={index} className="flex-1 h-1 bg-gray-400 mx-1">
                  <div 
                    className="h-full bg-primary" 
                    style={{ 
                      width: `${index === currentContentIndex ? progress : index < currentContentIndex ? 100 : 0}%`,
                      transition: 'width 0.1s linear'
                    }}
                  />
                </div>
              ))}
            </div>
            {/* Affichage du contenu (image ou vidéo) */}
            {selectedStory.content[currentContentIndex].type === 'image' ? (
              <img 
                src={selectedStory.content[currentContentIndex].url} 
                alt={selectedStory.user.firstName} 
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              videoError ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-800 text-ascent-1">
                  Impossible de charger la vidéo
                </div>
              ) : (
                <video 
                  ref={videoRef}
                  src={selectedStory.content[currentContentIndex].url}
                  className="w-full h-full object-cover rounded-lg"
                  muted
                  playsInline
                  onError={handleVideoError}
                />
              )
            )}
            {/* Informations de l'utilisateur */}
            <div className="absolute top-4 left-4 flex items-center">
              <img src={selectedStory.user.profileUrl} alt={selectedStory.user.firstName} className="w-8 h-8 rounded-full mr-2" />
              <p className="text-ascent-1 font-semibold">{selectedStory.user.firstName}</p>
            </div>
            {/* Bouton de fermeture */}
            <button onClick={closeStory} className="absolute top-4 right-4 text-ascent-1">
              <X size={24} />
            </button>
            {/* Boutons de navigation */}
            <button onClick={handlePrevContent} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full p-2">
              <ChevronLeft size={32} />
            </button>
            <button onClick={handleNextContent} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full p-2">
              <ChevronRight size={32} />
            </button>
            {/* Description et actions */}
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <p className={`${isDescriptionExpanded ? '' : 'line-clamp-2'} mb-2`}>
                {selectedStory.content[currentContentIndex].description}
              </p>
              {selectedStory.content[currentContentIndex].description.length > 100 && (
                <button onClick={toggleDescriptionExpanded} className="text-white text-sm flex items-center">
                  {isDescriptionExpanded ? 'Voir moins' : 'Voir plus'}
                  <ChevronDown size={16} className={`ml-1 transform ${isDescriptionExpanded ? 'rotate-180' : ''}`} />
                </button>
              )}
              <div className="flex justify-between mt-4">
                <button 
                  className="flex items-center bg-black bg-opacity-50 rounded-full p-2"
                  onClick={() => handleLike(selectedStory._id, currentContentIndex)}
                >
                  <Heart 
                    size={24} 
                    className="mr-2" 
                    fill={likes[selectedStory._id]?.[currentContentIndex] > 0 ? 'white' : 'none'} 
                    stroke="white"
                  />
                  <span>{likes[selectedStory._id]?.[currentContentIndex] || 0}</span>
                </button>
                <button 
                  className="flex items-center bg-black bg-opacity-50 rounded-full p-2"
                  onClick={toggleComments}
                >
                  <MessageCircle size={24} className="mr-2" stroke="white" />
                  <span>{comments[selectedStory._id]?.[currentContentIndex]?.length || 0}</span>
                </button>
                <button className="bg-black bg-opacity-50 rounded-full p-2">
                  <Share size={24} stroke="white" />
                </button>
              </div>
            </div>
          </div>
          {/* Modal des commentaires à l'intérieur du modal des stories */}
          {showComments && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-primary rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
                <h3 className="text-xl font-bold mb-4">Commentaires</h3>
                <div className="space-y-4 mb-4">
                  {comments[selectedStory._id]?.[currentContentIndex]?.map((comment, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <img src={comment.user.profileUrl} alt={comment.user.firstName} className="w-8 h-8 rounded-full" />
                      <div>
                        <p className="font-semibold">{comment.user.firstName} {comment.user.lastName}</p>
                        <p>{comment.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Ajouter un commentaire..."
                    className="flex-grow border rounded-full px-4 py-2"
                  />
                  <button
                    onClick={() => handleComment(selectedStory._id, currentContentIndex)}
                    className="bg-[#9a00d7] text-ascent-1 px-4 py-2 rounded-full"
                  >
                    Envoyer
                  </button>
                </div>
                <button
                  onClick={toggleComments}
                  className="mt-4 text-gray-500"
                >
                  Fermer
                </button>
              </div>
            </div>
          )}
        </div>
      )}
  
      {showCreateStoryPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-primary rounded-lg p-6 w-full max-w-md">
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
                  <div className="bg-gray-200 rounded-full p-2">
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
                      className="rounded-lg max-h-[500px] w-auto mx-auto"
                    />
                  ) : file?.type?.startsWith("video/") ? (
                    <video
                      src={imagePreview}
                      className="w-full rounded-lg"
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
                  containerStyles="bg-gray-300 text-black mr-2"
                  onClick={() => setShowCreateStoryPopup(false)}
                />
                <CustomButton
                  type="submit"
                  title={creating ? "Création..." : "Créer"}
                  containerStyles="bg-[#9a00d7] text-ascent-1 py-1 px-2 rounded-md"
                  disabled={creating || !file}
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
  
}

export default Stories;
