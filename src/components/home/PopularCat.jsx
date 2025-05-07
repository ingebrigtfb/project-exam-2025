import beachImg from '../../assets/beach-category.png';
import cityImg from '../../assets/city-category.png';
import cabinImg from '../../assets/cabin-category.png';

const categories = [
  { image: beachImg },
  { image: cityImg },
  { image: cabinImg },
];

export default function PopularCat() {
  return (
    <div className="max-w-[1000px] mx-auto w-full px-4 py-16 flex flex-col">
      <h1 className="text-2xl font-bold mb-8 text-center md:text-left">Popular categories</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {categories.map((cat, idx) => (
          <div
            key={idx}
            className="relative max-w-[298px] w-full mx-auto overflow-hidden shadow rounded-lg"
          >
            <img
              src={cat.image}
              alt={cat.name}
              className="w-full h-48 object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}