import React from 'react';
import { motion } from 'framer-motion';
import { components, animations, typography } from '../utils/designSystem';
import ProductDetail from '../components/ProductDetail';
import ProductRecommendations from '../components/ProductRecommendations';
import PromoSection from '../components/PromoSection';
import { SectionTitle } from '../components/ui';
import SimilarCategories from '../components/SimilarCategories';

const ProductDetailPage: React.FC = () => {
  return (
    <div className={components.containers.page}>
      {/* Éléments décoratifs d'arrière-plan */}
      <div className={`${components.decorations.blobs} w-96 h-96 bg-primary-300 top-10 -right-48 opacity-20`}></div>
      <div className={`${components.decorations.blobs} w-80 h-80 bg-secondary-300 bottom-40 -left-40 opacity-20`}></div>
      
      <div className={components.containers.maxWidth}>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={animations.fadeIn}
        >
          {/* Détail du produit */}
          <ProductDetail />
          
          {/* Recommandations de produits similaires */}
          <div className="mt-16">
            <SectionTitle 
              title="Vous aimerez aussi" 
              subtitle="Basé sur vos préférences de navigation"
              align="center"
              size="lg"
            />
            <div className="mt-8">
              <ProductRecommendations 
                variant="grid"
                limit={4}
              />
            </div>
          </div>
          
          {/* Catégories similaires */}
          <div className="mt-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="py-8 px-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl shadow-sm"
            >
              <SectionTitle 
                title="Catégories similaires" 
                subtitle="Explorez d'autres catégories qui pourraient vous plaire"
                align="center"
                size="md"
                badge="Découvrez plus"
                badgeVariant="info"
              />
              <div className="mt-8">
                <SimilarCategories limit={3} />
              </div>
            </motion.div>
          </div>
          
          {/* Section promotionnelle */}
          <div className="mt-16">
            <PromoSection 
              title="Offres spéciales" 
              subtitle="À saisir avant expiration"
              className="bg-gradient-to-r from-primary-900 to-primary-800 text-white py-12 px-6 rounded-3xl shadow-lg"
              variant="countdown"
              endsIn={48}
              limit={3}
              minDiscount={15}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetailPage; 