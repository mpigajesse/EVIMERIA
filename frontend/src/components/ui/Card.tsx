import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { classNames, components } from '../../utils/designSystem';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  to?: string;
  onClick?: () => void;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  elevation?: 'none' | 'low' | 'medium' | 'high' | 'extraHigh' | 'intense';
  rounded?: 'sm' | 'md' | 'lg' | 'xl';
  animate?: boolean;
  border?: boolean;
  badge?: ReactNode;
  badgePosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  as?: React.ElementType;
  bgColor?: string;
}

/**
 * Composant Card - Container polyvalent pour contenu divers
 * Utilise les styles du design system pour une apparence cohérente
 */
const Card = ({
  children,
  className = '',
  hover = true,
  to,
  onClick,
  padding = 'md',
  elevation = 'medium',
  rounded = 'xl',
  animate = true,
  border = false,
  badge,
  badgePosition = 'top-right',
  as: Component = 'div',
  bgColor = 'bg-white',
}: CardProps) => {
  // Gestion du padding avec classes Tailwind responsive
  const getPaddingClasses = (): string => {
    switch (padding) {
      case 'none':
        return '';
      case 'sm':
        return 'p-2 sm:p-3 md:p-4';
      case 'md':
        return 'p-3 sm:p-4 md:p-5 lg:p-6';
      case 'lg':
        return 'p-4 sm:p-5 md:p-6 lg:p-8';
      case 'xl':
        return 'p-5 sm:p-6 md:p-8 lg:p-10';
      default:
        return 'p-3 sm:p-4 md:p-5 lg:p-6';
    }
  };

  // Gestion de l'élévation (ombre)
  const getElevationClasses = (): string => {
    switch (elevation) {
      case 'none':
        return '';
      case 'low':
        return 'shadow-sm';
      case 'medium':
        return 'shadow';
      case 'high':
        return 'shadow-lg';
      case 'extraHigh':
        return 'shadow-xl';
      case 'intense':
        return 'shadow-2xl';
      default:
        return 'shadow';
    }
  };

  // Gestion des coins arrondis
  const getRoundedClasses = (): string => {
    switch (rounded) {
      case 'sm':
        return 'rounded-lg';
      case 'md':
        return 'rounded-xl';
      case 'lg':
        return 'rounded-2xl';
      case 'xl':
        return 'rounded-3xl';
      default:
        return 'rounded-xl';
    }
  };

  // Gestion de la position du badge
  const getBadgePositionClasses = (): string => {
    switch (badgePosition) {
      case 'top-left':
        return 'top-2 left-2 sm:top-3 sm:left-3';
      case 'top-right':
        return 'top-2 right-2 sm:top-3 sm:right-3';
      case 'bottom-left':
        return 'bottom-2 left-2 sm:bottom-3 sm:left-3';
      case 'bottom-right':
        return 'bottom-2 right-2 sm:bottom-3 sm:right-3';
      default:
        return 'top-2 right-2 sm:top-3 sm:right-3';
    }
  };

  // Classes de base pour la carte
  const baseClasses = classNames(
    bgColor,
    'overflow-hidden relative w-full',
    getRoundedClasses(),
    getElevationClasses(),
    getPaddingClasses(),
    border ? 'border border-gray-200' : '',
    hover ? components.cards.hover : '',
    className
  );

  // Props pour les animations si activées
  const motionProps = animate
    ? {
        whileHover: hover ? { y: -5 } : {},
        transition: { duration: 0.3 },
      }
    : {};

  // Rendu du contenu de la carte
  const cardContent = (
    <>
      {children}
      {badge && (
        <div className={`absolute ${getBadgePositionClasses()}`}>
          {badge}
        </div>
      )}
    </>
  );

  // Si la carte est un lien
  if (to) {
    return (
      <motion.div {...motionProps}>
        <Link to={to} className={`block ${baseClasses} group`}>
          {cardContent}
        </Link>
      </motion.div>
    );
  }

  // Si la carte a un gestionnaire de clic
  if (onClick) {
    return (
      <motion.div 
        className={`${baseClasses} cursor-pointer`} 
        onClick={onClick}
        {...motionProps}
      >
        {cardContent}
      </motion.div>
    );
  }

  // Carte standard - Correction de l'erreur TypeScript
  // motion.div ne prend pas le prop 'as' directement
  if (Component !== 'div') {
    const MotionComponent = motion(Component);
    return (
      <MotionComponent 
        className={baseClasses} 
        {...motionProps}
      >
        {cardContent}
      </MotionComponent>
    );
  }

  // Pour div standard 
  return (
    <motion.div 
      className={baseClasses} 
      {...motionProps}
    >
      {cardContent}
    </motion.div>
  );
};

export default Card; 