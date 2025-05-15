import React from 'react';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { Product } from '../api/products';

interface ProductBuyButtonProps {
  product: Product;
  quantity?: number;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  showIcon?: boolean;
  className?: string;
}

const ProductBuyButton: React.FC<ProductBuyButtonProps> = ({
  product,
  quantity = 1,
  size = 'md',
  fullWidth = false,
  showIcon = true,
  className = '',
}) => {
  const dispatch = useDispatch();
  
  // Styles selon la taille
  const sizeStyles = {
    sm: 'text-sm py-2 px-4',
    md: 'text-base py-2.5 px-5',
    lg: 'text-lg py-3 px-6',
  };
  
  // Animation lors du clic
  const buttonTapAnimation = {
    scale: 0.97,
    transition: { duration: 0.1 }
  };
  
  // Animation de survol
  const buttonHoverAnimation = {
    scale: 1.02,
    boxShadow: '0 8px 15px rgba(2, 132, 199, 0.25)',
    transition: { duration: 0.2 }
  };
  
  // Animation du contenu
  const contentAnimation = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
  };
  
  const handleAddToCart = () => {
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url,
      quantity
    }));
  };
  
  return (
    <motion.button
      onClick={handleAddToCart}
      className={`
        inline-flex items-center justify-center gap-2
        bg-primary-600 hover:bg-primary-700 active:bg-primary-800
        !text-black font-medium rounded-full
        shadow-md hover:shadow-lg
        transition-all duration-300
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      whileHover={buttonHoverAnimation}
      whileTap={buttonTapAnimation}
      initial="initial"
      animate="animate"
    >
      {showIcon && (
        <motion.svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
          {...contentAnimation}
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
          />
        </motion.svg>
      )}
      
      <motion.span {...contentAnimation}>
        Acheter maintenant
      </motion.span>
    </motion.button>
  );
};

export default ProductBuyButton; 