import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { components, typography, animations } from '../utils/designSystem';
import { Card, Button, Badge, SectionTitle } from '../components/ui';
import { loginUser, ApiError } from '../api/products';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const data = await loginUser({ email, password });
      // Stocker les tokens. Le localStorage est simple, mais pour une meilleure sécurité
      // en production, considérer des cookies httpOnly.
      localStorage.setItem('accessToken', data.access);
      localStorage.setItem('refreshToken', data.refresh);

      // Rediriger vers la page d'accueil ou le tableau de bord
      navigate('/');

    } catch (err) {
      let errorMessage = 'Email ou mot de passe incorrect.';
      if (err instanceof ApiError) {
        // Personnaliser le message si l'API renvoie des détails spécifiques
        if (err.details && err.details.detail) {
          errorMessage = err.details.detail;
        }
      }
      setError(errorMessage);
      console.error('Erreur de connexion:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={components.containers.page}>
      {/* Éléments décoratifs d'arrière-plan améliorés */}
      <div className={`${components.decorations.blobs} w-96 h-96 bg-blue-400 top-20 -right-48 opacity-20`}></div>
      <div className={`${components.decorations.blobs} w-80 h-80 bg-violet-400 bottom-20 -left-40 opacity-20`}></div>
      <div className={`${components.decorations.blobs} w-64 h-64 bg-green-400 bottom-40 right-20 opacity-10`}></div>
      
      <div className={components.containers.maxWidth}>
        <motion.div 
          className="flex items-center justify-center py-8 sm:py-12 md:py-16"
          initial="hidden"
          animate="visible"
          variants={animations.fadeIn}
        >
          <Card 
            elevation="high" 
            rounded="xl" 
            className="w-full max-w-sm sm:max-w-md overflow-hidden relative"
            padding="md"
          >
            {/* Barre de dégradé supérieure */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-violet-600 to-green-600"></div>
            
            <motion.div variants={animations.fadeInUp} className="text-center pt-4">
              <SectionTitle 
                title="Connexion" 
                description="Entrez vos identifiants pour accéder à votre compte"
                align="center"
                size="md"
                className="mb-6 sm:mb-8"
              />
            </motion.div>
        
            <motion.form 
              className="space-y-4" 
              onSubmit={handleSubmit}
              variants={animations.fadeInUp}
              transition={{ delay: 0.1 }}
            >
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <strong className="font-bold">Erreur: </strong>
                  <span className="block sm:inline">{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className={`block text-sm font-medium ${typography.body.medium} mb-1`}>
                    Adresse email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className={components.inputs.base}
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="password" className={`block text-sm font-medium ${typography.body.medium}`}>
                      Mot de passe
                    </label>
                    <div className="text-xs">
                      <Link to="#" className="text-blue-600 hover:text-blue-500 underline">
                        Oublié ?
                      </Link>
                    </div>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className={components.inputs.base}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label htmlFor="remember-me" className={`ml-2 block text-sm ${typography.body.regular}`}>
                    Se souvenir de moi
                  </label>
                </div>
                
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="primary"
                    className="px-8 py-2.5 bg-gradient-to-r from-blue-600 via-violet-600 to-green-600 !text-white hover:from-blue-700 hover:via-violet-700 hover:to-green-700"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Connexion...' : 'Se connecter'}
                  </Button>
                </motion.div>
              </div>
              
              {/* Séparateur avec texte */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">ou</span>
                </div>
              </div>
              
              {/* Boutons de connexion sociale en ligne */}
              <div className="grid grid-cols-1 gap-3">
                {/* Google */}
                <motion.button 
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center px-3 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                >
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Continuer avec Google</span>
                </motion.button>
              </div>
              
              <div className="text-sm text-center mt-6">
                <p className={`${typography.body.regular}`}>
                  Pas encore de compte ?{' '}
                  <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500 underline">
                    Inscrivez-vous ici
                  </Link>
                </p>
              </div>
            </motion.form>
            
            {/* Badge sécurisé */}
            <motion.div 
              className="absolute top-4 right-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Badge variant="success" className="bg-green-100 text-green-700 shadow-sm">
                <span className="mr-1">🔒</span> Sécurisé
              </Badge>
            </motion.div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage; 