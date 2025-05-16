import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { NavButton } from './ui';

interface HeroSectionProps {
  className?: string;
  variant?: 'default' | 'minimal' | 'fullwidth';
}

const HeroSection: React.FC<HeroSectionProps> = ({
  className = '',
  variant = 'default'
}) => {
  // Animations pour les éléments du héros
  const containerAnimation = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className={`flex flex-col ${variant === 'fullwidth' ? 'md:flex-row' : 'lg:flex-row'} items-center py-12 md:py-16 lg:py-20`}
          initial="hidden"
          animate="visible"
          variants={containerAnimation}
        >
          {/* Contenu texte */}
          <motion.div 
            className={`flex-1 text-center ${variant === 'fullwidth' ? 'md:text-left' : 'lg:text-left'} pb-8 ${variant === 'fullwidth' ? 'md:pb-0' : 'lg:pb-0'}`}
            variants={itemAnimation}
          >
            <div className="inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-800 font-medium text-sm mb-6">
              Nouvelle collection
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight tracking-tight mb-4">
              JaelleShop <span className="text-blue-600">Inspiring</span> <span className="block">Fashion.</span>
            </h1>
            
            <p className="text-gray-600 text-lg max-w-xl mx-auto lg:mx-0 mb-8">
              Découvrez notre collection exclusive et faites de votre style une
              déclaration de mode unique.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <NavButton to="/categories" variant="primary" className="bg-blue-600 text-black hover:bg-blue-700">
                Nos catégories
              </NavButton>
              
              <NavButton to="/products" variant="secondary" className="bg-violet-600 text-black hover:bg-violet-700 border-0">
                Voir tous les produits
              </NavButton>
            </div>
            
            {/* Section de couleurs de la carte de visite */}
            <div className="flex items-center justify-center lg:justify-start mt-6 space-x-3">
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-primary-600"></div>
                <span className="ml-2 text-gray-700">Vert</span>
              </div>
              
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-secondary-600"></div>
                <span className="ml-2 text-gray-700">Bleu</span>
              </div>
              
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-accent-600"></div>
                <span className="ml-2 text-gray-700">Violet</span>
              </div>
            </div>
            
            <div className="flex items-center justify-center lg:justify-start mt-8 space-x-8">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Livraison 24h</span>
              </div>
              
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Garantie qualité</span>
              </div>
            </div>
          </motion.div>
          
          {/* Image */}
          {variant !== 'minimal' && (
            <motion.div 
              className="flex-1"
              variants={itemAnimation}
            >
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1542060748-10c28b62716f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8ZmFzaGlvbiUyMG1vZGVsfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                  alt="JaelleShop Fashion Collection" 
                  className="rounded-2xl shadow-xl object-cover w-full"
                />
                
                <div className="absolute top-4 right-4 bg-accent-100 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-accent-800 shadow-md">
                  Collection limitée
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection; 