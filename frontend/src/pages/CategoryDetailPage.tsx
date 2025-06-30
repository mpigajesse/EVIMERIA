import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Category, Product, SubCategory, getProductsByCategory, getCategories, getCategoryImageUrl, getSubCategoriesByCategory } from '../api/products';
import { components, typography, animations } from '../utils/designSystem';
import { Card, Button, Badge, SectionTitle } from '../components/ui';
import ProductsGrid from '../components/ProductsGrid';
import Pagination from '../components/Pagination';

const PRODUCTS_PER_PAGE = 12;

const CategoryDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const subcategorySlug = searchParams.get('subcategory');
  
  const [category, setCategory] = useState<Category | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('default');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [paginatedProducts, setPaginatedProducts] = useState<Product[]>([]);

  // Statistiques
  const totalProducts = filteredProducts.length;
  const avgPrice = filteredProducts.length > 0 ? (filteredProducts.reduce((sum, p) => sum + parseFloat(p.price), 0) / filteredProducts.length) : 0;

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
        
        // Récupérer les produits et les sous-catégories de cette catégorie
        const [productsData, subcategoriesData] = await Promise.all([
          getProductsByCategory(slug || ''),
          getSubCategoriesByCategory(slug || '')
        ]);
        
        setAllProducts(productsData);
        setSubcategories(subcategoriesData);
        setError(null);
      } catch (error) {
        console.error('Erreur lors du chargement de la catégorie et des produits:', error);
        setError('Impossible de charger les informations. Veuillez réessayer plus tard.');
        setCategory(null);
        setAllProducts([]);
        setSubcategories([]);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchCategoryAndProducts();
    }
  }, [slug]);

  // Filtrer et trier les produits
  useEffect(() => {
    let filtered = [...allProducts];
    
    // Filtrage par sous-catégorie
    if (subcategorySlug) {
      const targetSubcategory = subcategories.find(sub => sub.slug === subcategorySlug);
      if (targetSubcategory) {
        filtered = filtered.filter(product => product.subcategory === targetSubcategory.id);
      }
    }
    
    // Filtrage par recherche
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filtrage par prix
    if (priceRange.min > 0 || priceRange.max < 1000) {
      filtered = filtered.filter(product => {
        const price = parseFloat(product.price);
        return price >= priceRange.min && price <= priceRange.max;
      });
    }
    
    // Tri
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case 'price-desc':
        filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      default:
        // Garder l'ordre par défaut
        break;
    }
    
    setFilteredProducts(filtered);
    setCurrentPage(1);
    setTotalPages(Math.ceil(filtered.length / PRODUCTS_PER_PAGE));
    
    // Mettre à jour les filtres actifs
    const filters = [];
    if (subcategorySlug) {
      const subCategoryName = subcategories.find(sc => sc.slug === subcategorySlug)?.name || subcategorySlug;
      filters.push(`Sous-catégorie: "${subCategoryName}"`);
    }
    if (searchQuery) filters.push(`Recherche: "${searchQuery}"`);
    if (priceRange.min > 0 || priceRange.max < 1000) {
      filters.push(`Prix: ${priceRange.min}€ - ${priceRange.max}€`);
    }
    setActiveFilters(filters);
    
  }, [allProducts, subcategorySlug, subcategories, searchQuery, priceRange, sortBy]);

  // Mise à jour des produits paginés
  useEffect(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    setPaginatedProducts(filteredProducts.slice(startIndex, endIndex));
  }, [filteredProducts, currentPage]);

  const handleSubCategorySelect = (subCategorySlug: string | null) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (subCategorySlug) {
      newSearchParams.set('subcategory', subCategorySlug);
    } else {
      newSearchParams.delete('subcategory');
    }
    navigate(`/categories/${slug}?${newSearchParams.toString()}`);
  };

  const handlePriceFilter = (min: number, max: number) => {
    setPriceRange({ min, max });
  };

  const resetFilters = () => {
    setSearchQuery('');
    setPriceRange({ min: 0, max: 1000 });
    handleSubCategorySelect(null);
  };

  const removeFilter = (filter: string) => {
    if (filter.startsWith('Sous-catégorie')) {
      handleSubCategorySelect(null);
    } else if (filter.startsWith('Recherche')) {
      setSearchQuery('');
    } else if (filter.startsWith('Prix')) {
      setPriceRange({ min: 0, max: 1000 });
    }
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Icônes SVG par catégorie
  const getCategoryIcon = (categorySlug: string) => {
    const iconClass = "w-8 h-8 text-white";
    
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
      default:
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        );
    }
  };

  // Composant Header moderne avec Hero
  const CategoryHero = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="relative p-8 lg:p-12 rounded-3xl overflow-hidden bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 text-white shadow-2xl">
        {/* Image de fond avec overlay */}
        <div className="absolute inset-0 opacity-20">
          <img 
            src={getCategoryImageUrl(category!)} 
            alt={category!.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://via.placeholder.com/1200x400?text=${category!.name}`;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/80 to-blue-600/80"></div>
        </div>
        
        {/* Motif de fond */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Ccircle cx='30' cy='30' r='3'/%3E%3C/g%3E%3C/svg%3E")`
            }}
          ></div>
        </div>
        
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-between mb-6"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                {getCategoryIcon(category!.slug)}
              </div>
              <Badge variant="secondary" className="bg-white/20 backdrop-blur-sm text-white border-white/30">
                Collection {category!.name}
              </Badge>
            </div>
            
            <Button 
              variant="outlined"
              to="/categories"
              className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
            >
              ← Retour aux catégories
            </Button>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl lg:text-6xl font-bold mb-4"
          >
            {category!.name}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-white/90 mb-8 max-w-2xl"
          >
            {category!.description || `Découvrez notre collection ${category!.name.toLowerCase()} avec des produits de qualité`}
          </motion.p>
          
          {/* Statistiques */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-6"
          >
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/30">
              <div className="text-2xl font-bold">{allProducts.length}</div>
              <div className="text-sm text-white/80">Produits</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/30">
              <div className="text-2xl font-bold">{subcategories.length}</div>
              <div className="text-sm text-white/80">Sous-catégories</div>
            </div>
            {filteredProducts.length > 0 && (
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/30">
                <div className="text-2xl font-bold">{Math.round(avgPrice)}€</div>
                <div className="text-sm text-white/80">Prix moyen</div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );

  // Navigation par sous-catégories
  const SubCategoryNavigation = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="mb-8"
    >
      <Card elevation="medium" rounded="xl" className="p-6 bg-gradient-to-r from-gray-50 to-white border border-gray-200">
        {subcategories.length > 0 ? (
          <>
            <div className="flex items-center mb-4">
              <svg className="w-5 h-5 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h3 className="text-lg font-semibold">Affiner par sous-catégorie</h3>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => handleSubCategorySelect(null)}
                className={`px-4 py-2 rounded-xl transition-all ${
                  !subcategorySlug 
                    ? 'bg-primary-600 text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Toutes ({allProducts.length})
              </motion.button>
              
              {subcategories.map((subcategory) => (
                <motion.button
                  key={subcategory.id}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleSubCategorySelect(subcategory.slug)}
                  className={`px-4 py-2 rounded-xl transition-all ${
                    subcategorySlug === subcategory.slug
                      ? 'bg-primary-600 text-white shadow-lg' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {subcategory.name} ({subcategory.products_count || 0})
                </motion.button>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500">Aucune sous-catégorie disponible pour cette catégorie.</p>
          </div>
        )}
      </Card>
    </motion.div>
  );

  // Barre de recherche et filtres
  const SearchAndFilters = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="mb-8"
    >
      <Card elevation="medium" rounded="xl" className="p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          {/* Recherche */}
          <div className="relative flex-1 maxw-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Rechercher dans cette catégorie..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white shadow-sm"
            />
          </div>
          
          {/* Contrôles */}
          <div className="flex items-center gap-4">
            {/* Tri */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white shadow-sm"
            >
              <option value="default">Par défaut</option>
              <option value="newest">Plus récents</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="name-asc">Nom A-Z</option>
              <option value="name-desc">Nom Z-A</option>
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
            
            {/* Toggle filtres mobile */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden p-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Filtres actifs */}
        {activeFilters.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gray-600 mr-2">Filtres actifs:</span>
              {activeFilters.map((filter, index) => (
                <Badge 
                  key={index} 
                  variant="primary" 
                  className="px-3 py-1 bg-primary-100 text-primary-800 cursor-pointer hover:bg-primary-200 transition-colors"
                  onClick={() => removeFilter(filter)}
                >
                  {filter}
                  <span className="ml-2">×</span>
                </Badge>
              ))}
              {activeFilters.length > 1 && (
                <Badge 
                  variant="secondary" 
                  className="px-3 py-1 cursor-pointer hover:bg-gray-200 transition-colors"
                  onClick={resetFilters}
                >
                  Tout effacer
                </Badge>
              )}
            </div>
            
            <div className="mt-2 text-sm text-gray-500">
              {totalProducts} produit{totalProducts !== 1 ? 's' : ''} {totalProducts !== 1 ? 'trouvés' : 'trouvé'}
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );

  // Sidebar filtres (version desktop)
  const FilterSidebar = () => (
    <div className={`${showFilters || window.innerWidth >= 1024 ? 'block' : 'hidden'} lg:block`}>
      <Card elevation="medium" rounded="xl" className="p-4">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
          Gamme de prix
        </h3>
        
        <PriceFilter />
      </Card>
    </div>
  );

  // Composant pour le filtre de prix
  const PriceFilter = () => {
    const [minPrice, setMinPrice] = useState(priceRange.min);
    const [maxPrice, setMaxPrice] = useState(priceRange.max);

    const handleApplyFilter = () => {
      handlePriceFilter(minPrice, maxPrice);
    };

    const handleReset = () => {
      setMinPrice(0);
      setMaxPrice(1000);
      handlePriceFilter(0, 1000);
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">Prix min</label>
            <input
              type="number"
              min="0"
              max="10000"
              value={minPrice}
              onChange={(e) => setMinPrice(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="0"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">Prix max</label>
            <input
              type="number"
              min="0"
              max="10000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="1000"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleApplyFilter}
            className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
          >
            Appliquer
          </button>
          <button
            onClick={handleReset}
            className="px-3 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            Reset
          </button>
        </div>
        
        <div className="text-xs text-gray-500 text-center">
          {minPrice}€ - {maxPrice}€
        </div>
      </div>
    );
  };

  // État de chargement
  if (loading) {
    return (
      <div className={components.containers.page}>
        <div className={components.containers.maxWidth}>
          <div className="animate-pulse space-y-8">
            <div className="h-64 rounded-3xl bg-gray-200"></div>
            <div className="h-16 rounded-xl bg-gray-200"></div>
            <div className="h-16 rounded-xl bg-gray-200"></div>
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
          <Card elevation="low" rounded="xl" className="bg-red-50 border border-red-200 text-center p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            </div>
            <h3 className="text-xl font-semibold text-red-800 mb-2">Catégorie introuvable</h3>
            <p className="text-red-600 mb-6">{error || `La catégorie "${slug}" n'a pas été trouvée.`}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
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
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-200 to-purple-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-60 h-60 bg-gradient-to-br from-indigo-200 to-indigo-300 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <div className={components.containers.maxWidth}>
        <CategoryHero />
        <SubCategoryNavigation />
        <SearchAndFilters />
            
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar avec filtres */}
          <div className="w-full lg:w-1/4">
            <FilterSidebar />
          </div>
        
          {/* Contenu principal */}
          <div className="w-full lg:w-3/4">
            {filteredProducts.length > 0 ? (
        <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
          >
            <ProductsGrid products={paginatedProducts} title="" />
            
            {/* Pagination */}
            {totalPages > 1 && (
                  <div className="mt-8 pt-6 border-t border-gray-100">
                <Pagination 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </motion.div>
        ) : (
              <Card className="p-12 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucun produit trouvé</h3>
                <p className="text-gray-500 mb-6">
                  {searchQuery 
                    ? `Aucun produit ne correspond à "${searchQuery}" dans cette catégorie.`
                    : subcategorySlug
                      ? "Aucun produit dans cette sous-catégorie."
                      : "Cette catégorie ne contient aucun produit pour le moment."
                  }
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button 
                    variant="primary"
                    onClick={resetFilters}
                  >
                    Réinitialiser les filtres
                  </Button>
                  <Button 
                    variant="outlined"
                    to="/products"
                  >
                    Voir tous les produits
              </Button>
                </div>
            </Card>
        )}
          </div>
        </div>
        
        {/* Catégories suggérées */}
        {allProducts.length > 0 && (
          <motion.div
            className="mt-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <SectionTitle
              title="Découvrir d'autres catégories"
              description="Explorez nos autres collections"
              align="center"
              size="md"
              className="mb-8"
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {['Nouveautés', 'Promotions', 'Tendances'].map((name, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card 
                    to={`/products?filter=${name.toLowerCase()}`}
                    elevation="medium"
                    className="bg-gradient-to-br from-gray-50 to-gray-100 text-center h-32 flex items-center justify-center hover:shadow-lg border-2 border-gray-200 hover:border-primary-300"
                    padding="sm"
                    hover={false}
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">{name}</h3>
                      <p className="text-sm text-gray-500">Découvrir →</p>
                    </div>
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