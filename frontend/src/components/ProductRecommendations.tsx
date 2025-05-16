import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Product, getProducts } from '../api/products';
import { Link } from 'react-router-dom';
import { animations, typography, components } from '../utils/designSystem';
import { Card, Badge, Button } from './ui';

interface ProductRecommendationsProps {
  title?: string;
  subtitle?: string;
  className?: string;
  limit?: number;
  variant?: 'grid' | 'carousel';
  showTags?: boolean;
}

const ProductRecommendations: React.FC<ProductRecommendationsProps> = ({
  title = 'Vous aimerez aussi',
  subtitle = 'Sélection basée sur vos préférences',
  className = '',
  limit = 4,
  variant = 'carousel',
  showTags = true
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        // Utilisation de l'API de produits existante
        // Dans un cas réel, il pourrait y avoir une API spécifique pour les recommandations
        const allProducts = await getProducts();
        
        // Filtrer uniquement les produits avec des remises ou mis en avant
        const recommendedProducts = allProducts.filter(
          product => product.discount_percentage > 0 || product.featured
        ).slice(0, limit);
        
        setProducts(recommendedProducts);
      } catch (error) {
        console.error('Erreur lors du chargement des recommandations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [limit]);

  const nextProduct = () => {
    setActiveIndex((prev) => (prev + 1) % products.length);
  };

  const prevProduct = () => {
    setActiveIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
  };

  // Tags pour les recommandations
  const getRecommendationTags = (product: Product): string[] => {
    const tags = [];
    if (product.discount_percentage > 0) tags.push('Promotion');
    if (product.featured) tags.push('Populaire');
    if (product.is_new) tags.push('Nouveau');
    if (product.stock < 5 && product.stock > 0) tags.push('Stock limité');
    return tags;
  };

  // Rendu en fonction du variant (grille ou carrousel)
  if (loading) {
    return (
      <div className={className}>
        <div className="flex justify-center items-center h-48">
          <motion.div 
            className="relative w-12 h-12"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute inset-0 rounded-full border-t-4 border-primary-500 opacity-75"></div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  if (variant === 'carousel') {
    return (
      <div className={className}>
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h2 className={typography.headings.h2}>{title}</h2>
            <p className="text-gray-500 mt-1">{subtitle}</p>
          </div>
          <div className="flex space-x-2 mt-3 sm:mt-0">
            <motion.button 
              onClick={prevProduct}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
            <motion.button 
              onClick={nextProduct}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          </div>
        </div>

        <div className="overflow-hidden">
          <motion.div 
            className="flex"
            animate={{ x: `-${activeIndex * 100}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {products.map((product) => (
              <div key={product.id} className="min-w-full p-1">
                <Card className="p-0 overflow-hidden h-full">
                  <div className="flex flex-col md:flex-row h-full">
                    <div className="md:w-2/5 relative overflow-hidden bg-gray-100">
                      <div className="aspect-[1/1] h-[300px]">
                        {product.images && product.images.length > 0 ? (
                          <motion.img 
                            src={product.images.find(img => img.is_main)?.image_url || product.images[0].image_url} 
                            alt={product.name} 
                            className="w-full h-full object-cover object-center"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.5 }}
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full bg-gray-200">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="md:w-3/5 p-6 flex flex-col">
                      {showTags && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {getRecommendationTags(product).map((tag, index) => (
                            <Badge 
                              key={index} 
                              variant={
                                tag === 'Promotion' ? 'danger' : 
                                tag === 'Populaire' ? 'warning' : 
                                tag === 'Nouveau' ? 'success' : 'info'
                              } 
                              size="sm"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      <Link to={`/products/${product.slug}`} className="hover:text-primary-600 transition-colors">
                        <h3 className={typography.headings.h3}>{product.name}</h3>
                      </Link>
                      
                      <p className="text-gray-500 text-sm line-clamp-2 mt-2 flex-grow">
                        {product.description || "Description non disponible"}
                      </p>
                      
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mt-4">
                        <div>
                          {product.discount_percentage > 0 ? (
                            <div className="flex items-center gap-2">
                              <span className="text-xl font-bold text-primary-600">
                                {(parseFloat(product.price) * (1 - product.discount_percentage / 100)).toFixed(2)} €
                              </span>
                              <span className="text-sm text-gray-500 line-through">
                                {product.price} €
                              </span>
                            </div>
                          ) : (
                            <span className="text-xl font-bold text-primary-600">
                              {product.price} €
                            </span>
                          )}
                        </div>
                        
                        <Button 
                          variant="primary" 
                          size="sm" 
                          to={`/products/${product.slug}`}
                        >
                          Voir le produit
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </motion.div>
        </div>
        
        {/* Indicateurs */}
        <div className="flex justify-center mt-4 space-x-2">
          {products.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === activeIndex ? 'w-6 bg-primary-600' : 'bg-gray-300'
              }`}
              aria-label={`Voir produit ${index + 1}`}
            />
          ))}
        </div>
      </div>
    );
  }

  // Rendu en mode grille
  return (
    <div className={className}>
      <div className="mb-6">
        <h2 className={typography.headings.h2}>{title}</h2>
        <p className="text-gray-500 mt-1">{subtitle}</p>
      </div>
      
      <div className={components.gridLayouts.products}>
        {products.map((product, index) => (
          <motion.div 
            key={product.id}
            variants={animations.fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full p-0 overflow-hidden">
              <div className="relative">
                {product.images && product.images.length > 0 ? (
                  <div className="aspect-[1/1] h-[300px]">
                    <img 
                      src={product.images.find(img => img.is_main)?.image_url || product.images[0].image_url} 
                      alt={product.name} 
                      className="w-full h-full object-cover object-center"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="aspect-[1/1] h-[300px] flex items-center justify-center bg-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                
                {showTags && getRecommendationTags(product).length > 0 && (
                  <div className="absolute top-2 right-2 flex flex-col gap-1">
                    {getRecommendationTags(product).slice(0, 2).map((tag, index) => (
                      <Badge 
                        key={index}
                        variant={
                          tag === 'Promotion' ? 'danger' : 
                          tag === 'Populaire' ? 'warning' : 
                          tag === 'Nouveau' ? 'success' : 'info'
                        }
                        size="xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <Link to={`/products/${product.slug}`} className="hover:text-primary-600 transition-colors">
                  <h3 className="font-medium text-gray-900 line-clamp-2">{product.name}</h3>
                </Link>
                
                <div className="mt-2 flex justify-between items-center">
                  {product.discount_percentage > 0 ? (
                    <div className="flex flex-col">
                      <span className="font-bold text-primary-600">
                        {(parseFloat(product.price) * (1 - product.discount_percentage / 100)).toFixed(2)} €
                      </span>
                      <span className="text-xs text-gray-500 line-through">
                        {product.price} €
                      </span>
                    </div>
                  ) : (
                    <span className="font-bold text-primary-600">
                      {product.price} €
                    </span>
                  )}
                  
                  <Button 
                    variant="minimal" 
                    size="xs" 
                    to={`/products/${product.slug}`}
                    className="text-primary-600 hover:bg-primary-50"
                  >
                    Voir
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProductRecommendations; 