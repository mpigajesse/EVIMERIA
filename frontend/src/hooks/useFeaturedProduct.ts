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
        const response = await axios.get('http://localhost:8000/api/products/?featured=true&limit=50');
        const products = response.data.results || response.data;
        
        if (products && products.length > 0) {
          // Filtrer les produits avec images et préférer certaines catégories pour la bannière
          const productsWithImages = products.filter((product: Product) => 
            product.images && product.images.length > 0
          );
          
          if (productsWithImages.length > 0) {
            // Préférer les vêtements, accessoires élégants pour la bannière
            const preferredProducts = productsWithImages.filter((product: Product) => {
              const name = product.name.toLowerCase();
              const categoryName = product.category_name?.toLowerCase() || '';
              
              return (
                name.includes('robe') || 
                name.includes('veste') || 
                name.includes('chemise') || 
                name.includes('sac') || 
                name.includes('montre') || 
                categoryName.includes('femmes') || 
                categoryName.includes('hommes')
              );
            });
            
            // Utiliser les produits préférés s'il y en a, sinon tous les produits avec images
            const finalProducts = preferredProducts.length > 0 ? preferredProducts : productsWithImages;
            const randomIndex = Math.floor(Math.random() * finalProducts.length);
            setFeaturedProduct(finalProducts[randomIndex]);
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
    
    const mainImage = featuredProduct.images.find((img: ProductImage) => img.is_main);
    return mainImage || featuredProduct.images[0];
  };

  return {
    featuredProduct,
    loading,
    error,
    mainImage: getMainImage()
  };
}; 