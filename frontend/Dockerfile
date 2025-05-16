FROM node:18-alpine as build

WORKDIR /app

# Copier package.json avant le reste pour optimiser le cache
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Copier le reste des fichiers
COPY . .

# Construire l'application
RUN npm run build

# Étape de production avec Nginx
FROM nginx:alpine

# Copier la configuration Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copier les fichiers de build depuis l'étape précédente
COPY --from=build /app/dist /usr/share/nginx/html

# Script pour remplacer les variables d'environnement
RUN echo 'sed -i "s|__BACKEND_URL__|$BACKEND_URL|g" /etc/nginx/conf.d/default.conf && nginx -g "daemon off;"' > /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh

# Exposer le port
EXPOSE 80

# Démarrer Nginx
CMD ["/docker-entrypoint.sh"]