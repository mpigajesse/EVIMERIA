import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Category, getCategories, getCategoryImageUrl } from '../api/products';
import { animations, typography, colors, components } from '../utils/designSystem';
import { Card, Button, Badge, SectionTitle } from './ui';

const CategoryCarousel: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await getCategories();
        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          console.error('Les données reçues ne sont pas un tableau :', data);
          setCategories([]);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Effet de scroll automatique pour la navigation
  const scrollToCategory = (index: number) => {
    if (carouselRef.current) {
      const scrollContainer = carouselRef.current;
      const items = scrollContainer.querySelectorAll('.category-item');
      if (items[index]) {
        const itemWidth = items[index].clientWidth;
        const scrollPosition = index * (itemWidth + 24) - (scrollContainer.clientWidth - itemWidth) / 2;
        
        scrollContainer.scrollTo({
          left: scrollPosition,
          behavior: 'smooth'
        });
        
        setActiveIndex(index);
      }
    }
  };

  if (loading) {
    return (
      <div className="w-full py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center space-y-8">
            <div className="w-48 h-8 bg-gray-200 animate-pulse rounded-full"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
              {[1, 2, 3, 4].map((index) => (
                <div key={index} className="h-64 bg-gray-200 animate-pulse rounded-3xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const categoryItems = Array.isArray(categories) ? categories : [];
  
  if (categoryItems.length === 0) {
    return null;
  }

  return (
    <motion.div 
      className="py-16 relative overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={animations.fadeIn}
    >
      {/* Éléments décoratifs d'arrière-plan */}
      <div className={`${components.decorations.blobs} w-72 h-72 bg-primary-300 top-1/4 -right-36 opacity-20`}></div>
      <div className={`${components.decorations.blobs} w-60 h-60 bg-secondary-300 bottom-1/4 -left-24 opacity-20`}></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <SectionTitle
          title="Découvrez nos catégories"
          badge="Collections"
          badgeVariant="primary"
          align="center"
          size="lg"
          description="Explorez notre sélection de catégories et trouvez votre style parfait"
        />
        
        {/* Indicateurs de navigation */}
        <div className="flex justify-center mt-8 mb-6 space-x-2">
          {categoryItems.map((_, index) => (
            <button
              key={index}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === activeIndex ? 'bg-primary-500 w-8' : 'bg-gray-300'}`}
              onClick={() => scrollToCategory(index)}
              aria-label={`Voir catégorie ${index + 1}`}
            />
          ))}
        </div>
        
        {/* Carousel */}
        <div className="relative mt-4">
          <div 
            ref={carouselRef}
            className="flex overflow-x-auto hide-scrollbar snap-x snap-mandatory pb-8 px-4 -mx-4 scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categoryItems.map((category, index) => (
              <motion.div
                key={category.id}
                className="category-item px-3 md:px-4 min-w-[260px] md:min-w-[300px] flex-shrink-0 snap-center"
                variants={animations.fadeInUp}
                custom={index}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <Card 
                  to={`/categories/${category.slug}`}
                  padding="none" 
                  hover={false}
                  rounded="xl"
                  elevation="extraHigh"
                  className={`relative h-full ${index === activeIndex ? 'ring-2 ring-primary-500 ring-offset-2' : ''}`}
                >
                  <motion.div
                    className="relative h-48 md:h-64 overflow-hidden"
                    whileHover="hover"
                  >
                    <motion.img 
                      src={getCategoryImageUrl(category)} 
                      alt={category.name}
                      className="w-full h-full object-cover object-center" 
                      variants={{
                        hover: { scale: 1.1, filter: "brightness(1.1)" }
                      }}
                      transition={{ duration: 0.5 }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://via.placeholder.com/400x300?text=${category.name}`;
                      }}
                    />
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60"
                      variants={{
                        hover: { opacity: 0.8 }
                      }}
                    ></motion.div>
                    
                    {/* Badge avec nombre de produits */}
                    {category.products_count && (
                      <div className="absolute top-3 right-3">
                        <Badge variant="primary" size="sm" className={`${colors.gradients.primary} shadow-md`}>
                          {category.products_count} produits
                        </Badge>
                      </div>
                    )}
                  </motion.div>
                  
                  <div className="p-5 relative">
                    <h3 className={`${typography.headings.h3} group-hover:text-primary-600 transition-colors`}>{category.name}</h3>
                    
                    {category.description && (
                      <p className={`${typography.body.small} line-clamp-2 mt-2 opacity-90`}>{category.description}</p>
                    )}
                    
                    <div className="mt-4 flex justify-between items-center">
                      <Button 
                        variant="gradient"
                        size="sm"
                        icon={<span className="ml-1">&rarr;</span>}
                        iconPosition="right"
                        className="shadow-sm"
                      >
                        Explorer
                      </Button>
                      
                      {/* Indicateur visuel */}
                      <motion.div 
                        className="w-8 h-8 rounded-full flex items-center justify-center bg-primary-50"
                        whileHover={{ scale: 1.2, backgroundColor: "#bae6fd" }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </motion.div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
          
          {/* Boutons de navigation */}
          <button 
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-lg text-primary-600 hover:bg-white transition-all hidden md:block"
            onClick={() => scrollToCategory(Math.max(0, activeIndex - 1))}
            disabled={activeIndex === 0}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button 
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-lg text-primary-600 hover:bg-white transition-all hidden md:block"
            onClick={() => scrollToCategory(Math.min(categoryItems.length - 1, activeIndex + 1))}
            disabled={activeIndex === categoryItems.length - 1}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        {/* Appel à l'action */}
        <div className="text-center mt-8">
          <Button 
            variant="primary"
            size="lg"
            to="/categories"
            className="bg-white text-primary-600 border border-primary-100 hover:shadow-lg hover:border-primary-200"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            }
          >
            Voir toutes les catégories
          </Button>
        </div>
      </div>
      
      {/* Style CSS pour masquer la scrollbar */}
      <style>
        {`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
    </motion.div>
  );
};

export default CategoryCarousel; 