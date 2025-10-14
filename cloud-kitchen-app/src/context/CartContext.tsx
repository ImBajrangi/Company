import React, { createContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from 'react';
import type { MenuItem } from '../data/mockData'; // Changed to import type

interface CartItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: string;
  customer: {
    name: string;
    address: string;
    contact: string;
  };
  items: CartItem[];
  total: number;
  status: string;
  paymentId: string;
}

interface CartContextType {
  cart: CartItem[];
  cartItems: CartItem[]; // Alias for cart for consistency with existing useCart hook
  orders: Order[];
  setOrders: Dispatch<SetStateAction<Order[]>>; 
  addToCart: (item: MenuItem) => void;
  removeFromCart: (id: number) => void; 
  increaseQuantity: (id: number) => void; 
  decreaseQuantity: (id: number) => void; 
  getTotalPrice: () => number;
  clearCart: () => void;
  addOrder: (order: Order) => void;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const savedOrders = localStorage.getItem('orders');
    return savedOrders ? JSON.parse(savedOrders) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  const addToCart = (item: MenuItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const increaseQuantity = (id: number) => {
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item))
    );
  };

  const decreaseQuantity = (id: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
      ).filter(item => item.quantity > 0) // Remove item if quantity becomes 0
    );
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const clearCart = () => {
    setCart([]);
  };

  const addOrder = (order: Order) => {
    setOrders((prevOrders) => [...prevOrders, order]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartItems: cart,
        orders,
        setOrders,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        getTotalPrice,
        clearCart,
        addOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

