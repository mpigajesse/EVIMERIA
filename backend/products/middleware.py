from django.http import HttpResponseRedirect
from urllib.parse import unquote

class CloudinaryRedirectMiddleware:
    """
    Middleware pour rediriger les URLs Cloudinary qui sont préfixées par /media/http
    vers leur destination réelle.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Vérifie si l'URL est une URL Cloudinary
        path = request.path_info
        
        if path.startswith('/media/http'):
            # Extraire et nettoyer l'URL Cloudinary
            cleaned_url = path.replace('/media/', '')
            cleaned_url = unquote(cleaned_url)
            
            # Corriger le format de l'URL
            if cleaned_url.startswith('http:/'):
                cleaned_url = cleaned_url.replace('http:/', 'https://')
            elif cleaned_url.startswith('res.cloudinary.com'):
                cleaned_url = f'https://{cleaned_url}'
            
            # Rediriger vers l'URL corrigée
            return HttpResponseRedirect(cleaned_url)
        
        response = self.get_response(request)
        return response 