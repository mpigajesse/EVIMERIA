import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Product, getProducts } from '../api/products';
import { Link } from 'react-router-dom';
import { components, typography, animations, colors } from '../utils/designSystem';
import { Card, Badge, Button, Loader } from './ui';

interface PromoSectionProps {
  title?: string;
  subtitle?: string;
  className?: string;
  endsIn?: number; // Temps restant en heures
  limit?: number;
  minDiscount?: number; // Promotion minimale en pourcentage
  variant?: 'countdown' | 'simple';
}

const PromoSection: React.FC<PromoSectionProps> = ({
  title = 'Prix en baisse',
  subtitle = 'Offres à durée limitée',
  className = '',
  endsIn = 48,
  limit = 3,
  minDiscount = 10,
  variant = 'countdown'
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({
    hours: Math.floor(endsIn),
    minutes: 0,
    seconds: 0
  });

  // Récupération des produits en promotion
  useEffect(() => {
    const fetchPromoProducts = async () => {
      try {
        setLoading(true);
        const allProducts = await getProducts();
        
        // Filtrer uniquement les produits avec des remises supérieures au minimum demandé
        const promoProducts = allProducts
          .filter(product => product.discount_percentage >= minDiscount)
          .sort((a, b) => b.discount_percentage - a.discount_percentage) // Trier par remise décroissante
          .slice(0, limit);
        
        setProducts(promoProducts);
      } catch (error) {
        console.error('Erreur lors du chargement des promotions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPromoProducts();
  }, [limit, minDiscount]);

  // Gestion du compte à rebours
  useEffect(() => {
    if (variant !== 'countdown') return;
    
    // Calcul du temps initial
    const initialTimeInSeconds = (endsIn * 60 * 60);
    const hours = Math.floor(initialTimeInSeconds / 3600);
    const minutes = Math.floor((initialTimeInSeconds % 3600) / 60);
    const seconds = initialTimeInSeconds % 60;
    
    setTimeLeft({ hours, minutes, seconds });
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        // Si le compteur est à zéro, on arrête
        if (prev.hours === 0 && prev.minutes === 0 && prev.seconds === 0) {
          clearInterval(timer);
          return prev;
        }
        
        // Calcul du nouveau temps
        let newHours = prev.hours;
        let newMinutes = prev.minutes;
        let newSeconds = prev.seconds - 1;
        
        if (newSeconds < 0) {
          newSeconds = 59;
          newMinutes -= 1;
        }
        
        if (newMinutes < 0) {
          newMinutes = 59;
          newHours -= 1;
        }
        
        return { hours: newHours, minutes: newMinutes, seconds: newSeconds };
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [endsIn, variant]);

  // Rendu conditionnel en fonction de l'état de chargement
  if (loading) {
    return (
      <div className={className}>
        <div className="text-center py-12">
          <Loader 
            variant="circle" 
            color={variant === 'countdown' ? 'white' : 'primary'} 
            size="lg" 
            text="Chargement des offres spéciales..."
            centered
          />
        </div>
      </div>
    );
  }

  // Pas de produits en promotion
  if (products.length === 0) {
    return null;
  }

  // Formatage du temps pour l'affichage
  const formatTime = (value: number): string => {
    return value < 10 ? `0${value}` : `${value}`;
  };

  return (
    <div className={className}>
      <motion.div 
        className="mb-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Badge 
          variant="danger" 
          size="md" 
          className="mb-3 inline-block bg-red-500 text-white"
        >
          Offre spéciale
        </Badge>
        <h2 className={typography.headings.h2}>{title}</h2>
        <p className="text-gray-500 mt-2">{subtitle}</p>
        
        {variant === 'countdown' && (
          <motion.div 
            className="mt-6 flex justify-center gap-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-center">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold bg-gray-800 text-white rounded-lg px-4 py-2 min-w-[60px]">
                {formatTime(timeLeft.hours)}
              </div>
              <p className="text-xs mt-1 text-gray-500">Heures</p>
            </div>
            <div className="text-2xl font-bold text-gray-400 flex items-center">:</div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold bg-gray-800 text-white rounded-lg px-4 py-2 min-w-[60px]">
                {formatTime(timeLeft.minutes)}
              </div>
              <p className="text-xs mt-1 text-gray-500">Minutes</p>
            </div>
            <div className="text-2xl font-bold text-gray-400 flex items-center">:</div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold bg-gray-800 text-white rounded-lg px-4 py-2 min-w-[60px]">
                {formatTime(timeLeft.seconds)}
              </div>
              <p className="text-xs mt-1 text-gray-500">Secondes</p>
            </div>
          </motion.div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product, index) => (
          <motion.div 
            key={product.id} 
            className="flex flex-col h-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full p-0 overflow-hidden flex flex-col">
              <div className="relative">
                {/* Badge de promotion */}
                <div className="absolute top-0 left-0 z-10">
                  <div className="bg-red-600 text-white font-bold px-6 py-2 shadow-lg transform -skew-x-12">
                    -{product.discount_percentage}%
                  </div>
                </div>
                
                {/* Image */}
                <div className="aspect-[4/3] overflow-hidden relative">
                  {product.images && product.images.length > 0 ? (
                    <Link to={`/products/${product.slug}`}>
                      <motion.img 
                        src={product.images.find(img => img.is_main)?.image_url || product.images[0].image_url} 
                        alt={product.name} 
                        className="w-full h-full object-cover object-center"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.5 }}
                        loading="lazy"
                      />
                      <div className={colors.overlay.gradient + " absolute inset-0"}></div>
                    </Link>
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Contenu */}
              <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-3">
                  <Badge variant="info" size="sm" className="bg-blue-100 text-blue-700">
                    {product.category_name}
                  </Badge>
                  
                  {product.stock > 0 ? (
                    <Badge variant="success" size="xs" className="bg-green-100 text-green-700">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1 inline-block"></span>
                      En stock
                    </Badge>
                  ) : (
                    <Badge variant="danger" size="xs" className="bg-red-100 text-red-700">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1 inline-block"></span>
                      Rupture
                    </Badge>
                  )}
                </div>
                
                <Link to={`/products/${product.slug}`} className="hover:text-primary-600 transition-colors">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                </Link>
                
                <p className="text-sm text-gray-500 mb-4 line-clamp-3 flex-grow">
                  {product.description || "Aucune description disponible pour ce produit."}
                </p>
                
                <div className="mt-auto pt-4 border-t border-gray-100">
                  <div className="flex flex-wrap justify-between items-center">
                    <div className="flex items-baseline space-x-2">
                      <span className="text-2xl font-bold text-primary-600">
                        {(parseFloat(product.price) * (1 - product.discount_percentage / 100)).toFixed(2)} €
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        {product.price} €
                      </span>
                    </div>
                    
                    <Button 
                      variant="primary" 
                      size="sm" 
                      to={`/products/${product.slug}`}
                      className="mt-2 sm:mt-0"
                    >
                      Voir l'offre
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-8 text-center">
        <Button 
          variant="outlined" 
          size="lg" 
          to="/products"
          className="border-primary-500 text-primary-600 px-8"
        >
          Voir toutes les promotions
        </Button>
      </div>
    </div>
  );
};

export default PromoSection; 