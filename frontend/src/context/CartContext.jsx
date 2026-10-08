import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext(null);

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, color, size, quantity = 1, customization = null } = action.payload;
      const itemKey = `${product.id}-${color?.name || 'default'}-${size}-${JSON.stringify(customization)}`;
      const existing = state.items.find(item => item.itemKey === itemKey);
      if (existing) {
        return {
          ...state,
          items: state.items.map(item =>
            item.itemKey === itemKey
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      }
      return {
        ...state,
        items: [
          ...state.items,
          { itemKey, product, color, size, quantity, customization },
        ],
      };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.itemKey !== action.payload),
      };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.itemKey === action.payload.itemKey
            ? { ...item, quantity: Math.max(1, action.payload.quantity) }
            : item
        ),
      };
    case 'SAVE_FOR_LATER':
      return {
        ...state,
        items: state.items.filter(item => item.itemKey !== action.payload),
        savedItems: [...state.savedItems, ...state.items.filter(i => i.itemKey === action.payload)],
      };
    case 'MOVE_TO_CART': {
      const savedItem = state.savedItems.find(item => item.itemKey === action.payload);
      if (!savedItem) return state;
      return {
        ...state,
        savedItems: state.savedItems.filter(item => item.itemKey !== action.payload),
        items: [...state.items, savedItem],
      };
    }
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'APPLY_COUPON':
      return { ...state, coupon: action.payload };
    case 'REMOVE_COUPON':
      return { ...state, coupon: null };
    default:
      return state;
  }
};

const initialCartState = {
  items: [],
  savedItems: [],
  coupon: null,
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialCartState, (init) => {
    try {
      const stored = localStorage.getItem('cognify_cart');
      return stored ? JSON.parse(stored) : init;
    } catch {
      return init;
    }
  });

  useEffect(() => {
    localStorage.setItem('cognify_cart', JSON.stringify(state));
  }, [state]);

  const subtotal = state.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);

  const shipping = subtotal > 999 ? 0 : 99;

  const discountAmount = state.coupon
    ? Math.round(subtotal * (state.coupon.percentage / 100))
    : 0;

  const total = subtotal - discountAmount + shipping;

  return (
    <CartContext.Provider
      value={{
        ...state,
        dispatch,
        subtotal,
        totalItems,
        shipping,
        discountAmount,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
