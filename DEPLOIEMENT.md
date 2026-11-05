# Déployer la démo publique d'EVIMERIA (gratuit)

| Rôle | Service | Ce qu'il héberge |
|---|---|---|
| Base de données | **Neon** (PostgreSQL) | catalogue de démonstration |
| API Django | **Render** (Web Service gratuit) | `backend/`, décrit par `render.yaml` |
| Boutique React | **Vercel** | `frontend/` ; `/api/*` est relayé vers Render |

> Render met le service en veille après 15 min sans visite : la première requête suivante
> prend ~30 s.

## 1. Base Neon
https://neon.tech → *New project* `evimeria-demo` (région Europe) → copier la *connection string*.

## 2. API sur Render
1. https://render.com → *New* → *Blueprint* → ce dépôt (Render lit `render.yaml`).
2. `DATABASE_URL` = la chaîne Neon. `SECRET_KEY` est générée par Render : le serveur
   **refuse de démarrer** avec la clé de développement du dépôt.
3. Au démarrage : `migrate`, puis `seed_demo` (3 catégories, 17 sous-catégories, 51 produits —
   seulement si la base est vide), puis `gunicorn`.
4. Vérifier `https://evimeria-api.onrender.com/api/categories/`.

## 3. Boutique sur Vercel
1. https://vercel.com → *Add New* → *Project* → ce dépôt, **Root Directory : `frontend`**.
2. `frontend/vercel.json` relaie `/api/*` vers `https://evimeria-api.onrender.com`. Si Render
   a donné un autre nom au service, corriger cette adresse dans `vercel.json`.
   Pas de CORS à régler : pour le navigateur, l'API est sur le même domaine.

## Cloudinary
Facultatif : il ne sert qu'à **téléverser** des images depuis l'admin (le catalogue stocke des
URL). Pour l'activer, ajouter sur Render `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` et
`CLOUDINARY_API_SECRET` — jamais dans le code.
