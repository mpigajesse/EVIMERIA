import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getCategories, Category } from '../../api/products';

const CategoriesNav: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
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

  if (loading) {
    return (
      <div className="w-full overflow-hidden bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="flex space-x-6 overflow-x-auto py-4 scrollbar-hide">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="bg-blue-200 animate-pulse h-10 w-32 rounded-full flex-shrink-0"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 py-3 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center overflow-x-auto hide-scrollbar gap-2 sm:gap-4">
          <Link 
            to="/products" 
            className={`
              px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors
              ${location.pathname === '/products' && !location.search ? 'bg-blue-600 text-white' : 'text-blue-900 hover:bg-blue-100'}
            `}
          >
            Tous les produits
          </Link>
          
          <Link 
            to="/products?featured=true" 
            className={`
              px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors
              ${location.search === '?featured=true' ? 'bg-violet-600 text-white' : 'text-violet-900 hover:bg-violet-100'}
            `}
          >
            En vedette
          </Link>
          
          <Link 
            to="/products?new=true" 
            className={`
              px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors
              ${location.search === '?new=true' ? 'bg-green-600 text-white' : 'text-green-900 hover:bg-green-100'}
            `}
          >
            Nouveautés
          </Link>
          
          {categories.map(category => (
            <Link 
              key={category.id}
              to={`/categories/${category.slug}`}
              className={`
                px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors
                ${location.pathname === `/categories/${category.slug}` ? 'bg-blue-600 text-white' : 'text-blue-900 hover:bg-blue-100'}
              `}
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesNav; 