import { useState } from "react";
import { CartContext } from "./CartContext";

// src/contexts/shop/CartContext.jsx
import { useReducer, useEffect } from "react";
import { AuthContext } from "../../contexts/shop/auth/AuthContext"; // pretpostavljam da imaš AuthContext
import { CartService } from "../../services/CartService"; // putanja do CartService
import { useAuth } from "../../hooks/useAuth";

// Reducer funkcija za upravljanje stanjem korpe

const cartReducer = (state, action) => {
  switch (action.type) {
    case "SET_CART": return action.payload;
    case "ADD_TO_CART": {
      const exist = state.find(i => i.id === action.payload.id);
      if (exist) {
        return state.map(i => i.id === action.payload.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...state, { ...action.payload, qty: 1 }];
    }
    case "REMOVE_FROM_CART": return state.filter(i => i.id !== action.payload);
    case "CLEAR_CART": return [];
    case "UPDATE_QUANTITY":
      return state.map(i =>
        i.id === action.payload.id
          ? { ...i, qty: action.payload.qty }
          : i
      );
    default: return state;
  }
};

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, []);
  const { user } = useAuth();

  // Učitaj korpu kad korisnik dođe na sajt/loguje se
  useEffect(() => {
    async function loadCart() {
      if (user?.uid) {
        const cartItems = await CartService.loadCartFromFirebase(user.uid); // asynch
        dispatch({ type: "SET_CART", payload: cartItems });
      } else {
        const localCart = localStorage.getItem("cart");
        if (localCart) dispatch({ type: "SET_CART", payload: JSON.parse(localCart) });
        else dispatch({ type: "CLEAR_CART" });
      }
    }
    loadCart();
  }, [user]);

  // Funkcije koje eksplicitno šalju podatke u Firebase kad se nešto desi
  const addToCart = async (product) => {
    dispatch({ type: "ADD_TO_CART", payload: product });
    if (user?.uid) {
      // čekaj novi state
      const nextCart = getNextCart("ADD_TO_CART", cart, product); // vidi dole!
      await CartService.saveCartToFirebase(user.uid, nextCart);
    } else {
      const nextCart = getNextCart("ADD_TO_CART", cart, product);
      localStorage.setItem("cart", JSON.stringify(nextCart));
    }
  };

  const removeFromCart = async (id) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: id });
    if (user?.uid) {
      const nextCart = getNextCart("REMOVE_FROM_CART", cart, id);
      await CartService.saveCartToFirebase(user.uid, nextCart);
    } else {
      const nextCart = getNextCart("REMOVE_FROM_CART", cart, id);
      localStorage.setItem("cart", JSON.stringify(nextCart));
    }
  };

  const updateQuantity = async (id, qty) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, qty } });
    if (user?.uid) {
      const nextCart = getNextCart("UPDATE_QUANTITY", cart, { id, qty });
      await CartService.saveCartToFirebase(user.uid, nextCart);
    } else {
      const nextCart = getNextCart("UPDATE_QUANTITY", cart, { id, qty });
      localStorage.setItem("cart", JSON.stringify(nextCart));
    }
  };

  const clearCart = async () => {
    dispatch({ type: "CLEAR_CART" });
    if (user?.uid) {
      await CartService.saveCartToFirebase(user.uid, []);
    }
    localStorage.removeItem("cart");
  };

  // Helper za sledeći state (jer dispatch je asinhron)
  function getNextCart(type, currentCart, payload) {
    switch (type) {
      case "ADD_TO_CART": {
        const exist = currentCart.find(i => i.id === payload.id);
        if (exist) {
          return currentCart.map(i => i.id === payload.id ? { ...i, qty: i.qty + 1 } : i);
        }
        return [...currentCart, { ...payload, qty: 1 }];
      }
      case "REMOVE_FROM_CART":
        return currentCart.filter(i => i.id !== payload);
      case "UPDATE_QUANTITY":
        return currentCart.map(i =>
          i.id === payload.id
            ? { ...i, qty: payload.qty }
            : i
        );
      default: return currentCart;
    }
  }

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      clearCart,
      updateQuantity
    }}>
      {children}
    </CartContext.Provider>
  );
}
