import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Button, Badge } from './ui';
import CategoryMenu from './CategoryMenu';
import CurrencySwitcher from './CurrencySwitcher';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  
  // Calculer le nombre total d'articles dans le panier
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  
  // Effet pour suivre le défilement et changer le style du header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Effet pour fermer le menu lors du changement de route
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);
  
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-primary-600 font-bold text-2xl">Jaelle</span>
            <span className="text-gray-800 font-medium text-xl">Shop</span>
          </Link>
          
          {/* Navigation desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/"
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/' ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              Accueil
            </Link>
            <Link 
              to="/products"
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/products' ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              Produits
            </Link>
            <Link 
              to="/categories"
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/categories' ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              Catégories
            </Link>
            <Link 
              to="/contact"
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/contact' ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              Contact
            </Link>
          </nav>
          
          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Sélecteur de devise */}
            <div className="hidden md:block">
              <CurrencySwitcher />
            </div>
            
            {/* Recherche */}
            <Button
              variant="icon"
              ariaLabel="Rechercher"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            >
              <span className="sr-only">Rechercher</span>
            </Button>
            
            {/* Panier */}
            <Button
              variant="icon"
              to="/cart"
              ariaLabel="Voir le panier"
              className="relative"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              }
            >
              <span className="sr-only">Panier</span>
              {cartItemCount > 0 && (
                <Badge
                  variant="primary"
                  size="xs"
                  className="absolute -top-1 -right-1 bg-primary-600 text-white"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Button>
            
            {/* Compte */}
            <Button
              variant="icon"
              to="/account"
              ariaLabel="Mon compte"
              className="hidden md:flex"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
            >
              <span className="sr-only">Compte</span>
            </Button>
            
            {/* Menu mobile */}
            <Button
              variant="icon"
              className="md:hidden"
              ariaLabel={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={
                    isMenuOpen 
                      ? "M6 18L18 6M6 6l12 12" 
                      : "M4 6h16M4 12h16M4 18h16"
                  } />
                </svg>
              }
            >
              <span className="sr-only">{isMenuOpen ? "Fermer" : "Menu"}</span>
            </Button>
          </div>
        </div>
        
        {/* Menu de catégories */}
        <div className="mt-4 md:block">
          <CategoryMenu variant="horizontal" />
        </div>
      </div>
      
      {/* Menu mobile */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden bg-white shadow-lg border-t border-gray-100"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 py-6 space-y-4">
              <nav className="flex flex-col space-y-3">
                <Link 
                  to="/"
                  className={`text-base font-medium transition-colors ${
                    location.pathname === '/' ? 'text-primary-600' : 'text-gray-700'
                  }`}
                >
                  Accueil
                </Link>
                <Link 
                  to="/products"
                  className={`text-base font-medium transition-colors ${
                    location.pathname === '/products' ? 'text-primary-600' : 'text-gray-700'
                  }`}
                >
                  Produits
                </Link>
                <Link 
                  to="/categories"
                  className={`text-base font-medium transition-colors ${
                    location.pathname === '/categories' ? 'text-primary-600' : 'text-gray-700'
                  }`}
                >
                  Catégories
                </Link>
                <Link 
                  to="/contact"
                  className={`text-base font-medium transition-colors ${
                    location.pathname === '/contact' ? 'text-primary-600' : 'text-gray-700'
                  }`}
                >
                  Contact
                </Link>
              </nav>
              
              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-gray-400 mb-3">Catégories</h3>
                <CategoryMenu variant="vertical" />
              </div>
              
              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-gray-400 mb-3">Devise</h3>
                <CurrencySwitcher />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header; 