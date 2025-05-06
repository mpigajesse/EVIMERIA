import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchProducts, Product } from '../api/products';

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  variant?: 'default' | 'minimal';
  autoFocus?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  className = '',
  placeholder = 'Rechercher un produit...',
  variant = 'default',
  autoFocus = false
}) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus automatique si demandé
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }

    // Gestionnaire de clic pour fermer les résultats en cliquant à l'extérieur
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [autoFocus]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.length >= 2) {
        handleSearch();
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSearch = async () => {
    if (query.trim() === '') return;
    
    setLoading(true);
    try {
      const data = await searchProducts(query);
      setResults(data);
      setShowResults(true);
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() !== '') {
      setShowResults(false);
      navigate(`/products?search=${encodeURIComponent(query)}`);
    }
  };

  const handleProductClick = (slug: string) => {
    setShowResults(false);
    navigate(`/products/${slug}`);
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit}>
        <div className={`flex items-center ${variant === 'default' ? 'bg-white border border-gray-300 rounded-full' : ''}`}>
          <div className="relative flex-grow">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className={`w-full py-2 pl-4 pr-10 focus:outline-none ${
                variant === 'default' 
                  ? 'rounded-full focus:ring-2 focus:ring-primary-500'
                  : 'border-b-2 border-transparent focus:border-primary-500'
              }`}
            />
            {loading && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          <button
            type="submit"
            className={`flex items-center justify-center ${
              variant === 'default'
                ? 'bg-primary-500 hover:bg-primary-600 text-white rounded-full w-10 h-10 mr-1'
                : 'text-gray-500 hover:text-primary-500 px-2'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </form>

      {/* Résultats de recherche */}
      {showResults && results.length > 0 && (
        <div className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-lg z-50 overflow-hidden border border-gray-100 max-h-96 overflow-y-auto">
          <ul>
            {results.map((product) => (
              <li
                key={product.id}
                className="border-b border-gray-100 last:border-b-0 transition-colors hover:bg-gray-50 cursor-pointer"
                onClick={() => handleProductClick(product.slug)}
              >
                <div className="flex items-center p-3">
                  <div className="h-12 w-12 bg-gray-100 rounded-lg overflow-hidden mr-3 flex-shrink-0">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images.find(img => img.is_main)?.image_url || product.images[0].image_url}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-sm font-medium text-gray-900">{product.name}</h4>
                    <div className="flex justify-between mt-1">
                      <p className="text-xs text-gray-500">{product.category_name}</p>
                      <p className="text-xs font-bold text-primary-600">{product.price} €</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="p-3 bg-gray-50 border-t border-gray-100">
            <button
              onClick={() => navigate(`/products?search=${encodeURIComponent(query)}`)}
              className="text-sm text-center w-full text-primary-600 hover:text-primary-700 font-medium"
            >
              Voir tous les résultats ({results.length})
            </button>
          </div>
        </div>
      )}

      {showResults && query.length >= 2 && results.length === 0 && !loading && (
        <div className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-lg z-50 overflow-hidden border border-gray-100 p-6 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-600 mb-1">Aucun résultat trouvé pour "{query}"</p>
          <p className="text-sm text-gray-500">Essayez avec d'autres termes ou consultez toutes nos catégories</p>
        </div>
      )}
    </div>
  );
};

export default SearchBar; 