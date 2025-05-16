import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppSelector } from '../../store';
import SearchBar from '../SearchBar';
import { getCategories, Category } from '../../api/products';
import { fadeInDown, mobileMenuAnimation, mobileMenuItemAnimation } from '../../utils/animations';

const Header = () => {
  const { totalItems } = useAppSelector((state) => state.cart);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesMenuOpen, setCategoriesMenuOpen] = useState(false);
  const [isHeaderFixed, setIsHeaderFixed] = useState(false);
  const location = useLocation();

  // Ferme le menu mobile lors du changement de page
  useEffect(() => {
    setMobileMenuOpen(false);
    setCategoriesMenuOpen(false);
  }, [location]);

  // Gestion du scroll pour afficher une ombre sur le header
  useEffect(() => {
    const handleScroll = () => {
      const position = window.pageYOffset;
      setIsHeaderFixed(position > 80);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Récupération des catégories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des catégories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <motion.header 
      className={`bg-white z-40 transition-shadow duration-300 w-full ${
        isHeaderFixed ? 'sticky top-0 shadow-md' : 'shadow-sm'
      }`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="container mx-auto px-4 py-4">
        {/* Notification bandeau (optionnel) */}
        <motion.div 
          className="bg-gradient-to-r from-blue-600 via-violet-600 to-green-600 text-white text-center py-3 px-4 rounded-lg mb-4 flex items-center justify-center shadow-lg"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
          <motion.p 
            className="font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <span className="font-bold">NOUVEAU !</span> Du00e9couvrez EVIMERIA, votre nouvelle plateforme de mode et d'accessoires
          </motion.p>
        </motion.div>
        
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-blue-600 flex items-center">
            <motion.img 
              src="/src/assets/logo/logodusite.jpg" 
              alt="EVIMERIA" 
              className="h-10 w-10 mr-2 rounded-full shadow-sm"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 500 }}
            />
            <motion.span 
              className="font-extrabold bg-gradient-to-r from-blue-600 via-violet-600 to-green-600 text-transparent bg-clip-text"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 500 }}
            >
              EVIMERIA
            </motion.span>
          </Link>
          
          {/* Barre de recherche (visible sur desktop) */}
          <div className="hidden md:block flex-grow max-w-md mx-4">
            <SearchBar variant="default" />
          </div>
          
          {/* Navigation desktop */}
          <nav className="hidden md:flex space-x-6 items-center">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors py-2 font-medium">
              Accueil
            </Link>
            
            {/* Menu déroulant des catégories */}
            <div className="relative group">
              <button 
                className="flex items-center text-gray-700 hover:text-blue-600 transition-colors py-2 font-medium"
                onMouseEnter={() => setCategoriesMenuOpen(true)}
                onMouseLeave={() => setCategoriesMenuOpen(false)}
                onClick={() => setCategoriesMenuOpen(!categoriesMenuOpen)}
              >
                Catégories
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-4 w-4 ml-1 transition-transform ${categoriesMenuOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <AnimatePresence>
                {categoriesMenuOpen && (
                  <motion.div 
                    className="absolute left-0 mt-1 w-56 rounded-xl bg-white shadow-lg overflow-hidden z-20 border border-gray-100"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    onMouseEnter={() => setCategoriesMenuOpen(true)}
                    onMouseLeave={() => setCategoriesMenuOpen(false)}
                  >
                    <div className="py-2">
                      <Link 
                        to="/products" 
                        className="block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                      >
                        Tous les produits
                      </Link>
                      <Link 
                        to="/products?featured=true" 
                        className="block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                      >
                        Produits en vedette
                      </Link>
                      
                      {categories.length > 0 && (
                        <div className="border-t border-gray-100 my-1"></div>
                      )}
                      
                      {categories.map(category => (
                        <Link 
                          key={category.id}
                          to={`/categories/${category.slug}`}
                          className="block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <Link to="/products" className="text-gray-700 hover:text-blue-600 transition-colors py-2 font-medium">
              Produits
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link to="/cart" className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {totalItems > 0 && (
                    <motion.span 
                      className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500 }}
                    >
                      {totalItems}
                    </motion.span>
                  )}
                </motion.div>
              </Link>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/login" className="inline-flex items-center justify-center px-4 py-1.5 bg-white border border-violet-300 text-violet-700 rounded-full hover:bg-violet-50 hover:text-violet-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Connexion
                </Link>
              </motion.div>
            </div>
          </nav>
          
          {/* Menu mobile */}
          <div className="flex items-center space-x-4 md:hidden">
            <Link to="/cart" className="relative p-2 text-gray-700">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {totalItems > 0 && (
                  <motion.span 
                    className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500 }}
                  >
                    {totalItems}
                  </motion.span>
                )}
              </motion.div>
            </Link>
            
            <motion.button
              className="p-2 text-gray-700 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              whileTap={{ scale: 0.95 }}
            >
              {mobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </motion.button>
          </div>
        </div>
        
        {/* Barre de recherche mobile (s'affiche toujours) */}
        <div className="mt-4 md:hidden">
          <SearchBar variant="default" />
        </div>
        
        {/* Menu mobile déroulant */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              className="md:hidden mt-4 py-3 border-t border-gray-100 overflow-hidden"
              variants={mobileMenuAnimation}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <nav className="flex flex-col space-y-3">
                <motion.div variants={mobileMenuItemAnimation}>
                  <Link 
                    to="/" 
                    className="text-gray-700 hover:text-blue-600 px-2 py-2 rounded-lg hover:bg-gray-50 flex items-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Accueil
                  </Link>
                </motion.div>
                
                <motion.div variants={mobileMenuItemAnimation}>
                  <Link 
                    to="/products" 
                    className="text-gray-700 hover:text-blue-600 px-2 py-2 rounded-lg hover:bg-gray-50 flex items-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Produits
                  </Link>
                </motion.div>
                
                <motion.div variants={mobileMenuItemAnimation}>
                  <div className="border-t border-gray-100 pt-2 pb-1 px-2">
                    <p className="text-sm text-gray-500 mb-2">Catégories</p>
                    {categories.map(category => (
                      <Link 
                        key={category.id}
                        to={`/categories/${category.slug}`}
                        className="block text-gray-700 hover:text-blue-600 px-2 py-1.5 rounded-lg hover:bg-gray-50 ml-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </motion.div>
                
                <motion.div variants={mobileMenuItemAnimation}>
                  <Link 
                    to="/login" 
                    className="text-gray-700 hover:text-blue-600 px-2 py-2 rounded-lg hover:bg-gray-50 flex items-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Connexion
                  </Link>
                </motion.div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header; 