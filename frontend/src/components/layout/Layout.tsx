import { Outlet, useLocation } from 'react-router-dom';
import Header from '../../components/layout/Header';
import CategoriesNav from '../../components/layout/CategoriesNav';
import Footer from '../../components/layout/Footer';
import { useEffect } from 'react';

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
    <div className="flex flex-col min-h-screen overflow-x-hidden w-full">
      <Header />
      {shouldShowCategoriesNav && <CategoriesNav />}
      <main className="flex-grow responsive-container safari-flex-fix">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout; 