import { useState, useEffect } from 'react';
import { Product, ProductImage } from '../api/products';
import axios from 'axios';

export const useFeaturedProduct = () => {
  const [featuredProduct, setFeaturedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Récupérer tous les produits featured
        const response = await axios.get('/api/products/featured/');
        const products = response.data.results || response.data;
        
        if (products && products.length > 0) {
          // Filtrer les produits avec images
          const productsWithImages = products.filter((product: Product) => 
            product.images && product.images.length > 0
          );
          
          if (productsWithImages.length > 0) {
            // Sélectionner un produit au hasard parmi ceux qui ont des images
            const randomIndex = Math.floor(Math.random() * productsWithImages.length);
            setFeaturedProduct(productsWithImages[randomIndex]);
          }
        }
      } catch (err) {
        console.error('Erreur lors du chargement du produit featured:', err);
        setError('Erreur lors du chargement');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProduct();
  }, []);

  const getMainImage = () => {
    if (!featuredProduct?.images || featuredProduct.images.length === 0) {
      return null;
    }
    
    return featuredProduct.images[0];
  };

  return {
    featuredProduct,
    loading,
    error,
    mainImage: getMainImage()
  };
}; 