import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Category, getCategories, getCategoryImageUrl } from '../api/products';
import { components, typography, animations, colors } from '../utils/designSystem';
import { Card, Button, Badge, SectionTitle } from '../components/ui';

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await getCategories();
        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          throw new Error('Les données reçues ne sont pas un tableau');
        }
        setError(null);
      } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
        setError('Impossible de charger les catégories. Veuillez réessayer plus tard.');
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className={components.containers.page}>
      {/* Éléments décoratifs d'arrière-plan */}
      <div className={`${components.decorations.blobs} w-96 h-96 bg-primary-300 top-0 -right-48 opacity-20`}></div>
      <div className={`${components.decorations.blobs} w-72 h-72 bg-secondary-300 bottom-40 -left-40 opacity-20`}></div>
      
      <div className={components.containers.maxWidth}>
        {/* En-tête de page */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={animations.fadeInDown}
          className="relative z-10"
        >
          <div className={`${colors.gradients.primary} !text-black p-8 rounded-3xl mb-8 shadow-lg relative overflow-hidden`}>
            <div className="absolute inset-0 bg-pattern opacity-10"></div>
            
            <SectionTitle
              title="Nos Catégories"
              description="Explorez notre large sélection de catégories et trouvez les articles qui vous correspondent"
              className="text-white"
              align="center"
              badge="Collections"
              badgeVariant="secondary"
            />
            
            <div className="flex justify-center mt-6">
              <Badge variant="secondary" size="md" className="bg-white/20 backdrop-blur-sm mr-3">
                {categories.length} catégories
              </Badge>
              
              <Badge variant="success" size="md" className="bg-white/20 backdrop-blur-sm">
                <span className="mr-1">✓</span> Livraison offerte
              </Badge>
            </div>
          </div>
        </motion.div>
        
        {/* État de chargement */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <div key={index} className="rounded-3xl bg-gray-200 animate-pulse h-72"></div>
            ))}
          </div>
        )}
        
        {/* Message d'erreur */}
        {error && (
          <Card elevation="low" rounded="xl" className="bg-red-50 border border-red-100 text-center p-8 mb-16">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className={`${typography.headings.h3} text-red-600 mb-2`}>Erreur</h3>
            <p className="text-red-600 mb-6">{error}</p>
            <Button 
              variant="primary" 
              onClick={() => window.location.reload()}
            >
              Réessayer
            </Button>
          </Card>
        )}
        
        {/* Grille de catégories */}
        {!loading && !error && (
          <motion.div 
            variants={animations.staggerChildren}
            initial="hidden"
            animate="visible"
            className="mb-16"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  variants={animations.fadeInUp}
                  custom={index}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="h-full"
                >
                  <Card 
                    to={`/categories/${category.slug}`}
                    padding="none" 
                    hover={false}
                    rounded="xl"
                    elevation="high"
                    className="h-full group"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <motion.img 
                        src={getCategoryImageUrl(category)} 
                        alt={category.name}
                        className="w-full h-full object-cover object-center transition-transform duration-700" 
                        whileHover={{ scale: 1.1 }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://via.placeholder.com/400x300?text=${category.name}`;
                        }}
                      />
                      
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/70"></div>
                      
                      {/* Badge avec nombre de produits */}
                      {category.products_count !== undefined && (
                        <div className="absolute top-4 right-4">
                          <Badge variant="primary" size="sm" className={`${colors.gradients.primary} !text-black shadow-md`}>
                            {category.products_count} produits
                          </Badge>
                        </div>
                      )}
                      
                      {/* Overlay au survol */}
                      <div className="absolute inset-0 bg-primary-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileHover={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Button 
                            variant="primary"
                            className="bg-white !text-primary-600 !border-2 !border-primary-600 hover:bg-gray-100"
                          >
                            Explorer la collection
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className={`${typography.headings.h3} group-hover:text-primary-600 transition-colors`}>{category.name}</h3>
                        
                        <motion.div 
                          className="w-8 h-8 rounded-full flex items-center justify-center bg-primary-50"
                          whileHover={{ scale: 1.2, backgroundColor: "#bae6fd" }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </motion.div>
                      </div>
                      
                      {category.description && (
                        <p className={`${typography.body.small} line-clamp-3 opacity-80`}>{category.description}</p>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
        
        {/* Banner promotionnel */}
        <motion.div
          variants={animations.fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Card className={`${colors.gradients.cosmic} p-8 !text-black rounded-3xl overflow-hidden relative mb-16`}>
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
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-2/3 mb-6 md:mb-0">
                <Badge variant="warning" className="mb-3 bg-white/20 backdrop-blur-sm">Offre spéciale</Badge>
                <h3 className={`${typography.headings.h2} text-white mb-3`}>Livraison gratuite sur votre première commande</h3>
                <p className="text-white/90 mb-0">Utilisez le code <span className="font-bold">WELCOME10</span> pour bénéficier de 10% de réduction supplémentaire.</p>
              </div>
              
              <Button 
                variant="primary" 
                size="lg"
                to="/products"
                className="bg-white !text-primary-600 !border-2 !border-primary-600 hover:bg-gray-100"
              >
                En profiter maintenant
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default CategoriesPage; 