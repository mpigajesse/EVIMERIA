# Guide de déploiement sur Railway

Ce guide explique comment déployer l'application EVIMERIA sur Railway de manière simple et cohérente.

## Prérequis

- Un compte Railway
- Le code source EVIMERIA

## 1. Déploiement de la base de données PostgreSQL

1. Créez un nouveau projet sur Railway
2. Cliquez sur "New"
3. Sélectionnez "Database" → "PostgreSQL"
4. Attendez que la base de données soit créée
5. Notez les variables d'environnement générées (notamment `DATABASE_URL`)

## 2. Déploiement du backend

1. Dans votre projet Railway, cliquez sur "New"
2. Sélectionnez "GitHub Repo"
3. Sélectionnez votre dépôt EVIMERIA
4. Configurez le dossier source: `/backend`
5. Configurez les variables d'environnement:
   - `DATABASE_URL` (copier depuis le service PostgreSQL)
   - `DJANGO_ALLOWED_HOSTS=*.up.railway.app,evimeria-production.up.railway.app`
   - `DEBUG=False`
   - `SECRET_KEY=votre_clé_secrète`
   - `CLOUDINARY_CLOUD_NAME=dmcaguchx`
   - `CLOUDINARY_API_KEY=238869761337271`
   - `CLOUDINARY_API_SECRET=G1AQ85xIMHSFSLgPOXeNsGFnfJA`

6. Cliquez sur "Deploy" pour lancer le déploiement
7. Une fois déployé, notez l'URL générée pour le backend

## 3. Déploiement du frontend

1. Dans votre projet Railway, cliquez sur "New"
2. Sélectionnez "GitHub Repo"
3. Sélectionnez votre dépôt EVIMERIA
4. Configurez le dossier source: `/frontend`
5. Configurez les variables d'environnement:
   - `BACKEND_URL=https://url-de-votre-backend.railway.app` (URL du backend)
   - `VITE_API_URL=https://url-de-votre-backend.railway.app`

6. Cliquez sur "Deploy" pour lancer le déploiement
7. Une fois déployé, générez une URL publique dans les paramètres

## 4. Configuration des domaines (optionnel)

1. Allez dans les paramètres de chaque service
2. Sélectionnez "Custom Domain"
3. Suivez les instructions pour configurer vos domaines personnalisés

## Troubleshooting

- **Problème d'affichage des produits**: Vérifiez la connexion à Cloudinary
- **Erreur de connexion à la base de données**: Vérifiez la variable `DATABASE_URL`
- **Problème de CORS**: Vérifiez que le frontend peut communiquer avec le backend

## Structure de répertoire

```
evimeria/
├── backend/               # Backend Django
│   ├── Dockerfile        # Configuration Docker pour le backend
│   └── railway.json      # Configuration Railway pour le backend
│
└── frontend/              # Frontend React
    ├── Dockerfile        # Configuration Docker pour le frontend
    ├── nginx.conf        # Configuration Nginx
    └── railway.json      # Configuration Railway pour le frontend
``` 