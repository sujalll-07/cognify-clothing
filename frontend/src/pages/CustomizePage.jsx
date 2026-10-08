import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProductById } from '../data/products';
import { useCart } from '../context/CartContext';
import EmptyState from '../components/ui/EmptyState';
import QuantitySelector from '../components/ui/QuantitySelector';
import Price from '../components/ui/Price';
import { ShoppingBag, Zap } from 'lucide-react';

const COLOR_OPTIONS = [
  { name: 'Black', hex: '#080808' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Gray', hex: '#6B7280' },
  { name: 'Olive', hex: '#858C72' },
];

const LOGO_OPTIONS = [
  { id: 'cognify', label: 'Cognify Logo' },
  { id: 'none', label: 'No Logo' },
];

const GRAPHIC_OPTIONS = [
  { id: 'none', label: 'None' },
  { id: 'graphic01', label: 'Graphic 01' },
  { id: 'graphic02', label: 'Graphic 02' },
  { id: 'graphic03', label: 'Graphic 03' },
];

const FONT_OPTIONS = [
  { id: 'sans', label: 'Sans-Serif' },
  { id: 'serif', label: 'Serif' },
  { id: 'mono', label: 'Monospace' },
];

const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

import CustomizationScene from '../3d/CustomizationScene';

// Removed CustomizationPlaceholder

export default function CustomizePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = getProductById(id);
  const { dispatch: cartDispatch } = useCart();

  const [color, setColor] = useState(COLOR_OPTIONS[0]);
  const [logo, setLogo] = useState('cognify');
  const [graphic, setGraphic] = useState('none');
  const [customText, setCustomText] = useState('');
  const [font, setFont] = useState('sans');
  const [size, setSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState(false);

  if (!product) {
    return (
      <div className="pt-28 min-h-screen">
        <EmptyState icon={ShoppingBag} title="Product Not Found" description="This product cannot be customized." actionLabel="Browse Shop" actionHref="/shop" />
      </div>
    );
  }

  if (!product.isCustomizable) {
    return (
      <div className="pt-28 min-h-screen">
        <EmptyState icon={Zap} title="Not Customizable" description="This product does not support 3D customization." actionLabel="View Product" actionHref={`/product/${id}`} />
      </div>
    );
  }

  const customization = { color: color.name, logo, graphic, customText, font };
  const customPrice = product.price + (customText ? 200 : 0) + (graphic !== 'none' ? 150 : 0);

  const handleAddToCart = () => {
    if (!size) { setSizeError(true); return; }
    setSizeError(false);
    cartDispatch({ type: 'ADD_ITEM', payload: { product, color, size, quantity, customization, customPrice } });
    navigate('/cart');
  };

  const handleBuyNow = () => {
    if (!size) { setSizeError(true); return; }
    setSizeError(false);
    cartDispatch({ type: 'ADD_ITEM', payload: { product, color, size, quantity, customization, customPrice } });
    navigate('/checkout');
  };

  return (
    <div className="pt-28 pb-16 min-h-screen">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
        <nav className="flex items-center gap-2 text-xs text-cognify-gray mb-8">
          <Link to={`/product/${id}`} className="hover:text-cognify-offwhite">Product</Link>
          <span>/</span>
          <span className="text-cognify-offwhite">Customize</span>
        </nav>
        <div className="mb-6">
          <p className="section-subtitle mb-1">3D Customization</p>
          <h1 className="text-3xl font-bold text-cognify-white">{product.name}</h1>
        </div>
        <div className="grid lg:grid-cols-2 gap-10 xl:gap-16">
          <CustomizationScene product={product} color={color} logo={logo} graphic={graphic} customText={customText} font={font} />
          <div className="space-y-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-cognify-offwhite mb-3">Color: <span className="text-cognify-gray">{color.name}</span></p>
              <div className="flex items-center gap-3">
                {COLOR_OPTIONS.map(opt => (
                  <button key={opt.name} onClick={() => setColor(opt)} className={`w-10 h-10 rounded-full border-2 transition-all ${color.name === opt.name ? 'border-cognify-offwhite scale-110' : 'border-cognify-border hover:border-cognify-gray'}`} style={{ backgroundColor: opt.hex, boxShadow: opt.name === 'White' ? 'inset 0 0 0 1px #2A2A2A' : undefined }} />
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-cognify-offwhite mb-3">Logo</p>
              <div className="flex gap-3">
                {LOGO_OPTIONS.map(opt => (
                  <button key={opt.id} onClick={() => setLogo(opt.id)} className={`px-4 py-2.5 border text-sm transition-colors ${logo === opt.id ? 'border-cognify-offwhite text-cognify-offwhite bg-cognify-offwhite/10' : 'border-cognify-border text-cognify-gray hover:border-cognify-olive'}`}>{opt.label}</button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-cognify-offwhite mb-3">Graphics</p>
              <div className="grid grid-cols-2 gap-2">
                {GRAPHIC_OPTIONS.map(opt => (
                  <button key={opt.id} onClick={() => setGraphic(opt.id)} className={`px-4 py-2.5 border text-sm transition-colors ${graphic === opt.id ? 'border-cognify-offwhite text-cognify-offwhite bg-cognify-offwhite/10' : 'border-cognify-border text-cognify-gray hover:border-cognify-olive'}`}>
                    {opt.label} {opt.id !== 'none' && <span className="text-xs text-cognify-olive ml-1">+₹150</span>}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-cognify-offwhite mb-3">Custom Text <span className="text-cognify-olive">+₹200</span></p>
              <input type="text" value={customText} onChange={e => setCustomText(e.target.value.slice(0, 24))} placeholder="Enter your text (max 24 chars)" className="input-field" maxLength={24} />
              <p className="text-xs text-cognify-gray mt-1">{customText.length}/24 characters</p>
            </div>
            {customText && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-cognify-offwhite mb-3">Font</p>
                <div className="flex gap-2">
                  {FONT_OPTIONS.map(opt => (
                    <button key={opt.id} onClick={() => setFont(opt.id)} className={`px-4 py-2.5 border text-sm transition-colors ${font === opt.id ? 'border-cognify-offwhite text-cognify-offwhite bg-cognify-offwhite/10' : 'border-cognify-border text-cognify-gray hover:border-cognify-olive'}`}>{opt.label}</button>
                  ))}
                </div>
              </div>
            )}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-cognify-offwhite mb-3">Size: <span className="text-cognify-gray">{size || 'Select'}</span></p>
              <div className="flex gap-2">
                {SIZES.map(s => (
                  <button key={s} onClick={() => { setSize(s); setSizeError(false); }} className={`w-12 h-10 border text-sm font-medium transition-colors ${size === s ? 'border-cognify-offwhite text-cognify-offwhite bg-cognify-offwhite/10' : 'border-cognify-border text-cognify-gray hover:border-cognify-olive'}`}>{s}</button>
                ))}
              </div>
              {sizeError && <p className="text-red-400 text-xs mt-2">Please select a size</p>}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-cognify-offwhite mb-3">Quantity</p>
              <QuantitySelector value={quantity} onChange={setQuantity} />
            </div>
            <div className="p-4 bg-cognify-card border border-cognify-border">
              <Price price={customPrice * quantity} size="lg" />
              <p className="text-xs text-cognify-gray mt-1">Base: ₹{product.price.toLocaleString('en-IN')} {customText && ' + ₹200 (text)'} {graphic !== 'none' && ' + ₹150 (graphic)'}</p>
            </div>
            <div className="flex flex-col gap-3">
              <button onClick={handleAddToCart} className="btn-secondary w-full flex items-center justify-center gap-2"><ShoppingBag size={16} /> Add Customized Item to Cart</button>
              <button onClick={handleBuyNow} className="btn-primary w-full flex items-center justify-center gap-2">Buy Now</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
