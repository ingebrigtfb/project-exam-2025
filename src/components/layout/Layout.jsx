import { Outlet, useLocation } from 'react-router-dom';
import Header from '../header/Header';
import Footer from '../footer/Footer';

const Layout = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className={`${isHome ? '' : 'pt-20'} min-h-[calc(100vh-5rem)]`}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout; 