import HomeHero from '../components/home/HomeHero';
import PopularCat from '../components/home/PopularCat';


const Home = () => {
  return (
    <div className='min-h-screen'>
      <HomeHero />
      <div className="block md:hidden" style={{ height: '900px' }} />
      <div className="hidden md:block" style={{ height: '250px' }} />
      <PopularCat />
    </div>
  );
};

export default Home;
