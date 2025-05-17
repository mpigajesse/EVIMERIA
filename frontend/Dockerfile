FROM node:18-alpine as build

WORKDIR /app

# Copier les fichiers de configuration
COPY package*.json ./

# Installer les dépendances
RUN npm ci

# Copier le reste des fichiers du projet
COPY . .

# Construire l'application
RUN npm run build

# Étape de production avec Nginx
FROM nginx:alpine

# Copier la configuration Nginx
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Variables d'environnement
ENV API_URL=http://backend:8000

# Exposer le port
EXPOSE 80

# Commande d'exécution
CMD ["nginx", "-g", "daemon off;"] 