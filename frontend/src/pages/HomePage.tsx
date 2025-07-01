import React from 'react';
import { motion } from 'framer-motion';
import ProductsGrid from '../components/ProductsGrid';
import CategoryCarousel from '../components/CategoryCarousel';
import { components, typography, animations, colors } from '../utils/designSystem';
import { Button, Card, Input, Badge, SectionTitle } from '../components/ui';
import ProductRecommendations from '../components/ProductRecommendations';
import PromoSection from '../components/PromoSection';
import { useFeaturedProduct } from '../hooks/useFeaturedProduct';
import CurrencySwitcher from '../components/CurrencySwitcher';



const HomePage = () => {
  const { featuredProduct, loading: productLoading, mainImage } = useFeaturedProduct();

  return (
    <div className={components.containers.page}>
      {/* Éléments décoratifs d'arrière-plan */}
      <div className={`${components.decorations.blobs} w-96 h-96 bg-primary-400 top-20 -left-48`}></div>
      <div className={`${components.decorations.blobs} w-80 h-80 bg-secondary-400 bottom-40 -right-40`}></div>
      
      <div className={components.containers.maxWidth}>
        {/* Hero Section avec design moderne et animations */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={animations.staggerChildren}
          className="mb-16"
        >
          <Card className="overflow-hidden" padding="none" elevation="high">
          <div className="flex flex-col md:flex-row">
              <motion.div 
                className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center"
                variants={animations.slideInLeft}
              >
                <Badge variant="primary" className="mb-4 animate-pulse">Nouvelle collection</Badge>
                <h1 className={typography.headings.display}>
                  EVIMERIA <span className="text-primary-600">Inspiring</span> Fashion.
              </h1>
                <p className={`${typography.body.medium} mb-8 max-w-lg mt-4`}>
                Découvrez notre collection exclusive et faites de votre style une déclaration de mode unique.
              </p>
                <div className="flex flex-wrap gap-4">
                  <Button 
                    variant="primary"
                    size="lg"
                  to="/products"
                    className="bg-blue-600 !text-black"
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                    }
                  >
                    Explorer nos produits
                  </Button>
                  <Button 
                    variant="secondary"
                    size="lg"
                    to="/categories"
                  >
                    Nos catégories
                  </Button>
                </div>

                {/* Indicateurs de confiance */}
                <div className="flex flex-wrap gap-6 mt-12">
                  <motion.div 
                    className="flex items-center text-sm"
                    variants={animations.fadeInUp}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="bg-primary-100 p-2 rounded-full mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className={typography.body.medium}>Livraison 24h</span>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center text-sm"
                    variants={animations.fadeInUp}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="bg-primary-100 p-2 rounded-full mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
              </div>
                    <span className={typography.body.medium}>Garantie qualité</span>
                  </motion.div>
            </div>
              </motion.div>
              
              <motion.div 
                className="md:w-1/2 relative overflow-hidden rounded-2xl h-[350px] md:h-[450px] flex-shrink-0"
                variants={animations.scaleIn}
                style={{
                  height: window.innerWidth < 768 ? '350px' : '450px',
                  minHeight: window.innerWidth < 768 ? '350px' : '450px',
                  maxHeight: window.innerWidth < 768 ? '350px' : '450px'
                }}
              >
                {productLoading ? (
                  <div className="w-full h-full featured-loading flex items-center justify-center rounded-2xl">
                    <div className="text-gray-500 font-medium">Chargement du produit...</div>
                  </div>
                ) : mainImage ? (
                  <div className="w-full h-full relative overflow-hidden rounded-2xl featured-product-container">
                    {/* Image avec contournement intelligent */}
                <motion.img
                      src={mainImage.image}
                      alt={featuredProduct?.name || "Produit vedette"}
                      className="w-full h-full featured-product-image"
                      style={{ 
                        objectFit: 'contain',
                        objectPosition: 'center',
                        padding: '20px',
                        maxWidth: '100%',
                        maxHeight: '100%'
                      }}
                      whileHover={{ scale: 1.03 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      onLoad={(e) => {
                        // Ajuster dynamiquement selon les proportions de l'image
                        const img = e.target as HTMLImageElement;
                        const aspectRatio = img.naturalWidth / img.naturalHeight;
                        
                        if (aspectRatio > 1.5) {
                          // Image très large
                          img.style.objectFit = 'contain';
                          img.style.padding = '30px 20px';
                        } else if (aspectRatio < 0.8) {
                          // Image très haute
                          img.style.objectFit = 'contain';
                          img.style.padding = '20px 40px';
                        } else {
                          // Proportions normales
                          img.style.objectFit = 'contain';
                          img.style.padding = '25px';
                        }
                      }}
                    />
                    
                    {/* Effet de brillance subtil */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none"></div>
                    
                    {/* Overlay décoratif très discret */}
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/5 pointer-events-none"></div>
                  </div>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center rounded-2xl">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-500 font-medium">Aucune image disponible</p>
                  </div>
                )}
                {/* Badges flottants avec animation */}
                <motion.div 
                  className="absolute top-8 right-8 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg"
                  variants={animations.fadeInDown}
                  transition={{ delay: 0.3 }}
                  animate={animations.float}
                >
                  <span className="font-bold text-primary-600">
                    {featuredProduct?.name || "Collection limitée"}
                  </span>
                </motion.div>
                
                {/* Cercles décoratifs */}
                <motion.div 
                  className="absolute top-1/4 left-1/4 w-16 h-16 bg-primary-500 rounded-full opacity-20"
                  animate={animations.pulse}
                ></motion.div>
                <motion.div 
                  className="absolute bottom-1/3 right-1/3 w-12 h-12 bg-secondary-500 rounded-full opacity-20"
                  animate={animations.pulse}
                  transition={{ delay: 0.5 }}
                ></motion.div>
              </motion.div>
            </div>
          </Card>
        </motion.div>

        {/* Catégories populaires avec le nouveau carrousel */}
        <CategoryCarousel />

        {/* Produits en vedette avec design amélioré */}
        <div id="featured" className="relative">
          {/* Élément décoratif */}
          <div className={`${components.decorations.blobs} w-64 h-64 bg-amber-300 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}></div>
          
          <Card className={components.containers.glass}>
            <div className="flex items-center justify-between mb-6">
              <SectionTitle
                title="Produits en vedette"
                badge="Populaire"
                badgeVariant="warning"
                size="lg"
              />
              <CurrencySwitcher className="ml-4" />
            </div>
          
          <ProductsGrid featuredOnly={true} limit={4} title="" showCurrencySwitcher={false} />
          </Card>
        </div>

        {/* Section de promotions avec compte à rebours */}
        <div className="my-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Card className="bg-gradient-to-r from-blue-600 via-violet-600 to-green-600 p-8 sm:p-10 !text-black overflow-hidden relative shadow-xl rounded-3xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
              {/* Éléments décoratifs animés */}
              <motion.div 
                className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full" 
                animate={{ x: [50, 30, 50], y: [-50, -30, -50], opacity: [0.5, 0.7, 0.5] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div 
                className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full" 
                animate={{ x: [-50, -30, -50], y: [50, 30, 50], opacity: [0.5, 0.7, 0.5] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div 
                className="absolute top-1/2 left-1/3 w-16 h-16 bg-blue-300/30 rounded-full" 
                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div 
                className="absolute bottom-1/3 right-1/4 w-20 h-20 bg-violet-300/20 rounded-full" 
                animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              />
              <motion.div 
                className="absolute top-1/4 right-1/3 w-12 h-12 bg-green-300/20 rounded-full" 
                animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              />
              
              <div className="relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  viewport={{ once: true }}
                >
            <PromoSection 
                    title="Du00e9couvrez EVIMERIA" 
                    subtitle="Votre nouvelle plateforme de mode et d'accessoires - Vivez une expu00e9rience shopping unique et innovante !" 
              variant="countdown"
              endsIn={24}
              minDiscount={15}
              limit={3}
              className="relative z-10"
            />
                </motion.div>
              </div>
          </Card>
          </motion.div>
        </div>

        {/* Recommandations de produits */}
        <div className="my-16">
          <ProductRecommendations 
            title="Nos meilleures offres" 
            subtitle="Découvrez les promotions et articles populaires" 
            variant="carousel" 
            limit={5} 
          />
        </div>

        {/* Avantages avec design moderne */}
        <div className="relative overflow-hidden">
          <Card className={components.containers.feature}>
            <SectionTitle
              title="Pourquoi nous choisir"
              align="center"
              size="lg"
              badge="Avantages"
              badgeVariant="success"
            />
          
            <div className={components.gridLayouts.features}>
            {/* Avantage 1 */}
              <motion.div 
                className="text-center p-6 rounded-2xl hover:bg-white hover:shadow-md transition-all"
                variants={animations.fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 !text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
                <h3 className={typography.headings.h3}>Qualité Premium</h3>
                <p className={`${typography.body.regular} mt-2`}>Des vêtements fabriqués avec les meilleurs matériaux pour une durabilité et un confort incomparables.</p>
              </motion.div>
            
            {/* Avantage 2 */}
              <motion.div 
                className="text-center p-6 rounded-2xl hover:bg-white hover:shadow-md transition-all"
                variants={animations.fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                whileHover={{ y: -5 }}
              >
                <div className="bg-violet-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 !text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
                <h3 className={typography.headings.h3}>Livraison Rapide</h3>
                <p className={`${typography.body.regular} mt-2`}>Recevez votre commande en un temps record grâce à notre service de livraison express.</p>
              </motion.div>
            
            {/* Avantage 3 */}
              <motion.div 
                className="text-center p-6 rounded-2xl hover:bg-white hover:shadow-md transition-all"
                variants={animations.fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                whileHover={{ y: -5 }}
              >
                <div className="bg-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 !text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
                <h3 className={typography.headings.h3}>Retours Gratuits</h3>
                <p className={`${typography.body.regular} mt-2`}>Insatisfait ? Retournez votre article dans les 30 jours pour un remboursement complet.</p>
              </motion.div>
            </div>
          </Card>
        </div>

        {/* Newsletter avec design amélioré */}
        <Card className="bg-gradient-to-r from-blue-700 to-blue-900 p-10 !text-black overflow-hidden relative mb-16 shadow-xl">
          {/* Éléments décoratifs */}
          <motion.div 
            className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-32 -translate-y-32"
            animate={animations.pulse}
          ></motion.div>
          <motion.div 
            className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -translate-x-24 translate-y-24"
            animate={animations.pulse}
            transition={{ delay: 0.5 }}
          ></motion.div>
          
          <motion.div 
            className="max-w-3xl mx-auto text-center relative z-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={animations.fadeInUp}
          >
            <Badge variant="primary" className="bg-white/20 backdrop-blur-sm mb-4">Newsletter</Badge>
            <h2 className={`${typography.headings.h1} text-white mb-4 bg-blue-900/40 inline-block px-2.5 py-0.5 rounded-full backdrop-blur-sm mb-4`}>Restez informé</h2>
            <p className="text-lg text-white bg-blue-900/40 p-4 rounded-xl max-w-2xl mx-auto mb-8">
              Inscrivez-vous à notre newsletter pour recevoir nos offres exclusives et les dernières tendances
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto mt-8 bg-white/10 backdrop-blur-sm p-2 rounded-full">
              <Input
                type="email" 
                placeholder="Votre adresse email" 
                fullWidth
                className="focus:ring-white bg-white/60 placeholder:text-gray-500"
                variant="outlined"
                size="lg"
              />
              <Button variant="primary" size="lg" className="bg-white !text-primary-600 hover:bg-gray-100">
                S'inscrire
              </Button>
            </div>
            
            <p className="text-white bg-blue-900/50 inline-block px-4 py-2 rounded-lg text-sm mt-4">
              En vous inscrivant, vous acceptez de recevoir nos emails et confirmez avoir lu notre politique de confidentialité.
            </p>
          </motion.div>
        </Card>

        {/* Section témoignages */}
        <Card className={components.containers.glass} padding="lg">
          <SectionTitle
            title="Ce que nos clients disent"
            badge="Témoignages"
            badgeVariant="info"
            align="center"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            {[
              {
                name: "Sophie Dupont",
                avatar: "https://randomuser.me/api/portraits/women/12.jpg",
                text: "Je suis fan de JaelleShop ! La qualité des vêtements est exceptionnelle et le service client est toujours à l'écoute.",
                rating: 5,
              },
              {
                name: "Thomas Laurent",
                avatar: "https://randomuser.me/api/portraits/men/32.jpg",
                text: "Livraison ultra rapide et emballage soigné. Les produits correspondent parfaitement aux descriptions. Je recommande !",
                rating: 5,
              }
            ].map((testimonial, index) => (
              <motion.div 
                key={index}
                className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -5, boxShadow: "0 12px 24px rgba(0, 0, 0, 0.1)" }}
              >
                <div className="flex items-center mb-4">
                  <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4" />
                  <div>
                    <h4 className="font-medium">{testimonial.name}</h4>
                    <div className="flex mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg 
                          key={i}
                          xmlns="http://www.w3.org/2000/svg" 
                          className={`h-4 w-4 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          viewBox="0 0 20 20" 
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic">{testimonial.text}</p>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default HomePage; 