import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Category, getCategories } from '../api/products';
import { animations, typography } from '../utils/designSystem';
import { Badge, Card, Loader, ActionButton } from './ui';

interface SimilarCategoriesProps {
  categoryId?: number;
  excludeId?: number;
  limit?: number;
  className?: string;
}

const SimilarCategories: React.FC<SimilarCategoriesProps> = ({
  categoryId,
  excludeId,
  limit = 4,
  className = '',
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSimilarCategories = async () => {
      if (!categoryId) return;
      
      try {
        setLoading(true);
        const response = await getCategories();
        const allCategories = response.results || [];
        
        // Exclure la catégorie actuelle et prendre les 4 premières
        const similar = allCategories
          .filter(cat => cat.id !== categoryId)
          .slice(0, 4);
          
        setCategories(similar);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des catégories similaires:', err);
        setError('Impossible de charger les catégories similaires');
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarCategories();
  }, [categoryId]);

  if (loading) {
    return (
      <div className={`${className} flex justify-center items-center py-12`}>
        <Loader variant="circle" color="primary" size="md" text="Chargement des catégories..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className} text-center py-8`}>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <motion.div 
        className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
        initial="hidden"
        animate="visible"
        variants={animations.staggerChildren}
      >
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            variants={animations.fadeInUp}
            transition={{ delay: index * 0.05 }}
            className="h-full"
          >
            <Link to={`/categories/${category.slug}`} className="block h-full">
              <Card 
                padding="none" 
                hover={true}
                className="h-full flex flex-col overflow-hidden transform transition-all duration-300 hover:shadow-xl"
              >
                {/* Conteneur d'image avec ratio 1:1 fixe */}
                <div className="relative h-40 sm:h-48">
                  <img 
                    src={category.image || `https://via.placeholder.com/400x300?text=${category.name}`}
                    alt={category.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Zone de texte de hauteur fixe */}
                <div className="p-4 h-[180px] flex flex-col">
                  <h3 className={`${typography.headings.h4} mb-2 line-clamp-1`}>{category.name}</h3>
                  
                  {category.description && (
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-grow">
                      {category.description}
                    </p>
                  )}
                  
                  <ActionButton
                    to={`/categories/${category.slug}`}
                    variant="primary"
                    size="sm"
                    className="mt-auto w-full"
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    }
                    iconPosition="right"
                  >
                    Explorer la catégorie
                  </ActionButton>
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default SimilarCategories; 