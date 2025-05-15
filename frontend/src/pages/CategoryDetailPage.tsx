import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Category, Product, getProductsByCategory, getCategories, getCategoryImageUrl } from '../api/products';
import { components, typography, animations, colors } from '../utils/designSystem';
import { Card, Button, Badge, SectionTitle } from '../components/ui';
import ProductsGrid from '../components/ProductsGrid';
import Pagination from '../components/Pagination';

const PRODUCTS_PER_PAGE = 12;

const CategoryDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('default');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [visibleFilters, setVisibleFilters] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [paginatedProducts, setPaginatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      try {
        setLoading(true);
        
        // Récupérer toutes les catégories
        const categoriesData = await getCategories();
        
        if (!Array.isArray(categoriesData)) {
          throw new Error('Les données de catégories reçues ne sont pas un tableau');
        }
        
        // Trouver la catégorie par son slug
        const foundCategory = categoriesData.find(cat => cat.slug === slug);
        
        if (!foundCategory) {
          throw new Error(`Catégorie "${slug}" non trouvée`);
        }
        
        setCategory(foundCategory);
        
        // Récupérer les produits de cette catégorie
        const productsData = await getProductsByCategory(slug || '');
        setProducts(productsData);
        setTotalPages(Math.ceil(productsData.length / PRODUCTS_PER_PAGE));
        setError(null);
      } catch (error) {
        console.error('Erreur lors du chargement de la catégorie et des produits:', error);
        setError('Impossible de charger les informations. Veuillez réessayer plus tard.');
        setCategory(null);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchCategoryAndProducts();
    }
  }, [slug]);

  // Mise à jour des produits paginés quand les produits changent ou la page change
  useEffect(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    setPaginatedProducts(products.slice(startIndex, endIndex));
  }, [products, currentPage]);

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(event.target.value);
    setCurrentPage(1); // Retour à la première page lors du tri
    
    // Trier les produits selon l'option choisie
    const sortedProducts = [...products];
    switch (event.target.value) {
      case 'price-asc':
        sortedProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case 'price-desc':
        sortedProducts.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case 'name-asc':
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // Ne rien faire, garder l'ordre par défaut
        break;
    }
    
    setProducts(sortedProducts);
  };

  const toggleFilters = () => {
    setVisibleFilters(!visibleFilters);
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll doucement vers le haut
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // État de chargement
  if (loading) {
    return (
      <div className={components.containers.page}>
        <div className={components.containers.maxWidth}>
          <div className="animate-pulse space-y-8">
            <div className="h-64 rounded-3xl bg-gray-200"></div>
            <div className="h-10 w-64 rounded-full bg-gray-200"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
                <div key={index} className="h-72 rounded-3xl bg-gray-200"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Message d'erreur
  if (error || !category) {
    return (
      <div className={components.containers.page}>
        <div className={components.containers.maxWidth}>
          <Card elevation="low" rounded="xl" className="bg-red-50 border border-red-100 text-center p-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className={`${typography.headings.h3} text-red-600 mb-2`}>Erreur</h3>
            <p className="text-red-600 mb-6">{error || `La catégorie "${slug}" n'a pas été trouvée.`}</p>
            <div className="flex justify-center gap-4">
              <Button 
                variant="primary" 
                onClick={() => window.location.reload()}
              >
                Réessayer
              </Button>
              <Button 
                variant="outlined"
                to="/categories"
              >
                Toutes les catégories
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className={components.containers.page}>
      {/* Éléments décoratifs d'arrière-plan */}
      <div className={`${components.decorations.blobs} w-96 h-96 bg-primary-300 top-0 -right-48 opacity-20`}></div>
      <div className={`${components.decorations.blobs} w-72 h-72 bg-secondary-300 bottom-40 -left-40 opacity-20`}></div>
      
      <div className={components.containers.maxWidth}>
        {/* Bannière de la catégorie */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={animations.fadeIn}
          className="relative rounded-3xl overflow-hidden mb-8"
        >
          <div className="relative h-48 sm:h-56 md:h-64 lg:h-80">
            <div className="absolute inset-0">
              <img 
                src={getCategoryImageUrl(category)} 
                alt={category.name}
                className="w-full h-full object-cover object-center" 
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://via.placeholder.com/1200x400?text=${category.name}`;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600/80 to-transparent"></div>
            </div>
            
            <div className="absolute inset-0 flex items-center">
              <div className="p-4 sm:p-6 md:p-8 lg:p-12 md:max-w-2xl">
                <motion.div variants={animations.fadeInUp}>
                  <Badge variant="secondary" className="mb-3 sm:mb-4 bg-white/20 backdrop-blur-sm">
                    Collection
                  </Badge>
                </motion.div>
                
                <motion.h1 
                  className={`${typography.headings.h1} text-white mb-2 sm:mb-4`}
                  variants={animations.fadeInUp}
                  transition={{ delay: 0.1 }}
                >
                  {category.name}
                </motion.h1>
                
                {category.description && (
                  <motion.p 
                    className="text-white/90 text-sm sm:text-base md:text-lg mb-3 sm:mb-6 line-clamp-3"
                    variants={animations.fadeInUp}
                    transition={{ delay: 0.2 }}
                  >
                    {category.description}
                  </motion.p>
                )}
                
                <motion.div 
                  className="flex flex-wrap gap-2 sm:gap-3"
                  variants={animations.fadeInUp}
                  transition={{ delay: 0.3 }}
                >
                  {products.length > 0 && (
                    <Badge variant="success" size="md" className="bg-white/20 backdrop-blur-sm">
                      {products.length} produits
                    </Badge>
                  )}
                  
                  <Badge variant="primary" size="md" className="bg-white/20 backdrop-blur-sm">
                    <span className="mr-1">✓</span> Livraison rapide
                  </Badge>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Barre de filtres et tri */}
        <motion.div 
          className="mb-6 sm:mb-8"
          variants={animations.fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <Card className="bg-white rounded-xl shadow-md" padding="sm">
            <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <Button 
                  variant="outlined"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={toggleFilters}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Filtres
                </Button>
                
                <div className="flex items-center">
                  <span className="text-xs sm:text-sm text-gray-500 mr-2 sm:mr-3">
                    {products.length} produits
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="hidden md:flex items-center gap-2">
                  <button 
                    className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
                    onClick={() => setViewMode('grid')}
                    aria-label="Vue en grille"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  
                  <button 
                    className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
                    onClick={() => setViewMode('list')}
                    aria-label="Vue en liste"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
                
                <div className="flex items-center">
                  <label htmlFor="sort" className="text-xs sm:text-sm text-gray-500 mr-2">Trier:</label>
                  <select 
                    id="sort" 
                    className="border border-gray-300 rounded-md text-xs sm:text-sm py-1 px-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={sortBy}
                    onChange={handleSortChange}
                  >
                    <option value="default">Par défaut</option>
                    <option value="price-asc">Prix croissant</option>
                    <option value="price-desc">Prix décroissant</option>
                    <option value="name-asc">Nom A-Z</option>
                    <option value="name-desc">Nom Z-A</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Filtres */}
            {visibleFilters && (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Prix</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input type="checkbox" id="price-1" className="text-primary-600 focus:ring-primary-500 h-4 w-4" />
                      <label htmlFor="price-1" className="ml-2 text-sm text-gray-600">Moins de 50€</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="price-2" className="text-primary-600 focus:ring-primary-500 h-4 w-4" />
                      <label htmlFor="price-2" className="ml-2 text-sm text-gray-600">50€ - 100€</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="price-3" className="text-primary-600 focus:ring-primary-500 h-4 w-4" />
                      <label htmlFor="price-3" className="ml-2 text-sm text-gray-600">100€ - 200€</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="price-4" className="text-primary-600 focus:ring-primary-500 h-4 w-4" />
                      <label htmlFor="price-4" className="ml-2 text-sm text-gray-600">Plus de 200€</label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Disponibilité</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input type="checkbox" id="in-stock" className="text-primary-600 focus:ring-primary-500 h-4 w-4" />
                      <label htmlFor="in-stock" className="ml-2 text-sm text-gray-600">En stock</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="out-stock" className="text-primary-600 focus:ring-primary-500 h-4 w-4" />
                      <label htmlFor="out-stock" className="ml-2 text-sm text-gray-600">Rupture de stock</label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Remises</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input type="checkbox" id="discount" className="text-primary-600 focus:ring-primary-500 h-4 w-4" />
                      <label htmlFor="discount" className="ml-2 text-sm text-gray-600">En promotion</label>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-end">
                  <Button variant="primary" className="mr-2">Appliquer</Button>
                  <Button variant="outlined" onClick={toggleFilters}>Annuler</Button>
                </div>
              </motion.div>
            )}
          </Card>
        </motion.div>
        
        {/* Liste des produits */}
        {products.length > 0 ? (
          <motion.div
            variants={animations.fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <ProductsGrid products={paginatedProducts} title="" />
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  className="pt-4 border-t border-gray-100"
                />
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            variants={animations.fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            <Card className="p-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 className={typography.headings.h3}>Aucun produit disponible</h3>
              <p className="text-gray-500 mb-6">Nous n'avons pas encore de produits dans cette catégorie.</p>
              <Button variant="primary" to="/categories">
                Découvrir d'autres catégories
              </Button>
            </Card>
          </motion.div>
        )}
        
        {/* Suggestions de catégories connexes */}
        {products.length > 0 && (
          <motion.div
            className="mt-16"
            variants={animations.fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <SectionTitle
              title="Vous pourriez aussi aimer"
              align="center"
              size="md"
              className="mb-6 sm:mb-8"
            />
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {['Nouveautés', 'Tendances', 'Promotions', 'Meilleures ventes'].map((name, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card 
                    to={`/products?filter=${name.toLowerCase()}`}
                    elevation="medium"
                    className={`${colors.gradients.primary} !text-black text-center h-24 sm:h-32 flex items-center justify-center hover:shadow-lg`}
                    padding="sm"
                    hover={false}
                  >
                    <h3 className="text-base sm:text-lg font-medium">{name}</h3>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CategoryDetailPage; 