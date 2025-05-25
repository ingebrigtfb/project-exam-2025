import HomeHero from '../components/home/HomeHero';
import BecomeVenueManager from '../components/home/BecomeVenueManager';
import CarRentalPartners from '../components/home/CarRentalPartners';
import usePageTitle from '../hooks/usePageTitle';

const Home = () => {
  usePageTitle('Home');
  
  return (
    <div className='min-h-screen'>
      <HomeHero />
      <div className="block md:hidden" style={{ height: '1100px' }} />
      <div className="hidden md:block" style={{ height: '250px' }} />
      <BecomeVenueManager />
      <CarRentalPartners />
    </div>
  );
};

export default Home;
