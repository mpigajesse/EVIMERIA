import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Product, getProducts, getFeaturedProducts } from '../api/products';
import { animations, components, typography } from '../utils/designSystem';
import ProductCard from './ProductCard';
import { Loader } from './ui';
import CurrencySwitcher from './CurrencySwitcher';
import { CurrencyCode, currencies } from '../utils/currency';

interface ProductsGridProps {
  title?: string;
  featuredOnly?: boolean;
  limit?: number;
  className?: string;
  products?: Product[]; // Possibilité de passer des produits directement
  showCurrencySwitcher?: boolean;
}

// Composant SkeletonCard pour afficher pendant le chargement
const SkeletonCard: React.FC = () => (
  <div className="bg-white rounded-xl shadow-sm overflow-hidden h-full">
    <div className="aspect-[1/1] w-full h-[300px] bg-gray-200 animate-pulse"></div>
    <div className="p-4 h-[180px]">
      <div className="w-1/3 h-5 bg-gray-200 rounded-full mb-3 animate-pulse"></div>
      <div className="w-full h-5 bg-gray-200 rounded-full mb-2 animate-pulse"></div>
      <div className="w-2/3 h-5 bg-gray-200 rounded-full mb-6 animate-pulse"></div>
      <div className="flex justify-between items-center mt-auto">
        <div className="w-1/4 h-6 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="w-1/5 h-5 bg-gray-200 rounded-full animate-pulse"></div>
      </div>
    </div>
  </div>
);

const ProductsGrid: React.FC<ProductsGridProps> = ({ 
  title = 'Nos produits', 
  featuredOnly = false,
  limit,
  className = '',
  products: propProducts,
  showCurrencySwitcher = true,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currencyCode, setCurrencyCode] = useState<CurrencyCode>('EUR');

  // Récupérer la devise préférée du localStorage au chargement
  useEffect(() => {
    const savedCurrency = localStorage.getItem('preferredCurrency') as CurrencyCode | null;
    if (savedCurrency && currencies[savedCurrency]) {
      setCurrencyCode(savedCurrency);
    }
  }, []);

  useEffect(() => {
    // Si des produits sont passés en props, on les utilise directement
    if (propProducts) {
      setProducts(limit ? propProducts.slice(0, limit) : propProducts);
      setLoading(false);
      return;
    }

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = featuredOnly 
          ? await getFeaturedProducts() 
          : await getProducts();
        
        // Appliquer la limite si spécifiée
        const limitedData = limit ? data.slice(0, limit) : data;
        setProducts(limitedData);
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement des produits');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [featuredOnly, limit, propProducts]);

  // Gérer le changement de devise
  const handleCurrencyChange = (currency: typeof currencies[CurrencyCode]) => {
    setCurrencyCode(currency.code);
  };

  if (loading) {
    // Affichage de skeletons durant le chargement
    return (
      <div className={className}>
        {title && (
          <h2 className={typography.headings.h2}>{title}</h2>
        )}
        <div className={components.gridLayouts.products}>
          {[...Array(limit || 8)].map((_, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <SkeletonCard />
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-100 rounded-xl text-center p-6 sm:p-8 flex flex-col items-center">
        <Loader variant="pulse" color="primary" size="md" className="mb-4" />
        <p className="text-red-600 font-medium mb-2 sm:mb-3">{error}</p>
        <motion.button 
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          onClick={() => window.location.reload()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Réessayer
        </motion.button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-100 rounded-xl text-center p-6 sm:p-8">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-gray-300 mb-3 sm:mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <p className="text-gray-600 text-lg">Aucun produit disponible pour le moment.</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
        {title && (
          <motion.h2 
            className={typography.headings.h2}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {title}
          </motion.h2>
        )}
        
        {/* Sélecteur de devise */}
        {showCurrencySwitcher && (
          <div className="w-full sm:w-auto">
            <CurrencySwitcher 
              defaultCurrency={currencyCode}
              onCurrencyChange={handleCurrencyChange}
              className="w-full sm:w-auto"
            />
          </div>
        )}
      </div>
      
      <motion.div 
        className={components.gridLayouts.products}
        initial="hidden"
        animate="visible"
        variants={animations.staggerChildren}
      >
        {products.map((product, index) => (
          <motion.div 
            key={product.id} 
            variants={animations.fadeInUp}
            custom={index}
            transition={{ delay: index * 0.05 }}
          >
            <ProductCard 
              product={product} 
              currencyCode={currencyCode}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default ProductsGrid; 