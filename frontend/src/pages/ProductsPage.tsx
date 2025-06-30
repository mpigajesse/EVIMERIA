import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductsGrid from '../components/ProductsGrid';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import { Card, Button, Badge, SectionTitle } from '../components/ui';
import { components, typography, animations } from '../utils/designSystem';
import { 
  getCategories, 
  getSubCategoriesByCategory, 
  getProductsByCategory, 
  getProductsBySubCategory,
  getProducts, 
  searchProducts, 
  Category, 
  SubCategory, 
  Product 
} from '../api/products';

const PRODUCTS_PER_PAGE = 12;

const ProductsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const queryParam = searchParams.get('search');
  const categoryParam = searchParams.get('category');
  const subcategoryParam = searchParams.get('subcategory');
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(subcategoryParam);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(queryParam || '');
  const [sortOption, setSortOption] = useState('newest');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [paginatedProducts, setPaginatedProducts] = useState<Product[]>([]);

  // Statistiques
  const totalProducts = products.length;
  const avgPrice = products.length > 0 ? (products.reduce((sum, p) => sum + parseFloat(p.price), 0) / products.length).toFixed(0) : 0;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await getCategories();
        setCategories(data);
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement des catégories');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Charger les sous-catégories quand une catégorie est sélectionnée
  useEffect(() => {
    const fetchSubCategories = async () => {
      if (selectedCategory) {
        try {
          const data = await getSubCategoriesByCategory(selectedCategory);
          setSubCategories(data);
        } catch (err) {
          console.error('Erreur lors du chargement des sous-catégories:', err);
          setSubCategories([]);
        }
      } else {
        setSubCategories([]);
      }
    };

    fetchSubCategories();
  }, [selectedCategory]);

  useEffect(() => {
    // Mettre à jour les paramètres depuis l'URL
    const query = searchParams.get('search');
    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');
    
    if (query !== searchQuery) setSearchQuery(query || '');
    if (category !== selectedCategory) setSelectedCategory(category);
    if (subcategory !== selectedSubCategory) setSelectedSubCategory(subcategory);
  }, [location.search]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let data: Product[] = [];
        
        // Si on a une recherche
        if (searchQuery) {
          data = await searchProducts(searchQuery);
        }
        // Si une sous-catégorie est sélectionnée
        else if (selectedSubCategory) {
          data = await getProductsBySubCategory(selectedSubCategory);
        }
        // Si une catégorie est sélectionnée
        else if (selectedCategory) {
          data = await getProductsByCategory(selectedCategory);
        }
        // Sinon tous les produits
        else {
          data = await getProducts();
        }
        
        // Filtrer par prix
        if (priceRange.min > 0 || priceRange.max < 1000) {
          data = data.filter(product => {
            const price = parseFloat(product.price);
            return price >= priceRange.min && price <= priceRange.max;
          });
        }
        
        // Trier les produits
        data = sortProducts(data, sortOption);
        
        setProducts(data);
        setFilteredProducts(data);
        setTotalPages(Math.ceil(data.length / PRODUCTS_PER_PAGE));
        setCurrentPage(1);
        
        // Mettre à jour les filtres actifs
        const filters = [];
        if (searchQuery) filters.push(`Recherche: "${searchQuery}"`);
        if (selectedCategory) {
          const categoryName = categories.find(c => c.slug === selectedCategory)?.name || selectedCategory;
          filters.push(`Catégorie: "${categoryName}"`);
        }
        if (selectedSubCategory) {
          const subCategoryName = subCategories.find(sc => sc.slug === selectedSubCategory)?.name || selectedSubCategory;
          filters.push(`Sous-catégorie: "${subCategoryName}"`);
        }
        if (priceRange.min > 0 || priceRange.max < 1000) {
          filters.push(`Prix: ${priceRange.min}€ - ${priceRange.max}€`);
        }
        setActiveFilters(filters);
        
      } catch (err) {
        setError('Erreur lors du chargement des produits');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery, selectedCategory, selectedSubCategory, priceRange, sortOption, categories, subCategories]);

  // Mise à jour des produits paginés
  useEffect(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    setPaginatedProducts(filteredProducts.slice(startIndex, endIndex));
  }, [filteredProducts, currentPage]);

  const sortProducts = (productsList: Product[], option: string) => {
    const sortedProducts = [...productsList];
    
    switch (option) {
      case 'price-low':
        return sortedProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      case 'price-high':
        return sortedProducts.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      case 'alphabetical':
        return sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
      case 'newest':
      default:
        return sortedProducts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
  };

  const handleCategorySelect = (categorySlug: string | null) => {
    setSelectedCategory(categorySlug);
    setSelectedSubCategory(null); // Reset sous-catégorie
    updateURL({ category: categorySlug, subcategory: null });
  };

  const handleSubCategorySelect = (subCategorySlug: string | null) => {
    setSelectedSubCategory(subCategorySlug);
    updateURL({ subcategory: subCategorySlug });
  };

  const updateURL = (params: { category?: string | null; subcategory?: string | null; search?: string | null }) => {
    const newSearchParams = new URLSearchParams(location.search);
    
    if (params.hasOwnProperty('category')) {
      if (params.category) {
        newSearchParams.set('category', params.category);
      } else {
        newSearchParams.delete('category');
      }
    }
    
    if (params.hasOwnProperty('subcategory')) {
      if (params.subcategory) {
        newSearchParams.set('subcategory', params.subcategory);
      } else {
        newSearchParams.delete('subcategory');
      }
    }
    
    if (params.hasOwnProperty('search')) {
      if (params.search) {
        newSearchParams.set('search', params.search);
      } else {
        newSearchParams.delete('search');
      }
    }
    
    navigate(`/products?${newSearchParams.toString()}`);
  };

  const handlePriceFilter = (min: number, max: number) => {
    setPriceRange({ min, max });
  };

  const resetFilters = () => {
    setSelectedCategory(null);
    setSelectedSubCategory(null);
    setPriceRange({ min: 0, max: 1000 });
    setSearchQuery('');
    navigate('/products');
  };

  const removeFilter = (filter: string) => {
    if (filter.startsWith('Recherche')) {
      setSearchQuery('');
      updateURL({ search: null });
    } else if (filter.startsWith('Catégorie')) {
      setSelectedCategory(null);
      setSelectedSubCategory(null);
      updateURL({ category: null, subcategory: null });
    } else if (filter.startsWith('Sous-catégorie')) {
      setSelectedSubCategory(null);
      updateURL({ subcategory: null });
    } else if (filter.startsWith('Prix')) {
      setPriceRange({ min: 0, max: 1000 });
    }
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Composant Header moderne avec statistiques
  const ModernHeader = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="relative p-8 lg:p-12 rounded-3xl overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white shadow-2xl">
        {/* Motif de fond */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Ccircle cx='20' cy='20' r='2'/%3E%3C/g%3E%3C/svg%3E")`
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
              Catalogue Complet
            </Badge>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl lg:text-6xl font-bold text-center mb-4"
          >
            {searchQuery 
              ? `Résultats pour "${searchQuery}"` 
              : selectedSubCategory 
                ? `${subCategories.find(sc => sc.slug === selectedSubCategory)?.name || selectedSubCategory}`
                : selectedCategory 
                  ? `${categories.find(c => c.slug === selectedCategory)?.name || selectedCategory}`
                  : "Tous nos produits"
            }
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-center text-white/90 mb-8 max-w-2xl mx-auto"
          >
            {searchQuery 
              ? `Découvrez ${totalProducts} produit${totalProducts !== 1 ? 's' : ''} correspondant à votre recherche`
              : `Explorez notre sélection de ${totalProducts} produit${totalProducts !== 1 ? 's' : ''} de qualité`
            }
          </motion.p>
          
          {/* Statistiques */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-6"
          >
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/30">
              <div className="text-2xl font-bold">{totalProducts}</div>
              <div className="text-sm text-white/80">Produits</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/30">
              <div className="text-2xl font-bold">{categories.length}</div>
              <div className="text-sm text-white/80">Catégories</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/30">
              <div className="text-2xl font-bold">{avgPrice}€</div>
              <div className="text-sm text-white/80">Prix moyen</div>
          </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );

  // Composant de recherche avancée
  const AdvancedSearch = () => (
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
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                updateURL({ search: e.target.value || null });
              }}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white shadow-sm"
            />
          </div>
          
          {/* Contrôles */}
          <div className="flex items-center gap-4">
            {/* Tri */}
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white shadow-sm"
            >
              <option value="newest">Plus récents</option>
              <option value="alphabetical">Alphabétique</option>
              <option value="price-low">Prix croissant</option>
              <option value="price-high">Prix décroissant</option>
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
          </div>
        )}
      </Card>
    </motion.div>
  );

  // Composant de navigation par catégories avec sous-catégories
  const CategoryNavigation = () => (
    <div className={`${showFilters || window.innerWidth >= 1024 ? 'block' : 'hidden'} lg:block`}>
      {loading && categories.length === 0 ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse h-16 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Toutes les catégories */}
          <Card elevation="medium" rounded="xl" className="p-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Catégories
            </h3>
            
            <div className="space-y-2">
              <button
                onClick={() => handleCategorySelect(null)}
                className={`w-full text-left p-3 rounded-lg transition-all ${
                  selectedCategory === null 
                    ? 'bg-primary-100 text-primary-700 font-semibold' 
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>Toutes les catégories</span>
                  <Badge variant="secondary" size="xs">{totalProducts}</Badge>
                </div>
              </button>
              
              {categories.map((category) => (
                <div key={category.id}>
                  <button
                    onClick={() => handleCategorySelect(category.slug)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      selectedCategory === category.slug 
                        ? 'bg-primary-100 text-primary-700 font-semibold' 
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{category.name}</span>
                      <Badge variant="secondary" size="xs">{category.products_count || 0}</Badge>
                    </div>
                  </button>
                  
                  {/* Sous-catégories */}
                  {selectedCategory === category.slug && subCategories.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="ml-4 mt-2 space-y-1"
                    >
                      {subCategories.map((subCategory) => (
                        <button
                          key={subCategory.id}
                          onClick={() => handleSubCategorySelect(subCategory.slug)}
                          className={`w-full text-left p-2 rounded-lg text-sm transition-all ${
                            selectedSubCategory === subCategory.slug
                              ? 'bg-primary-50 text-primary-600 font-medium'
                              : 'hover:bg-gray-50 text-gray-600'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>→ {subCategory.name}</span>
                            <Badge variant="secondary" size="xs">{subCategory.products_count || 0}</Badge>
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Filtre de prix amélioré */}
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
      )}
      </div>
    );

  // Composant pour le filtre de prix amélioré
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

  return (
    <div className={components.containers.page}>
      {/* Éléments décoratifs d'arrière-plan */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary-200 to-primary-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-60 h-60 bg-gradient-to-br from-secondary-200 to-secondary-300 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <div className={components.containers.maxWidth}>
        <ModernHeader />
        <AdvancedSearch />

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar avec navigation et filtres */}
          <div className="w-full lg:w-1/4">
            <CategoryNavigation />
          </div>
          
          {/* Contenu principal */}
          <div className="w-full lg:w-3/4">
              {loading ? (
              <Card className="p-8">
                <div className="flex justify-center items-center h-64">
                  <div className="relative w-20 h-20">
                    <div className="absolute inset-0 rounded-full border-t-4 border-primary-500 animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-12 w-12 bg-white rounded-full opacity-80"></div>
                    </div>
                  </div>
                </div>
              </Card>
              ) : products.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                  <ProductsGrid 
                    title="" 
                    products={paginatedProducts}
                  />
                  
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
              ) : error ? (
              <Card className="p-12 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-red-800 mb-2">Erreur de chargement</h3>
                <p className="text-red-600 mb-6">{error}</p>
                  <Button 
                    variant="primary"
                    onClick={() => window.location.reload()}
                  >
                    Réessayer
                  </Button>
              </Card>
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
                    ? `Aucun produit ne correspond à "${searchQuery}". Essayez de modifier votre recherche.`
                    : "Aucun produit ne correspond aux filtres sélectionnés. Essayez de modifier vos critères."
                  }
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button 
                    variant="primary"
                    onClick={resetFilters}
                  >
                    Voir tous les produits
                  </Button>
                  <Button 
                    variant="outlined"
                    to="/categories"
                  >
                    Parcourir les catégories
                  </Button>
                </div>
              </Card>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage; 