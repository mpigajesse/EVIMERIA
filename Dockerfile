# Stage 1: Build du frontend
FROM node:18-alpine AS frontend_build

WORKDIR /app/frontend

# Copier package.json et package-lock.json
COPY frontend/package*.json ./

# Installer les dépendances avec une limite de mémoire
ENV NODE_OPTIONS=--max_old_space_size=465
RUN npm install --production=false --no-optional

# Copier le code source du frontend
COPY frontend/ ./

# Construire l'application
RUN npm run build

# Stage 2: Backend Django avec les fichiers statiques du frontend
FROM python:3.11-slim

WORKDIR /app

# Installer les dépendances Python
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copier le code source du backend
COPY backend/ .

# Créer les répertoires nécessaires
RUN mkdir -p /app/static /app/media && chmod -R 755 /app/static /app/media

# Copier le build du frontend
COPY --from=frontend_build /app/frontend/dist /app/frontend/dist

# Variables d'environnement
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV DEBUG=False

# Exposer le port
EXPOSE 8000

# Commande de démarrage
CMD ["sh", "-c", "python manage.py migrate && python manage.py collectstatic --noinput && gunicorn jaelleshop.wsgi:application --bind 0.0.0.0:8000"] 