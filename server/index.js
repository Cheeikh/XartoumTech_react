// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import path from "path";
import helmet from "helmet";
import dbConnection from "./dbConfig/index.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import router from "./routes/index.js";
import http from "http"; // Import http
import { Server } from "socket.io"; // Import socket.io
import messageRoutes from './routes/messageRoutes.js';

const __dirname = path.resolve(path.dirname(""));

dotenv.config();

const app = express();
const server = http.createServer(app); // Créer un serveur HTTP à partir de l'application Express
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Remplacez par l'origine de votre frontend
    methods: ["GET", "POST"],
  },
});

export { io };

// Servir les fichiers statiques de la build React
app.use(express.static(path.join(__dirname, "views/build")));

const PORT = process.env.PORT || 8800;

dbConnection();

app.use(helmet());

// Configuration CORS avec des options spécifiques
const corsOptions = {
  origin: "http://localhost:3000", // Remplacez par l'origine de votre frontend
  credentials: true, // Autoriser les credentials (cookies, headers d'authentification, etc.)
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Méthodes HTTP autorisées
  allowedHeaders: "Content-Type, Authorization", // En-têtes autorisés
};

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));
app.use(router);
app.use('/messages', messageRoutes);

// Configurer les événements de socket.io
io.on("connection", (socket) => {
  console.log("Nouvelle connexion : ", socket.id);

  // Gérer l'envoi de notifications
  socket.on("send_notification", (notification) => {
    // Émettre la notification à tous les clients connectés
    io.emit("new_notification", notification);
  });

  // Gérer la déconnexion
  socket.on("disconnect", () => {
    console.log("Utilisateur déconnecté : ", socket.id);
  });
});

// Error middleware
app.use(errorMiddleware);

server.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
