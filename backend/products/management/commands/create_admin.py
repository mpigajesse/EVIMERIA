from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.db import IntegrityError

class Command(BaseCommand):
    help = 'Créer un superuser automatiquement pour EVIMERIA'

    def add_arguments(self, parser):
        parser.add_argument(
            '--username',
            type=str,
            default='admin',
            help='Nom d\'utilisateur (défaut: admin)'
        )
        parser.add_argument(
            '--email',
            type=str,
            default='admin@evimeria.com',
            help='Email (défaut: admin@evimeria.com)'
        )
        parser.add_argument(
            '--password',
            type=str,
            default='admin',
            help='Mot de passe (défaut: admin)'
        )

    def handle(self, *args, **options):
        User = get_user_model()
        
        username = options['username']
        email = options['email']
        password = options['password']
        
        self.stdout.write(
            self.style.WARNING('🔐 Création du Superuser EVIMERIA')
        )
        self.stdout.write('=' * 40)
        
        # Vérifier si l'utilisateur existe déjà
        if User.objects.filter(username=username).exists():
            user = User.objects.get(username=username)
            self.stdout.write(
                self.style.SUCCESS(f'✅ L\'utilisateur \'{username}\' existe déjà')
            )
            self.stdout.write(f'📧 Email: {user.email}')
            self.stdout.write(f'🔑 Superuser: {"Oui" if user.is_superuser else "Non"}')
            
            if not user.is_superuser:
                user.is_superuser = True
                user.is_staff = True
                user.save()
                self.stdout.write(
                    self.style.SUCCESS('✅ Utilisateur promu en superuser')
                )
            return
        
        # Créer le superuser
        try:
            user = User.objects.create_superuser(
                username=username,
                email=email,
                password=password
            )
            
            self.stdout.write(
                self.style.SUCCESS('✅ Superuser créé avec succès !')
            )
            self.stdout.write(f'👤 Nom d\'utilisateur: {username}')
            self.stdout.write(f'📧 Email: {email}')
            self.stdout.write(f'🔑 Mot de passe: {password}')
            self.stdout.write('')
            self.stdout.write(
                self.style.WARNING('⚠️ IMPORTANT: Changez ce mot de passe après connexion !')
            )
            
            # Informations d'accès
            self.stdout.write('')
            self.stdout.write('🌐 Accès Admin:')
            self.stdout.write('URL: https://evimeria-production.up.railway.app/admin/')
            self.stdout.write(f'👤 Utilisateur: {username}')
            self.stdout.write(f'🔑 Mot de passe: {password}')
            
        except IntegrityError as e:
            self.stdout.write(
                self.style.ERROR(f'❌ Erreur: Utilisateur déjà existant - {e}')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'❌ Erreur lors de la création: {e}')
            ) 