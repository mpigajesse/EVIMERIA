import { ReactNode } from 'react';
import { classNames, components } from '../../utils/designSystem';

type BadgeVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'neutral' | 'transparent';
type BadgeSize = 'xs' | 'sm' | 'md';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  rounded?: boolean;
  outline?: boolean;
  icon?: ReactNode;
  className?: string;
  onClick?: () => void;
}

/**
 * Badge component - Utilisé pour des étiquettes, statuts, notifications, etc.
 */
const Badge = ({
  children,
  variant = 'primary',
  size = 'sm',
  rounded = true,
  outline = false,
  icon,
  className = '',
  onClick,
}: BadgeProps) => {
  // Styles de base communs à toutes les variantes
  const baseClasses = "inline-flex items-center justify-center font-medium";
  
  // Classes de taille
  const sizeClasses = {
    xs: "px-2 py-0.5 text-xs",
    sm: "px-2.5 py-0.5 text-sm",
    md: "px-3 py-1 text-sm",
  };
  
  // Classes de style pour les contours
  const outlineClasses = {
    primary: "border border-primary-500 text-primary-600 bg-transparent",
    secondary: "border border-secondary-500 text-secondary-600 bg-transparent",
    success: "border border-emerald-500 text-emerald-600 bg-transparent",
    danger: "border border-red-500 text-red-600 bg-transparent",
    warning: "border border-amber-500 text-amber-600 bg-transparent",
    info: "border border-sky-500 text-sky-600 bg-transparent",
    neutral: "border border-gray-400 text-gray-600 bg-transparent",
    transparent: "border border-white/50 text-white bg-transparent",
  };
  
  // Obtenir les classes de variant à partir du système de design
  const getVariantClasses = () => {
    return outline 
      ? outlineClasses[variant] 
      : components.badges[variant] || components.badges.neutral;
  };
  
  // Classes d'arrondi
  const roundedClasses = rounded ? "rounded-full" : "rounded";
  
  // Classes pour le comportement au clic
  const clickableClasses = onClick ? "cursor-pointer hover:opacity-90 active:opacity-70" : "";
  
  return (
    <span
      className={classNames(
        baseClasses,
        sizeClasses[size],
        getVariantClasses(),
        roundedClasses,
        clickableClasses,
        className
      )}
      onClick={onClick}
    >
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </span>
  );
};

// Composants prédéfinis pour faciliter l'utilisation
Badge.Primary = (props: Omit<BadgeProps, 'variant'>) => <Badge variant="primary" {...props} />;
Badge.Secondary = (props: Omit<BadgeProps, 'variant'>) => <Badge variant="secondary" {...props} />;
Badge.Success = (props: Omit<BadgeProps, 'variant'>) => <Badge variant="success" {...props} />;
Badge.Danger = (props: Omit<BadgeProps, 'variant'>) => <Badge variant="danger" {...props} />;
Badge.Warning = (props: Omit<BadgeProps, 'variant'>) => <Badge variant="warning" {...props} />;
Badge.Info = (props: Omit<BadgeProps, 'variant'>) => <Badge variant="info" {...props} />;

export default Badge; 