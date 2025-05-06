import { useState } from 'react';
import { useAppSelector } from '../store';
import { Link } from 'react-router-dom';

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
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-6">Paiement</h1>
        <p className="text-lg mb-6">Votre panier est vide. Ajoutez des produits avant de procéder au paiement.</p>
        <Link to="/products" className="btn btn-primary px-6 py-2">
          Voir les produits
        </Link>
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Finaliser votre commande</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulaire */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Informations de livraison</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  Prénom
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Nom
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Adresse
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  Ville
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                  Code postal
                </label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                  Pays
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
            </div>
            
            <h2 className="text-xl font-semibold mb-6 mt-10">Méthode de paiement</h2>
            
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
                <label htmlFor="credit_card" className="ml-3 block text-sm font-medium text-gray-700">
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
                <label htmlFor="paypal" className="ml-3 block text-sm font-medium text-gray-700">
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
                <label htmlFor="bank_transfer" className="ml-3 block text-sm font-medium text-gray-700">
                  Virement bancaire
                </label>
              </div>
            </div>
            
            {formData.paymentMethod === 'credit_card' && (
              <div className="mb-6 border p-4 rounded-md bg-gray-50">
                <p className="text-gray-700 mb-4">
                  Les détails de carte de crédit seront demandés sur la page de paiement sécurisée.
                </p>
              </div>
            )}
            
            <button
              type="submit"
              className="btn btn-primary w-full py-3 mt-6"
            >
              Confirmer la commande
            </button>
          </form>
        </div>
        
        {/* Récapitulatif de commande */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-semibold mb-6">Votre commande</h2>
            
            <div className="divide-y divide-gray-200">
              {items.map((item) => (
                <div key={item.id} className="py-4 flex">
                  <div className="flex-shrink-0 w-16 h-16">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-sm font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-500">Quantité: {item.quantity}</p>
                    <p className="text-sm font-medium">{(item.price * item.quantity).toFixed(2)} €</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-200 mt-6 pt-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Sous-total</span>
                <span className="text-sm font-medium">{totalAmount.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Frais de livraison</span>
                <span className="text-sm font-medium">Gratuit</span>
              </div>
              <div className="flex justify-between font-semibold text-lg mt-4">
                <span>Total</span>
                <span className="text-primary-600">{totalAmount.toFixed(2)} €</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage; 