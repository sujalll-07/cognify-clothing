import { createContext, useContext, useReducer, useEffect } from 'react';

const WishlistContext = createContext(null);

const wishlistReducer = (state, action) => {
  switch (action.type) {
    case 'TOGGLE': {
      const exists = state.items.some(item => item.id === action.payload.id);
      return {
        ...state,
        items: exists
          ? state.items.filter(item => item.id !== action.payload.id)
          : [...state.items, action.payload],
      };
    }
    case 'REMOVE':
      return { ...state, items: state.items.filter(item => item.id !== action.payload) };
    case 'CLEAR':
      return { ...state, items: [] };
    default:
      return state;
  }
};

export const WishlistProvider = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, { items: [] }, (init) => {
    try {
      const stored = localStorage.getItem('cognify_wishlist');
      return stored ? JSON.parse(stored) : init;
    } catch {
      return init;
    }
  });

  useEffect(() => {
    localStorage.setItem('cognify_wishlist', JSON.stringify(state));
  }, [state]);

  const isInWishlist = (id) => state.items.some(item => item.id === id);

  return (
    <WishlistContext.Provider value={{ ...state, dispatch, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
};
