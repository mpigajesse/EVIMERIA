import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ButtonVariant, ButtonSize, buttonHoverAnimation, buttonTapAnimation } from '../../utils/buttonStyles';

interface ActionButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  to?: string;
  href?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

/**
 * ActionButton - Un bouton spécialement conçu pour les actions principales
 * avec un design plus accrocheur et visible
 */
const ActionButton: React.FC<ActionButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  to,
  href,
  onClick,
  icon,
  iconPosition = 'right',
  fullWidth = false,
  disabled = false,
  className = '',
  type = 'button',
}) => {
  // Classes de taille
  const sizeClasses = {
    xs: 'text-xs px-3 py-1.5',
    sm: 'text-sm px-4 py-2',
    md: 'text-base px-6 py-2.5',
    lg: 'text-lg px-8 py-3',
    xl: 'text-xl px-10 py-4',
  };

  // Classes de variant avec design plus accrocheur
  const variantClasses = {
    primary: 'bg-primary-600 !text-black hover:bg-primary-700 shadow-md',
    secondary: 'bg-primary-100 text-primary-800 border border-primary-300 hover:bg-primary-200 shadow-sm',
    accent: 'bg-secondary-600 !text-black hover:bg-secondary-700 shadow-md',
    gradient: 'bg-gradient-to-r from-primary-500 to-primary-700 !text-black shadow-md',
    outlined: 'bg-white border-2 border-primary-500 text-primary-600 hover:bg-primary-50 shadow-sm',
    danger: 'bg-red-600 !text-black hover:bg-red-700 shadow-md',
    success: 'bg-emerald-600 !text-black hover:bg-emerald-700 shadow-md',
    link: 'text-primary-700 hover:text-primary-800 hover:underline',
    icon: 'bg-primary-600 !text-black hover:bg-primary-700 shadow-md',
  };

  // Base classes
  const baseClasses = `
    inline-flex items-center justify-center gap-2 
    font-medium rounded-full 
    transition-all duration-300 
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${fullWidth ? 'w-full' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${className}
  `;

  // Contenu avec icon à droite ou à gauche
  const content = (
    <>
      {icon && iconPosition === 'left' && <span>{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span>{icon}</span>}
    </>
  );

  // Props d'animation
  const motionProps = {
    whileHover: !disabled ? buttonHoverAnimation : undefined,
    whileTap: !disabled ? buttonTapAnimation : undefined,
  };

  // Si c'est un lien interne
  if (to && !disabled) {
    return (
      <motion.div className="inline-block" {...motionProps}>
        <Link to={to} className={baseClasses.trim()}>
          {content}
        </Link>
      </motion.div>
    );
  }

  // Si c'est un lien externe
  if (href && !disabled) {
    return (
      <motion.div className="inline-block" {...motionProps}>
        <a 
          href={href}
          className={baseClasses.trim()}
          target="_blank"
          rel="noopener noreferrer"
        >
          {content}
        </a>
      </motion.div>
    );
  }

  // Si c'est un bouton standard
  return (
    <motion.button
      type={type}
      className={baseClasses.trim()}
      disabled={disabled}
      onClick={onClick}
      {...motionProps}
    >
      {content}
    </motion.button>
  );
};

export default ActionButton; 