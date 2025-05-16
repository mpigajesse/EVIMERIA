import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Category, getCategoryImageUrl } from '../api/products';
import { ActionButton } from './ui';

interface CategoryCardProps {
  category: Category;
  index?: number;
  variant?: 'default' | 'horizontal' | 'minimal';
  className?: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  index = 0,
  variant = 'default',
  className = '',
}) => {
  // Animation d'apparition avec délai basé sur l'index
  const cardAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.3,
        delay: index * 0.05
      }
    },
  };

  // Animation au survol
  const hoverAnimation = {
    rest: { scale: 1, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' },
    hover: { 
      scale: 1.03, 
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      transition: { duration: 0.3 }
    }
  };

  // Générer le style selon la variante
  const getCardStyle = () => {
    switch (variant) {
      case 'horizontal':
        return 'flex flex-row h-40 overflow-hidden rounded-2xl';
      case 'minimal':
        return 'bg-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow';
      default:
        return 'flex flex-col h-full rounded-2xl overflow-hidden shadow-md';
    }
  };

  // Obtenir l'URL de l'image avec fallback
  const imageUrl = getCategoryImageUrl(category);
  
  // Nombre de produits formaté
  const productsCount = category.products_count 
    ? `${category.products_count} produits`
    : 'Voir les produits';

  return (
    <motion.div
      className={`${getCardStyle()} ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      whileHover="hover"
      animate="rest"
      variants={{
        ...cardAnimation,
        hover: hoverAnimation.hover,
        rest: hoverAnimation.rest
      }}
    >
      {/* Image de la catégorie */}
      {variant === 'horizontal' ? (
        <div className="w-1/3 relative">
          <div className="absolute inset-0 bg-gray-200">
            <img
              src={imageUrl}
              alt={category.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://via.placeholder.com/400x400?text=${category.name}`;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/60"></div>
          </div>
        </div>
      ) : (
        <div className="relative w-full">
          <div className="aspect-[1/1] h-[300px]">
            <img
              src={imageUrl}
              alt={category.name}
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://via.placeholder.com/400x400?text=${category.name}`;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/60"></div>
          </div>
          
          {category.products_count && (
            <div className="absolute top-3 right-3 z-10">
              <span className="bg-primary-600 text-white text-xs font-medium px-2.5 py-1 rounded-full shadow-md">
                {productsCount}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Contenu de la carte */}
      <div className={`${variant === 'horizontal' ? 'w-2/3 p-4' : 'p-4 h-[180px] flex flex-col'}`}>
        <h3 className="text-lg font-semibold mb-1 line-clamp-1">{category.name}</h3>
        
        {category.description && (
          <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-grow">
            {category.description}
          </p>
        )}
        
        {variant === 'horizontal' && category.products_count && (
          <div className="text-sm text-primary-700 font-medium mb-2">
            {productsCount}
          </div>
        )}
        
        <div className={variant === 'horizontal' ? 'mt-auto' : 'mt-auto pt-2'}>
          <ActionButton
            to={`/categories/${category.slug}`}
            variant="primary"
            size="sm"
            className="w-full"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            }
            iconPosition="right"
          >
            Explorer
          </ActionButton>
        </div>
      </div>
    </motion.div>
  );
};

export default CategoryCard; 