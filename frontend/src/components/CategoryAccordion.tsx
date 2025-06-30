import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Category, SubCategory, getSubCategoriesByCategory } from '../api/products';
import { Badge } from './ui';

interface CategoryAccordionProps {
  categories: Category[];
  onSubCategorySelect?: (categorySlug: string, subcategorySlug?: string) => void;
}

const CategoryAccordion: React.FC<CategoryAccordionProps> = ({ 
  categories, 
  onSubCategorySelect 
}) => {
  const [openCategory, setOpenCategory] = useState<number | null>(null);
  const [subcategories, setSubcategories] = useState<{ [key: string]: SubCategory[] }>({});
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});

  const loadSubcategories = async (categorySlug: string) => {
    if (subcategories[categorySlug]) return; // Déjà chargé

    setLoading(prev => ({ ...prev, [categorySlug]: true }));
    try {
      const data = await getSubCategoriesByCategory(categorySlug);
      setSubcategories(prev => ({ ...prev, [categorySlug]: data }));
    } catch (error) {
      console.error('Erreur lors du chargement des sous-catégories:', error);
    } finally {
      setLoading(prev => ({ ...prev, [categorySlug]: false }));
    }
  };

  const handleCategoryClick = (category: Category) => {
    if (openCategory === category.id) {
      setOpenCategory(null);
    } else {
      setOpenCategory(category.id);
      loadSubcategories(category.slug);
    }
  };

  const handleSubCategoryClick = (categorySlug: string, subcategorySlug?: string) => {
    if (onSubCategorySelect) {
      onSubCategorySelect(categorySlug, subcategorySlug);
    }
  };

  return (
    <div className="space-y-4">
      {categories.map((category) => (
        <motion.div
          key={category.id}
          layout
          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300"
        >
          {/* En-tête de catégorie */}
          <motion.button
            onClick={() => handleCategoryClick(category)}
            className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
          >
            <div className="flex items-center space-x-4">
              {/* Icône de catégorie */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold text-lg">
                {category.name.charAt(0).toUpperCase()}
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-1">
                  {category.name}
                </h3>
                {category.description && (
                  <p className="text-sm text-gray-600 line-clamp-1">
                    {category.description}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Badge du nombre de produits */}
              {category.products_count !== undefined && (
                <Badge variant="primary" size="sm">
                  {category.products_count} produits
                </Badge>
              )}

              {/* Flèche */}
              <motion.svg
                animate={{ rotate: openCategory === category.id ? 180 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="w-6 h-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </motion.svg>
            </div>
          </motion.button>

          {/* Contenu des sous-catégories */}
          <AnimatePresence>
            {openCategory === category.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-6 bg-gray-50">
                  {loading[category.slug] ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                      <span className="ml-3 text-gray-600">Chargement des sous-catégories...</span>
                    </div>
                  ) : subcategories[category.slug]?.length > 0 ? (
                    <div className="space-y-3">
                      {/* Option "Voir toute la catégorie" */}
                      <motion.button
                        whileHover={{ x: 4 }}
                        onClick={() => handleSubCategoryClick(category.slug)}
                        className="w-full flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 group"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                            <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                            </svg>
                          </div>
                          <span className="font-medium text-gray-800 group-hover:text-primary-700">
                            Voir toute la catégorie "{category.name}"
                          </span>
                        </div>
                        <Badge variant="outline" size="sm">
                          {category.products_count || 0}
                        </Badge>
                      </motion.button>

                      {/* Liste des sous-catégories */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {subcategories[category.slug].map((subcategory) => (
                          <motion.button
                            key={subcategory.id}
                            whileHover={{ x: 4 }}
                            onClick={() => handleSubCategoryClick(category.slug, subcategory.slug)}
                            className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 group text-left"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                                <span className="text-xs font-medium text-gray-600 group-hover:text-primary-600">
                                  {subcategory.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <span className="text-gray-700 group-hover:text-primary-700 font-medium">
                                {subcategory.name}
                              </span>
                            </div>
                            {subcategory.products_count && (
                              <Badge variant="secondary" size="xs">
                                {subcategory.products_count}
                              </Badge>
                            )}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      <p className="text-gray-500">Aucune sous-catégorie disponible</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
};

export default CategoryAccordion; 