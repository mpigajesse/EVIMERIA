import React from 'react';
import { motion } from 'framer-motion';
import { NavButton } from './ui';

interface CTABannerProps {
  title: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  bgColor?: 'primary' | 'secondary' | 'gradient' | 'light';
  className?: string;
}

const CTABanner: React.FC<CTABannerProps> = ({
  title,
  description,
  primaryButtonText = 'Nos catégories',
  primaryButtonLink = '/categories',
  secondaryButtonText,
  secondaryButtonLink,
  bgColor = 'primary',
  className = '',
}) => {
  // Définir les classes de fond selon la couleur choisie
  const bgClasses = {
    primary: 'bg-primary-600 text-white',
    secondary: 'bg-secondary-600 text-white',
    gradient: 'bg-gradient-to-r from-primary-600 to-primary-800 text-white',
    light: 'bg-gray-50 text-gray-900'
  };

  // Animation
  const bannerAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  };

  return (
    <div className={className}>
      <motion.div 
        className={`rounded-2xl shadow-lg overflow-hidden ${bgClasses[bgColor]}`}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={bannerAnimation}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">{title}</h2>
            
            {description && (
              <p className={`text-lg max-w-2xl mx-auto mb-8 ${bgColor === 'light' ? 'text-gray-600' : 'text-white text-opacity-90'}`}>
                {description}
              </p>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <NavButton 
                to={primaryButtonLink}
                variant={bgColor === 'light' ? 'primary' : 'secondary'}
              >
                {primaryButtonText}
              </NavButton>
              
              {secondaryButtonText && secondaryButtonLink && (
                <NavButton 
                  to={secondaryButtonLink}
                  variant={bgColor === 'light' ? 'secondary' : 'primary'}
                >
                  {secondaryButtonText}
                </NavButton>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CTABanner; 