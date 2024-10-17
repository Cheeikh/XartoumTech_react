// axios.js
import axios from "axios";
import { logout } from "./redux/userSlice";
import { toast } from "react-toastify";
import { store } from "./redux/store";

export const makeRequest = axios.create({
    baseURL: "http://localhost:8800/" // Assurez-vous que c'est l'URL correcte de votre backend
});

export const getToken = () => {
    return localStorage.getItem("token"); // Supposant que le token est stocké sous la clé "token"
};

// Intercepteur pour ajouter le token à chaque requête
makeRequest.interceptors.request.use((config) => {
    const token = getToken(); // Récupérer le token depuis le localStorage
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Intercepteur pour gérer les réponses
makeRequest.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Déconnecter l'utilisateur en cas d'erreur 401 (non autorisé)
            store.dispatch(logout());
            toast.error("Votre session a expiré. Veuillez vous reconnecter.");
        }
        return Promise.reject(error);
    }
);
