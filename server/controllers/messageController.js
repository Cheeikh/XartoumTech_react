import Conversation from '../models/conversationModel.js';
import Message from '../models/messageModel.js';
import User from '../models/userModel.js';
import cloudinary from '../utils/cloudinaryConfig.js';

export const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: { $in: [req.user._id] }
    }).populate('participants', 'firstName lastName profileUrl');

    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des conversations" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      conversation: req.params.conversationId
    }).populate('sender', 'firstName lastName profileUrl');

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des messages" });
  }
};

export const sendMessage = async (req, res) => {
  const { conversationId, content } = req.body;

  try {
    const newMessage = new Message({
      conversation: conversationId,
      sender: req.user._id,
      content
    });

    await newMessage.save();

    const populatedMessage = await Message.findById(newMessage._id)
      .populate('sender', 'firstName lastName profileUrl');

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'envoi du message" });
  }
};

export const createConversation = async (req, res) => {
  const { participantId } = req.body;

  try {
    const existingConversation = await Conversation.findOne({
      participants: { $all: [req.user._id, participantId] }
    });

    if (existingConversation) {
      return res.status(200).json(existingConversation);
    }

    const newConversation = new Conversation({
      participants: [req.user._id, participantId]
    });

    await newConversation.save();

    const populatedConversation = await Conversation.findById(newConversation._id)
      .populate('participants', 'firstName lastName profileUrl');

    res.status(201).json(populatedConversation);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création de la conversation" });
  }
};

export const sendAudioMessage = async (req, res) => {
  const { conversationId } = req.body;
  const audioFile = req.file;

  console.log('req.body:', req.body);
  console.log('req.file:', req.file);
  console.log('Content-Type:', req.headers['content-type']);


  if (!audioFile) {
    return res.status(400).json({ message: "Aucun fichier audio n'a été fourni" });
  }

  try {
    // Assurez-vous que cette fonction est correctement importée et configurée
    const result = await cloudinary.uploader.upload(audioFile.path, {
      resource_type: "auto",
      folder: "chat_audio"
    });

    const newMessage = new Message({
      conversation: conversationId,
      sender: req.user._id,
      content: result.secure_url,
      messageType: 'audio'
    });

    await newMessage.save();

    const populatedMessage = await Message.findById(newMessage._id)
      .populate('sender', 'firstName lastName profileUrl');

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error("Erreur lors de l'envoi du message audio:", error);
    res.status(500).json({ message: "Erreur lors de l'envoi du message audio" });
  }
};

export const sendFileMessage = async (req, res) => {
  const { conversationId } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: "Aucun fichier n'a été fourni" });
  }

  try {
    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: "auto",
      folder: "chat_files"
    });

    const newMessage = new Message({
      conversation: conversationId,
      sender: req.user._id,
      content: result.secure_url,
      messageType: 'file'
    });

    await newMessage.save();

    const populatedMessage = await Message.findById(newMessage._id)
      .populate('sender', 'firstName lastName profileUrl');

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'envoi du fichier" });
  }
};
