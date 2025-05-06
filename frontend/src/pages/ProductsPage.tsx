import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductsGrid from '../components/ProductsGrid';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import { Card, Button, Badge } from '../components/ui';
import { components, typography, animations } from '../utils/designSystem';
import { motion } from 'framer-motion';
import { getCategories, getProductsByCategory, getProducts, searchProducts, Category, Product } from '../api/products';

const PRODUCTS_PER_PAGE = 12;

const ProductsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const queryParam = searchParams.get('search');
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(queryParam || '');
  const [sortOption, setSortOption] = useState('newest');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [paginatedProducts, setPaginatedProducts] = useState<Product[]>([]);

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

  useEffect(() => {
    // Mettre à jour la recherche quand l'URL change
    const query = searchParams.get('search');
    if (query) {
      setSearchQuery(query);
    }
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
        setCurrentPage(1); // Réinitialiser à la première page lors d'un changement de filtre
        
        // Mettre à jour les filtres actifs
        const filters = [];
        if (searchQuery) filters.push(`Recherche: "${searchQuery}"`);
        if (selectedCategory) filters.push(`Catégorie: "${categories.find(c => c.slug === selectedCategory)?.name || selectedCategory}"`);
        if (priceRange.min > 0 || priceRange.max < 1000) filters.push(`Prix: ${priceRange.min}€ - ${priceRange.max}€`);
        setActiveFilters(filters);
        
      } catch (err) {
        setError('Erreur lors du chargement des produits');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery, selectedCategory, priceRange, sortOption, categories]);

  // Mise à jour des produits paginés quand les produits filtrés changent ou la page change
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
      case 'newest':
      default:
        return sortedProducts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
  };

  const handleCategorySelect = (categorySlug: string | null) => {
    setSelectedCategory(categorySlug);
    // Réinitialiser la recherche si on change de catégorie
    if (searchQuery) {
      setSearchQuery('');
      navigate('/products');
    }
  };

  const handlePriceFilter = (min: number, max: number) => {
    setPriceRange({ min, max });
  };

  const resetFilters = () => {
    setSelectedCategory(null);
    setPriceRange({ min: 0, max: 1000 });
    setSearchQuery('');
    navigate('/products');
  };

  const removeFilter = (filter: string) => {
    if (filter.startsWith('Recherche')) {
      setSearchQuery('');
      navigate('/products');
    } else if (filter.startsWith('Catégorie')) {
      setSelectedCategory(null);
    } else if (filter.startsWith('Prix')) {
      setPriceRange({ min: 0, max: 1000 });
    }
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll doucement vers le haut
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Composant pour afficher les catégories
  const CategoriesList = () => {
    if (loading && categories.length === 0) {
      return (
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <h3 className="text-lg font-semibold mb-3">Catégories</h3>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="animate-pulse h-6 bg-gray-200 rounded w-3/4"></div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <h3 className="text-lg font-semibold mb-3">Catégories</h3>
        <ul className="space-y-2">
          <li key="all">
            <button
              onClick={() => handleCategorySelect(null)}
              className={`text-gray-700 hover:text-primary-600 w-full text-left p-2 rounded-lg transition-colors ${selectedCategory === null ? 'font-bold text-primary-600 bg-primary-50' : 'hover:bg-gray-50'}`}
            >
              Tous les produits
            </button>
          </li>
          {categories.map((category) => (
            <li key={category.id}>
              <button
                onClick={() => handleCategorySelect(category.slug)}
                className={`text-gray-700 hover:text-primary-600 w-full text-left p-2 rounded-lg transition-colors ${selectedCategory === category.slug ? 'font-bold text-primary-600 bg-primary-50' : 'hover:bg-gray-50'}`}
              >
                {category.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  // Composant pour le filtre de prix
  const PriceFilter = () => {
    const [minPrice, setMinPrice] = useState(priceRange.min);
    const [maxPrice, setMaxPrice] = useState(priceRange.max);

    const handleApplyFilter = () => {
      handlePriceFilter(minPrice, maxPrice);
    };

    return (
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <h3 className="text-lg font-semibold mb-3">Prix</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="number"
              min="0"
              max="10000"
              value={minPrice}
              onChange={(e) => setMinPrice(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Min"
            />
            <span className="text-gray-500">-</span>
            <input
              type="number"
              min="0"
              max="10000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Max"
            />
          </div>
          <button
            onClick={handleApplyFilter}
            className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
            Appliquer
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={components.containers.page}>
      <div className={components.containers.maxWidth}>
        {/* Titre */}
        <motion.h1 
          className={typography.headings.h1 + " mb-6 text-center"}
          variants={animations.fadeInDown}
          initial="hidden"
          animate="visible"
        >
          {searchQuery ? `Résultats pour "${searchQuery}"` : "Tous nos produits"}
        </motion.h1>
        
        {/* Filtres actifs */}
        {activeFilters.length > 0 && (
          <motion.div 
            className="flex flex-wrap gap-2 mb-6"
            variants={animations.fadeInUp}
            initial="hidden"
            animate="visible"
          >
            {activeFilters.map((filter, index) => (
              <Badge 
                key={index} 
                variant="primary" 
                className="px-3 py-1.5 bg-primary-100 text-primary-800"
                onClick={() => removeFilter(filter)}
              >
                {filter}
                <span className="ml-2 cursor-pointer">×</span>
              </Badge>
            ))}
            {activeFilters.length > 1 && (
              <Badge 
                variant="neutral" 
                className="px-3 py-1.5 cursor-pointer"
                onClick={resetFilters}
              >
                Réinitialiser tous les filtres
              </Badge>
            )}
          </motion.div>
        )}

        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
          {/* Sidebar avec filtres */}
          <div className="w-full lg:w-1/4">
            {/* Barre de recherche mobile */}
            <div className="block md:hidden mb-6">
              <SearchBar placeholder="Rechercher..." />
            </div>
            
            <CategoriesList />
            <PriceFilter />
          </div>
          
          {/* Liste des produits */}
          <div className="w-full lg:w-3/4">
            <Card className="bg-white rounded-xl" padding="md">
              {/* En-tête des résultats */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold">
                    {loading 
                      ? 'Chargement des produits...' 
                      : products.length > 0 
                        ? `${products.length} produit${products.length > 1 ? 's' : ''} trouvé${products.length > 1 ? 's' : ''}` 
                        : 'Aucun produit trouvé'
                    }
                  </h2>
                  {searchQuery && (
                    <p className="text-sm text-gray-500 mt-1">Résultats pour "{searchQuery}"</p>
                  )}
                </div>
                
                <div className="mt-3 sm:mt-0">
                  <select 
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                  >
                    <option value="newest">Plus récents</option>
                    <option value="price-low">Prix croissant</option>
                    <option value="price-high">Prix décroissant</option>
                  </select>
                </div>
              </div>

              {/* Affichage des produits */}
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="relative w-20 h-20">
                    <div className="absolute inset-0 rounded-full border-t-4 border-primary-500 animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-12 w-12 bg-white rounded-full opacity-80"></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-8 w-8 bg-primary-100 rounded-full"></div>
                    </div>
                  </div>
                </div>
              ) : products.length > 0 ? (
                <div>
                  <ProductsGrid 
                    title="" 
                    products={paginatedProducts}
                  />
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-8 pt-4 border-t border-gray-100">
                      <Pagination 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  )}
                </div>
              ) : error ? (
                <div className="text-center py-16">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-lg font-medium text-red-600 mb-2">{error}</h3>
                  <p className="text-gray-500 mb-6">Un problème est survenu lors du chargement des produits.</p>
                  <Button 
                    variant="primary"
                    onClick={() => window.location.reload()}
                  >
                    Réessayer
                  </Button>
                </div>
              ) : (
                <div className="text-center py-16">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun produit ne correspond à votre recherche</h3>
                  <p className="text-gray-500 mb-6">Essayez de modifier vos critères de recherche ou de parcourir toutes nos catégories.</p>
                  <Button 
                    variant="primary"
                    onClick={resetFilters}
                  >
                    Voir tous les produits
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage; 