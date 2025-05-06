import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Category, Product, getProductsByCategory, getCategories, getCategoryImageUrl } from '../api/products';
import ProductsGrid from '../components/ProductsGrid';
import { fadeIn, fadeInUp, staggeredList, staggeredItem } from '../utils/animations';

const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [relatedCategories, setRelatedCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Récupérer la catégorie et ses produits
  useEffect(() => {
    const fetchCategoryData = async () => {
      if (!slug) {
        navigate('/products');
        return;
      }

      try {
        setLoading(true);
        
        // Charger toutes les catégories pour pouvoir afficher les catégories connexes
        const allCategoriesData = await getCategories();
        // S'assurer que c'est un tableau
        const allCategories = Array.isArray(allCategoriesData) ? allCategoriesData : [];
        
        if (allCategories.length === 0) {
          setError('Aucune catégorie disponible');
          setLoading(false);
          return;
        }
        
        // Trouver la catégorie actuelle
        const currentCategory = allCategories.find(cat => cat.slug === slug);
        
        if (!currentCategory) {
          setError('Catégorie non trouvée');
          setLoading(false);
          return;
        }
        
        setCategory(currentCategory);
        
        // Charger les produits de cette catégorie
        const categoryProductsData = await getProductsByCategory(slug);
        // S'assurer que c'est un tableau
        const categoryProducts = Array.isArray(categoryProductsData) ? categoryProductsData : [];
        setProducts(categoryProducts);
        
        // Sélectionner quelques catégories connexes (toutes sauf la catégorie actuelle)
        const otherCategories = allCategories.filter(cat => cat.slug !== slug);
        // Sélectionner aléatoirement jusqu'à 4 catégories
        const selectedRelatedCategories = otherCategories
          .sort(() => 0.5 - Math.random())
          .slice(0, 4);
        
        setRelatedCategories(selectedRelatedCategories);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement de la catégorie:', err);
        setError('Erreur lors du chargement de la catégorie. Veuillez réessayer plus tard.');
        setProducts([]);
        setRelatedCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [slug, navigate]);

  // État de chargement
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center">
          <motion.div 
            className="relative w-20 h-20"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute inset-0 rounded-full border-t-4 border-primary-500 opacity-75"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-12 w-12 bg-white rounded-full opacity-80"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-8 w-8 bg-primary-100 rounded-full"></div>
            </div>
          </motion.div>
          <p className="mt-4 text-gray-600">Chargement de la catégorie...</p>
        </div>
      </div>
    );
  }

  // Gestion des erreurs
  if (error || !category) {
    return (
      <motion.div 
        className="container mx-auto px-4 py-12"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="max-w-2xl mx-auto bg-red-50 p-8 rounded-2xl shadow-sm border border-red-100 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-600 font-medium text-xl mb-4">{error || "Catégorie non trouvée"}</p>
          <p className="text-gray-600 mb-6">Nous n'avons pas pu trouver la catégorie demandée.</p>
          <motion.button 
            className="px-6 py-3 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors shadow-sm"
            onClick={() => navigate('/products')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Voir tous les produits
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="container mx-auto px-4 py-8"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      {/* En-tête de la catégorie */}
      <div className="flex flex-col md:flex-row items-start gap-6 mb-12">
        <motion.div 
          className="md:w-1/3 lg:w-1/4"
          variants={fadeInUp}
        >
          <div className="rounded-2xl overflow-hidden h-40 md:h-56 lg:h-64 shadow-md">
            <motion.img 
              src={getCategoryImageUrl(category)} 
              alt={category.name} 
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              onError={(e) => {
                // Fallback en cas d'erreur de chargement d'image
                const target = e.target as HTMLImageElement;
                target.src = `https://via.placeholder.com/600x400?text=${category.name}`;
              }}
            />
          </div>
        </motion.div>
        
        <motion.div 
          className="md:w-2/3 lg:w-3/4"
          variants={fadeInUp}
        >
          <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{category.name}</h1>
            {category.description && (
              <p className="text-gray-600 mb-4">{category.description}</p>
            )}
            <div className="flex items-center text-sm text-gray-500">
              <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full">
                {products.length} produits disponibles
              </span>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Grille de produits */}
      <div className="mb-16">
        {products.length > 0 ? (
          <ProductsGrid 
            title={`Produits ${category.name}`}
            products={products}
          />
        ) : (
          <motion.div 
            className="text-center bg-white p-12 rounded-2xl shadow-sm"
            variants={fadeInUp}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Aucun produit disponible</h3>
            <p className="text-gray-600">
              Aucun produit n'est actuellement disponible dans cette catégorie.
            </p>
          </motion.div>
        )}
      </div>
      
      {/* Catégories connexes */}
      {Array.isArray(relatedCategories) && relatedCategories.length > 0 && (
        <motion.div 
          className="mb-12"
          variants={fadeInUp}
        >
          <h2 className="text-2xl font-bold mb-6">Catégories similaires</h2>
          
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            variants={staggeredList}
          >
            {relatedCategories.map((relatedCategory) => (
              <motion.div 
                key={relatedCategory.id}
                variants={staggeredItem}
              >
                <Link to={`/categories/${relatedCategory.slug}`} className="block">
                  <motion.div 
                    className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-200 h-full"
                    whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}
                  >
                    <div className="aspect-w-16 aspect-h-9 w-full">
                      <img 
                        src={getCategoryImageUrl(relatedCategory)} 
                        alt={relatedCategory.name} 
                        className="w-full h-32 object-cover object-center"
                        onError={(e) => {
                          // Fallback en cas d'erreur de chargement d'image
                          const target = e.target as HTMLImageElement;
                          target.src = `https://via.placeholder.com/300x200?text=${relatedCategory.name}`;
                        }}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-center text-gray-900">{relatedCategory.name}</h3>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default CategoryPage; 