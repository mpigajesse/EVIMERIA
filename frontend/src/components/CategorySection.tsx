import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Category, getCategories } from '../api/products';
import { NavButton, Loader } from './ui';
import { animations, typography, components, colors } from '../utils/designSystem';

interface CategorySectionProps {
  title?: string;
  limit?: number;
  className?: string;
}

const CategorySection: React.FC<CategorySectionProps> = ({
  title = 'Nos catégories',
  limit = 3,
  className = '',
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await getCategories();
        const allCategories = response.results || [];
        setCategories(allCategories.slice(0, 4));
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des catégories:', err);
        setError('Impossible de charger les catégories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [limit]);

  // Animations
  const containerAnimation = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  if (loading) {
    return (
      <div className={`${className} flex justify-center py-12`}>
        <Loader variant="circle" color="primary" size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className} text-center py-12`}>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className={typography.headings.h2}>{title}</h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Découvrez notre sélection de catégories et trouvez les produits qui correspondent à votre style.
          </p>
        </div>

        <motion.div 
          className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          variants={containerAnimation}
          initial="hidden"
          animate="visible"
        >
          {categories.map((category, index) => (
            <motion.div 
              key={category.id} 
              className="relative rounded-2xl overflow-hidden shadow-md group h-80"
              variants={itemAnimation}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900/30 to-gray-900/70 z-10"></div>
              
              <div className="relative aspect-w-16 aspect-h-9 sm:aspect-h-12 lg:aspect-h-9 overflow-hidden rounded-xl">
                <img
                  src={category.image || `https://via.placeholder.com/600x400?text=${category.name}`}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
              
              <div className="absolute inset-0 z-20 flex flex-col justify-end p-6">
                <h3 className="text-white text-xl font-bold mb-2">{category.name}</h3>
                
                {category.products_count && (
                  <p className="text-white text-opacity-80 mb-4">
                    {category.products_count} produits
                  </p>
                )}
                
                <NavButton 
                  to={`/categories/${category.slug}`}
                  variant="primary"
                  className="mt-2"
                >
                  Explorer
                </NavButton>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <div className="text-center mt-12">
          <NavButton 
            to="/categories"
            variant="primary"
          >
            Voir toutes les catégories
          </NavButton>
        </div>
      </div>
    </div>
  );
};

export default CategorySection; 