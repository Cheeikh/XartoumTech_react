# Utiliser une image de base Node.js
FROM node:18-alpine as build

# Créer et définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package.json et package-lock.json dans le répertoire de travail
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers de l'application
COPY . .

# Construire l'application React
RUN npm run build

# Utiliser une image de base nginx pour servir l'application
FROM nginx:alpine

# Copier les fichiers de build dans le répertoire de nginx
COPY --from=build /app/build /usr/share/nginx/html

# Exposer le port 3000
EXPOSE 3000

# Démarrer nginx
CMD ["nginx", "-g", "daemon off;"]
