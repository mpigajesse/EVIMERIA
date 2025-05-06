import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CurrencyCode, currencies } from '../utils/currency';

interface CurrencySwitcherProps {
  onCurrencyChange?: (currency: typeof currencies[CurrencyCode]) => void;
  defaultCurrency?: CurrencyCode;
  className?: string;
}

const CurrencySwitcher: React.FC<CurrencySwitcherProps> = ({
  onCurrencyChange,
  defaultCurrency = 'EUR',
  className = '',
}) => {
  const [activeCurrency, setActiveCurrency] = useState<typeof currencies[CurrencyCode]>(currencies[defaultCurrency]);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Effet pour fermer le menu lors d'un clic externe
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Gestion du changement de devise
  const handleCurrencyChange = (currency: typeof currencies[CurrencyCode]) => {
    setActiveCurrency(currency);
    setIsOpen(false);
    
    // Notifier le composant parent du changement
    if (onCurrencyChange) {
      onCurrencyChange(currency);
    }
    
    // Sauvegarder la préférence dans le localStorage
    localStorage.setItem('preferredCurrency', currency.code);
  };

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      <motion.button
        className="flex items-center space-x-1 px-3 py-2 rounded-full bg-white shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors text-sm"
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.98 }}
      >
        <span className="text-base">{activeCurrency.flag}</span>
        <span className="font-medium">{activeCurrency.code}</span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-2">
              {Object.values(currencies).map((currency) => (
                <motion.button
                  key={currency.code}
                  className={`flex items-center w-full px-3 py-2 text-left rounded-lg ${
                    activeCurrency.code === currency.code 
                      ? 'bg-primary-50 text-primary-700' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleCurrencyChange(currency)}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-lg mr-2">{currency.flag}</span>
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">{currency.code}</span>
                    <span className="text-xs text-gray-500">{currency.name}</span>
                  </div>
                  {activeCurrency.code === currency.code && (
                    <svg className="ml-auto h-5 w-5 text-primary-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </motion.button>
              ))}
            </div>
            
            <div className="px-3 py-2 bg-gray-50 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                Les prix sont convertis selon les taux approximatifs.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CurrencySwitcher; 