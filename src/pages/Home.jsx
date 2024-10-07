// Frontend - Home.jsx
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { makeRequest } from "../axios";
import {
  CustomButton,
  EditProfile,
  FriendsCard,
  Loading,
  PostCard,
  ProfileCard,
  TextInput,
  TopBar,
} from "../components";
import { Link } from "react-router-dom";
import { NoProfile } from "../assets";
import { BsPersonFillAdd } from "react-icons/bs";
import { BiImages } from "react-icons/bi";
import { useForm } from "react-hook-form";

const Home = () => {
  const { user, edit } = useSelector((state) => state.user);
  const [friendRequest, setFriendRequest] = useState([]);
  const [suggestedFriends, setSuggestedFriends] = useState([]);
  const [getFriendRequest, setGetFriendRequest] = useState([]);
  const [posts, setPosts] = useState([]);
  const [errMsg, setErrMsg] = useState("");
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // Déclarez l'état imagePreview ici
  const [posting, setPosting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setErrMsg("");
        setSuccessMsg("");

        // Appel des données de l'utilisateur et des posts
        const [
          userResponse,
          suggestedFriendsResponse,
          postsResponse,
          getFriendRequestResponse,
        ] = await Promise.all([
          makeRequest.post(`/users/get-user`),
          makeRequest.post(`/users/suggested-friends`),
          makeRequest.get(`/posts/get-posts`),
          makeRequest.post(`/users/get-friend-request`),
        ]);

        setFriendRequest(userResponse.data.user.friendRequests || []);
        setSuggestedFriends(suggestedFriendsResponse.data.data || []);
        setPosts(postsResponse.data.data || []);
        setGetFriendRequest(getFriendRequestResponse.data.data || []);
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

  const handlePostSubmit = async (data) => {
    try {
      setPosting(true);
      setErrMsg("");
      setSuccessMsg("");

      const formData = new FormData();
      formData.append("description", data.description);

      if (file) {
        formData.append("media", file); // Utilisation d'un seul champ "media" pour le fichier, quel que soit son type.
      }

      const response = await makeRequest.post("/posts/create-post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Post Created:", response);

      // Mettre à jour les posts avec le nouveau post
      setPosts([response.data.data, ...posts]);
      setSuccessMsg("Post créé avec succès !");
      setPosting(false);
      setFile(null);
      setImagePreview(null); // Réinitialiser l'aperçu après soumission
      reset();
    } catch (error) {
      console.error("Erreur lors de la création du post:", error);
      setErrMsg("Échec de la création du post.");
      setPosting(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImagePreview(URL.createObjectURL(selectedFile)); // Créer un URL d'aperçu pour le fichier (image ou vidéo).
    }
  };

  const handleLikePost = async (postId) => {
    try {
      const response = await makeRequest.post(`/posts/like/${postId}`);

      console.log("Like Post Response:", response);

      // Mettre à jour le post dans la liste des posts
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? response.data.data : post
        )
      );
    } catch (error) {
      console.error("Erreur lors de l'ajout du like:", error);
      setErrMsg("Échec de l'ajout du like.");
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await makeRequest.delete(`/posts/${postId}`);
      console.log("Post Deleted:", postId);
      // Retirer le post de la liste des posts
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
      setSuccessMsg("Post supprimé avec succès !");
    } catch (error) {
      console.error("Erreur lors de la suppression du post:", error);
      setErrMsg("Échec de la suppression du post.");
    }
  };

  const handleAcceptFriend = async (requestId) => {
    try {
      await makeRequest.post("/users/accept-request", {
        rid: requestId,
        status: "Accepted",
      });
      console.log("Friend Request Accepted:", requestId);

      // Fetch updated friend requests after acceptance
      const updatedUserResponse = await makeRequest.get(`/users/get-user`);
      setFriendRequest(updatedUserResponse.data.user.friendRequests || []);
      setSuccessMsg("Demande d'ami acceptée !");
    } catch (error) {
      console.error("Erreur lors de l'acceptation de la demande:", error);
      setErrMsg("Échec de l'acceptation de la demande.");
    }
  };

  const handleDenyFriend = async (requestId) => {
    try {
      await makeRequest.post("/users/accept-request", {
        rid: requestId,
        status: "Denied",
      });
      console.log("Friend Request Denied:", requestId);

      // Fetch updated friend requests after denial
      const updatedUserResponse = await makeRequest.get(`/users/get-user`);
      setFriendRequest(updatedUserResponse.data.user.friendRequests || []);
      setSuccessMsg("Demande d'ami refusée !");
    } catch (error) {
      console.error("Erreur lors du refus de la demande:", error);
      setErrMsg("Échec du refus de la demande.");
    }
  };

  const handleSendFriendRequest = async (friendId) => {
    try {
      await makeRequest.post("/users/friend-request", {
        requestTo: friendId,
      });
      console.log("Friend Request Sent to:", friendId);
      setSuccessMsg("Demande d'ami envoyée !");
    } catch (error) {
      console.error("Erreur lors de l'envoi de la demande d'ami:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErrMsg(error.response.data.message); // Afficher le message d'erreur du backend
      } else {
        setErrMsg("Échec de l'envoi de la demande d'ami.");
      }
    }
  };

  return (
    <div className="w-full px-0 lg:px-10 pb-20 2xl:px-40 bg-bgColor lg:rounded-lg min-h-screen overflow-hidden">
      <TopBar />

      <div className="w-full flex gap-2 lg:gap-4 pt-5 pb-10 h-full">
        {/* LEFT */}
        <div className="hidden w-1/3 lg:w-1/4 h-full md:flex flex-col gap-6 overflow-y-auto">
          <ProfileCard />
          <FriendsCard />
        </div>

        {/* CENTER */}
        <div className="flex-1 h-full px-4 flex flex-col gap-6 overflow-y-auto rounded-lg">
          <form
            onSubmit={handleSubmit(handlePostSubmit)}
            className="bg-primary px-4 rounded-lg"
          >
            <div className="w-full flex items-center gap-2 py-4 border-b border-[#66666645]">
              <img
                src={user?.profileUrl ?? NoProfile}
                alt="User Image"
                className="w-14 h-14 rounded-full object-cover"
              />
              <TextInput
                styles="w-full rounded-full py-5"
                placeholder="Quoi de neuf ?"
                name="description"
                register={register("description", {
                  required: "Écrivez quelque chose pour le post",
                })}
                error={errors.description ? errors.description.message : ""}
              />
            </div>
            {errMsg && (
              <span role="alert" className="text-sm text-[#f64949fe] mt-0.5">
                {errMsg}
              </span>
            )}
            {successMsg && (
              <span role="status" className="text-sm text-[#2ba150fe] mt-0.5">
                {successMsg}
              </span>
            )}

            {/* Aperçu dynamique du fichier */}
            {imagePreview && (
              <div className="w-full mt-4">
                {file?.type.startsWith("image/") ? (
                  <img
                    src={imagePreview}
                    alt="Aperçu du média"
                    className="w-full rounded-lg object-cover"
                  />
                ) : file?.type.startsWith("video/") ? (
                  <video
                    className="w-full rounded-lg object-cover"
                    autoPlay
                    loop
                    muted
                  >
                    <source src={imagePreview} type={file.type} />
                    Votre navigateur ne supporte pas la lecture des vidéos.
                  </video>
                ) : (
                  <p>Format non supporté pour l'aperçu.</p>
                )}
              </div>
            )}

            <div className="flex items-center justify-between py-4">
              <label
                htmlFor="mediaUpload"
                className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer"
              >
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  id="mediaUpload"
                  data-max-size="5120"
                  accept=".jpg, .png, .jpeg, .mp4, .wav, .gif"
                />
                <BiImages />
                <span>Média</span>
              </label>

              <div>
                <CustomButton
                  type="submit"
                  title={posting ? "Publication..." : "Publier"}
                  containerStyles={`${
                    posting
                      ? "bg-[#0444a4] opacity-50 cursor-not-allowed"
                      : "bg-[#0444a4]"
                  } text-white py-1 px-6 rounded-full font-semibold text-sm`}
                  disabled={posting}
                />
              </div>
            </div>
          </form>

          {loading ? (
            <Loading />
          ) : posts?.length > 0 ? (
            posts?.map((post) => (
              <PostCard
                key={post?._id}
                post={post}
                user={user}
                deletePost={() => handleDeletePost(post._id)}
                likePost={() => handleLikePost(post._id)}
              />
            ))
          ) : (
            <div className="flex w-full h-full items-center justify-center">
              <p className="text-lg text-ascent-2">Aucun post disponible</p>
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="hidden w-1/4 h-full lg:flex flex-col gap-8 overflow-y-auto">
          {/* FRIEND REQUEST */}
          <div className="w-full bg-primary shadow-sm rounded-lg px-6 py-5">
            <div className="flex items-center justify-between text-xl text-ascent-1 pb-2 border-b border-[#66666645]">
              <span>Demandes d'Ami</span>
              <span>{getFriendRequest?.length}</span>
            </div>

            <div className="w-full flex flex-col gap-4 pt-4">
              {getFriendRequest?.map(({ _id, requestFrom: from }) => (
                <div key={_id} className="flex items-center justify-between">
                  <Link
                    to={`/profile/${from._id}`}
                    className="w-full flex gap-4 items-center cursor-pointer"
                  >
                    <img
                      src={from?.profileUrl ?? NoProfile}
                      alt={from?.firstName}
                      className="w-10 h-10 object-cover rounded-full"
                    />
                    <div className="flex-1">
                      <p className="text-base font-medium text-ascent-1">
                        {from?.firstName} {from?.lastName}
                      </p>
                      <span className="text-sm text-ascent-2">
                        {from?.profession ?? "Pas de Profession"}
                      </span>
                    </div>
                  </Link>

                  <div className="flex gap-1">
                    <CustomButton
                      title="Accepter"
                      onClick={() => handleAcceptFriend(_id)}
                      containerStyles="bg-[#0444a4] text-xs text-white px-1.5 py-1 rounded-full"
                    />
                    <CustomButton
                      title="Refuser"
                      onClick={() => handleDenyFriend(_id)}
                      containerStyles="border border-[#666] text-xs text-ascent-1 px-1.5 py-1 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SUGGESTED FRIENDS */}
          <div className="w-full bg-primary shadow-sm rounded-lg px-5 py-5">
            <div className="flex items-center justify-between text-lg text-ascent-1 border-b border-[#66666645]">
              <span>Ami·e·s Suggérés·es</span>
            </div>
            <div className="w-full flex flex-col gap-4 pt-4">
              {suggestedFriends?.map((friend) => (
                <div
                  className="flex items-center justify-between"
                  key={friend._id}
                >
                  <Link
                    to={`/profile/${friend._id}`}
                    className="w-full flex gap-4 items-center cursor-pointer"
                  >
                    <img
                      src={friend?.profileUrl ?? NoProfile}
                      alt={friend?.firstName}
                      className="w-10 h-10 object-cover rounded-full"
                    />
                    <div className="flex-1">
                      <p className="text-base font-medium text-ascent-1">
                        {friend?.firstName} {friend?.lastName}
                      </p>
                      <span className="text-sm text-ascent-2">
                        {friend?.profession ?? "Pas de Profession"}
                      </span>
                    </div>
                  </Link>

                  <div className="flex gap-1">
                    <button
                      className="bg-[#0444a430] text-sm text-white p-1 rounded"
                      onClick={() => handleSendFriendRequest(friend._id)}
                      title="Ajouter en ami"
                    >
                      <BsPersonFillAdd size={20} className="text-[#0f52b6]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {edit && <EditProfile />}
    </div>
  );
};

export default Home;
