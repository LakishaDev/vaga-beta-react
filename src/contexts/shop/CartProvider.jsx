import { useState } from "react";
import { CartContext } from "./CartContext";

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const addToCart = item => {
    setCart(prev =>
      prev.find(p => p.id === item.id)
        ? prev.map(p => p.id === item.id ? { ...p, qty: p.qty + 1 } : p)
        : [...prev, { ...item, qty: 1 }]);
  };

  const removeFromCart = id => setCart(prev => prev.filter(p => p.id !== id));

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}