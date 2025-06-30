import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  slug: string;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}

// Récupère l'état du panier depuis le localStorage s'il existe
const getInitialState = (): CartState => {
  try {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart) as CartState;
      // S'assurer que les prix sont des nombres
      parsedCart.items = parsedCart.items.map(item => ({
        ...item,
        price: typeof item.price === 'string' ? parseFloat(item.price) : item.price
      }));
      return parsedCart;
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du panier depuis le localStorage:', error);
  }
  
  return {
    items: [],
    totalItems: 0,
    totalAmount: 0
  };
};

const initialState: CartState = getInitialState();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const { id, quantity } = action.payload;
      const existingItem = state.items.find(item => item.id === id);
      
      if (existingItem) {
        // Si l'item existe déjà, met à jour la quantité
        existingItem.quantity += quantity;
      } else {
        // Sinon, ajoute le nouvel item au panier
        state.items.push(action.payload);
      }
      
      // Met à jour les totaux
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalAmount = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
      
      // Sauvegarde dans le localStorage
      localStorage.setItem('cart', JSON.stringify(state));
    },
    
    removeFromCart: (state, action: PayloadAction<number>) => {
      // Supprime un item du panier par son ID
      state.items = state.items.filter(item => item.id !== action.payload);
      
      // Met à jour les totaux
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalAmount = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
      
      // Sauvegarde dans le localStorage
      localStorage.setItem('cart', JSON.stringify(state));
    },
    
    updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      
      if (item && quantity > 0) {
        item.quantity = quantity;
        
        // Met à jour les totaux
        state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
        state.totalAmount = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        
        // Sauvegarde dans le localStorage
        localStorage.setItem('cart', JSON.stringify(state));
      }
    },
    
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalAmount = 0;
      
      // Supprime du localStorage
      localStorage.removeItem('cart');
    }
  }
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

export default cartSlice.reducer; 