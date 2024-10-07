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
} from "../controllers/postController.js";
import upload from "../middleware/upload.js"; // Middleware pour Multer
import verifyToken from "../middleware/authMiddleware.js"; // Middleware d'authentification

const router = express.Router();

// Protégez la route get-posts avec verifyToken
router.get("/get-posts", verifyToken, getPosts);

// Routes pour les commentaires
router.get("/comments/:postId", verifyToken, getComments);
router.post("/comment/:postId", verifyToken, commentPost);
router.post("/reply/:commentId", verifyToken, replyPostComment);

// Routes pour les likes
router.post("/like/:id", verifyToken, likePost);
router.post("/like-comment/:id/:rid?", verifyToken, likePostComment);

// Routes pour les posts
router.post("/create-post", verifyToken, upload.single("media"), createPost);
router.post("/", verifyToken, getPosts);
router.get("/:id", verifyToken, getPost);
router.get("/user/:id", verifyToken, getUserPost);
router.delete("/:id", verifyToken, deletePost);

export default router;