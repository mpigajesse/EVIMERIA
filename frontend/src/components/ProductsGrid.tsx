import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Product, getProducts, getFeaturedProducts } from '../api/products';
import { fadeIn, staggeredList, staggeredItem, productCardHover, imageZoom } from '../utils/animations';

interface ProductsGridProps {
  title?: string;
  featuredOnly?: boolean;
  limit?: number;
  className?: string;
  products?: Product[]; // Ajout de la possibilité de passer des produits directement
}

const ProductsGrid: React.FC<ProductsGridProps> = ({ 
  title = 'Nos produits', 
  featuredOnly = false,
  limit,
  className = '',
  products: propProducts,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
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
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        className="text-center bg-red-50 p-6 rounded-2xl shadow-sm border border-red-100"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-red-600 font-medium mb-3">{error}</p>
        <motion.button 
          className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-sm"
          onClick={() => window.location.reload()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Réessayer
        </motion.button>
      </motion.div>
    );
  }

  if (products.length === 0) {
    return (
      <motion.div 
        className="text-center bg-gray-50 p-8 rounded-2xl border border-gray-100"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <p className="text-gray-600 text-lg">Aucun produit disponible pour le moment.</p>
      </motion.div>
    );
  }

  // Calculer les remises en pourcentage (simulation)
  const getDiscountPercentage = (productId: number) => {
    // Pour l'exemple, on crée une remise aléatoire pour certains produits
    // Dans un vrai cas d'utilisation, cette valeur viendrait du backend
    if (productId % 3 === 0) {
      return Math.floor(Math.random() * 30) + 10; // Remise entre 10% et 40%
    }
    return null;
  };

  return (
    <div className={className}>
      {title && (
        <motion.h2 
          className="text-2xl font-bold mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {title}
        </motion.h2>
      )}
      
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        variants={staggeredList}
        initial="hidden"
        animate="visible"
      >
        {products.map((product) => {
          const discount = getDiscountPercentage(product.id);
          return (
            <motion.div key={product.id} variants={staggeredItem}>
              <Link to={`/products/${product.slug}`} className="group block">
                <motion.div 
                  className="bg-white rounded-3xl shadow-sm overflow-hidden h-full transition-all duration-300 hover:shadow-lg relative"
                  whileHover="hover"
                  initial="initial"
                  variants={productCardHover}
                >
                  <div className="relative overflow-hidden">
                    <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-50">
                      {product.images && product.images.length > 0 ? (
                        <motion.img 
                          src={product.images.find(img => img.is_main)?.image_url || product.images[0].image_url} 
                          alt={product.name} 
                          className="w-full h-64 object-cover object-center"
                          variants={imageZoom}
                          transition={{ duration: 0.4 }}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-64 bg-gray-100">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    {/* Overlay avec effet de hover */}
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
                    
                    {/* Éléments décoratifs flottants */}
                    <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-primary-500 rounded-full opacity-10 group-hover:opacity-20 transition-opacity"></div>
                    <div className="absolute bottom-1/3 right-1/3 w-6 h-6 bg-secondary-500 rounded-full opacity-10 group-hover:opacity-20 transition-opacity"></div>
                    
                    {/* Badge pour les produits en vedette */}
                    {product.featured && (
                      <div className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                        Populaire
                      </div>
                    )}
                    
                    {/* Badge de remise */}
                    {discount && (
                      <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                        -{discount}%
                      </div>
                    )}
                    
                    {/* Badge pour les produits en rupture de stock */}
                    {product.stock === 0 && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                        Rupture
                      </div>
                    )}

                    {/* Bouton rapide d'ajout au panier (visible au survol) */}
                    <div className="absolute bottom-4 right-4 transform translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <motion.button 
                        className="bg-primary-600 text-white p-2 rounded-full shadow-lg hover:bg-primary-700"
                        whileTap={{ scale: 0.95 }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </motion.button>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <p className="text-xs text-gray-500 mb-1">{product.category_name}</p>
                    <h3 className="text-lg font-medium text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">{product.name}</h3>
                    
                    <div className="mt-3 flex justify-between items-center">
                      <div className="flex flex-col">
                        {discount ? (
                          <>
                            <span className="text-lg font-bold text-primary-600">
                              {(parseFloat(product.price) * (1 - discount / 100)).toFixed(2)} €
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              {product.price} €
                            </span>
                          </>
                        ) : (
                          <span className="text-lg font-bold text-primary-600">{product.price} €</span>
                        )}
                      </div>
                      
                      {product.stock > 0 ? (
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full flex items-center">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span>
                          En stock
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full flex items-center">
                          <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1"></span>
                          Rupture
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-4 flex justify-between items-center">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg key={star} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      
                      <button className="text-xs text-primary-600 font-medium bg-primary-50 hover:bg-primary-100 px-3 py-1 rounded-full transition-colors flex items-center">
                        <span>Voir</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default ProductsGrid; 