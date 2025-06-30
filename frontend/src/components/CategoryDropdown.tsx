import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Category, SubCategory, getSubCategoriesByCategory } from '../api/products';
import { Badge } from './ui';

interface CategoryDropdownProps {
  category: Category;
  onSubCategorySelect?: (subcategorySlug: string) => void;
}

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({ 
  category, 
  onSubCategorySelect 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Charger les sous-catégories quand le dropdown s'ouvre
  useEffect(() => {
    if (isOpen && subcategories.length === 0) {
      loadSubcategories();
    }
  }, [isOpen, category.slug]);

  // Fermer le dropdown quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadSubcategories = async () => {
    setLoading(true);
    try {
      const data = await getSubCategoriesByCategory(category.slug);
      setSubcategories(data);
    } catch (error) {
      console.error('Erreur lors du chargement des sous-catégories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubCategoryClick = (subcategory: SubCategory) => {
    if (onSubCategorySelect) {
      onSubCategorySelect(subcategory.slug);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bouton principal */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2 text-left text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
      >
        <div className="flex items-center">
          <span className="font-medium">{category.name}</span>
          {category.products_count && (
            <Badge variant="secondary" size="sm" className="ml-2">
              {category.products_count}
            </Badge>
          )}
        </div>
        
        <motion.svg
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>

      {/* Menu déroulant */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
          >
            {loading ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto"></div>
                <p className="text-sm text-gray-500 mt-2">Chargement...</p>
              </div>
            ) : subcategories.length > 0 ? (
              <div className="py-1">
                {/* Option "Toutes les sous-catégories" */}
                <button
                  onClick={() => handleSubCategoryClick({ slug: '', name: 'Toutes', id: 0, description: '' })}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between transition-colors duration-150"
                >
                  <span className="text-gray-700 font-medium">Toutes les sous-catégories</span>
                  <span className="text-xs text-gray-500">Voir tout</span>
                </button>
                
                <hr className="my-1" />
                
                {/* Liste des sous-catégories */}
                {subcategories.map((subcategory) => (
                  <button
                    key={subcategory.id}
                    onClick={() => handleSubCategoryClick(subcategory)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between transition-colors duration-150 group"
                  >
                    <span className="text-gray-700 group-hover:text-primary-600">
                      {subcategory.name}
                    </span>
                    {subcategory.products_count && (
                      <Badge variant="secondary" size="sm">
                        {subcategory.products_count}
                      </Badge>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">
                <svg className="w-8 h-8 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <p className="text-sm">Aucune sous-catégorie</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategoryDropdown; 