FROM python:3.11-slim as backend

WORKDIR /app

# Installer les dépendances Python
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copier le code source du backend
COPY backend/ .

# Configurer les variables d'environnement
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV DEBUG=False

# Stage pour le frontend
FROM node:18-alpine as frontend_build

WORKDIR /frontend

# Installer les dépendances du frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

# Copier le code source du frontend
COPY frontend/ .

# Construire l'application React
RUN npm run build

# Stage final
FROM python:3.11-slim

WORKDIR /app

# Copier les fichiers du backend
COPY --from=backend /app /app
COPY --from=backend /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages

# Copier le build du frontend
COPY --from=frontend_build /frontend/dist /app/frontend/dist

# Exposer le port
EXPOSE 8000

# Commande de démarrage
CMD ["sh", "-c", "python manage.py migrate && python manage.py collectstatic --noinput && gunicorn jaelleshop.wsgi:application --bind 0.0.0.0:8000"] 