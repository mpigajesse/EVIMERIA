FROM node:18-alpine as build

WORKDIR /app

# Variables d'environnement pour la construction
ARG VITE_API_URL=http://localhost:8000
ENV VITE_API_URL=${VITE_API_URL}

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances avec une limite de mémoire
ENV NODE_OPTIONS=--max_old_space_size=465
RUN npm install --omit=dev

# Copier le code source
COPY . .

# Construire l'application avec les variables d'environnement
RUN npm run build

# Étape de production avec Nginx
FROM nginx:alpine

# Copier le build dans Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Configuration de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Script pour remplacer les variables d'environnement dans la configuration
RUN echo '#!/bin/sh\n\
# Remplacer les variables d\environnement dans la configuration Nginx\n\
envsubst < /etc/nginx/conf.d/default.conf > /etc/nginx/conf.d/default.conf.tmp\n\
mv /etc/nginx/conf.d/default.conf.tmp /etc/nginx/conf.d/default.conf\n\
\n\
# Remplacer les variables d\environnement dans les fichiers JS si nécessaire\n\
find /usr/share/nginx/html -type f -name "*.js" -exec sed -i "s|BACKEND_URL_PLACEHOLDER|${BACKEND_URL:-https://evimeria-production.up.railway.app}|g" {} \;\n\
\n\
# Démarrer Nginx\n\
nginx -g "daemon off;"' > /docker-entrypoint.sh

RUN chmod +x /docker-entrypoint.sh

# Exposer le port
EXPOSE 80

# Démarrer avec notre script personnalisé
CMD ["/docker-entrypoint.sh"]