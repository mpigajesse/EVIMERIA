import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { classNames, animations } from '../utils/designSystem';
import { searchProducts as apiSearchProducts, Product } from '../api/products';
import { Card } from './ui';

interface SearchBarProps {
  initialQuery?: string;
  onSearch?: (query: string) => void;
  className?: string;
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal' | 'white';
}

const SearchBar: React.FC<SearchBarProps> = ({
  initialQuery = '',
  onSearch,
  className = '',
  placeholder = 'Rechercher un produit...',
  size = 'md',
  variant = 'default',
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Product[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  
  // Styles conditionnels en fonction des props
  const sizeClasses = {
    sm: 'h-9 text-sm',
    md: 'h-11 text-base',
    lg: 'h-14 text-lg',
  };
  
  const variantClasses = {
    default: 'bg-white border border-gray-300 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-100 shadow-sm hover:shadow',
    minimal: 'bg-gray-100 hover:bg-gray-50 focus-within:bg-white focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-100',
    white: 'bg-white/90 backdrop-blur-sm border border-white/10 shadow-sm hover:shadow focus-within:border-primary-400',
  };

  const fetchSearchResults = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      const data = await apiSearchProducts(searchQuery);
      setResults(data);
    } catch (err) {
      console.error('Erreur lors de la recherche:', err);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Gestion des clics en dehors de la barre de recherche
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Debounce pour la recherche
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length >= 2) {
        fetchSearchResults(query);
      } else {
        setResults([]);
      }
    }, 300);
    
    return () => {
      clearTimeout(timer);
    };
  }, [query]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (e.target.value.trim().length >= 2) {
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      if (onSearch) {
        onSearch(query);
      } else {
        navigate(`/products?search=${encodeURIComponent(query)}`);
        setShowResults(false);
      }
    }
  };
  
  const handleProductClick = (slug: string) => {
    navigate(`/products/${slug}`);
    setShowResults(false);
    setQuery('');
  };

  // Gestion des raccourcis clavier
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setShowResults(false);
    }
    // Ajoutez ici la gestion des flèches pour naviguer entre les résultats si souhaité
  };

  // Icônes avec animations
  const searchIcon = (
    <motion.svg 
      xmlns="http://www.w3.org/2000/svg" 
      className="h-5 w-5 text-gray-500" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
      initial={{ scale: 1 }}
      animate={{ scale: isLoading ? [1, 1.1, 1] : 1 }}
      transition={{ repeat: isLoading ? Infinity : 0, duration: 0.6 }}
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </motion.svg>
  );

  const loadingIcon = (
    <motion.div 
      className="h-5 w-5 rounded-full border-2 border-t-primary-500 border-r-primary-300 border-b-primary-200 border-l-primary-100"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
    />
  );

  const clearIcon = (
    <motion.button
      type="button"
      className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none"
      onClick={() => { setQuery(''); inputRef.current?.focus(); }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label="Effacer la recherche"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </motion.button>
  );

  return (
    <div 
      ref={searchRef} 
      className={classNames(
        "relative w-full max-w-2xl mx-auto transition-all duration-300",
        isFocused ? "scale-[1.02]" : "",
        className
      )}
    >
      <form onSubmit={handleSubmit} className="relative w-full">
        <div className={classNames(
          "flex items-center rounded-full overflow-hidden transition-all duration-200",
          sizeClasses[size],
          variantClasses[variant],
          isFocused ? "ring-2 ring-primary-200" : ""
        )}>
          <div className="pl-4 flex-shrink-0">
            {isLoading ? loadingIcon : searchIcon}
          </div>
          
          <input
            ref={inputRef}
            type="text"
            className="w-full py-2 px-3 bg-transparent outline-none"
            placeholder={placeholder}
            value={query}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            aria-label="Recherche"
          />
          
          <div className="flex items-center pr-3 gap-1">
            {query && clearIcon}
            <motion.button
              type="submit"
              className="flex items-center justify-center bg-primary-600 text-white h-7 w-7 rounded-full hover:bg-primary-700 focus:outline-none"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Lancer la recherche"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </motion.button>
          </div>
        </div>
      </form>

      <AnimatePresence>
        {showResults && results.length > 0 && (
          <motion.div
            className="absolute left-0 right-0 mt-2 z-50"
            variants={animations.fadeInDown}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <Card padding="none" elevation="high" rounded="md" animate={false}>
              <ul className="max-h-96 overflow-y-auto divide-y divide-gray-100">
                {results.map((product) => (
                  <motion.li
                    key={product.id}
                    className="transition-colors hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleProductClick(product.slug)}
                    whileHover={{ backgroundColor: "rgba(243, 244, 246, 1)" }}
                  >
                    <div className="flex items-center p-3">
                      <div className="h-12 w-12 bg-gray-100 rounded-lg overflow-hidden mr-3 flex-shrink-0">
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images.find(img => img.is_main)?.image_url || product.images[0].image_url}
                            alt={product.name}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {product.category_name}
                        </p>
                      </div>
                      
                      <div className="flex-shrink-0 text-sm font-bold text-primary-600 ml-2">
                        {product.price} €
                      </div>
                    </div>
                  </motion.li>
                ))}
              </ul>
              <div className="p-2 bg-gray-50 border-t border-gray-100 text-center">
                <button
                  className="text-xs text-primary-600 hover:text-primary-800 font-medium focus:outline-none"
                  onClick={() => {
                    navigate(`/products?search=${encodeURIComponent(query)}`);
                    setShowResults(false);
                  }}
                >
                  Voir tous les résultats
                </button>
              </div>
            </Card>
          </motion.div>
        )}

        {showResults && query.trim().length >= 2 && results.length === 0 && !isLoading && (
          <motion.div
            className="absolute left-0 right-0 mt-2 z-50"
            variants={animations.fadeInDown}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <Card padding="md" elevation="medium" rounded="md" animate={false}>
              <div className="text-center py-3">
                <p className="text-gray-500">Aucun résultat pour "{query}"</p>
                <p className="text-xs text-gray-400 mt-1">Essayez avec d'autres mots-clés</p>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar; 