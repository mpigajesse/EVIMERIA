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
  notificationAnimation,
  buttonTap
} from '../utils/animations';

const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [showNotification, setShowNotification] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <motion.div 
          className="relative w-24 h-24"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute inset-0 rounded-full border-t-4 border-primary-500 opacity-75"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-16 w-16 bg-white rounded-full opacity-80"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-10 w-10 bg-primary-100 rounded-full"></div>
          </div>
        </motion.div>
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
        <motion.button 
          className="px-6 py-3 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors shadow-sm"
          onClick={() => navigate(-1)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Retour à la page précédente
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="max-w-7xl mx-auto py-12 px-4 sm:px-6"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      {/* Fil d'Ariane */}
      <motion.nav 
        className="flex items-center text-sm text-gray-500 mb-8"
        variants={fadeInUp}
      >
        <Link to="/" className="hover:text-primary-600 transition-colors">Accueil</Link>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <Link to="/products" className="hover:text-primary-600 transition-colors">Produits</Link>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-gray-900 font-medium">{product.name}</span>
      </motion.nav>

      <div className="bg-white rounded-3xl shadow-lg overflow-hidden p-6">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Galerie d'images */}
          <motion.div 
            className="lg:w-1/2"
            variants={fadeInLeft}
          >
            <div className="relative bg-gray-50 rounded-2xl overflow-hidden mb-4 aspect-w-1 aspect-h-1">
              {activeImage ? (
                <div 
                  className="relative w-full h-96 cursor-zoom-in"
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
                <div className="flex items-center justify-center h-96 bg-gray-100">
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
                    <motion.img 
                      src={image.image_url} 
                      alt={`${product.name} - vue ${image.id}`} 
                      className="w-full h-24 object-cover"
                      layoutId={`product-thumbnail-${index}`}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
          
          {/* Informations produit */}
          <motion.div 
            className="lg:w-1/2"
            variants={fadeInRight}
          >
            {product.featured && (
              <motion.div 
                className="inline-block bg-primary-100 text-primary-600 px-3 py-1 rounded-full text-sm font-medium mb-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Produit en vedette
              </motion.div>
            )}
            <motion.h1 
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-2"
              variants={fadeInUp}
            >
              {product.name}
            </motion.h1>
            <div className="flex items-center mb-4">
              <p className="text-sm text-gray-500">Catégorie: <span className="font-medium text-gray-700">{product.category_name}</span></p>
              <div className="h-4 w-px bg-gray-300 mx-3"></div>
              <div className={`flex items-center ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                <span className={`inline-block w-2 h-2 rounded-full mr-1 ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span className="text-sm">{product.stock > 0 ? 'Disponible' : 'Rupture de stock'}</span>
              </div>
            </div>
            
            <motion.div 
              className="text-3xl font-bold text-primary-600 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {product.price} €
            </motion.div>
            
            <motion.div 
              className="prose max-w-none mb-8 text-gray-600"
              variants={fadeInUp}
            >
              <p>{product.description}</p>
            </motion.div>
            
            {product.stock > 0 ? (
              <>
                <motion.div 
                  className="mb-6"
                  variants={fadeInUp}
                >
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">Quantité</label>
                  <div className="flex items-center">
                    <motion.button
                      type="button"
                      className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary-100"
                      onClick={decrementQuantity}
                      whileTap="tap"
                      variants={buttonTap}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    </motion.button>
                    <input
                      type="number"
                      id="quantity"
                      min="1"
                      max={product.stock}
                      value={quantity}
                      onChange={handleQuantityChange}
                      className="mx-2 w-16 text-center border-gray-200 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    />
                    <motion.button
                      type="button"
                      className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary-100"
                      onClick={incrementQuantity}
                      whileTap="tap"
                      variants={buttonTap}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                    </motion.button>
                    <span className="ml-3 text-sm text-gray-500">
                      {product.stock} disponibles
                    </span>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex flex-col sm:flex-row gap-4"
                  variants={fadeInUp}
                >
                  <motion.button
                    onClick={handleAddToCart}
                    className="flex-1 bg-primary-600 text-white py-3 px-6 rounded-full hover:bg-primary-700 transition-colors shadow-sm flex items-center justify-center"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Ajouter au panier
                  </motion.button>
                  <motion.button
                    className="flex-1 border border-primary-600 text-primary-600 py-3 px-6 rounded-full hover:bg-primary-50 transition-colors flex items-center justify-center"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    Ajouter aux favoris
                  </motion.button>
                </motion.div>
              </>
            ) : (
              <motion.div 
                className="bg-red-50 text-red-800 p-4 rounded-xl border border-red-100 mb-6"
                variants={fadeInUp}
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">Ce produit est actuellement en rupture de stock</span>
                </div>
                <p className="mt-2 text-sm">Recevez une notification dès qu'il sera à nouveau disponible</p>
                <div className="mt-3 flex">
                  <input
                    type="email"
                    placeholder="Votre adresse email"
                    className="flex-1 px-3 py-2 rounded-l-full border-gray-300 focus:ring-red-500 focus:border-red-500"
                  />
                  <motion.button 
                    className="bg-red-600 text-white px-4 py-2 rounded-r-full hover:bg-red-700 transition-colors"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Me notifier
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Informations supplémentaires */}
            <motion.div 
              className="mt-8"
              variants={fadeInUp}
            >
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Informations supplémentaires</h3>
                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Référence</dt>
                    <dd className="mt-1 text-sm text-gray-900">REF-{product.id}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Catégorie</dt>
                    <dd className="mt-1 text-sm text-gray-900">{product.category_name}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Disponibilité</dt>
                    <dd className="mt-1 text-sm text-gray-900">{product.stock > 0 ? `En stock (${product.stock} disponibles)` : 'Rupture de stock'}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Livraison</dt>
                    <dd className="mt-1 text-sm text-gray-900">2-4 jours ouvrables</dd>
                  </div>
                </dl>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* Notification d'ajout au panier */}
      <AnimatePresence>
        {showNotification && (
          <motion.div 
            className="fixed bottom-4 right-4 bg-primary-600 text-white px-6 py-4 rounded-xl shadow-lg flex items-center z-50"
            variants={notificationAnimation}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <div>
              <p className="font-medium">Produit ajouté au panier</p>
              <p className="text-sm text-primary-200">
                {product.name} ({quantity}) - {(parseFloat(product.price) * quantity).toFixed(2)} €
              </p>
            </div>
            <motion.button 
              className="ml-4 text-primary-200 hover:text-white"
              onClick={() => setShowNotification(false)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProductDetail; 