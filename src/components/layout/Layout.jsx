import { Outlet, useLocation } from 'react-router-dom';
import Header from '../header/Header';
import Footer from '../footer/Footer';

const Layout = ({ children }) => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isProfile = location.pathname === '/profile';
  const noPadding = isHome || isProfile;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className={`${noPadding ? '' : 'pt-20'} min-h-[calc(100vh-5rem)]`}>
        {children || <Outlet />}
      </main>
      <Footer />
    </div>
  );
};

export default Layout; 