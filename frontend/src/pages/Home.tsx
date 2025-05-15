import React from 'react';
import { motion } from 'framer-motion';
import HeroSection from '../components/HeroSection';
import CategorySection from '../components/CategorySection';
import ProductsGrid from '../components/ProductsGrid';
import Newsletter from '../components/Newsletter';
import CTABanner from '../components/CTABanner';
import { NavButton } from '../components/ui';

const Home: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Section Hero avec bouton "Nos catégories" en bleu */}
      <HeroSection />
      
      {/* Section Catégories avec boutons Explorer en bleu */}
      <CategorySection />
      
      {/* Section Produits Vedettes */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProductsGrid 
            title="Produits populaires" 
            featuredOnly={true} 
            limit={8} 
          />
          
          <div className="text-center mt-12">
            <NavButton 
              to="/products" 
              variant="primary"
            >
              Voir tous les produits
            </NavButton>
          </div>
        </div>
      </section>
      
      {/* Bannière CTA */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CTABanner 
            title="Profitez de nos offres exclusives" 
            description="Inscrivez-vous à notre newsletter pour recevoir des réductions et être informé des dernières tendances."
            primaryButtonText="Explorer les nouveautés"
            primaryButtonLink="/categories/nouveautes"
            secondaryButtonText="Nos meilleures ventes"
            secondaryButtonLink="/products/featured"
            bgColor="gradient"
          />
        </div>
      </section>
      
      {/* Avantages */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-2 rounded-full bg-primary-100 text-primary-800 font-medium text-sm mb-4">
              Avantages
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Pourquoi nous choisir</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Qualité Premium */}
            <div className="bg-white p-8 rounded-3xl shadow-md flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Qualité Premium</h3>
              <p className="text-gray-600">
                Des vêtements fabriqués avec les meilleurs matériaux pour une durabilité et un confort incomparables.
              </p>
            </div>
            
            {/* Livraison Rapide */}
            <div className="bg-white p-8 rounded-3xl shadow-md flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Livraison Rapide</h3>
              <p className="text-gray-600">
                Recevez votre commande en un temps record grâce à notre service de livraison express.
              </p>
            </div>
            
            {/* Retours Gratuits */}
            <div className="bg-white p-8 rounded-3xl shadow-md flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Retours Gratuits</h3>
              <p className="text-gray-600">
                Insatisfait ? Retournez votre article dans les 30 jours pour un remboursement complet.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Newsletter */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Newsletter variant="gradient" />
        </div>
      </section>
    </motion.div>
  );
};

export default Home; 