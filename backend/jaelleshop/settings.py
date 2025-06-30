import os
from pathlib import Path
import cloudinary
import cloudinary.uploader
import cloudinary.api
from datetime import timedelta
from dotenv import load_dotenv
import dj_database_url

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Charger les variables d'environnement
# Chercher le fichier .env dans le répertoire parent (racine du projet)
env_path = os.path.join(BASE_DIR.parent, '.env')
load_dotenv(env_path)

# Chemin vers le dossier du frontend
# En développement local
FRONTEND_DIR = os.path.abspath(os.path.join(BASE_DIR, '..', 'frontend'))

# En production Railway, ajuster le chemin
if os.path.exists('/app/frontend/dist'):
    # Production Railway
    FRONTEND_DIR = '/app/frontend'
elif os.path.exists(os.path.join(BASE_DIR, '..', 'frontend', 'dist')):
    # Développement local
    FRONTEND_DIR = os.path.abspath(os.path.join(BASE_DIR, '..', 'frontend'))
else:
    # Fallback
    FRONTEND_DIR = os.path.abspath(os.path.join(BASE_DIR, 'frontend'))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get('SECRET_KEY', 'django-insecure-evimeria-secret-key-for-development-2024')

# Ensure SECRET_KEY is not empty
if not SECRET_KEY:
    SECRET_KEY = 'django-insecure-evimeria-secret-key-for-development-2024'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.environ.get('DEBUG', 'False').lower() == 'true'

# Hosts autorisés pour la production Railway
ALLOWED_HOSTS = [
    'localhost',
    '127.0.0.1',
    '*.up.railway.app',
    '*.railway.app',
    'evimeria-production.up.railway.app',  # Remplacez par votre domaine Railway
]

# Si on a une variable RAILWAY_STATIC_URL, ajouter le domaine
railway_url = os.environ.get('RAILWAY_STATIC_URL')
if railway_url:
    # Extraire le domaine de l'URL Railway
    from urllib.parse import urlparse
    # S'assurer que l'URL a un schéma pour le parsing
    if not railway_url.startswith(('http://', 'https://')):
        railway_url = f'https://{railway_url}'
    
    parsed = urlparse(railway_url)
    if parsed.hostname:
        ALLOWED_HOSTS.append(parsed.hostname)

# En développement, autoriser tous les hosts
if DEBUG:
    ALLOWED_HOSTS = ['*']


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third-party apps
    'rest_framework',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',
    'corsheaders',
    'cloudinary',
    'cloudinary_storage',
    
    # Custom apps
    'products',
    'users',
    'orders',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',  # CORS middleware
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'jaelleshop.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(FRONTEND_DIR, 'dist')],  # Chemin vers les fichiers du build React
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'jaelleshop.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.2/ref/settings/#databases

# Configuration de la base de données pour Railway
DATABASE_URL = os.environ.get('DATABASE_URL')

if DATABASE_URL:
    # Configuration pour Railway avec DATABASE_URL
    DATABASES = {
        'default': dj_database_url.parse(DATABASE_URL, conn_max_age=600, ssl_require=True)
    }
else:
    # Configuration par défaut pour le développement local
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': os.environ.get('POSTGRES_DB', 'evimeria'),
            'USER': os.environ.get('POSTGRES_USER', 'postgres'),
            'PASSWORD': os.environ.get('POSTGRES_PASSWORD', ''),
            'HOST': os.environ.get('PGHOST', 'db'),
            'PORT': os.environ.get('PGPORT', '5432'),
            'OPTIONS': {
                'sslmode': 'disable' if DEBUG else 'require'
            }
        }
    }

# Password validation
# https://docs.djangoproject.com/en/5.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.2/topics/i18n/

LANGUAGE_CODE = 'fr-fr'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.2/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# Configuration des fichiers statiques pour Railway
STATICFILES_DIRS = []
frontend_dist_path = os.path.join(FRONTEND_DIR, 'dist')
if os.path.exists(frontend_dist_path):
    STATICFILES_DIRS.append(frontend_dist_path)

# Configuration de Whitenoise pour les fichiers statiques (développement et production)
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Assurer que Whitenoise est dans les premiers middlewares
if 'whitenoise.middleware.WhiteNoiseMiddleware' not in MIDDLEWARE:
    # Insérer Whitenoise juste après SecurityMiddleware
    MIDDLEWARE.insert(1, 'whitenoise.middleware.WhiteNoiseMiddleware')

# Configuration supplémentaire de Whitenoise
WHITENOISE_ROOT = frontend_dist_path if os.path.exists(frontend_dist_path) else None
WHITENOISE_MAX_AGE = 31536000  # 1 an en secondes
WHITENOISE_SKIP_COMPRESS_EXTENSIONS = []  # Comprimer tous les types de fichiers

# Cloudinary settings
CLOUDINARY_STORAGE = {
    'CLOUD_NAME': os.environ.get('CLOUDINARY_CLOUD_NAME', 'dmcaguchx'),
    'API_KEY': os.environ.get('CLOUDINARY_API_KEY', '238869761337271'),
    'API_SECRET': os.environ.get('CLOUDINARY_API_SECRET', 'G1AQ85xIMHSFSLgPOXeNsGFnfJA'),
    'MEDIA_TAG': 'jaelleshop',
    'STATIC_TAG': 'static',
    'STATICFILES_MANIFEST_ROOT': os.path.join(BASE_DIR, 'manifest'),
    'FOLDER': 'jaelleshop',  # Utilise la structure existante jaelleshop/categories/
    'AUTO_CREATE_FOLDERS': True,  # Créer automatiquement les dossiers
}

# Configure Cloudinary
cloudinary.config(
    cloud_name=CLOUDINARY_STORAGE['CLOUD_NAME'],
    api_key=CLOUDINARY_STORAGE['API_KEY'],
    api_secret=CLOUDINARY_STORAGE['API_SECRET'],
    secure=True  # Forcer HTTPS
)

# Media files configuration with Cloudinary
DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Default primary key field type
# https://docs.djangoproject.com/en/5.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# REST Framework settings
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.BasicAuthentication',
    ],
}

# JWT Settings
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': False,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': False,

    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'VERIFYING_KEY': None,
    'AUDIENCE': None,
    'ISSUER': None,

    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
    'USER_AUTHENTICATION_RULE': 'rest_framework_simplejwt.authentication.default_user_authentication_rule',

    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',
    'TOKEN_USER_CLASS': 'rest_framework_simplejwt.models.TokenUser',

    'JTI_CLAIM': 'jti',
}

# CORS settings pour la production
if DEBUG:
    # Configuration CORS pour le développement
    CORS_ALLOW_ALL_ORIGINS = True
    CORS_ALLOW_CREDENTIALS = True
    CORS_ALLOWED_ORIGINS = [
        "http://localhost:5173",  # Vite React frontend
        "http://127.0.0.1:5173",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ]
else:
    # Configuration CORS sécurisée pour la production
    CORS_ALLOW_ALL_ORIGINS = False
    CORS_ALLOW_CREDENTIALS = True
    CORS_ALLOWED_ORIGINS = []
    
    # Ajouter automatiquement l'URL Railway si disponible
    railway_url = os.environ.get('RAILWAY_STATIC_URL')
    if railway_url:
        # S'assurer que l'URL a le bon schéma
        if not railway_url.startswith(('http://', 'https://')):
            railway_url = f'https://{railway_url}'
        CORS_ALLOWED_ORIGINS.append(railway_url)
    
    # Ajouter l'URL par défaut si aucune variable n'est définie
    if not CORS_ALLOWED_ORIGINS:
        CORS_ALLOWED_ORIGINS = [
            "https://evimeria-production.up.railway.app",
        ]

# Configuration du modèle utilisateur personnalisé
AUTH_USER_MODEL = 'users.User'

# Configuration de sécurité pour la production
if not DEBUG:
    # Sécurité HTTPS
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    X_FRAME_OPTIONS = 'DENY'
    
    # Cookies sécurisés
    SECURE_HSTS_SECONDS = 31536000  # 1 an
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
