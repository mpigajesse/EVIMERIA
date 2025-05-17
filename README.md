# EVIMERIA (anciennement JaelleShop)

Boutique e-commerce moderne créée avec Django, React et Cloudinary.

## Prérequis

- Docker et Docker Compose pour le développement local
- Un compte Railway pour le déploiement
- Un compte Cloudinary pour la gestion des médias

## Structure du Projet

```
evimeria/
├── backend/            # API Django
│   ├── Dockerfile      # Dockerfile du backend (dev local)
│   ├── Procfile        # Configuration démarrage Railway
│   ├── jaelleshop/     # Configurations du projet
│   ├── products/       # App pour les produits
│   ├── users/          # App pour les utilisateurs
│   └── ...
├── frontend/           # Application React
│   ├── Dockerfile      # Dockerfile du frontend (dev local)
│   ├── nginx.conf      # Configuration Nginx (dev local)
│   └── ...
├── docker-compose.yml  # Configuration Docker Compose (dev local)
├── railway.toml        # Configuration Railway
├── .github/workflows/  # Configuration CI/CD GitHub Actions
└── ...
```

## Déploiement sur Railway

### 1. Préparation du code

Assurez-vous que votre dépôt contient tous les fichiers suivants:
- `backend/Procfile`
- `railway.toml`
- `.github/workflows/railway-deploy.yml`

### 2. Configuration des secrets GitHub

Allez dans les paramètres de votre dépôt GitHub et ajoutez le secret suivant:

```
RAILWAY_TOKEN=votre_token_railway
```

Vous pouvez obtenir un token Railway en exécutant `railway login` localement ou en allant dans les paramètres de votre compte Railway.

### 3. Configuration des variables d'environnement

Dans Railway, configurez les variables d'environnement suivantes:

```
# Configuration Django
DEBUG=False
SECRET_KEY=votre_secret_key
ALLOWED_HOSTS=*.up.railway.app,localhost,127.0.0.1

# Cloudinary
CLOUDINARY_CLOUD_NAME=dmcaguchx
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret

# Configuration de l'application
PORT=8000
PYTHONUNBUFFERED=1
NODE_ENV=production
```

### 4. Déploiement automatique avec GitHub Actions

1. Poussez votre code sur la branche main de votre dépôt GitHub
2. GitHub Actions va automatiquement déployer l'application sur Railway

3. Vous pouvez également déclencher manuellement le déploiement depuis l'onglet "Actions" de votre dépôt GitHub.

### 5. Déploiement manuel sur Railway

Si vous préférez déployer manuellement:

1. Installez la CLI Railway : `npm i -g @railway/cli`
2. Connectez-vous : `railway login`
3. Liez votre projet : `railway link`
4. Déployez : `railway up`

## Développement local avec Docker

```bash
# Créer un fichier .env à partir de .env.example
cp .env.example .env
# Modifier le fichier .env avec vos propres valeurs

# Démarrer l'application en mode développement
docker-compose up

# Reconstruire l'application après des modifications
docker-compose up --build

# Exécuter des commandes dans le conteneur backend
docker-compose exec backend python manage.py createsuperuser
```

## Maintenance

### Migration de la base de données

```bash
docker-compose exec backend python manage.py makemigrations
docker-compose exec backend python manage.py migrate
```

### Création d'un utilisateur admin

```bash
docker-compose exec backend python manage.py createsuperuser
```

### Sauvegarde et restauration de la base de données

```bash
# Sauvegarde
docker-compose exec db pg_dump -U postgres railway > backup.sql

# Restauration
cat backup.sql | docker-compose exec -T db psql -U postgres railway
``` 

## Configuration des variables d'environnement pour l'application

Pour que l'application fonctionne correctement, vous devez configurer les variables d'environnement suivantes dans Railway:

1. **Pour le backend (Django)**:
   - SECRET_KEY: Clé secrète Django pour la sécurité
   - DEBUG: Toujours "False" en production
   - CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET: Identifiants Cloudinary

2. **Base de données**:
   Railway configure automatiquement les variables suivantes pour PostgreSQL:
   - DATABASE_URL
   - PGDATABASE
   - PGHOST
   - PGPASSWORD
   - PGPORT
   - PGUSER 