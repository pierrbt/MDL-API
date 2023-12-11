# Utiliser une version récente de l'image Node
FROM node:20-alpine

# Créer et définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json séparément pour optimiser la mise en cache des dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le fichier .swcrc
COPY .swcrc ./

# Copier les fichiers nécessaires pour la construction (ajouter d'autres lignes si nécessaire)
COPY src/ ./src
COPY static/ ./static
COPY prisma/ ./prisma
COPY static/ ./static

# Exécuter la construction du projet
RUN npx swc ./src -d ./dist

# Générer les fichiers prisma
RUN npx prisma generate

# Supprimer les dépendances inutiles pour la production
RUN npm prune --omit=dev

# Supprimer le dossier src
RUN rm -rf ./src

# Exposer le port sur lequel le serveur écoute
EXPOSE 5444

# Ajouter une commande HEALTHCHECK pour vérifier l'état de l'application
HEALTHCHECK --interval=60s --timeout=3s CMD curl -f http://localhost:5444/index.html || exit 1

# Démarrer l'application
CMD ["node", "dist/index.js"]
