import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { components, typography, animations, colors } from '../utils/designSystem';
import { Card, Button, Badge, SectionTitle } from '../components/ui';
import { registerUser, ApiError } from '../api/products';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    
    if (!agreeTerms) {
      setError('Vous devez accepter les conditions générales.');
      return;
    }
    
    setIsLoading(true);
    try {
      await registerUser({
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        password2: confirmPassword,
      });
      // Rediriger vers la page de connexion après une inscription réussie
      navigate('/login');
    } catch (err) {
      if (err instanceof ApiError) {
        // Gérer les erreurs de l'API (ex: email déjà utilisé)
        const errorDetails = Object.values(err.details || {}).flat().join(' ');
        setError(errorDetails || 'Une erreur est survenue lors de l\'inscription.');
      } else {
        setError('Une erreur inconnue est survenue.');
      }
      console.error('Erreur d\'inscription:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={components.containers.page}>
      {/* Éléments décoratifs d'arrière-plan améliorés */}
      <div className={`${components.decorations.blobs} w-96 h-96 bg-blue-400 top-0 -right-48 opacity-20`}></div>
      <div className={`${components.decorations.blobs} w-72 h-72 bg-violet-400 bottom-40 -left-40 opacity-20`}></div>
      <div className={`${components.decorations.blobs} w-64 h-64 bg-green-400 top-40 left-20 opacity-10`}></div>
      
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
            className="w-full max-w-lg overflow-hidden relative"
            padding="md"
          >
            {/* Barre de gradient supérieure */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-violet-600 to-green-600"></div>
            
            <motion.div variants={animations.fadeInUp} className="text-center pt-4">
              <SectionTitle 
                title="Inscription" 
                description="Créez votre compte pour commencer vos achats"
                align="center"
                size="md"
                className="mb-6"
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
                  <label htmlFor="first-name" className={`block text-sm font-medium ${typography.body.medium} mb-1`}>
                    Prénom
                  </label>
                  <input
                    id="first-name"
                    name="first-name"
                    type="text"
                    autoComplete="given-name"
                    required
                    className={components.inputs.base}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="last-name" className={`block text-sm font-medium ${typography.body.medium} mb-1`}>
                    Nom
                  </label>
                  <input
                    id="last-name"
                    name="last-name"
                    type="text"
                    autoComplete="family-name"
                    required
                    className={components.inputs.base}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
              
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="password" className={`block text-sm font-medium ${typography.body.medium} mb-1`}>
                    Mot de passe
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className={components.inputs.base}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <p className="mt-1 text-xs text-gray-500">Min 8 caractères</p>
                </div>
                
                <div>
                  <label htmlFor="confirm-password" className={`block text-sm font-medium ${typography.body.medium} mb-1`}>
                    Confirmer
                  </label>
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className={components.inputs.base}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="agree-terms"
                      name="agree-terms"
                      type="checkbox"
                      className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      required
                    />
                  </div>
                  <label htmlFor="agree-terms" className="ml-2 block text-xs text-gray-500">
                    J'accepte les{' '}
                    <Link to="#" className="text-blue-600 hover:text-blue-500 underline">
                      conditions
                    </Link>
                  </label>
                </div>
                
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="primary"
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 via-violet-600 to-green-600 !text-white hover:from-blue-700 hover:via-violet-700 hover:to-green-700"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Inscription...' : 'Créer un compte'}
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
              
              {/* Boutons d'inscription sociale en ligne */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Google */}
                <motion.button 
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center px-3 py-2.5 border border-gray-300 rounded-xl text-xs md:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                >
                  <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="hidden md:inline">Google</span>
                  <span className="md:hidden">G</span>
                </motion.button>

                {/* Facebook */}
                <motion.button 
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center px-3 py-2.5 border border-gray-300 rounded-xl text-xs md:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all duration-200"
                >
                  <svg className="h-4 w-4 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span className="hidden md:inline">Facebook</span>
                  <span className="md:hidden">F</span>
                </motion.button>

                {/* Instagram */}
                <motion.button 
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center px-3 py-2.5 border border-gray-300 rounded-xl text-xs md:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all duration-200"
                >
                  <svg className="h-4 w-4 mr-2" fill="url(#instagram-gradient-register)" viewBox="0 0 24 24">
                    <defs>
                      <linearGradient id="instagram-gradient-register" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#405DE6"/>
                        <stop offset="25%" stopColor="#5851DB"/>
                        <stop offset="50%" stopColor="#833AB4"/>
                        <stop offset="75%" stopColor="#C13584"/>
                        <stop offset="100%" stopColor="#E1306C"/>
                      </linearGradient>
                    </defs>
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <span className="hidden md:inline">Instagram</span>
                  <span className="md:hidden">I</span>
                </motion.button>
              </div>
            </motion.form>
        
            <motion.div 
              className="text-center mt-4"
              variants={animations.fadeInUp}
              transition={{ delay: 0.2 }}
            >
              <p className={typography.body.small}>
                Vous avez déjà un compte ?{' '}
                <Link to="/login" className="text-blue-600 hover:text-blue-500 underline">
                  Se connecter
                </Link>
              </p>
            </motion.div>
            
            {/* Badge */}
            <motion.div 
              className="absolute top-4 right-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Badge variant="primary" className="bg-gradient-to-r from-blue-600 via-violet-600 to-green-600 text-white shadow-sm">
                <span className="mr-1">✨</span> Nouveau
              </Badge>
            </motion.div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage; 