import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SubCategory, getSubCategoriesByCategory } from '../api/products';
import { Button } from './ui';

interface SubCategoryMenuProps {
  categorySlug?: string;
  className?: string;
  variant?: 'horizontal' | 'vertical';
  showAllLink?: boolean;
}

const SubCategoryMenu: React.FC<SubCategoryMenuProps> = ({
  categorySlug,
  className = '',
  variant = 'horizontal',
  showAllLink = true,
}) => {
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  
  useEffect(() => {
    const fetchSubCategories = async () => {
      if (!categorySlug) {
        setSubCategories([]);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const data = await getSubCategoriesByCategory(categorySlug);
        setSubCategories(data);
      } catch (error) {
        console.error("Erreur lors du chargement des sous-catégories:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubCategories();
  }, [categorySlug]);
  
  // Animation pour les éléments du menu
  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
      }
    }),
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  };
  
  // Animation pour le conteneur
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: 0.1
      }
    }
  };
  
  // Vérifier si un lien est actif
  const isActive = (slug: string) => {
    return location.pathname.includes(`/subcategories/${slug}`) || 
           location.search.includes(`subcategory=${slug}`);
  };
  
  // Styles de base pour le conteneur
  const containerClass = variant === 'horizontal' 
    ? `flex flex-nowrap overflow-x-auto gap-2 py-2 px-1 scrollbar-hide snap-x ${className}`
    : `flex flex-col gap-2 ${className}`;
  
  if (loading) {
    return (
      <div className={containerClass}>
        {Array(3).fill(0).map((_, i) => (
          <div 
            key={i}
            className="h-8 bg-gray-200 rounded-full animate-pulse min-w-[100px]"
          />
        ))}
      </div>
    );
  }

  if (!categorySlug || subCategories.length === 0) {
    return null;
  }
  
  return (
    <motion.div 
      className={`${containerClass} mt-2`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {showAllLink && (
        <motion.div
          custom={0}
          variants={itemVariants}
          whileHover="hover"
          whileTap="tap"
          className={variant === 'horizontal' ? 'snap-start' : ''}
        >
          <Button
            variant="ghost"
            size="xs"
            to={`/categories/${categorySlug}`}
            className={`min-w-max whitespace-nowrap text-sm border border-gray-300 ${
              location.pathname === `/categories/${categorySlug}` && !location.search.includes('subcategory=') 
                ? 'border-primary-500 bg-primary-50 text-primary-700' 
                : 'hover:border-primary-300'
            }`}
          >
            Tout voir
          </Button>
        </motion.div>
      )}
      
      {subCategories.map((subCategory, index) => (
        <motion.div
          key={subCategory.id}
          custom={index + 1}
          variants={itemVariants}
          whileHover="hover"
          whileTap="tap"
          className={variant === 'horizontal' ? 'snap-start' : ''}
        >
          <Button
            variant={isActive(subCategory.slug) ? 'primary' : 'ghost'}
            size="xs"
            to={`/categories/${categorySlug}?subcategory=${subCategory.slug}`}
            className={`min-w-max whitespace-nowrap text-sm border ${
              isActive(subCategory.slug) 
                ? 'border-primary-500' 
                : 'border-gray-300 hover:border-primary-300'
            }`}
          >
            {subCategory.name}
            {subCategory.products_count !== undefined && (
              <span className="ml-1 text-xs opacity-70">
                ({subCategory.products_count})
              </span>
            )}
          </Button>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default SubCategoryMenu; 