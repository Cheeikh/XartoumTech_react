import Conversation from '../models/conversationModel.js';
import Message from '../models/messageModel.js';
import User from '../models/userModel.js';

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