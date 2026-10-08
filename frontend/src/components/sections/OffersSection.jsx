import { Link } from 'react-router-dom';
import { Tag, Truck, RotateCcw, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const offers = [
  {
    code: 'FIRST20',
    title: '20% Off First Order',
    description: 'Use code FIRST20 on your first purchase. Valid on all products.',
    badge: 'NEW USER',
    bg: 'bg-cognify-olive/10 border-cognify-olive/30',
  },
  {
    code: 'STYLE500',
    title: 'Flat ₹500 Off on ₹3000+',
    description: 'Shop for ₹3000 or more and get ₹500 instant discount.',
    badge: 'LIMITED',
    bg: 'bg-cognify-offwhite/5 border-cognify-offwhite/20',
  },
];

const perks = [
  { icon: Truck, title: 'Free Delivery', description: 'On orders above ₹999' },
  { icon: RotateCcw, title: 'Easy Returns', description: '15-day hassle-free returns' },
  { icon: Shield, title: 'Authentic Products', description: '100% genuine guarantee' },
  { icon: Tag, title: 'Best Prices', description: 'Competitive pricing always' },
];

export default function OffersSection() {
  return (
    <section className="py-16 md:py-24 bg-cognify-secondary">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <p className="section-subtitle mb-2">Exclusive Deals</p>
          <h2 className="section-title">Special Offers</h2>
        </div>

        {/* Offer Cards */}
        <div className="grid sm:grid-cols-2 gap-4 mb-16">
          {offers.map((offer) => (
            <motion.div
              key={offer.code}
              whileHover={{ y: -2 }}
              className={`border p-6 md:p-8 ${offer.bg}`}
            >
              <span className="text-xs font-bold tracking-widest uppercase text-cognify-olive border border-cognify-olive/50 px-2 py-0.5 mb-4 inline-block">
                {offer.badge}
              </span>
              <h3 className="text-lg font-bold text-cognify-white mb-2">{offer.title}</h3>
              <p className="text-cognify-gray text-sm mb-4">{offer.description}</p>
              <div className="flex items-center gap-4">
                <div className="border border-dashed border-cognify-border px-4 py-2">
                  <span className="text-cognify-offwhite font-mono font-bold tracking-widest">{offer.code}</span>
                </div>
                <Link to="/shop" className="text-sm text-cognify-olive hover:text-cognify-offwhite transition-colors font-medium">
                  Shop Now →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Perks */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-cognify-border pt-12">
          {perks.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 border border-cognify-border flex items-center justify-center">
                <Icon size={20} className="text-cognify-olive" />
              </div>
              <div>
                <p className="text-cognify-white font-semibold text-sm">{title}</p>
                <p className="text-cognify-gray text-xs mt-0.5">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
