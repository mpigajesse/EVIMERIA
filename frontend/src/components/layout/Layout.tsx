import { Outlet, useLocation } from 'react-router-dom';
import Header from '../../components/layout/Header';
import CategoriesNav from '../../components/layout/CategoriesNav';
import Footer from '../../components/layout/Footer';

const Layout = () => {
  const location = useLocation();
  
  // Afficher le menu des catégories uniquement sur certaines pages
  const shouldShowCategoriesNav = 
    location.pathname === '/' || 
    location.pathname.startsWith('/products') || 
    location.pathname.startsWith('/categories');
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {shouldShowCategoriesNav && <CategoriesNav />}
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout; 