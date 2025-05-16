# Guide de déploiement sur Railway

Ce guide explique comment déployer l'application EVIMERIA sur Railway.

## Prérequis

- Un compte [Railway](https://railway.app/)
- Git installé sur votre machine
- Le code source de l'application EVIMERIA (backend Django + frontend React)

## 1. Déploiement du Backend

### Étape 1: Création d'un nouveau projet sur Railway

1. Connectez-vous à votre compte Railway
2. Créez un nouveau projet
3. Choisissez "Deploy from GitHub repo"
4. Sélectionnez le dépôt GitHub de l'application EVIMERIA

### Étape 2: Ajout d'une base de données PostgreSQL

1. Dans votre projet Railway, cliquez sur "New"
2. Sélectionnez "Database" puis "PostgreSQL"
3. Railway créera automatiquement une base de données PostgreSQL
4. La variable `DATABASE_URL` sera automatiquement ajoutée à votre projet

### Étape 3: Configuration des variables d'environnement

Dans l'onglet "Variables" de votre service de backend, ajoutez les variables suivantes:

```
DEBUG=False
DJANGO_ALLOWED_HOSTS=*.up.railway.app,localhost,127.0.0.1,0.0.0.0,evimeria-production.up.railway.app
RAILWAY_DEPLOYMENT=True
SECRET_KEY=votre_clé_secrète_très_sécurisée
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret
```

Railway ajoutera automatiquement:
- `PORT`: Port sur lequel l'application doit écouter
- `DATABASE_URL`: URL de connexion à la base de données PostgreSQL

### Étape 4: Vérification du déploiement

1. Attendez que le déploiement soit terminé
2. Accédez à l'URL de votre application backend (générée par Railway)
3. Vérifiez que vous recevez une réponse JSON à l'URL racine
4. Vérifiez le point de terminaison `/health/` pour confirmer que l'application fonctionne correctement

## 2. Déploiement du Frontend

### Étape 1: Création d'un nouveau service dans votre projet Railway

1. Dans votre projet Railway, cliquez sur "New"
2. Sélectionnez "GitHub Repo"
3. Sélectionnez le même dépôt GitHub mais spécifiez le dossier `frontend` comme source

### Étape 2: Configuration des variables d'environnement

Dans l'onglet "Variables" de votre service de frontend, ajoutez les variables suivantes:

```
BACKEND_URL=https://url-de-votre-backend.up.railway.app
VITE_API_URL=https://url-de-votre-backend.up.railway.app
```

Remplacez `https://url-de-votre-backend.up.railway.app` par l'URL réelle de votre backend déployé.

### Étape 3: Vérification du déploiement

1. Attendez que le déploiement soit terminé
2. Accédez à l'URL de votre application frontend (générée par Railway)
3. Vérifiez que vous pouvez accéder à l'interface utilisateur
4. Vérifiez que le frontend peut communiquer avec le backend

## 3. Configuration des domaines personnalisés (optionnel)

Si vous souhaitez utiliser des domaines personnalisés:

1. Dans Railway, ouvrez le service que vous souhaitez exposer
2. Allez dans l'onglet "Settings"
3. Faites défiler jusqu'à "Domains"
4. Cliquez sur "Generate Domain" pour obtenir un domaine railway.app ou "Custom Domain" pour utiliser votre propre domaine

## Dépannage

### Problèmes de base de données
- Vérifiez les logs pour les erreurs de migration
- Vérifiez que la base de données est accessible depuis votre application

### Problèmes de CORS
- Vérifiez que les en-têtes CORS sont correctement configurés dans le backend
- Assurez-vous que l'URL du backend est correctement configurée dans le frontend

### Problèmes de déploiement
- Consultez les logs de build et de déploiement pour identifier les erreurs
- Vérifiez que toutes les variables d'environnement nécessaires sont configurées

Pour plus d'informations, consultez la [documentation Railway](https://docs.railway.app/). 