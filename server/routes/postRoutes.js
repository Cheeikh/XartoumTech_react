  // routes/postRoutes.js
  import express from "express";
  import {
  createPost,
  getPosts,
  getPost,
  getUserPost,
  getComments,
  likePost,
  likePostComment,
  commentPost,
  replyPostComment,
  deletePost,
  deleteComment, updateComment,
} from "../controllers/postController.js";
  import upload from "../middleware/upload.js"; // Middleware pour Multer
  import userAuth from "../middleware/authMiddleware.js";

  const router = express.Router();

  // Protégez la route get-posts avec verifyToken
  router.get("/get-posts", userAuth, getPosts);

  // Routes pour les commentaires
  router.get("/comments/:postId", userAuth, getComments);
  router.post("/comment/:postId", userAuth, commentPost);
  router.delete("/:postId/comment/:commentId", userAuth, deleteComment);
  router.put("/:postId/comments/:commentId", userAuth, updateComment);
  router.post("/reply/:commentId", userAuth, replyPostComment);
  // Routes pour les likes
  router.post("/like/:id", userAuth, likePost);
  router.post("/like-comment/:id/:rid?", userAuth, likePostComment);

  // Routes pour les posts
  router.post("/create-post", userAuth, upload.single("media"), createPost);
  router.post("/", userAuth, getPosts);
  router.get("/:id", userAuth, getPost);
  router.get("/user/:id", userAuth, getUserPost);
  router.delete("/:id", userAuth, deletePost);

  export default router;