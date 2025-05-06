import { useState } from 'react';
import { Link } from 'react-router-dom';

// Composant temporaire pour simuler les catégories
const Categories = ({ onSelectCategory }: { onSelectCategory: (category: string | null) => void }) => {
  const categories = [
    { id: 1, name: 'Tous les produits', slug: null },
    { id: 2, name: 'Femmes', slug: 'femmes' },
    { id: 3, name: 'Hommes', slug: 'hommes' },
    { id: 4, name: 'Accessoires', slug: 'accessoires' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <h3 className="text-lg font-semibold mb-3">Catégories</h3>
      <ul className="space-y-2">
        {categories.map((category) => (
          <li key={category.id}>
            <button
              onClick={() => onSelectCategory(category.slug)}
              className="text-gray-700 hover:text-primary-600 w-full text-left"
            >
              {category.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Composant temporaire pour simuler les filtres de prix
const PriceFilter = ({ onApplyPriceFilter }: { onApplyPriceFilter: (min: number, max: number) => void }) => {
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleApplyFilter = () => {
    onApplyPriceFilter(
      minPrice ? parseFloat(minPrice) : 0,
      maxPrice ? parseFloat(maxPrice) : 1000
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <h3 className="text-lg font-semibold mb-3">Prix</h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="min-price" className="block text-sm text-gray-600 mb-1">
            Prix minimum
          </label>
          <input
            type="number"
            id="min-price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="form-input"
            placeholder="0 €"
          />
        </div>
        <div>
          <label htmlFor="max-price" className="block text-sm text-gray-600 mb-1">
            Prix maximum
          </label>
          <input
            type="number"
            id="max-price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="form-input"
            placeholder="1000 €"
          />
        </div>
        <button
          onClick={handleApplyFilter}
          className="btn btn-primary w-full"
        >
          Appliquer
        </button>
      </div>
    </div>
  );
};

// Composant pour simuler des produits
const ProductsList = () => {
  // Données temporaires de produits
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
    },
    {
      id: 5,
      name: 'Pull en laine beige',
      slug: 'pull-laine-beige',
      price: 44.99,
      image: 'https://via.placeholder.com/300x400?text=Pull+Laine'
    },
    {
      id: 6,
      name: 'T-shirt basique noir',
      slug: 't-shirt-basique-noir',
      price: 19.99,
      image: 'https://via.placeholder.com/300x400?text=T-shirt+Noir'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

const ProductsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
    // Ici, on ferait une requête API pour filtrer par catégorie
  };

  const handlePriceFilter = (min: number, max: number) => {
    setPriceRange({ min, max });
    // Ici, on ferait une requête API pour filtrer par prix
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Nos Produits</h1>
      
      <div className="flex flex-col md:flex-row">
        {/* Sidebar avec filtres */}
        <div className="w-full md:w-1/4 md:pr-6">
          <Categories onSelectCategory={handleCategorySelect} />
          <PriceFilter onApplyPriceFilter={handlePriceFilter} />
        </div>
        
        {/* Liste des produits */}
        <div className="w-full md:w-3/4">
          <div className="mb-6 flex justify-between items-center">
            <p className="text-gray-600">
              Affichage des produits {selectedCategory ? `de la catégorie "${selectedCategory}"` : ''}
              {(priceRange.min > 0 || priceRange.max < 1000) ? 
                ` • Prix: ${priceRange.min}€ - ${priceRange.max}€` : 
                ''}
            </p>
            <select className="form-input w-40">
              <option value="newest">Plus récents</option>
              <option value="price-low">Prix croissant</option>
              <option value="price-high">Prix décroissant</option>
            </select>
          </div>
          
          <ProductsList />
        </div>
      </div>
    </div>
  );
};

export default ProductsPage; 