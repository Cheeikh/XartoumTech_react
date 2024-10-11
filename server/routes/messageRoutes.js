import express from 'express';
import { getConversations, getMessages, sendMessage, createConversation } from '../controllers/messageController.js';
import userAuth from "../middleware/authMiddleware.js";

const router = express.Router();

router.get('/conversations', userAuth, getConversations);
router.get('/messages/:conversationId', userAuth, getMessages);
router.post('/messages', userAuth, sendMessage);
router.post('/conversations', userAuth, createConversation);

export default router;