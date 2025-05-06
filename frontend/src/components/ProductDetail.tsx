import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Product, getProductBySlug } from '../api/products';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { 
  fadeIn, 
  fadeInUp, 
  fadeInLeft, 
  fadeInRight, 
  notificationAnimation
} from '../utils/animations';
import { Badge, Button, Loader } from './ui';
import { components, typography } from '../utils/designSystem';
import CurrencySwitcher from './CurrencySwitcher';
import { CurrencyCode, useCurrencyFormatter, currencies } from '../utils/currency';

// Extension du type Product avec les propriétés additionnelles
interface ProductWithDetails extends Product {
  discount_percentage?: number;
  is_new?: boolean;
  rating?: number;
  review_count?: number;
  features?: Array<{
    name: string;
    value: string;
  }>;
}

const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [product, setProduct] = useState<ProductWithDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [showNotification, setShowNotification] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [currencyCode, setCurrencyCode] = useState<CurrencyCode>('EUR');
  
  // Récupérer la devise préférée du localStorage au chargement
  useEffect(() => {
    const savedCurrency = localStorage.getItem('preferredCurrency') as CurrencyCode | null;
    if (savedCurrency && currencies[savedCurrency]) {
      setCurrencyCode(savedCurrency);
    }
  }, []);
  
  // Utiliser le hook pour formater les prix
  const formatPrice = useCurrencyFormatter(currencyCode);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        const data = await getProductBySlug(slug);
        setProduct(data);
        
        // Définir l'image active par défaut
        if (data.images && data.images.length > 0) {
          const mainImage = data.images.find(img => img.is_main);
          if (mainImage) {
            setActiveImage(mainImage.image_url);
            setActiveImageIndex(data.images.indexOf(mainImage));
          } else {
            setActiveImage(data.images[0].image_url);
            setActiveImageIndex(0);
          }
        }
      } catch (err) {
        setError('Erreur lors du chargement du produit');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0 && product && value <= product.stock) {
      setQuantity(value);
    }
  };

  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        image: product.images && product.images.length > 0 
          ? product.images.find(img => img.is_main)?.image_url || product.images[0].image_url
          : '',
        quantity,
        slug: product.slug
      }));
      
      // Afficher une notification
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    }
  };

  const nextImage = () => {
    if (!product || !product.images) return;
    
    const newIndex = (activeImageIndex + 1) % product.images.length;
    setActiveImageIndex(newIndex);
    setActiveImage(product.images[newIndex].image_url);
  };

  const prevImage = () => {
    if (!product || !product.images) return;
    
    const newIndex = (activeImageIndex - 1 + product.images.length) % product.images.length;
    setActiveImageIndex(newIndex);
    setActiveImage(product.images[newIndex].image_url);
  };

  // Gérer le changement de devise
  const handleCurrencyChange = (currency: typeof currencies[CurrencyCode]) => {
    setCurrencyCode(currency.code);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader 
          variant="circle" 
          color="primary" 
          size="lg" 
          text="Chargement du produit..." 
          centered 
        />
      </div>
    );
  }

  if (error || !product) {
    return (
      <motion.div 
        className="max-w-4xl mx-auto my-12 bg-red-50 p-8 rounded-3xl shadow-sm border border-red-100 text-center"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-red-600 font-medium text-xl mb-4">{error || "Produit non trouvé"}</p>
        <p className="text-gray-600 mb-6">Le produit que vous recherchez n'est pas disponible ou n'existe pas.</p>
        <Button 
          variant="primary" 
          size="md" 
          onClick={() => navigate(-1)}
          className="rounded-full"
        >
          Retour à la page précédente
        </Button>
      </motion.div>
    );
  }

  // Calcul du prix réduit si applicable
  const discount = product.discount_percentage || 0;
  const priceValue = parseFloat(product.price);
  const discountedPriceValue = discount > 0 
    ? priceValue * (1 - discount / 100)
    : null;

  return (
    <motion.div 
      className="max-w-7xl mx-auto py-12 px-4 sm:px-6"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      {/* Fil d'Ariane avec sélecteur de devise */}
      <motion.div 
        className="flex items-center justify-between text-sm text-gray-500 mb-8"
        variants={fadeInUp}
      >
        <nav className="flex items-center">
          <Link to="/" className="hover:text-primary-600 transition-colors">Accueil</Link>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <Link to="/products" className="hover:text-primary-600 transition-colors">Produits</Link>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-900 font-medium">{product.name}</span>
        </nav>
        
        {/* Sélecteur de devise */}
        <CurrencySwitcher 
          defaultCurrency={currencyCode}
          onCurrencyChange={handleCurrencyChange}
        />
      </motion.div>

      <div className={`${components.containers.section} p-6 md:p-8 lg:p-10`}>
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Galerie d'images */}
          <motion.div 
            className="lg:w-1/2"
            variants={fadeInLeft}
          >
            <div className="relative bg-gray-50 rounded-2xl overflow-hidden mb-4 aspect-w-4 aspect-h-3">
              {activeImage ? (
                <div 
                  className="relative w-full h-full cursor-zoom-in"
                  onClick={() => setIsZoomed(!isZoomed)}
                >
                  <motion.img 
                    src={activeImage} 
                    alt={product.name} 
                    className={`w-full h-full object-contain transition-transform duration-500 ${isZoomed ? 'scale-150' : 'scale-100'}`}
                    layoutId={`product-image-${activeImageIndex}`}
                  />
                  
                  {/* Contrôles de navigation */}
                  {product.images && product.images.length > 1 && (
                    <>
                      <motion.button 
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-2 shadow-md text-gray-800 hover:bg-opacity-100 focus:outline-none"
                        onClick={(e) => { e.stopPropagation(); prevImage(); }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </motion.button>
                      <motion.button 
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-2 shadow-md text-gray-800 hover:bg-opacity-100 focus:outline-none"
                        onClick={(e) => { e.stopPropagation(); nextImage(); }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </motion.button>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
            
            {/* Miniatures */}
            {product.images && product.images.length > 1 && (
              <motion.div 
                className="grid grid-cols-5 gap-2"
                variants={fadeInUp}
              >
                {product.images.map((image, index) => (
                  <motion.div 
                    key={image.id}
                    className={`cursor-pointer rounded-xl overflow-hidden transition-all ${
                      activeImage === image.image_url ? 'ring-2 ring-primary-500 scale-95' : 'hover:opacity-80'
                    }`}
                    onClick={() => {
                      setActiveImage(image.image_url);
                      setActiveImageIndex(index);
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="aspect-w-1 aspect-h-1 w-full">
                      <img 
                        src={image.image_url} 
                        alt={`${product.name} vue ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>

          {/* Informations produit */}
          <motion.div 
            className="lg:w-1/2 flex flex-col"
            variants={fadeInRight}
          >
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="info" size="md" className="bg-blue-100 text-blue-700">
                {product.category_name}
              </Badge>
              
              {product.is_new && (
                <Badge variant="success" size="md" className="bg-emerald-500 text-white">
                  Nouveau
                </Badge>
              )}
              
              {discount > 0 && (
                <Badge variant="danger" size="md" className="bg-red-500 text-white">
                  -{discount}%
                </Badge>
              )}
              
              {product.featured && (
                <Badge variant="warning" size="md" className="bg-amber-500 text-white">
                  Vedette
                </Badge>
              )}
            </div>

            {/* Nom du produit */}
            <h1 className={typography.headings.h1}>{product.name}</h1>
            
            {/* Prix et remise */}
            <div className="mt-4 flex items-end">
              {discountedPriceValue ? (
                <>
                  <span className="text-3xl font-bold text-primary-600 mr-3">
                    {formatPrice(discountedPriceValue)}
                  </span>
                  <span className="text-xl text-gray-500 line-through mb-0.5">
                    {formatPrice(priceValue)}
                  </span>
                </>
              ) : (
                <span className="text-3xl font-bold text-primary-600">
                  {formatPrice(priceValue)}
                </span>
              )}
            </div>
            
            {/* Évaluation */}
            <div className="mt-4 flex items-center">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg 
                    key={i} 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-6 w-6 ${i < Math.round(product.rating || 0) ? 'text-amber-400' : 'text-gray-300'}`}
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="ml-2 text-gray-600">
                {product.rating ? `${product.rating.toFixed(1)} (${product.review_count} avis)` : 'Aucun avis'}
              </span>
            </div>
            
            {/* Disponibilité */}
            <div className="mt-6 flex items-center">
              {product.stock > 0 ? (
                <Badge variant="success" size="md" className="bg-green-100 text-green-700">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                  En stock ({product.stock} disponibles)
                </Badge>
              ) : (
                <Badge variant="danger" size="md" className="bg-red-100 text-red-700">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                  En rupture de stock
                </Badge>
              )}
            </div>
            
            {/* Description */}
            <div className="mt-6">
              <h3 className={typography.headings.h4}>Description</h3>
              <motion.div 
                className="mt-2 prose text-gray-700"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                dangerouslySetInnerHTML={{ __html: product.description || "Aucune description disponible." }}
              />
            </div>
            
            {/* Options d'achat */}
            {product.stock > 0 && (
              <motion.div 
                className="mt-8"
                variants={fadeInUp}
              >
                <div className="flex flex-col sm:flex-row gap-4 items-center mb-6">
                  {/* Sélecteur de quantité */}
                  <div className="w-full sm:w-1/3 flex items-center border border-gray-300 rounded-full overflow-hidden bg-white">
                    <button 
                      onClick={decrementQuantity}
                      className="px-4 py-2 text-gray-700 hover:bg-gray-100 focus:outline-none"
                      disabled={quantity <= 1}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <input 
                      type="number" 
                      value={quantity} 
                      onChange={handleQuantityChange}
                      min="1" 
                      max={product.stock} 
                      className="flex-1 text-center border-none focus:ring-0 py-2"
                    />
                    <button 
                      onClick={incrementQuantity}
                      className="px-4 py-2 text-gray-700 hover:bg-gray-100 focus:outline-none"
                      disabled={quantity >= product.stock}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Bouton d'ajout au panier */}
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleAddToCart}
                    className="w-full sm:w-2/3 rounded-full"
                    disabled={product.stock <= 0}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Ajouter au panier
                  </Button>
                </div>
                
                {/* Bouton d'achat rapide */}
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full rounded-full"
                  disabled={product.stock <= 0}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Acheter maintenant ({formatPrice(discountedPriceValue || priceValue)})
                </Button>
              </motion.div>
            )}
            
            {/* Caractéristiques du produit */}
            {product.features && product.features.length > 0 && (
              <motion.div 
                className="mt-8 border-t border-gray-200 pt-6"
                variants={fadeInUp}
              >
                <h3 className={typography.headings.h4}>Caractéristiques</h3>
                <ul className="mt-4 space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{feature.name}: <span className="font-medium">{feature.value}</span></span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
            
            {/* Options de livraison */}
            <motion.div 
              className="mt-8 border-t border-gray-200 pt-6 space-y-4"
              variants={fadeInUp}
            >
              <div className="flex items-center text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Livraison gratuite à partir de {formatPrice(50)}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Retours gratuits sous 30 jours</span>
              </div>
              <div className="flex items-center text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Paiement sécurisé</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* Notification d'ajout au panier */}
      <AnimatePresence>
        {showNotification && (
          <motion.div 
            className="fixed bottom-8 right-8 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 flex items-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            variants={notificationAnimation}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Produit ajouté au panier avec succès!
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProductDetail; 