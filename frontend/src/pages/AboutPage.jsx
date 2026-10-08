import BrandSection from '../components/sections/BrandSection';

export default function AboutPage() {
  return (
    <div className="pt-28 pb-16 min-h-screen">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 mb-16">
        <h1 className="text-4xl md:text-5xl font-black text-cognify-white tracking-tight text-center mb-6">About Cognify</h1>
        <p className="text-cognify-gray text-center max-w-2xl mx-auto">
          We are a premium streetwear brand dedicated to redefining modern men's fashion through quality craftsmanship and timeless design.
        </p>
      </div>
      <BrandSection />
    </div>
  );
}
