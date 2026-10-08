import HeroSection from '../components/sections/HeroSection';
import CategoryCarousel from '../components/sections/CategoryCarousel';
import ProductSection from '../components/sections/ProductSection';
import OffersSection from '../components/sections/OffersSection';
import BrandSection from '../components/sections/BrandSection';
import { getFeaturedProducts, getNewArrivals, getTrendingProducts, products } from '../data/products';

export default function HomePage() {
  const featured = getFeaturedProducts().slice(0, 8);
  const newArrivals = getNewArrivals().slice(0, 8);
  const trending = getTrendingProducts().slice(0, 8);
  const recommended = products.slice(0, 8);

  return (
    <div>
      <HeroSection />
      <CategoryCarousel />
      <div className="border-t border-cognify-border" />
      <ProductSection
        title="Featured Products"
        subtitle="Curated for you"
        products={featured}
        viewAllHref="/shop"
      />
      <div className="border-t border-cognify-border" />
      <ProductSection
        title="New Arrivals"
        subtitle="Just dropped"
        products={newArrivals}
        viewAllHref="/shop?filter=new"
      />
      <OffersSection />
      <div className="border-t border-cognify-border" />
      <ProductSection
        title="Trending Now"
        subtitle="Most popular"
        products={trending}
        viewAllHref="/shop?filter=trending"
      />
      <BrandSection />
      <div className="border-t border-cognify-border" />
      <ProductSection
        title="Recommended for You"
        subtitle="Based on your style"
        products={recommended}
        viewAllHref="/shop"
      />
    </div>
  );
}
