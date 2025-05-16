FROM node:18-alpine as build

WORKDIR /app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances avec une limite de mémoire
ENV NODE_OPTIONS=--max_old_space_size=465
RUN npm install --omit=dev

# Copier le code source
COPY . .

# Construire l'application
RUN npm run build

# Étape de production avec Nginx
FROM nginx:alpine

# Copier le build dans Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Configuration de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposer le port
EXPOSE 80

# Démarrer Nginx
CMD ["nginx", "-g", "daemon off;"] 