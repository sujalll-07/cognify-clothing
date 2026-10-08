import { Link } from 'react-router-dom';
import Folder from '../ui/Folder';

const CATEGORIES = [
  {
    id: 'hoodies',
    name: 'Hoodies',
    href: '/category/hoodies',
    image: '/images/hoodie_card.jpg',
  },
  {
    id: 'shirts',
    name: 'Shirts',
    href: '/category/shirts',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80',
  },
  {
    id: 'tshirts',
    name: 'T-Shirts',
    href: '/category/tshirts',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
  },
  {
    id: 'jeans',
    name: 'Jeans',
    href: '/category/jeans',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80',
  },
];

export default function CategoryCarousel() {
  return (
    <section className="py-24 overflow-hidden bg-cognify-bg">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 flex flex-col items-center">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="section-subtitle mb-3">Browse by Category</p>
          <h2 className="section-title">Shop the Collection</h2>
        </div>

        {/* Single Folder */}
        <div className="flex flex-col items-center justify-center relative my-16">
          <div className="flex items-center justify-center relative" style={{ width: 400, height: 400 }}>
            <Folder
              color="#3a3a3a" 
              size={4}
              items={CATEGORIES.map((cat) => (
                <Link key={cat.id} to={cat.href} className="w-full h-full block relative group">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover rounded-md" />
                  <div className="absolute top-0 left-0 right-0 p-[2px] bg-gradient-to-b from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-md">
                    <p className="text-white text-center font-bold tracking-widest uppercase text-[5px] pt-0.5">{cat.name}</p>
                  </div>
                </Link>
              ))}
            />
          </div>
          <h3 className="text-3xl font-bold text-white mt-8 tracking-wide">Our Collections</h3>
        </div>
      </div>
    </section>
  );
}
