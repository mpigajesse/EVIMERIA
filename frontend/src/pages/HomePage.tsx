import { Link } from 'react-router-dom';

// Composant temporaire pour simuler des produits en vedette
// À remplacer par des données réelles de l'API
const FeaturedProducts = () => {
  const products = [
    {
      id: 1,
      name: 'Robe d\'été fleurie',
      slug: 'robe-ete-fleurie',
      price: 49.99,
      image: 'https://via.placeholder.com/300x400?text=Robe+Fleurie'
    },
    {
      id: 2,
      name: 'Chemise en lin blanc',
      slug: 'chemise-lin-blanc',
      price: 39.99,
      image: 'https://via.placeholder.com/300x400?text=Chemise+Lin'
    },
    {
      id: 3,
      name: 'Jean slim bleu',
      slug: 'jean-slim-bleu',
      price: 59.99,
      image: 'https://via.placeholder.com/300x400?text=Jean+Slim'
    },
    {
      id: 4,
      name: 'Veste en cuir noire',
      slug: 'veste-cuir-noire',
      price: 129.99,
      image: 'https://via.placeholder.com/300x400?text=Veste+Cuir'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <div key={product.id} className="card hover:shadow-lg transition-shadow">
          <Link to={`/products/${product.slug}`}>
            <img src={product.image} alt={product.name} className="w-full h-64 object-cover rounded-t-lg" />
            <div className="p-4">
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-primary-600 font-bold mt-2">{product.price.toFixed(2)} €</p>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

const HomePage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Bienvenue chez JaelleShop</h1>
          <p className="text-xl mb-8">Votre destination mode pour des vêtements élégants et de qualité</p>
          <Link to="/products" className="btn btn-secondary px-8 py-3 text-lg">
            Découvrir la collection
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Produits en vedette</h2>
          <FeaturedProducts />
          <div className="text-center mt-10">
            <Link to="/products" className="btn btn-primary px-6 py-2">
              Voir tous les produits
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Pourquoi nous choisir ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Qualité Premium</h3>
              <p className="text-gray-600">Des vêtements fabriqués avec les meilleurs matériaux pour une durabilité et un confort incomparables.</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Livraison Rapide</h3>
              <p className="text-gray-600">Recevez votre commande en un temps record grâce à notre service de livraison express.</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Retours Gratuits</h3>
              <p className="text-gray-600">Insatisfait ? Retournez votre article dans les 30 jours pour un remboursement complet.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 