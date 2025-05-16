import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { components } from '../../utils/designSystem';

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white pt-16 pb-8 px-4 mt-auto">
      <div className="max-w-7xl mx-auto">
        {/* Grille principale */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Colonne 1: Logo et description */}
          <div className="col-span-1 lg:col-span-1">
            <h2 className="text-2xl font-bold text-white mb-6">JaelleShop</h2>
            <p className="text-blue-200 mb-6">
              Votre boutique de mode en ligne pour des vêtements élégants et tendance. Découvrez notre collection exclusive.
            </p>
            <div className="flex space-x-4 mb-8">
              <a href="#" className="text-blue-200 hover:text-violet-300 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
              </a>
              <a href="#" className="text-blue-200 hover:text-violet-300 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="#" className="text-blue-200 hover:text-violet-300 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
            </div>
          </div>
          
          {/* Colonne 2: Liens rapides */}
          <div className="col-span-1">
            <h3 className="text-xl font-semibold mb-6 text-violet-300">Liens rapides</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-blue-200 hover:text-violet-300 transition-colors">Accueil</Link></li>
              <li><Link to="/products" className="text-blue-200 hover:text-violet-300 transition-colors">Produits</Link></li>
              <li><Link to="/categories" className="text-blue-200 hover:text-violet-300 transition-colors">Catégories</Link></li>
              <li><Link to="/about" className="text-blue-200 hover:text-violet-300 transition-colors">À propos</Link></li>
              <li><Link to="/contact" className="text-blue-200 hover:text-violet-300 transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          {/* Colonne 3: Informations */}
          <div className="col-span-1">
            <h3 className="text-xl font-semibold mb-6 text-green-300">Informations</h3>
            <ul className="space-y-3">
              <li><Link to="/delivery" className="text-blue-200 hover:text-green-300 transition-colors">Livraison</Link></li>
              <li><Link to="/returns" className="text-blue-200 hover:text-green-300 transition-colors">Retours</Link></li>
              <li><Link to="/privacy" className="text-blue-200 hover:text-green-300 transition-colors">Politique de confidentialité</Link></li>
              <li><Link to="/terms" className="text-blue-200 hover:text-green-300 transition-colors">Conditions d'utilisation</Link></li>
              <li><Link to="/faq" className="text-blue-200 hover:text-green-300 transition-colors">FAQ</Link></li>
            </ul>
          </div>
          
          {/* Colonne 4: Newsletter */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <h3 className="text-xl font-semibold mb-6 text-violet-300">Newsletter</h3>
            <p className="text-blue-200 mb-4">Inscrivez-vous pour recevoir nos offres exclusives</p>
            <div className="flex flex-col space-y-4">
              <form className="flex">
                <input 
                  type="email" 
                  placeholder="Votre adresse email" 
                  className="flex-grow px-4 py-3 rounded-full text-gray-800 bg-white border-2 border-white focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 placeholder-gray-600 font-medium"
                />
                <button 
                  type="submit"
                  className="whitespace-nowrap bg-violet-600 !text-black hover:bg-violet-500 px-6 py-3 rounded-full font-semibold transition-colors ml-2"
                >
                  S'inscrire
                </button>
              </form>
            </div>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-blue-800 text-center text-sm text-blue-200 flex flex-col items-center">
          <p>&copy; {new Date().getFullYear()} JaelleShop. Tous droits réservés.</p>
          <div className="flex space-x-6 mt-4">
            <Link to="/privacy" className="text-violet-300 hover:text-white transition-colors">Confidentialité</Link>
            <Link to="/terms" className="text-green-300 hover:text-white transition-colors">Conditions</Link>
            <Link to="/contact" className="text-violet-300 hover:text-white transition-colors">Contact</Link>
          </div>
          
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
          
        </div>
      </div>
    </footer>
  );
};

export default Footer; 