import React from 'react';
import { motion } from 'framer-motion';
import { classNames } from '../../utils/designSystem';

interface LoaderProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'circle' | 'dots' | 'pulse' | 'skeleton';
  text?: string;
  className?: string;
  color?: 'primary' | 'secondary' | 'white' | 'gray';
  centered?: boolean;
}

const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  variant = 'circle',
  text,
  className = '',
  color = 'primary',
  centered = false,
}) => {
  // Classes de taille
  const sizeClasses = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  // Classes de couleur
  const colorClasses = {
    primary: 'border-primary-500 text-primary-500',
    secondary: 'border-secondary-500 text-secondary-500',
    white: 'border-white text-white',
    gray: 'border-gray-300 text-gray-300',
  };

  // Wrapper conditionnel pour le centrage
  const WrapperComponent = centered ? ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-center justify-center w-full">
      {children}
    </div>
  ) : React.Fragment;

  // Rendu en fonction du variant
  const renderLoader = () => {
    switch (variant) {
      case 'circle':
        return (
          <div className={classNames('relative', className)}>
            <motion.div
              className={classNames(
                'rounded-full border-4 border-t-transparent',
                sizeClasses[size],
                colorClasses[color]
              )}
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            />
            {text && (
              <p className={`mt-3 text-center text-sm text-${color === 'white' ? 'white' : 'gray-500'}`}>
                {text}
              </p>
            )}
          </div>
        );

      case 'dots':
        return (
          <div className={classNames('flex gap-2', className)}>
            {[0, 1, 2].map((idx) => (
              <motion.div
                key={idx}
                className={classNames(
                  'rounded-full',
                  color === 'primary' ? 'bg-primary-500' : 
                  color === 'secondary' ? 'bg-secondary-500' : 
                  color === 'white' ? 'bg-white' : 'bg-gray-300',
                  size === 'xs' ? 'w-1.5 h-1.5' :
                  size === 'sm' ? 'w-2 h-2' :
                  size === 'md' ? 'w-3 h-3' :
                  size === 'lg' ? 'w-4 h-4' : 'w-5 h-5'
                )}
                animate={{
                  y: ['0%', '-50%', '0%'],
                  opacity: [1, 0.5, 1],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: idx * 0.2,
                }}
              />
            ))}
            {text && (
              <span className={`ml-2 text-${color === 'white' ? 'white' : 'gray-500'}`}>
                {text}
              </span>
            )}
          </div>
        );

      case 'pulse':
        return (
          <div className={classNames('relative', className)}>
            <motion.div
              className={classNames(
                'rounded-full',
                sizeClasses[size],
                color === 'primary' ? 'bg-primary-500' : 
                color === 'secondary' ? 'bg-secondary-500' : 
                color === 'white' ? 'bg-white' : 'bg-gray-300',
                'opacity-75'
              )}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 0.2, 0.7],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.div
              className={classNames(
                'absolute inset-0 rounded-full',
                color === 'primary' ? 'bg-primary-300' : 
                color === 'secondary' ? 'bg-secondary-300' : 
                color === 'white' ? 'bg-white/50' : 'bg-gray-200',
              )}
              animate={{
                scale: [0.8, 1, 0.8],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            {text && (
              <p className={`mt-4 text-center text-sm text-${color === 'white' ? 'white' : 'gray-500'}`}>
                {text}
              </p>
            )}
          </div>
        );

      case 'skeleton':
        return (
          <div className={classNames('w-full', className)}>
            <div className="animate-pulse space-y-4">
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              {text && <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto mt-6"></div>}
            </div>
          </div>
        );
    }
  };

  return (
    <WrapperComponent>
      {renderLoader()}
    </WrapperComponent>
  );
};

export default Loader; 