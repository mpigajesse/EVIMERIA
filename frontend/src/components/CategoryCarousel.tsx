import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Category, getCategories, getCategoryImageUrl } from '../api/products';
import { fadeIn, staggeredList, staggeredItem } from '../utils/animations';

const CategoryCarousel: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await getCategories();
        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          console.error('Les données reçues ne sont pas un tableau :', data);
          setCategories([]);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="w-full overflow-x-auto py-8">
        <div className="flex space-x-6">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="w-64 h-64 bg-gray-200 animate-pulse rounded-xl flex-shrink-0"></div>
          ))}
        </div>
      </div>
    );
  }

  const categoryItems = Array.isArray(categories) ? categories : [];
  
  if (categoryItems.length === 0) {
    return null;
  }

  return (
    <motion.div 
      className="py-12"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-2xl md:text-3xl font-bold mb-8 text-center"
          variants={fadeIn}
        >
          Découvrez nos catégories
        </motion.h2>
        
        <div className="relative">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
            variants={staggeredList}
          >
            {categoryItems.map((category) => (
              <motion.div
                key={category.id}
                variants={staggeredItem}
                whileHover={{ y: -10 }}
                className="transition-all duration-300"
              >
                <Link to={`/categories/${category.slug}`} className="block">
                  <div className="bg-white rounded-xl shadow-md overflow-hidden h-full hover:shadow-lg transition-shadow duration-300">
                    <div className="relative h-40 overflow-hidden">
                      <motion.img 
                        src={getCategoryImageUrl(category)} 
                        alt={category.name}
                        className="w-full h-full object-cover object-center" 
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://via.placeholder.com/400x300?text=${category.name}`;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-50"></div>
                    </div>
                    <div className="p-4 text-center">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{category.name}</h3>
                      {category.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">{category.description}</p>
                      )}
                      <motion.div 
                        className="mt-3 inline-block text-sm font-medium text-primary-600 hover:text-primary-700"
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        Explorer <span>&rarr;</span>
                      </motion.div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default CategoryCarousel; 