import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ActionButton } from './ui';

interface NewsletterProps {
  className?: string;
  variant?: 'standard' | 'gradient' | 'minimal';
}

const Newsletter: React.FC<NewsletterProps> = ({ 
  className = '',
  variant = 'standard'
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation simple de l'email
    if (!email || !email.includes('@')) {
      setError('Veuillez entrer une adresse email valide');
      return;
    }
    
    // Simuler l'envoi du formulaire
    setIsSubmitted(true);
    setError(null);
    
    // Dans une application réelle, vous appelleriez votre API ici
    console.log('Email soumis:', email);
  };

  // Variantes d'arrière-plan selon le variant choisi
  const backgroundClass = {
    standard: "bg-white shadow-lg rounded-3xl p-8",
    gradient: "bg-gradient-to-r from-primary-600 to-primary-800 text-white rounded-3xl p-8 shadow-lg",
    minimal: "bg-transparent"
  }[variant];

  // Variantes de titre selon le variant choisi
  const titleClass = {
    standard: "text-gray-900",
    gradient: "text-white",
    minimal: "text-gray-900"
  }[variant];

  // Variantes de description selon le variant choisi
  const descriptionClass = {
    standard: "text-gray-600",
    gradient: "text-white text-opacity-90",
    minimal: "text-gray-600"
  }[variant];

  // Animation du formulaire
  const formAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className={`${backgroundClass} ${className}`}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={formAnimation}
      >
        <div className="text-center mb-6">
          <h2 className={`text-2xl sm:text-3xl font-bold mb-3 ${titleClass}`}>
            Restez informé
          </h2>
          <p className={`${descriptionClass}`}>
            Inscrivez-vous à notre newsletter pour recevoir nos offres exclusives et les dernières tendances
          </p>
        </div>

        {isSubmitted ? (
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className={`inline-flex items-center rounded-full px-4 py-2 ${
                variant === 'gradient' ? 'bg-white text-primary-700' : 'bg-primary-100 text-primary-700'
              }`}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 mr-2 text-primary-600" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                  clipRule="evenodd" 
                />
              </svg>
              <span>Merci pour votre inscription!</span>
            </motion.div>
            <p className={`mt-3 ${descriptionClass}`}>
              Vous recevrez bientôt nos dernières actualités.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
              <div className="flex-grow relative">
                <input
                  type="email"
                  placeholder="Votre adresse email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`px-4 py-3 w-full rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 placeholder-gray-600 font-medium ${
                    error ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : ''
                  }`}
                />
                {error && (
                  <p className="absolute text-red-500 text-xs mt-1 ml-4">
                    {error}
                  </p>
                )}
              </div>

              <ActionButton
                type="submit"
                variant={variant === 'gradient' ? 'primary' : 'primary'}
                size="md"
                icon={
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                }
                iconPosition="right"
              >
                S'inscrire
              </ActionButton>
            </div>
            
            <p className={`text-xs text-center mt-4 ${variant === 'gradient' ? 'text-white text-opacity-80' : 'text-gray-500'}`}>
              En vous inscrivant, vous acceptez de recevoir nos emails et confirmez avoir lu notre politique de confidentialité.
            </p>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default Newsletter; 