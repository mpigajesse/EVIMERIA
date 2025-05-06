import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ButtonVariant, 
  ButtonSize, 
  generateButtonClasses, 
  buttonHoverAnimation, 
  buttonTapAnimation 
} from '../../utils/buttonStyles';

interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  to?: string;
  href?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
  onClick?: () => void;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  animate?: boolean;
  ariaLabel?: string;
}

/**
 * Composant Button - Utilise des styles uniformes et cohérents pour tous les boutons du site
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  to,
  href,
  type = 'button',
  disabled = false,
  fullWidth = false,
  className = '',
  onClick,
  icon,
  iconPosition = 'left',
  animate = true,
  ariaLabel,
}: ButtonProps) => {
  // Générer les classes de style complètes pour le bouton
  const baseClasses = generateButtonClasses(
    variant, 
    size, 
    fullWidth, 
    `${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`
  );
  
  // Props pour les animations si activées
  const motionProps = animate
    ? {
        whileHover: buttonHoverAnimation,
        whileTap: !disabled ? buttonTapAnimation : undefined,
        transition: { duration: 0.2 },
      }
    : {};
  
  // Contenu du bouton (avec l'icône)
  const buttonContent = (
    <>
      {icon && iconPosition === 'left' && <span className="icon-container">{icon}</span>}
      <span className="flex-1 text-center">{children}</span>
      {icon && iconPosition === 'right' && <span className="icon-container">{icon}</span>}
    </>
  );
  
  // Si un lien interne est fourni (routing React)
  if (to && !disabled) {
    return (
      <motion.div {...motionProps} className="inline-block">
        <Link
          to={to}
          className={baseClasses}
          aria-label={ariaLabel}
          onClick={onClick}
        >
          {buttonContent}
        </Link>
      </motion.div>
    );
  }
  
  // Si un lien externe est fourni
  if (href && !disabled) {
    return (
      <motion.div {...motionProps} className="inline-block">
        <a
          href={href}
          className={baseClasses}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={ariaLabel}
          onClick={onClick}
        >
          {buttonContent}
        </a>
      </motion.div>
    );
  }
  
  // Sinon, c'est un bouton normal
  return (
    <motion.button
      type={type}
      className={baseClasses}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      {...motionProps}
    >
      {buttonContent}
    </motion.button>
  );
};

export default Button; 