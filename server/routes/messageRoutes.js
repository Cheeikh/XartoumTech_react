import express from 'express';
import { getConversations, getMessages, sendMessage, createConversation, sendAudioMessage, sendFileMessage } from '../controllers/messageController.js';
import userAuth from "../middleware/authMiddleware.js";
import upload from '../middleware/upload.js';

const router = express.Router();

router.get('/conversations', userAuth, getConversations);
router.get('/messages/:conversationId', userAuth, getMessages);
router.post('/messages', userAuth, sendMessage);
router.post('/conversations', userAuth, createConversation);
router.post('/audio', userAuth, upload.single('audio'), sendAudioMessage);
router.post('/file', userAuth, upload.single('file'), sendFileMessage);

export default router;
