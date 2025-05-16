import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Product } from '../api/products';
import { Badge } from './ui';
import { classNames } from '../utils/designSystem';
import { CurrencyCode, useCurrencyFormatter } from '../utils/currency';

interface ProductCardProps {
  product: Product;
  className?: string;
  currencyCode?: CurrencyCode;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  className = '',
  currencyCode = 'EUR'
}) => {
  // Utiliser le hook pour formater les prix selon la devise
  const formatPrice = useCurrencyFormatter(currencyCode);
  
  // Calcul du rabais si applicable
  const discount = product.discount_percentage || 0;
  const priceValue = parseFloat(product.price);
  const discountedPriceValue = discount > 0 
    ? priceValue * (1 - discount / 100)
    : null;

  // Détermination des badges à afficher
  const productBadges = [];
  
  if (discount > 0) {
    productBadges.push(
      <Badge 
        key="discount" 
        variant="danger" 
        size="sm" 
        className="bg-red-500 text-white"
      >
        -{discount}%
      </Badge>
    );
  }
  
  if (product.is_new) {
    productBadges.push(
      <Badge 
        key="new" 
        variant="success" 
        size="sm" 
        className="bg-emerald-500 text-white"
      >
        Nouveau
      </Badge>
    );
  }
  
  if (product.featured) {
    productBadges.push(
      <Badge 
        key="featured" 
        variant="warning" 
        size="sm" 
        className="bg-amber-500 text-white"
      >
        Vedette
      </Badge>
    );
  }

  // Gestion du clic sur le bouton d'ajout au panier
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Logique d'ajout au panier (à implémenter)
    console.log('Ajouter au panier:', product.id);
  };

  // Icône de panier
  const cartIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4, type: "spring", stiffness: 300 }}
      className={classNames("group h-full", className)}
    >
      <Link 
        to={`/products/${product.slug}`} 
        className="block h-full bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300"
      >
        {/* Badges en haut à droite */}
        {productBadges.length > 0 && (
          <div className="absolute top-2 right-2 z-10 flex flex-wrap gap-1">
            {productBadges}
          </div>
        )}
        
        {/* Image du produit - taille fixe et uniforme */}
        <div className="relative overflow-hidden bg-gray-100">
          <div className="aspect-[1/1] w-full h-[300px]">
            {product.images && product.images.length > 0 ? (
              <motion.div
                className="w-full h-full bg-gray-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.img 
                  src={product.images.find(img => img.is_main)?.image_url || product.images[0].image_url} 
                  alt={product.name} 
                  className="w-full h-full object-cover object-center"
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  loading="lazy"
                />
              </motion.div>
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>

          {/* Bouton d'ajout au panier sur mobile et au survol sur desktop */}
          <motion.div 
            className="absolute bottom-3 right-3 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.button
              className="bg-primary-600 hover:bg-primary-700 text-white rounded-full p-2 shadow-md flex items-center transition-colors"
              onClick={handleAddToCart}
              aria-label="Ajouter au panier"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {cartIcon}
            </motion.button>
          </motion.div>
        </div>
        
        {/* Informations produit - hauteur fixe */}
        <div className="p-4 h-[180px] flex flex-col">
          {/* Catégorie */}
          <Badge 
            variant="info" 
            size="xs" 
            className="mb-1 inline-block bg-blue-100 text-blue-700"
          >
            {product.category_name}
          </Badge>
          
          {/* Nom du produit */}
          <h3 className="text-base font-medium text-gray-900 line-clamp-2 mb-2 flex-grow-0">
            {product.name}
          </h3>
          
          {/* Prix et stock */}
          <div className="mt-auto flex justify-between items-center">
            <div className="flex flex-col">
              {discount ? (
                <>
                  <span className="text-base font-bold text-primary-600">
                    {formatPrice(discountedPriceValue || 0)}
                  </span>
                  <span className="text-xs text-gray-500 line-through">
                    {formatPrice(priceValue)}
                  </span>
                </>
              ) : (
                <span className="text-base font-bold text-primary-600">
                  {formatPrice(priceValue)}
                </span>
              )}
            </div>
            
            {product.stock > 0 ? (
              <Badge variant="success" size="xs" className="bg-green-100 text-green-700">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span>
                En stock
              </Badge>
            ) : (
              <Badge variant="danger" size="xs" className="bg-red-100 text-red-700">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1"></span>
                Rupture
              </Badge>
            )}
          </div>
          
          {/* Évaluation */}
          <div className="mt-2 flex items-center text-xs text-gray-500">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg 
                  key={i} 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-3.5 w-3.5 ${i < Math.round(product.rating || 0) ? 'text-amber-400' : 'text-gray-300'}`} 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="ml-1">({product.review_count || 0})</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard; 