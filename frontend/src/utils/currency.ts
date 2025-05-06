// Définition des devises disponibles
export type CurrencyCode = 'EUR' | 'USD' | 'MAD' | 'XOF';

interface Currency {
  code: CurrencyCode;
  name: string;
  symbol: string;
  flag?: string;
  rate: number; // Taux de conversion par rapport à l'Euro (base 1)
}

export const currencies: Record<CurrencyCode, Currency> = {
  EUR: {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    flag: '🇪🇺',
    rate: 1, // Base de référence
  },
  USD: {
    code: 'USD',
    name: 'Dollar américain',
    symbol: '$',
    flag: '🇺🇸',
    rate: 1.09, // 1 EUR = 1.09 USD (approximatif)
  },
  MAD: {
    code: 'MAD',
    name: 'Dirham marocain',
    symbol: 'DH',
    flag: '🇲🇦',
    rate: 10.95, // 1 EUR = 10.95 MAD (approximatif)
  },
  XOF: {
    code: 'XOF',
    name: 'Franc CFA',
    symbol: 'FCFA',
    flag: '🇸🇳',
    rate: 655.96, // 1 EUR = 655.96 XOF (taux fixe)
  },
};

// Hook pour formater les prix selon la devise
export const useCurrencyFormatter = (currencyCode: CurrencyCode = 'EUR') => {
  const currency = currencies[currencyCode];
  
  // Fonction pour convertir et formater un prix
  const formatPrice = (price: number): string => {
    const convertedPrice = price * currency.rate;
    
    // Différents formatages selon la devise
    if (currency.code === 'XOF') {
      // Format Franc CFA (sans décimales)
      return `${Math.round(convertedPrice)} ${currency.symbol}`;
    } else if (currency.code === 'MAD') {
      // Format Dirham marocain
      return `${convertedPrice.toFixed(2)} ${currency.symbol}`;
    } else {
      // Format par défaut (€ et $)
      return `${currency.symbol}${convertedPrice.toFixed(2)}`;
    }
  };
  
  return formatPrice;
}; 