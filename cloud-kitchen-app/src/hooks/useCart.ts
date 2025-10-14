import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

export { CartContext }; // Re-export CartContext

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider. Make sure you have wrapped your component tree with <CartProvider />');
  }
  return context;
};
