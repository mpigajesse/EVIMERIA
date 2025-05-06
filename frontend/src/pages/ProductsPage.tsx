import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductsGrid from '../components/ProductsGrid';
import SearchBar from '../components/SearchBar';
import { getCategories, getProductsByCategory, getProducts, searchProducts, Category, Product } from '../api/products';

const ProductsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const queryParam = searchParams.get('search');
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(queryParam || '');
  const [sortOption, setSortOption] = useState('newest');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

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
  }, [searchQuery, selectedCategory, priceRange, sortOption]);

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

  // Composant pour filtrer par prix
  const PriceFilter = () => {
    const [minPrice, setMinPrice] = useState(priceRange.min.toString());
    const [maxPrice, setMaxPrice] = useState(priceRange.max.toString());

    const handleApplyFilter = () => {
      handlePriceFilter(
        minPrice ? parseFloat(minPrice) : 0,
        maxPrice ? parseFloat(maxPrice) : 1000
      );
    };

    return (
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <h3 className="text-lg font-semibold mb-3">Prix</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="min-price" className="block text-sm text-gray-600 mb-1">
              Prix minimum
            </label>
            <input
              type="number"
              id="min-price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="0 €"
            />
          </div>
          <div>
            <label htmlFor="max-price" className="block text-sm text-gray-600 mb-1">
              Prix maximum
            </label>
            <input
              type="number"
              id="max-price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="1000 €"
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
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <h1 className="text-3xl font-bold mb-6">Nos Produits</h1>
          
          {/* Barre de recherche en haut (desktop uniquement) */}
          <div className="hidden md:block mb-6">
            <SearchBar placeholder="Rechercher parmi tous nos produits..." autoFocus={!!searchQuery} />
          </div>
          
          {/* Filtres actifs */}
          {activeFilters.length > 0 && (
            <div className="mb-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-gray-500">Filtres actifs:</span>
                {activeFilters.map((filter, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-50 text-primary-700"
                  >
                    {filter}
                    <button 
                      onClick={() => removeFilter(filter)}
                      className="ml-1 text-primary-700 hover:text-primary-900"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
                <button 
                  onClick={resetFilters}
                  className="text-sm text-primary-600 hover:text-primary-800 ml-2"
                >
                  Réinitialiser tous les filtres
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
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
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
              {/* En-tête des résultats */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <div>
                  <h2 className="text-xl font-semibold">
                    {loading 
                      ? 'Chargement des produits...' 
                      : products.length > 0 
                        ? `${products.length} produit${products.length > 1 ? 's' : ''} trouvé${products.length > 1 ? 's' : ''}` 
                        : 'Aucun produit trouvé'
                    }
                  </h2>
                  {searchQuery && (
                    <p className="text-gray-500 mt-1">Résultats pour "{searchQuery}"</p>
                  )}
                </div>
                
                <div className="mt-4 sm:mt-0">
                  <select 
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                  >
                    <option value="newest">Plus récents</option>
                    <option value="price-low">Prix croissant</option>
                    <option value="price-high">Prix décroissant</option>
                  </select>
                </div>
              </div>

              {/* Grid de produits personnalisée utilisant les données filtrées */}
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
              ) : error ? (
                <div className="text-center py-16">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-lg font-medium text-red-900 mb-2">{error}</h3>
                  <p className="text-gray-500 mb-6">Un problème est survenu lors du chargement des produits.</p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Réessayer
                  </button>
                </div>
              ) : products.length > 0 ? (
                <ProductsGrid title="" />
              ) : (
                <div className="text-center py-16">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun produit ne correspond à votre recherche</h3>
                  <p className="text-gray-500 mb-6">Essayez de modifier vos critères de recherche ou de parcourir toutes nos catégories.</p>
                  <button 
                    onClick={resetFilters}
                    className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Voir tous les produits
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage; 