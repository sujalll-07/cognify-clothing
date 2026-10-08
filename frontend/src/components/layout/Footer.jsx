import { Link } from 'react-router-dom';
import { Globe, Mail, MessageCircle } from 'lucide-react';

const footerLinks = {
  Shop: [
    { label: 'Hoodies', href: '/category/hoodies' },
    { label: 'Shirts', href: '/category/shirts' },
    { label: 'T-Shirts', href: '/category/tshirts' },
    { label: 'Jeans', href: '/category/jeans' },
    { label: 'All Products', href: '/shop' },
  ],
  Account: [
    { label: 'My Account', href: '/account' },
    { label: 'My Orders', href: '/orders' },
    { label: 'Wishlist', href: '/wishlist' },
    { label: 'Cart', href: '/cart' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '/about' },
    { label: 'Press', href: '/about' },
    { label: 'Contact', href: '/about' },
  ],
  Help: [
    { label: 'FAQ', href: '/about' },
    { label: 'Shipping Policy', href: '/about' },
    { label: 'Return Policy', href: '/about' },
    { label: 'Size Guide', href: '/about' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-cognify-secondary border-t border-cognify-border mt-24">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-16">
        {/* Top */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="block mb-4">
              <span className="text-2xl font-bold tracking-[0.15em] text-cognify-offwhite font-['Space_Grotesk',sans-serif] uppercase">
                Cognify
              </span>
            </Link>
            <p className="text-cognify-gray text-sm leading-relaxed mb-6">
              More than clothing. It's a mindset. Premium men's fashion crafted for those who move forward.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://cognifysolution.com/"
                target="_blank"
                rel="noopener noreferrer"
                title="Cognify Solution"
                aria-label="Cognify Solution Website"
                className="text-cognify-gray hover:text-cognify-offwhite transition-colors"
              >
                <Globe size={18} />
              </a>
              <a
                href="#"
                title="Chat"
                aria-label="Chat"
                className="text-cognify-gray hover:text-cognify-offwhite transition-colors"
              >
                <MessageCircle size={18} />
              </a>
              <a
                href="mailto:cognifysolution@gmail.com"
                title="cognifysolution@gmail.com"
                aria-label="Email Cognify Solution"
                className="text-cognify-gray hover:text-cognify-offwhite transition-colors"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-xs font-semibold tracking-widest uppercase text-cognify-offwhite mb-4">
                {section}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-cognify-gray hover:text-cognify-offwhite transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="border-t border-cognify-border pt-12 mb-12">
          <div className="max-w-lg">
            <h3 className="text-lg font-semibold text-cognify-white mb-2">Stay in the loop</h3>
            <p className="text-cognify-gray text-sm mb-4">Get early access to drops, exclusive offers, and editorial content.</p>
            <form className="flex gap-0">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 bg-cognify-card border border-cognify-border text-cognify-white placeholder-cognify-gray px-4 py-3 text-sm focus:outline-none focus:border-cognify-olive transition-colors"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-cognify-offwhite text-cognify-bg text-sm font-semibold tracking-widest uppercase hover:bg-white transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-cognify-border pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-cognify-gray text-xs">
            © 2026 Cognify Clothing. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-cognify-gray hover:text-cognify-offwhite transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs text-cognify-gray hover:text-cognify-offwhite transition-colors">Terms of Service</a>
            <a href="#" className="text-xs text-cognify-gray hover:text-cognify-offwhite transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
