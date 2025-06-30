import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '../store';
import { removeFromCart, updateQuantity, clearCart } from '../store/slices/cartSlice';
import { components, typography, animations } from '../utils/designSystem';
import { Card, Button, Badge, SectionTitle } from '../components/ui';

const CartPage = () => {
  const { items, totalItems, totalAmount } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();

  if (items.length === 0) {
    return (
      <div className={components.containers.page}>
        <div className={components.containers.maxWidth}>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={animations.fadeIn}
          >
            <SectionTitle 
              title="Votre Panier" 
              size="lg"
              className="mb-8"
            />
            
            <Card 
              elevation="medium" 
              rounded="xl" 
              className="text-center p-8"
            >
              <motion.div variants={animations.fadeInUp}>
                <motion.div 
                  className="relative mx-auto mb-6 w-24 h-24"
                  animate={animations.float}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <div className="absolute inset-0 rounded-full blur-xl bg-gray-200 opacity-70 -z-10"></div>
                </motion.div>
                
                <h2 className={typography.headings.h2}>Votre panier est vide</h2>
                <p className={`${typography.body.regular} mb-8`}>
                  Découvrez nos produits et ajoutez-les à votre panier.
                </p>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    variant="primary" 
                    to="/products" 
                    className="px-8 py-3"
                  >
                    Voir les produits
                  </Button>
                </motion.div>
              </motion.div>
            </Card>
          </motion.div>
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
    <div className={components.containers.page}>
      <div className={components.containers.maxWidth}>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={animations.fadeIn}
        >
          <SectionTitle 
            title="Votre Panier" 
            badge={`${totalItems} articles`}
            badgeVariant="primary"
            size="lg"
            className="mb-8"
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div 
              className="lg:col-span-2"
              variants={animations.fadeInUp}
              transition={{ delay: 0.1 }}
            >
              <Card elevation="high" rounded="xl" padding="none">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 className={typography.headings.h3}>Produits ({totalItems})</h2>
                  <motion.button 
                    onClick={handleClearCart}
                    className="text-red-600 hover:text-red-800 px-3 py-1 rounded-full hover:bg-red-50 transition-colors flex items-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Vider le panier
                  </motion.button>
                </div>
                
                <motion.div variants={animations.staggerChildren}>
                  {items.map((item) => (
                    <motion.div 
                      key={item.id} 
                      className="p-4 border-b border-gray-200 flex flex-col sm:flex-row"
                      variants={animations.fadeInUp}
                    >
                      <div className="sm:w-24 sm:h-24 mb-4 sm:mb-0 overflow-hidden rounded-lg">
                        <motion.img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <div className="flex-grow sm:ml-6 flex flex-col sm:flex-row sm:items-center justify-between">
                        <div>
                          <h3 className={typography.headings.h4}>{item.name}</h3>
                          <p className="text-primary-600 font-bold">{typeof item.price === 'number' ? item.price.toFixed(2) : parseFloat(item.price).toFixed(2)} €</p>
                        </div>
                        <div className="flex items-center mt-4 sm:mt-0">
                          <div className="flex mr-6">
                            <motion.button 
                              className="px-2 py-1 border border-gray-300 bg-gray-100 rounded-l-lg"
                              onClick={() => handleQuantityChange(item.id, Math.max(1, item.quantity - 1))}
                              whileHover={{ backgroundColor: "#f0f9ff" }}
                              whileTap={{ scale: 0.95 }}
                            >
                              -
                            </motion.button>
                            <input 
                              type="number"
                              className={`${components.inputs.base} w-12 text-center mx-0 rounded-none border-x-0`}
                              value={item.quantity}
                              onChange={(e) => handleQuantityChange(item.id, Math.max(1, parseInt(e.target.value) || 1))}
                              min="1"
                            />
                            <motion.button 
                              className="px-2 py-1 border border-gray-300 bg-gray-100 rounded-r-lg"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              whileHover={{ backgroundColor: "#f0f9ff" }}
                              whileTap={{ scale: 0.95 }}
                            >
                              +
                            </motion.button>
                          </div>
                          <motion.button 
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-600 hover:text-red-800 w-8 h-8 rounded-full hover:bg-red-50 flex items-center justify-center"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </Card>
            </motion.div>
            
            <motion.div 
              className="lg:col-span-1"
              variants={animations.fadeInUp}
              transition={{ delay: 0.2 }}
            >
              <Card elevation="high" rounded="xl" className="sticky top-4">
                <h2 className={`${typography.headings.h3} mb-6`}>Récapitulatif</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between border-b border-gray-200 pb-4">
                    <span className={typography.body.medium}>Sous-total</span>
                    <span className={typography.body.medium}>{typeof totalAmount === 'number' ? totalAmount.toFixed(2) : parseFloat(totalAmount).toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-4">
                    <span className={typography.body.medium}>Frais de livraison</span>
                    <Badge variant="success" className="bg-green-100 text-green-700">Gratuit</Badge>
                  </div>
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span className="text-primary-600">{typeof totalAmount === 'number' ? totalAmount.toFixed(2) : parseFloat(totalAmount).toFixed(2)} €</span>
                  </div>
                </div>
                
                <motion.div 
                  className="mt-8"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    variant="primary" 
                    to="/checkout"
                    className="w-full py-3"
                  >
                    Passer à la caisse
                  </Button>
                </motion.div>
                
                <Link to="/products" className="text-primary-600 block text-center mt-4 hover:underline">
                  Continuer vos achats
                </Link>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CartPage; 