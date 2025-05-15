import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface NavButtonProps {
  children: React.ReactNode;
  to?: string;
  href?: string;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary';
}

/**
 * Bouton de navigation utilisé pour les liens comme "Nos catégories"
 * Par défaut en bleu pour une meilleure visibilité
 */
const NavButton: React.FC<NavButtonProps> = ({
  children,
  to,
  href,
  onClick,
  className = '',
  variant = 'primary'
}) => {
  // Définir les styles de base pour les boutons de navigation
  const baseClasses = 'inline-flex items-center justify-center px-6 py-3 rounded-full font-medium text-base transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // Styles selon la variante
  const variantStyles = {
    primary: 'bg-primary-600 !text-black hover:bg-primary-700 shadow-md focus:ring-primary-500',
    secondary: 'bg-white !text-gray-800 hover:bg-gray-50 border border-gray-200 shadow-sm focus:ring-primary-400'
  };
  
  // Classes complètes
  const buttonClasses = `${baseClasses} ${variantStyles[variant]} ${className}`;
  
  // Animation de bouton
  const buttonAnimation = {
    whileHover: { scale: 1.03 },
    whileTap: { scale: 0.97 }
  };
  
  // Si c'est un lien interne avec React Router
  if (to) {
    return (
      <motion.div className="inline-block" {...buttonAnimation}>
        <Link to={to} className={buttonClasses}>
          {children}
        </Link>
      </motion.div>
    );
  }
  
  // Si c'est un lien externe
  if (href) {
    return (
      <motion.div className="inline-block" {...buttonAnimation}>
        <a 
          href={href} 
          className={buttonClasses} 
          target="_blank" 
          rel="noopener noreferrer"
        >
          {children}
        </a>
      </motion.div>
    );
  }
  
  // Sinon c'est un bouton
  return (
    <motion.button
      onClick={onClick}
      className={buttonClasses}
      {...buttonAnimation}
    >
      {children}
    </motion.button>
  );
};

export default NavButton; 