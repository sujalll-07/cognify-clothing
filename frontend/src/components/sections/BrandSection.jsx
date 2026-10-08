import { motion } from 'framer-motion';

const stats = [
  { value: '20+', label: 'Premium Products' },
  { value: '4.6', label: 'Average Rating' },
  { value: '1K+', label: 'Happy Customers' },
  { value: '2026', label: 'Founded' },
];

export default function BrandSection() {
  return (
    <section className="py-24 md:py-32 bg-cognify-bg overflow-hidden">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <p className="section-subtitle mb-4">Our Story</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-cognify-white mb-6 leading-tight">
              Built for those<br />
              <span className="text-cognify-offwhite">who move forward.</span>
            </h2>
            <p className="text-cognify-gray leading-relaxed mb-6">
              Cognify was born from the belief that clothing should inspire confidence and movement. We design for the modern man who demands quality without compromise.
            </p>
            <p className="text-cognify-gray leading-relaxed mb-10">
              Every piece is crafted with intentional design — premium materials, precise construction, and silhouettes that work as hard as you do.
            </p>
            <div className="grid grid-cols-2 gap-6">
              {stats.map(({ value, label }) => (
                <motion.div
                  key={label}
                  whileInView={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: 20 }}
                  viewport={{ once: true }}
                  className="border-l-2 border-cognify-olive pl-4"
                >
                  <div className="text-3xl font-black text-cognify-offwhite">{value}</div>
                  <div className="text-xs text-cognify-gray uppercase tracking-widest mt-1">{label}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right */}
          <div className="relative">
            <div className="absolute inset-0 bg-cognify-olive/5 blur-3xl" />
            <div className="grid grid-cols-2 gap-3 relative">
              <motion.img
                whileInView={{ opacity: 1, scale: 1 }}
                initial={{ opacity: 0, scale: 0.95 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&q=80"
                alt="Cognify Collection"
                className="w-full aspect-[3/4] object-cover"
              />
              <div className="flex flex-col gap-3">
                <motion.img
                  whileInView={{ opacity: 1, scale: 1 }}
                  initial={{ opacity: 0, scale: 0.95 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  src="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80"
                  alt="Cognify Shirt"
                  className="w-full aspect-square object-cover"
                />
                <motion.img
                  whileInView={{ opacity: 1, scale: 1 }}
                  initial={{ opacity: 0, scale: 0.95 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  src="https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80"
                  alt="Cognify Denim"
                  className="w-full aspect-square object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
