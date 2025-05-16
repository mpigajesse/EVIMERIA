import { Outlet, useLocation } from 'react-router-dom';
import Header from '../../components/layout/Header';
import CategoriesNav from '../../components/layout/CategoriesNav';
import Footer from '../../components/layout/Footer';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
// import Loader from '../../components/ui/Loader';
// import CartDrawer from '../../components/layout/CartDrawer';
// import SearchModal from '../../components/layout/SearchModal';

const Layout = () => {
  const location = useLocation();
  
  // Afficher le menu des catégories uniquement sur certaines pages
  const shouldShowCategoriesNav = 
    location.pathname === '/' || 
    location.pathname.startsWith('/products') || 
    location.pathname.startsWith('/categories');
  
  // Remettre le scroll en haut lors du changement de page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-blue-100">
      {/* <Loader /> */}
      {/* <CartDrawer /> */}
      {/* <SearchModal /> */}
      <Header />
      {shouldShowCategoriesNav && <CategoriesNav />}
      <motion.main 
        className="flex-grow responsive-container safari-flex-fix"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Outlet />
      </motion.main>
      <Footer />
    </div>
  );
};

export default Layout; 