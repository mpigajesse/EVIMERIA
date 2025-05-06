import React from 'react';
import { Link } from 'react-router-dom';
import ProductsGrid from '../components/ProductsGrid';
import CategoryCarousel from '../components/CategoryCarousel';

const HomePage = () => {
  return (
    <div className="bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section inspirée du design moderne */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden mb-8">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <div className="inline-block bg-primary-100 text-primary-600 px-3 py-1 rounded-full text-sm font-medium mb-4">
                Mode tendance
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
                JaelleShop Inspiring Fashion.
              </h1>
              <p className="text-gray-600 mb-8 max-w-lg">
                Découvrez notre collection exclusive et faites de votre style une déclaration de mode unique.
              </p>
              <div className="flex space-x-4">
                <Link
                  to="/products"
                  className="bg-primary-600 text-white px-6 py-3 rounded-full hover:bg-primary-700 transition-colors flex items-center"
                >
                  Voir tous les produits
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 relative">
              <img
                src="https://res.cloudinary.com/dmcaguchx/image/upload/v1746496377/jaelleshop/products/photo-1556306535-0f09a537f0a3.jpg"
                alt="Featured product"
                className="w-full h-full object-cover object-center"
              />
              {/* Éléments décoratifs */}
              <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-primary-500 rounded-full opacity-20"></div>
              <div className="absolute bottom-1/3 right-1/3 w-8 h-8 bg-secondary-500 rounded-full opacity-20"></div>
            </div>
          </div>
        </div>

        {/* Catégories populaires - remplacé par le carrousel de catégories dynamique */}
        <CategoryCarousel />

        {/* Produits en vedette */}
        <div className="bg-white rounded-3xl shadow p-6 mb-12" id="featured">
          <div className="flex justify-between items-center mb-6">
            <div>
              <div className="inline-block bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium mb-2">
                Populaire
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Produits en vedette</h2>
            </div>
            <Link to="/products" className="text-primary-600 font-medium flex items-center hover:text-primary-700">
              Voir tout
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
          
          <ProductsGrid featuredOnly={true} limit={4} title="" />
        </div>

        {/* Avantages */}
        <div className="bg-white rounded-3xl shadow p-6 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Pourquoi nous choisir</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Avantage 1 */}
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Qualité Premium</h3>
              <p className="text-gray-600">Des vêtements fabriqués avec les meilleurs matériaux pour une durabilité et un confort incomparables.</p>
            </div>
            
            {/* Avantage 2 */}
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Livraison Rapide</h3>
              <p className="text-gray-600">Recevez votre commande en un temps record grâce à notre service de livraison express.</p>
            </div>
            
            {/* Avantage 3 */}
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Retours Gratuits</h3>
              <p className="text-gray-600">Insatisfait ? Retournez votre article dans les 30 jours pour un remboursement complet.</p>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="bg-primary-600 rounded-3xl shadow p-8 text-white overflow-hidden relative">
          {/* Éléments décoratifs */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-primary-500 rounded-full translate-x-16 -translate-y-16 opacity-30"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary-700 rounded-full -translate-x-16 translate-y-16 opacity-30"></div>
          
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <h2 className="text-3xl font-bold mb-4">Restez informé</h2>
            <p className="mb-8 text-primary-100">Inscrivez-vous à notre newsletter pour recevoir nos offres exclusives et les dernières tendances</p>
            <div className="flex flex-col sm:flex-row gap-2 max-w-lg mx-auto">
              <input 
                type="email" 
                placeholder="Votre adresse email" 
                className="flex-grow px-4 py-3 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="bg-white text-primary-600 hover:bg-primary-50 px-6 py-3 rounded-full font-semibold transition-colors">
                S'inscrire
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 