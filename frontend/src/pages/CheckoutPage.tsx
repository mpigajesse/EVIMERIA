import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppSelector } from '../store';
import { components, typography, animations } from '../utils/designSystem';
import { Card, Button, Badge, SectionTitle } from '../components/ui';

const CheckoutPage = () => {
  const { items, totalAmount } = useAppSelector((state) => state.cart);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    paymentMethod: 'credit_card'
  });

  // Rediriger si le panier est vide
  if (items.length === 0) {
    return (
      <div className={components.containers.page}>
        <div className={components.containers.maxWidth}>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={animations.fadeIn}
            className="py-12 text-center"
          >
            <SectionTitle 
              title="Paiement" 
              size="lg"
              className="mb-8"
            />
            
            <Card 
              elevation="medium" 
              rounded="xl" 
              className="p-8 max-w-2xl mx-auto"
            >
              <motion.div
                variants={animations.fadeInUp}
                className="space-y-6"
              >
                <p className={`${typography.body.regular} text-lg mb-6`}>
                  Votre panier est vide. Ajoutez des produits avant de procéder au paiement.
                </p>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block"
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ici, on traiterait le paiement en envoyant les données au backend
    console.log('Traitement de la commande avec les informations:', formData);
    alert('Commande traitée avec succès ! (Simulation)');
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
            title="Finaliser votre commande" 
            size="lg"
            badge={`${items.length} produits`}
            badgeVariant="primary"
            className="mb-8"
          />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulaire */}
            <motion.div 
              className="lg:col-span-2"
              variants={animations.fadeInUp}
              transition={{ delay: 0.1 }}
            >
              <Card elevation="high" rounded="xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h2 className={`${typography.headings.h3} mb-6`}>Informations de livraison</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                      <label htmlFor="firstName" className={`block text-sm font-medium ${typography.body.medium} mb-1`}>
                  Prénom
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  placeholder="Votre prénom"
                        className={components.inputs.base}
                />
              </div>
              <div>
                      <label htmlFor="lastName" className={`block text-sm font-medium ${typography.body.medium} mb-1`}>
                  Nom
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  placeholder="Votre nom"
                        className={components.inputs.base}
                />
              </div>
            </div>
            
            <div className="mb-6">
                    <label htmlFor="email" className={`block text-sm font-medium ${typography.body.medium} mb-1`}>
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="votre.email@exemple.com"
                      className={components.inputs.base}
              />
            </div>
            
            <div className="mb-6">
                    <label htmlFor="address" className={`block text-sm font-medium ${typography.body.medium} mb-1`}>
                Adresse
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="Votre adresse complète"
                      className={components.inputs.base}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                      <label htmlFor="city" className={`block text-sm font-medium ${typography.body.medium} mb-1`}>
                  Ville
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  placeholder="Votre ville"
                        className={components.inputs.base}
                />
              </div>
              <div>
                      <label htmlFor="postalCode" className={`block text-sm font-medium ${typography.body.medium} mb-1`}>
                  Code postal
                </label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  required
                  placeholder="Code postal"
                        className={components.inputs.base}
                />
              </div>
              <div>
                      <label htmlFor="country" className={`block text-sm font-medium ${typography.body.medium} mb-1`}>
                  Pays
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  placeholder="Votre pays"
                        className={components.inputs.base}
                />
              </div>
            </div>
            
                  <h2 className={`${typography.headings.h3} mb-6 mt-10`}>Méthode de paiement</h2>
            
            <div className="mb-6 space-y-4">
              <div className="flex items-center">
                <input
                  id="credit_card"
                  name="paymentMethod"
                  type="radio"
                  value="credit_card"
                  checked={formData.paymentMethod === 'credit_card'}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                      <label htmlFor="credit_card" className={`ml-3 ${typography.body.medium}`}>
                  Carte de crédit
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="paypal"
                  name="paymentMethod"
                  type="radio"
                  value="paypal"
                  checked={formData.paymentMethod === 'paypal'}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                      <label htmlFor="paypal" className={`ml-3 ${typography.body.medium}`}>
                  PayPal
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="bank_transfer"
                  name="paymentMethod"
                  type="radio"
                  value="bank_transfer"
                  checked={formData.paymentMethod === 'bank_transfer'}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                      <label htmlFor="bank_transfer" className={`ml-3 ${typography.body.medium}`}>
                  Virement bancaire
                </label>
              </div>
            </div>
            
            {formData.paymentMethod === 'credit_card' && (
                    <motion.div 
                      className="mb-6 border p-4 rounded-md bg-gray-50"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className={`${typography.body.regular} mb-4`}>
                  Les détails de carte de crédit seront demandés sur la page de paiement sécurisée.
                </p>
                      <div className="mt-4 flex justify-center items-center space-x-3 bg-white/5 rounded-lg p-2">
                        <div className="w-20 h-20 flex items-center justify-center bg-white/80 rounded">
                          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/MasterCard_Logo.svg/2560px-MasterCard_Logo.svg.png" alt="MasterCard" className="h-4 w-auto object-contain" />
                        </div>
                        <div className="w-20 h-20 flex items-center justify-center bg-white/80 rounded">
                          <img src="https://cecatogo.org/wp-content/uploads/2021/12/promotion-1-1.png" alt="Moov Money" className="h-4 w-auto object-contain" />
                        </div>
                        <div className="w-20 h-20 flex items-center justify-center bg-white/80 rounded">
                          <img src="https://cdn-icons-png.flaticon.com/128/349/349223.png" alt="PayPal" className="h-4 w-auto object-contain" />
                        </div>
                        <div className="w-20 h-20 flex items-center justify-center bg-white/80 rounded">
                          <img src="https://mir-s3-cdn-cf.behance.net/projects/404/5319da54025463.Y3JvcCwxMDgyLDg0NywwLDQ2Nw.png" alt="Airtel Money" className="h-4 w-auto object-contain" />
                        </div>
                        <div className="w-20 h-20 flex items-center justify-center bg-white/80 rounded">
                          <img src="https://www.entreprises-magazine.com/wp-content/uploads/2020/03/Orange-Money-Maroc-696x385.jpg" alt="Orange Money" className="h-4 w-auto object-contain" />
                        </div>
                        <div className="w-20 h-20 flex items-center justify-center bg-white/80 rounded">
                          <img src="https://mms.businesswire.com/media/20181108005528/fr/553326/23/WU_Prim_CMYK.jpg" alt="Western Union" className="h-4 w-auto object-contain" />
                        </div>
              </div>
                    </motion.div>
            )}
            
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-8"
                  >
                    <Button
                      variant="primary"
                      className="w-full py-3"
              type="submit"
            >
              Confirmer la commande
                    </Button>
                  </motion.div>
          </form>
              </Card>
            </motion.div>
        
        {/* Récapitulatif de commande */}
            <motion.div 
              className="lg:col-span-1"
              variants={animations.fadeInUp}
              transition={{ delay: 0.2 }}
            >
              <Card elevation="high" rounded="xl" className="sticky top-4">
                <h2 className={`${typography.headings.h3} mb-6`}>Votre commande</h2>
            
            <div className="divide-y divide-gray-200">
              {items.map((item) => (
                    <motion.div 
                      key={item.id} 
                      className="py-4 flex"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex-shrink-0 w-16 h-16 overflow-hidden rounded-lg">
                        <motion.img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.3 }}
                        />
                  </div>
                  <div className="ml-4 flex-1">
                        <h3 className={typography.body.medium}>{item.name}</h3>
                        <p className={typography.body.small}>Quantité: {item.quantity}</p>
                        <p className={typography.body.medium}>{(item.price * item.quantity).toFixed(2)} €</p>
                  </div>
                    </motion.div>
              ))}
            </div>
            
            <div className="border-t border-gray-200 mt-6 pt-6">
              <div className="flex justify-between mb-2">
                    <span className={typography.body.regular}>Sous-total</span>
                    <span className={typography.body.medium}>{totalAmount.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between mb-2">
                    <span className={typography.body.regular}>Frais de livraison</span>
                    <Badge variant="success" className="bg-green-100 text-green-700">Gratuit</Badge>
              </div>
              <div className="flex justify-between font-semibold text-lg mt-4">
                <span>Total</span>
                <span className="text-primary-600">{totalAmount.toFixed(2)} €</span>
              </div>
            </div>
                
                <div className="mt-6 p-3 rounded-lg bg-green-50 border border-green-100">
                  <div className="flex items-center">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      ✓
                    </span>
                    <span className={`${typography.body.small} ml-2 text-green-700`}>
                      Paiement 100% sécurisé
                    </span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CheckoutPage; 