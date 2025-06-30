import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Category, getCategories } from '../api/products';
import { components, typography, animations, colors } from '../utils/designSystem';
import { Card, Button, Badge, SectionTitle } from '../components/ui';
import CategoryAccordion from '../components/CategoryAccordion';

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'products' | 'alphabetical'>('name');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await getCategories();
        const categoriesData = response.results || [];
        setCategories(categoriesData);
        setFilteredCategories(categoriesData);
        setError(null);
      } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
        setError('Impossible de charger les catégories. Veuillez réessayer plus tard.');
        setCategories([]);
        setFilteredCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Filtrage et tri des catégories
  useEffect(() => {
    let filtered = categories.filter(category =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Tri
    switch (sortBy) {
      case 'alphabetical':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'products':
        filtered.sort((a, b) => (b.products_count || 0) - (a.products_count || 0));
        break;
      default:
        // Garder l'ordre par défaut
        break;
    }

    setFilteredCategories(filtered);
  }, [categories, searchTerm, sortBy]);

  // Statistiques
  const totalProducts = categories.reduce((sum, cat) => sum + (cat.products_count || 0), 0);
  const avgProductsPerCategory = categories.length > 0 ? Math.round(totalProducts / categories.length) : 0;

     // Icônes SVG par catégorie
   const getCategoryIcon = (categorySlug: string) => {
     const iconClass = "w-6 h-6 text-white";
     
     switch (categorySlug.toLowerCase()) {
       case 'enfants':
         return (
           <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
           </svg>
         );
       case 'femmes':
         return (
           <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
           </svg>
         );
       case 'hommes':
         return (
           <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
           </svg>
         );
       case 'accessoires':
         return (
           <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
           </svg>
         );
       case 'chaussures':
         return (
           <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
           </svg>
         );
       case 'vetements':
         return (
           <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4 4 4 0 004-4V5z" />
           </svg>
         );
       default:
         return (
           <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
           </svg>
         );
     }
   };

  const SkeletonLoader = () => (
    <div className="space-y-6">
      {/* Skeleton Header */}
      <div className="animate-pulse">
        <div className="h-48 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-3xl mb-8"></div>
      </div>
      
      {/* Skeleton Search */}
      <div className="animate-pulse">
        <div className="h-16 bg-gray-200 rounded-xl mb-6"></div>
      </div>
      
      {/* Skeleton Accordion */}
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-gray-200 rounded-xl"></div>
        ))}
      </div>
      
      {/* Skeleton Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((index) => (
          <div key={index} className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded-t-3xl"></div>
            <div className="p-6 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={components.containers.page}>
      {/* Éléments décoratifs d'arrière-plan améliorés */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary-200 to-primary-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-60 h-60 bg-gradient-to-br from-secondary-200 to-secondary-300 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-40 right-1/3 w-72 h-72 bg-gradient-to-br from-accent-200 to-accent-300 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className={components.containers.maxWidth}>
        {loading ? (
          <SkeletonLoader />
        ) : (
          <>
            {/* En-tête amélioré */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={animations.fadeInDown}
              className="relative z-10 mb-8"
            >
                             <div className="relative p-8 lg:p-12 rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white shadow-2xl">
                 {/* Motif de fond animé */}
                 <div className="absolute inset-0 opacity-10">
                   <div 
                     className="absolute inset-0"
                     style={{
                       backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='7' cy='7' r='7'/%3E%3Ccircle cx='53' cy='7' r='7'/%3E%3Ccircle cx='7' cy='53' r='7'/%3E%3Ccircle cx='53' cy='53' r='7'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                     }}
                   ></div>
                 </div>
                
                <div className="relative">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center justify-center mb-4"
                  >
                                         <Badge variant="secondary" className="bg-white/20 backdrop-blur-sm text-white border-white/30">
                       Collections Premium
                     </Badge>
                  </motion.div>
                  
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-4xl lg:text-6xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-200"
                  >
                    Nos Catégories
                  </motion.h1>
                  
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-xl text-center text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed"
                  >
                    Découvrez notre sélection soigneusement organisée de produits de qualité
                  </motion.p>
                  
                  {/* Statistiques */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-wrap justify-center gap-6"
                  >
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/30">
                      <div className="text-2xl font-bold">{categories.length}</div>
                      <div className="text-sm text-white/80">Catégories</div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/30">
                      <div className="text-2xl font-bold">{totalProducts}</div>
                      <div className="text-sm text-white/80">Produits</div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/30">
                      <div className="text-2xl font-bold">{avgProductsPerCategory}</div>
                      <div className="text-sm text-white/80">Moy. par catégorie</div>
                    </div>
                  </motion.div>
            </div>
          </div>
        </motion.div>
        
            {/* Barre de recherche et filtres améliorés */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-8"
            >
              <Card elevation="medium" rounded="xl" className="p-6 bg-gradient-to-r from-gray-50 to-white border border-gray-200">
                <div className="flex flex-col lg:flex-row gap-4 items-center">
                  {/* Recherche */}
                  <div className="relative flex-1 max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Rechercher une catégorie..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white shadow-sm"
                    />
                  </div>
                  
                  {/* Contrôles */}
                  <div className="flex items-center gap-4">
                    {/* Tri */}
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as 'name' | 'products' | 'alphabetical')}
                      className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white shadow-sm"
                    >
                      <option value="name">Par défaut</option>
                      <option value="alphabetical">Alphabétique</option>
                      <option value="products">Par nombre de produits</option>
                    </select>
                    
                    {/* Mode d'affichage */}
                    <div className="flex bg-gray-100 rounded-xl p-1">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-500'}`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-500'}`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Résultats de recherche */}
                {searchTerm && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      {filteredCategories.length} catégorie{filteredCategories.length !== 1 ? 's' : ''} trouvée{filteredCategories.length !== 1 ? 's' : ''} pour "{searchTerm}"
                    </p>
          </div>
        )}
              </Card>
            </motion.div>
        
        {/* Message d'erreur */}
        {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-8"
              >
                <Card elevation="low" rounded="xl" className="bg-red-50 border border-red-200 text-center p-8">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-red-800 mb-2">Oups ! Une erreur s'est produite</h3>
            <p className="text-red-600 mb-6">{error}</p>
            <Button 
              variant="primary" 
              onClick={() => window.location.reload()}
                    className="bg-red-600 hover:bg-red-700 border-red-600"
            >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
              Réessayer
            </Button>
          </Card>
              </motion.div>
            )}

            {/* Section Accordéon Navigation */}
            {!error && filteredCategories.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mb-12"
              >
                <Card elevation="medium" rounded="xl" className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
                                     <SectionTitle
                     title="Navigation Rapide"
                     description="Cliquez sur une catégorie pour explorer ses sous-catégories et naviguer rapidement"
                    align="left"
                    size="sm"
                    className="mb-6"
                  />
                  
                  <CategoryAccordion
                    categories={filteredCategories}
                    onSubCategorySelect={(categorySlug: string, subcategorySlug?: string) => {
                      if (subcategorySlug) {
                        window.location.href = `/categories/${categorySlug}?subcategory=${subcategorySlug}`;
                      } else {
                        window.location.href = `/categories/${categorySlug}`;
                      }
                    }}
                  />
                </Card>
              </motion.div>
            )}

            {/* Grille de catégories améliorée */}
            {!error && (
          <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
            className="mb-16"
          >
                                 <SectionTitle
                   title="Explorer par Collection"
                   description="Plongez dans nos collections soigneusement organisées"
                  align="center"
                  size="md"
                  className="mb-8"
                />
                
                {filteredCategories.length > 0 ? (
                  <div className={`grid gap-8 ${
                    viewMode === 'grid' 
                      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                      : 'grid-cols-1 max-w-4xl mx-auto'
                  }`}>
                    {filteredCategories.map((category, index) => (
                <motion.div
                  key={category.id}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        whileHover={{ y: -8, scale: 1.02 }}
                  className="h-full"
                >
                  <Card 
                    to={`/categories/${category.slug}`}
                    padding="none" 
                    hover={false}
                    rounded="xl"
                    elevation="high"
                          className={`h-full group overflow-hidden bg-white ${
                            viewMode === 'list' ? 'flex' : ''
                          }`}
                  >
                          <div className={`relative overflow-hidden ${
                            viewMode === 'list' ? 'w-1/3 h-48' : 'h-64'
                          }`}>
                      <motion.img 
                        src={category.image || `https://via.placeholder.com/400x300?text=${category.name}`} 
                        alt={category.name}
                        className="w-full h-full object-cover object-center transition-transform duration-700" 
                        whileHover={{ scale: 1.1 }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://via.placeholder.com/400x300?text=${category.name}`;
                        }}
                      />
                      
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/70"></div>
                      
                            {/* Badge icône et produits */}
                            <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">{getCategoryIcon(category.slug)}</div>
                      {category.products_count !== undefined && (
                                <Badge variant="primary" size="sm" className="bg-white/90 !text-gray-800 shadow-lg">
                            {category.products_count} produits
                          </Badge>
                              )}
                        </div>
                      
                            {/* Overlay interactif */}
                            <div className="absolute inset-0 bg-gradient-to-t from-primary-600/80 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center pb-8">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileHover={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Button 
                            variant="primary"
                                  className="bg-white !text-primary-600 hover:bg-gray-100 shadow-lg"
                          >
                                  Explorer maintenant
                                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                  </svg>
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                    
                          <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                            <div className="flex justify-between items-start mb-3">
                              <h3 className="text-xl font-bold text-gray-800 group-hover:text-primary-600 transition-colors">
                                {category.name}
                              </h3>
                        
                        <motion.div 
                                className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg"
                                whileHover={{ scale: 1.2, rotate: 360 }}
                                transition={{ duration: 0.5 }}
                        >
                                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </motion.div>
                      </div>
                      
                      {category.description && (
                              <p className="text-gray-600 line-clamp-2 mb-4 leading-relaxed">
                                {category.description}
                              </p>
                            )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
                ) : (
                  !loading && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <Card className="p-12 text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucune catégorie trouvée</h3>
                        <p className="text-gray-500 mb-6">Essayez de modifier votre recherche ou parcourez toutes nos catégories.</p>
                        <Button 
                          variant="primary" 
                          onClick={() => {
                            setSearchTerm('');
                            setSortBy('name');
                          }}
                        >
                          Réinitialiser les filtres
                        </Button>
                      </Card>
                    </motion.div>
                  )
                )}
          </motion.div>
        )}
        
            {/* Call-to-action final */}
            {!error && filteredCategories.length > 0 && (
        <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="text-center"
              >
                <Card elevation="medium" rounded="xl" className="p-8 bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-200">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Vous ne trouvez pas ce que vous cherchez ?</h3>
                  <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                    Explorez tous nos produits ou contactez notre équipe pour obtenir des recommandations personnalisées.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="primary" 
                to="/products"
                      className="bg-primary-600 hover:bg-primary-700"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      Voir tous les produits
                    </Button>
                    <Button 
                      variant="outlined"
                      to="/contact"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      Nous contacter
              </Button>
            </div>
          </Card>
        </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage; 