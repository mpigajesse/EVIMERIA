import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store';
import { removeFromCart, updateQuantity, clearCart } from '../store/slices/cartSlice';

const CartPage = () => {
  const { items, totalItems, totalAmount } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Votre Panier</h1>
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h2 className="text-xl font-semibold mb-4">Votre panier est vide</h2>
          <p className="text-gray-600 mb-6">
            Découvrez nos produits et ajoutez-les à votre panier.
          </p>
          <Link to="/products" className="btn btn-primary px-6 py-2">
            Voir les produits
          </Link>
        </div>
      </div>
    );
  }

  const handleRemoveItem = (id: number) => {
    dispatch(removeFromCart(id));
  };

  const handleQuantityChange = (id: number, quantity: number) => {
    dispatch(updateQuantity({ id, quantity }));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Votre Panier</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-4 border-b border-gray-200 flex justify-between">
              <h2 className="text-lg font-semibold">Produits ({totalItems})</h2>
              <button 
                onClick={handleClearCart}
                className="text-red-600 hover:text-red-800"
              >
                Vider le panier
              </button>
            </div>
            
            {items.map((item) => (
              <div key={item.id} className="p-4 border-b border-gray-200 flex flex-col sm:flex-row">
                <div className="sm:w-24 sm:h-24 mb-4 sm:mb-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded" />
                </div>
                <div className="flex-grow sm:ml-6 flex flex-col sm:flex-row sm:items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{item.name}</h3>
                    <p className="text-primary-600 font-bold">{item.price.toFixed(2)} €</p>
                  </div>
                  <div className="flex items-center mt-4 sm:mt-0">
                    <div className="flex mr-6">
                      <button 
                        className="px-2 py-1 border border-gray-300 bg-gray-100"
                        onClick={() => handleQuantityChange(item.id, Math.max(1, item.quantity - 1))}
                      >
                        -
                      </button>
                      <input 
                        type="number"
                        className="form-input w-12 text-center mx-1"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, Math.max(1, parseInt(e.target.value) || 1))}
                        min="1"
                      />
                      <button 
                        className="px-2 py-1 border border-gray-300 bg-gray-100"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <button 
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-semibold mb-6">Récapitulatif</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between border-b border-gray-200 pb-4">
                <span>Sous-total</span>
                <span>{totalAmount.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-4">
                <span>Frais de livraison</span>
                <span>Gratuit</span>
              </div>
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span className="text-primary-600">{totalAmount.toFixed(2)} €</span>
              </div>
            </div>
            
            <Link to="/checkout" className="btn btn-primary w-full py-3 mt-8 text-center">
              Passer à la caisse
            </Link>
            
            <Link to="/products" className="text-primary-600 block text-center mt-4 hover:underline">
              Continuer vos achats
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage; 