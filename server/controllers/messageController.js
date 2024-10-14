// Importation des modèles nécessaires pour les conversations, messages, utilisateurs
import Conversation from '../models/conversationModel.js';
import Message from '../models/messageModel.js';
import User from '../models/userModel.js';
// Importation de la configuration Cloudinary pour gérer les fichiers média (audio, images, etc.)
import cloudinary from '../utils/cloudinaryConfig.js';

// Fonction pour récupérer toutes les conversations où l'utilisateur connecté est un participant
export const getConversations = async (req, res) => {
  try {
    // Recherche des conversations où l'utilisateur est un participant
    const conversations = await Conversation.find({
      participants: { $in: [req.user._id] }
    }).populate('participants', 'firstName lastName profileUrl'); // Remplissage des détails des participants (nom, URL de profil)

    // Réponse avec succès contenant les conversations trouvées
    res.status(200).json(conversations);
  } catch (error) {
    // Réponse d'erreur si la récupération échoue
    res.status(500).json({ message: "Erreur lors de la récupération des conversations" });
  }
};

// Fonction pour récupérer les messages d'une conversation spécifique
export const getMessages = async (req, res) => {
  try {
    // Recherche des messages liés à une conversation spécifique
    const messages = await Message.find({
      conversation: req.params.conversationId
    }).populate('sender', 'firstName lastName profileUrl'); // Remplissage des détails de l'expéditeur du message

    // Réponse avec succès contenant les messages trouvés
    res.status(200).json(messages);
  } catch (error) {
    // Réponse d'erreur si la récupération échoue
    res.status(500).json({ message: "Erreur lors de la récupération des messages" });
  }
};

// Fonction pour envoyer un nouveau message dans une conversation
export const sendMessage = async (req, res) => {
  const { conversationId, content } = req.body; // Extraction de l'ID de la conversation et du contenu du message

  try {
    // Création d'un nouvel objet Message
    const newMessage = new Message({
      conversation: conversationId, // Référence à la conversation en cours
      sender: req.user._id,         // L'expéditeur est l'utilisateur connecté
      content                       // Le contenu du message
    });

    // Sauvegarde du nouveau message dans la base de données
    await newMessage.save();

    // Recherche du message avec les détails de l'expéditeur peuplés
    const populatedMessage = await Message.findById(newMessage._id)
      .populate('sender', 'firstName lastName profileUrl');

    // Réponse avec succès contenant le message créé
    res.status(201).json(populatedMessage);
  } catch (error) {
    // Réponse d'erreur si l'envoi échoue
    res.status(500).json({ message: "Erreur lors de l'envoi du message" });
  }
};

// Fonction pour créer une nouvelle conversation entre l'utilisateur et un autre participant
export const createConversation = async (req, res) => {
  const { participantId } = req.body; // Extraction de l'ID du participant

  try {
    // Vérification si une conversation existe déjà entre les deux utilisateurs
    const existingConversation = await Conversation.findOne({
      participants: { $all: [req.user._id, participantId] }
    });

    if (existingConversation) {
      // Si la conversation existe déjà, la renvoyer
      return res.status(200).json(existingConversation);
    }

    // Création d'une nouvelle conversation si elle n'existe pas
    const newConversation = new Conversation({
      participants: [req.user._id, participantId] // Les participants sont l'utilisateur connecté et le participant
    });

    // Sauvegarde de la nouvelle conversation
    await newConversation.save();

    // Recherche de la conversation avec les détails des participants peuplés
    const populatedConversation = await Conversation.findById(newConversation._id)
      .populate('participants', 'firstName lastName profileUrl');

    // Réponse avec succès contenant la conversation créée
    res.status(201).json(populatedConversation);
  } catch (error) {
    // Réponse d'erreur si la création échoue
    res.status(500).json({ message: "Erreur lors de la création de la conversation" });
  }
};

// Fonction pour envoyer un message audio
export const sendAudioMessage = async (req, res) => {
  const { conversationId } = req.body; // Extraction de l'ID de la conversation
  const audioFile = req.file;          // Le fichier audio est récupéré depuis la requête

  // Vérification si un fichier audio a été fourni
  if (!audioFile) {
    return res.status(400).json({ message: "Aucun fichier audio n'a été fourni" });
  }

  try {
    // Téléchargement du fichier audio sur Cloudinary
    const result = await cloudinary.uploader.upload(audioFile.path, {
      resource_type: "auto", // Le type de fichier est automatiquement détecté
      folder: "chat_audio"   // Le fichier est sauvegardé dans le dossier "chat_audio"
    });

    // Création d'un nouvel objet Message avec l'URL du fichier audio
    const newMessage = new Message({
      conversation: conversationId,
      sender: req.user._id,
      content: result.secure_url, // L'URL sécurisée du fichier audio
      messageType: 'audio'        // Indique que le type de message est "audio"
    });

    // Sauvegarde du message audio dans la base de données
    await newMessage.save();

    // Recherche du message avec les détails de l'expéditeur peuplés
    const populatedMessage = await Message.findById(newMessage._id)
      .populate('sender', 'firstName lastName profileUrl');

    // Réponse avec succès contenant le message audio créé
    res.status(201).json(populatedMessage);
  } catch (error) {
    // Réponse d'erreur si l'envoi échoue
    console.error("Erreur lors de l'envoi du message audio:", error);
    res.status(500).json({ message: "Erreur lors de l'envoi du message audio" });
  }
};

// Fonction pour envoyer un message avec un fichier
export const sendFileMessage = async (req, res) => {
  const { conversationId } = req.body; // Extraction de l'ID de la conversation
  const file = req.file;               // Le fichier est récupéré depuis la requête

  // Vérification si un fichier a été fourni
  if (!file) {
    return res.status(400).json({ message: "Aucun fichier n'a été fourni" });
  }

  try {
    // Téléchargement du fichier sur Cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: "auto", // Le type de fichier est automatiquement détecté
      folder: "chat_files"   // Le fichier est sauvegardé dans le dossier "chat_files"
    });

    // Création d'un nouvel objet Message avec l'URL du fichier
    const newMessage = new Message({
      conversation: conversationId,
      sender: req.user._id,
      content: result.secure_url, // L'URL sécurisée du fichier
      messageType: 'file'         // Indique que le type de message est "fichier"
    });

    // Sauvegarde du message fichier dans la base de données
    await newMessage.save();

    // Recherche du message avec les détails de l'expéditeur peuplés
    const populatedMessage = await Message.findById(newMessage._id)
      .populate('sender', 'firstName lastName profileUrl');

    // Réponse avec succès contenant le message fichier créé
    res.status(201).json(populatedMessage);
  } catch (error) {
    // Réponse d'erreur si l'envoi échoue
    res.status(500).json({ message: "Erreur lors de l'envoi du fichier" });
  }
};
