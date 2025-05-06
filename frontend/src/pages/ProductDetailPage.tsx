import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch } from '../store';
import { addToCart } from '../store/slices/cartSlice';

const ProductDetailPage = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { slug } = useParams<{ slug: string }>();
  const dispatch = useAppDispatch();
  const [quantity, setQuantity] = useState(1);

  // Simulation d'un produit pour le moment
  // Dans une application réelle, on utiliserait _slug pour récupérer le produit depuis l'API
  // console.log(`Slug du produit demandé: ${_slug}`);
  
  const product = {
    id: 1,
    name: 'Robe d\'été fleurie',
    slug: 'robe-ete-fleurie',
    description: 'Une magnifique robe d\'été à motifs floraux, parfaite pour les journées ensoleillées. Fabriquée en coton léger et respirant, cette robe vous garantit confort et style tout au long de la journée.',
    price: 49.99,
    stock: 15,
    category: 'Femmes',
    images: [
      'https://via.placeholder.com/600x800?text=Robe+Fleurie+1',
      'https://via.placeholder.com/600x800?text=Robe+Fleurie+2',
      'https://via.placeholder.com/600x800?text=Robe+Fleurie+3'
    ]
  };

  const [activeImage, setActiveImage] = useState(0);

  const handleAddToCart = () => {
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.images[0]
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link to="/products" className="text-primary-600 hover:underline flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Retour aux produits
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Images du produit */}
        <div>
          <div className="mb-4">
            <img 
              src={product.images[activeImage]} 
              alt={product.name} 
              className="w-full h-auto rounded-lg shadow-md"
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {product.images.map((image, index) => (
              <button 
                key={index}
                className={`rounded-md overflow-hidden border-2 ${activeImage === index ? 'border-primary-600' : 'border-transparent'}`}
                onClick={() => setActiveImage(index)}
              >
                <img src={image} alt={`${product.name} - vue ${index + 1}`} className="w-full h-auto" />
              </button>
            ))}
          </div>
        </div>

        {/* Détails du produit */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-gray-600 mb-4">Catégorie: {product.category}</p>
          <p className="text-2xl font-bold text-primary-600 mb-6">{product.price.toFixed(2)} €</p>
          
          <div className="border-t border-b border-gray-200 py-6 mb-6">
            <p className="text-gray-700 mb-4">{product.description}</p>
            <p className={`font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? `En stock (${product.stock} disponibles)` : 'Rupture de stock'}
            </p>
          </div>

          <div className="mb-6">
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
              Quantité
            </label>
            <div className="flex">
              <button 
                className="px-3 py-2 border border-gray-300 bg-gray-100"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </button>
              <input 
                type="number"
                id="quantity"
                className="form-input w-16 text-center mx-2"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                max={product.stock}
              />
              <button 
                className="px-3 py-2 border border-gray-300 bg-gray-100"
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              >
                +
              </button>
            </div>
          </div>

          <button 
            className="btn btn-primary w-full py-3 text-lg mb-4"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
          >
            Ajouter au panier
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage; 