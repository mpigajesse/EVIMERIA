import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { components, typography, animations, colors } from '../utils/designSystem';
import { Card, Button, Badge, SectionTitle } from '../components/ui';

const RegisterPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validation des champs
    if (password !== confirmPassword) {
      alert('Les mots de passe ne correspondent pas.');
      return;
    }
    
    if (!agreeTerms) {
      alert('Vous devez accepter les conditions générales.');
      return;
    }
    
    // Ici, on enverrait les informations au backend pour créer le compte
    console.log('Tentative d\'inscription avec:', { firstName, lastName, email, password });
  };

  return (
    <div className={components.containers.page}>
      {/* Éléments décoratifs d'arrière-plan */}
      <div className={`${components.decorations.blobs} w-96 h-96 bg-primary-300 top-0 -right-48 opacity-20`}></div>
      <div className={`${components.decorations.blobs} w-72 h-72 bg-secondary-300 bottom-40 -left-40 opacity-20`}></div>
      
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
            className="w-full max-w-sm sm:max-w-md"
            padding="md"
          >
            <motion.div variants={animations.fadeInUp} className="text-center">
              <SectionTitle 
                title="Inscription" 
                description="Créez votre compte pour commencer vos achats"
                align="center"
                size="md"
                className="mb-6 sm:mb-8"
              />
            </motion.div>
        
            <motion.form 
              className="space-y-4 sm:space-y-6" 
              onSubmit={handleSubmit}
              variants={animations.fadeInUp}
              transition={{ delay: 0.1 }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
                <p className="mt-1 text-xs text-gray-500">Au moins 8 caractères avec lettres, chiffres et symboles</p>
          </div>
          
          <div>
                <label htmlFor="confirm-password" className={`block text-sm font-medium ${typography.body.medium} mb-1`}>
              Confirmer le mot de passe
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
          
              <div className="flex items-start">
                <div className="flex items-center h-5">
            <input
              id="agree-terms"
              name="agree-terms"
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              required
            />
                </div>
                <label htmlFor="agree-terms" className="ml-2 block text-xs sm:text-sm text-gray-500">
              J'accepte les {' '}
                  <Link to="#" className="text-primary-600 hover:text-primary-500 underline">
                conditions générales
              </Link>
                  {' '} et la {' '}
                  <Link to="#" className="text-primary-600 hover:text-primary-500 underline">
                    politique de confidentialité
                  </Link>
            </label>
          </div>
          
              <motion.div 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="pt-2"
              >
                <Button
                  variant="primary"
                  className="w-full py-2.5 sm:py-3"
              type="submit"
            >
              Créer un compte
                </Button>
              </motion.div>
              
              {/* Séparateur avec texte */}
              <div className="relative my-4 sm:my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">ou</span>
                </div>
              </div>
              
              {/* Boutons d'inscription sociale */}
              <div className="flex flex-col space-y-3">
                <Button 
                  variant="outlined"
                  className="w-full justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                  S'inscrire avec Google
                </Button>
          </div>
            </motion.form>
        
            <motion.div 
              className="text-center mt-4 sm:mt-6"
              variants={animations.fadeInUp}
              transition={{ delay: 0.2 }}
            >
              <p className={typography.body.small}>
            Vous avez déjà un compte ?{' '}
                <Link to="/login" className="text-primary-600 hover:text-primary-500 underline">
              Se connecter
            </Link>
          </p>
            </motion.div>
            
            {/* Badge */}
            <motion.div 
              className="absolute top-2 right-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Badge variant="primary" className={`${colors.gradients.primary} !text-black`}>
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