import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getCategories, Category, getCategoryImageUrl } from '../../api/products';

const CategoriesNav: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const location = useLocation();

  // Récupérer les catégories depuis l'API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await getCategories();
        // S'assurer que data est un tableau
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

  // Mettre à jour la catégorie active en fonction de l'URL
  useEffect(() => {
    const path = location.pathname;
    
    if (path.startsWith('/categories/')) {
      // Nouvelle structure d'URL: /categories/:slug
      const categorySlug = path.split('/').pop();
      setActiveCategory(categorySlug || null);
    } else if (path.startsWith('/products')) {
      // Ancienne structure d'URL: /products?category=:slug
      const searchParams = new URLSearchParams(location.search);
      const categoryParam = searchParams.get('category');
      setActiveCategory(categoryParam);
    } else {
      setActiveCategory(null);
    }
  }, [location]);

  if (loading) {
    return (
      <div className="w-full overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex space-x-6 overflow-x-auto py-4 scrollbar-hide">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="bg-gray-200 animate-pulse h-10 w-32 rounded-full flex-shrink-0"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Protection supplémentaire contre les erreurs de données
  const categoryItems = Array.isArray(categories) ? categories : [];

  return (
    <div className="w-full bg-white shadow-sm overflow-hidden sticky top-16 z-30 border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex space-x-1 md:space-x-3 overflow-x-auto py-2 scrollbar-hide">
          <CategoryButton
            name="Tous les produits"
            slug={null}
            isActive={activeCategory === null}
            imageSrc={null}
          />
          
          {categoryItems.map((category) => (
            <CategoryButton
              key={category.id}
              name={category.name}
              slug={category.slug}
              isActive={activeCategory === category.slug}
              imageSrc={getCategoryImageUrl(category)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

interface CategoryButtonProps {
  name: string;
  slug: string | null;
  isActive: boolean;
  imageSrc: string | null;
}

const CategoryButton: React.FC<CategoryButtonProps> = ({ name, slug, isActive, imageSrc }) => {
  const url = slug ? `/categories/${slug}` : '/products';
  
  return (
    <Link to={url} className="flex-shrink-0 group">
      <motion.div
        className={`relative rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
          isActive 
            ? 'bg-primary-600 text-white' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center space-x-2">
          {imageSrc && (
            <div className="w-6 h-6 rounded-full overflow-hidden bg-white flex-shrink-0">
              <img 
                src={imageSrc} 
                alt={name} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback en cas d'erreur de chargement d'image
                  const target = e.target as HTMLImageElement;
                  target.src = "https://via.placeholder.com/60x60?text=Catégorie";
                }}
              />
            </div>
          )}
          <span className="whitespace-nowrap">{name}</span>
        </div>
        
        {isActive && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1 bg-primary-400 rounded-b-full"
            layoutId="categoryIndicator"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </motion.div>
    </Link>
  );
};

export default CategoriesNav; 