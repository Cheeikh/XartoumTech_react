// Frontend - PostCard.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { NoProfile } from "../assets";
import { BiComment, BiLike, BiSolidLike } from "react-icons/bi";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { useForm } from "react-hook-form";
import TextInput from "./TextInput";
import Loading from "./Loading";
import CustomButton from "./CustomButton";
import { makeRequest } from "../axios"; // Assurez-vous que makeRequest est correctement importé

const ReplyCard = ({ reply, user, handleLike }) => {
  return (
    <div className="w-full py-3">
      <div className="flex gap-3 items-center mb-1">
        <Link to={`/profile/${reply?.userId?._id}`}>
          <img
            src={reply?.userId?.profileUrl ?? NoProfile}
            alt={reply?.userId?.firstName}
            className="w-10 h-10 rounded-full object-cover"
          />
        </Link>

        <div>
          <Link to={`/profile/${reply?.userId?._id}`}>
            <p className="font-medium text-base text-ascent-1">
              {reply?.userId?.firstName} {reply?.userId?.lastName}
            </p>
          </Link>
          <span className="text-ascent-2 text-sm">
            {moment(reply?.createdAt).fromNow()}
          </span>
        </div>
      </div>

      <div className="ml-12">
        <p className="text-ascent-2 ">{reply?.comment}</p>
        <div className="mt-2 flex gap-6">
          <p
            className="flex gap-2 items-center text-base text-ascent-2 cursor-pointer"
            onClick={handleLike}
          >
            {reply?.likes?.includes(user?._id) ? (
              <BiSolidLike size={20} color="blue" />
            ) : (
              <BiLike size={20} />
            )}
            {reply?.likes?.length} Likes
          </p>
        </div>
      </div>
    </div>
  );
};

const CommentForm = ({ user, postId, parentId = null, refreshComments }) => {
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setErrMsg("");

      const endpoint = parentId
        ? `/posts/reply/${parentId}` // Si c'est une réponse
        : `/posts/comment/${postId}`; // Si c'est un commentaire sur un post

      const response = await makeRequest.post(endpoint, {
        comment: data.comment,
      });

      if (response.data.success) {
        reset();
        refreshComments(); // Rafraîchir la liste des commentaires après une soumission réussie
      }
    } catch (error) {
      console.error("Erreur lors de la soumission du commentaire :", error);
      setErrMsg(
        error.response?.data?.message ||
          "Échec de la soumission du commentaire."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full border-b border-[#66666645]"
    >
      <div className="w-full flex items-center gap-2 py-4">
        <img
          src={user?.profileUrl ?? NoProfile}
          alt="User Image"
          className="w-10 h-10 rounded-full object-cover"
        />

        <TextInput
          name="comment"
          styles="w-full rounded-full py-3"
          placeholder="Comment this post"
          register={register("comment", {
            required: "Le commentaire ne peut pas être vide",
          })}
          error={errors.comment ? errors.comment.message : ""}
        />
      </div>
      {errMsg && (
        <span
          role="alert"
          className={`text-sm ${
            errMsg.includes("Échec") ? "text-[#f64949fe]" : "text-[#2ba150fe]"
          } mt-0.5`}
        >
          {errMsg}
        </span>
      )}

      <div className="flex items-end justify-end pb-2">
        {loading ? (
          <Loading />
        ) : (
          <CustomButton
            title="Submit"
            type="submit"
            containerStyles="bg-[#0444a4] text-white py-1 px-3 rounded-full font-semibold text-sm"
          />
        )}
      </div>
    </form>
  );
};

const PostCard = ({ post, user, deletePost, likePost }) => {
  const [showAll, setShowAll] = useState(false);
  const [showReply, setShowReply] = useState(null);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    if (showComments) {
      getComments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showComments]);

  const getComments = async () => {
    try {
      setLoadingComments(true);
      const response = await makeRequest.get(`/posts/comments/${post._id}`);

      if (response.data.success) {
        setComments(response.data.data);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des commentaires :", error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleLikePost = async () => {
    try {
      await likePost(post._id);
      // Optionnel : Rafraîchir l'état du post si nécessaire
    } catch (error) {
      console.error("Erreur lors du like du post :", error);
    }
  };

  const handleLikeComment = async (commentId, replyId = null) => {
    try {
      const endpoint = replyId
        ? `/posts/like-comment/${commentId}/${replyId}`
        : `/posts/like-comment/${commentId}`;

      await makeRequest.post(endpoint);
      // Rafraîchir les commentaires après un like
      getComments();
    } catch (error) {
      console.error("Erreur lors du like du commentaire :", error);
    }
  };

  const handleDeletePost = () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce post ?")) {
      deletePost(post._id);
    }
  };

  return (
    <div className="mb-2 bg-primary p-4 rounded-xl">
      {/* Header du Post */}
      <div className="flex gap-3 items-center mb-2">
        <Link to={`/profile/${post?.userId?._id}`}>
          <img
            src={post?.userId?.profileUrl ?? NoProfile}
            alt={post?.userId?.firstName}
            className="w-14 h-14 object-cover rounded-full"
          />
        </Link>

        <div className="w-full flex justify-between">
          <div>
            <Link to={`/profile/${post?.userId?._id}`}>
              <p className="font-medium text-lg text-ascent-1">
                {post?.userId?.firstName} {post?.userId?.lastName}
              </p>
            </Link>
            <span className="text-ascent-2">{post?.userId?.location}</span>
          </div>

          <span className="text-ascent-2">
            {moment(post?.createdAt).fromNow()}
          </span>
        </div>
      </div>

      {/* Contenu du Post */}
      <div>
        <p className="text-ascent-2">
          {showAll ? post?.description : post?.description.slice(0, 300)}

          {post?.description?.length > 300 && (
            <span
              className="text-blue ml-2 font-medium cursor-pointer"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? "Show Less" : "Show More"}
            </span>
          )}
        </p>

        {post?.media &&
          (post?.mediaType === "image" ? (
            <img
              src={post?.media}
              alt="post media"
              className="w-full h-[300px] object-cover mt-2 rounded-lg"
            />
          ) : (
            <video
              src={post?.media}
              className="w-full h-[300px] object-cover mt-2 rounded-lg"
              autoPlay
              loop
              muted
            />
          ))}
      </div>

      {/* Actions du Post */}
      <div
        className="mt-4 flex justify-between items-center px-3 py-2 text-ascent-2
        text-base border-t border-[#66666645]"
      >
        <p
          className="flex gap-2 items-center text-base cursor-pointer"
          onClick={handleLikePost}
        >
          {post?.likes?.includes(user?._id) ? (
            <BiSolidLike size={20} color="blue" />
          ) : (
            <BiLike size={20} />
          )}
          {post?.likes?.length} Likes
        </p>

        <p
          className="flex gap-2 items-center text-base cursor-pointer"
          onClick={() => setShowComments(!showComments)}
        >
          <BiComment size={20} />
          {post?.comments?.length} Comments
        </p>

        {user?._id === post?.userId?._id && (
          <div
            className="flex gap-1 items-center text-base text-ascent-1 cursor-pointer"
            onClick={handleDeletePost}
          >
            <MdOutlineDeleteOutline size={20} />
            <span>Delete</span>
          </div>
        )}
      </div>

      {/* Section des Commentaires */}
      {showComments && (
        <div className="w-full mt-4 border-t border-[#66666645] pt-4 ">
          {/* Formulaire pour Ajouter un Commentaire */}
          <CommentForm
            user={user}
            postId={post._id}
            refreshComments={getComments}
          />

          {/* Liste des Commentaires */}
          {loadingComments ? (
            <Loading />
          ) : comments?.length > 0 ? (
            comments.map((comment) => (
              <div className="w-full py-2" key={comment._id}>
                <div className="flex gap-3 items-center mb-1">
                  <Link to={`/profile/${comment?.userId?._id}`}>
                    <img
                      src={comment?.userId?.profileUrl ?? NoProfile}
                      alt={comment?.userId?.firstName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </Link>
                  <div>
                    <Link to={`/profile/${comment?.userId?._id}`}>
                      <p className="font-medium text-base text-ascent-1">
                        {comment?.userId?.firstName} {comment?.userId?.lastName}
                      </p>
                    </Link>
                    <span className="text-ascent-2 text-sm">
                      {moment(comment?.createdAt).fromNow()}
                    </span>
                  </div>
                </div>

                <div className="ml-12">
                  <p className="text-ascent-2">{comment?.comment}</p>

                  <div className="mt-2 flex gap-6">
                    <p
                      className="flex gap-2 items-center text-base text-ascent-2 cursor-pointer"
                      onClick={() => handleLikeComment(comment._id)}
                    >
                      {comment?.likes?.includes(user?._id) ? (
                        <BiSolidLike size={20} color="blue" />
                      ) : (
                        <BiLike size={20} />
                      )}
                      {comment?.likes?.length} Likes
                    </p>
                    <span
                      className="text-blue cursor-pointer"
                      onClick={() =>
                        setShowReply(
                          showReply === comment._id ? null : comment._id
                        )
                      }
                    >
                      Reply
                    </span>
                  </div>

                  {/* Formulaire pour Ajouter une Réponse */}
                  {showReply === comment._id && (
                    <CommentForm
                      user={user}
                      postId={post._id}
                      parentId={comment._id}
                      refreshComments={getComments}
                    />
                  )}
                </div>

                {/* Liste des Réponses */}
                {comment?.replies?.length > 0 && (
                  <div className="py-2 px-8 mt-6">
                    <p
                      className="text-base text-ascent-1 cursor-pointer"
                      onClick={() =>
                        setShowReply(
                          showReply === comment._id ? null : comment._id
                        )
                      }
                    >
                      Show Replies ({comment?.replies?.length})
                    </p>

                    {showReply === comment._id &&
                      comment?.replies?.map((reply) => (
                        <ReplyCard
                          reply={reply}
                          user={user}
                          key={reply._id}
                          handleLike={() =>
                            handleLikeComment(comment._id, reply._id)
                          }
                        />
                      ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <span className="flex text-sm py-4 text-ascent-2 text-center">
              No Comments, be the first to comment
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default PostCard;
