import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { typography, animations, classNames } from '../../utils/designSystem';
import Badge from './Badge';

interface SectionTitleProps {
  title: string;
  description?: string;
  badge?: string;
  badgeVariant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  align?: 'left' | 'center' | 'right';
  withLine?: boolean;
  action?: {
    label: string;
    to?: string;
    onClick?: () => void;
  };
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  children?: ReactNode;
}

const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  description,
  badge,
  badgeVariant = 'primary',
  align = 'left',
  withLine = false,
  action,
  className = '',
  size = 'md',
  animate = true,
  as = 'h2',
  children,
}) => {
  // Définir les classes d'alignement du texte
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  // Définir les classes de taille de titre
  const titleClasses = {
    sm: typography.headings.h3,
    md: typography.headings.h2,
    lg: typography.headings.h1,
  };

  // Composant pour le titre avec l'élément HTML approprié
  const TitleComponent = as;

  // Animation des éléments
  const contentAnimation = animate ? {
    variants: animations.fadeInUp,
    initial: 'hidden',
    animate: 'visible',
  } : {};

  // Rendu du badge si fourni
  const renderBadge = badge && (
    <Badge variant={badgeVariant} size="sm" className="mb-2">
      {badge}
    </Badge>
  );

  // Rendu du lien d'action si fourni
  const renderAction = action && (
    <motion.div 
      className="flex items-center text-primary-600 font-medium hover:text-primary-700 transition-colors"
      whileHover={{ x: 4 }}
      transition={{ type: 'spring', stiffness: 400 }}
    >
      {action.to ? (
        <Link to={action.to}>{action.label} <span>&rarr;</span></Link>
      ) : (
        <button onClick={action.onClick}>{action.label} <span>&rarr;</span></button>
      )}
    </motion.div>
  );

  return (
    <div 
      className={classNames(
        'mb-8',
        alignClasses[align],
        className
      )}
    >
      {/* Layout flex pour aligner le titre et l'action */}
      <div className="flex justify-between items-start mb-2">
        <div>
          {renderBadge}
          
          <motion.div {...contentAnimation}>
            <TitleComponent 
              className={classNames(
                titleClasses[size],
                withLine ? 'pb-2 border-b border-gray-200' : ''
              )}
            >
              {title}
            </TitleComponent>
            
            {description && (
              <motion.p 
                className={`${typography.body.regular} mt-2`}
                variants={animations.fadeInUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.1 }}
              >
                {description}
              </motion.p>
            )}
          </motion.div>
        </div>
        
        {action && (
          <motion.div 
            {...contentAnimation}
            transition={{ delay: 0.2 }}
          >
            {renderAction}
          </motion.div>
        )}
      </div>
      
      {children && (
        <motion.div 
          className="mt-4"
          variants={animations.fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
        >
          {children}
        </motion.div>
      )}
    </div>
  );
};

export default SectionTitle; 