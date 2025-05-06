import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Category, getCategories } from '../api/products';
import { Button } from './ui';

interface CategoryMenuProps {
  className?: string;
  variant?: 'horizontal' | 'vertical';
  showAllLink?: boolean;
}

const CategoryMenu: React.FC<CategoryMenuProps> = ({
  className = '',
  variant = 'horizontal',
  showAllLink = true,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Erreur lors du chargement des catégories:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);
  
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
    return location.pathname.includes(`/categories/${slug}`);
  };
  
  // Styles de base pour le conteneur
  const containerClass = variant === 'horizontal' 
    ? `flex flex-nowrap overflow-x-auto gap-2 py-2 px-1 scrollbar-hide snap-x ${className}`
    : `flex flex-col gap-2 ${className}`;
  
  if (loading) {
    return (
      <div className={containerClass}>
        {Array(5).fill(0).map((_, i) => (
          <div 
            key={i}
            className="h-10 bg-gray-200 rounded-full animate-pulse min-w-[120px]"
          />
        ))}
      </div>
    );
  }
  
  return (
    <motion.div 
      className={containerClass}
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
            variant="secondary"
            size="sm"
            to="/products"
            className={`min-w-max whitespace-nowrap ${location.pathname === '/products' ? 'border-primary-500 bg-primary-50 text-primary-700' : ''}`}
          >
            Tous les produits
          </Button>
        </motion.div>
      )}
      
      {categories.map((category, index) => (
        <motion.div
          key={category.id}
          custom={index + 1}
          variants={itemVariants}
          whileHover="hover"
          whileTap="tap"
          className={variant === 'horizontal' ? 'snap-start' : ''}
        >
          <Button
            variant={isActive(category.slug) ? 'primary' : 'secondary'}
            size="sm"
            to={`/categories/${category.slug}`}
            className="min-w-max whitespace-nowrap"
          >
            {category.name}
          </Button>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default CategoryMenu; 