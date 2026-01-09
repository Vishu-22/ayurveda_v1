"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { CartItem, Product } from "@/types";

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  isInCart: (productId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "ayurveda_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY);
        if (savedCart) {
          const parsed = JSON.parse(savedCart);
          setCartItems(Array.isArray(parsed) ? parsed : []);
        }
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
        setCartItems([]);
      }
      setIsLoaded(true);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded && typeof window !== "undefined") {
      try {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/5e8bf3cb-007b-4391-a1cc-13e16d0edec7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'CartContext.tsx:44',message:'Saving cart to localStorage',data:{cartItemCount:cartItems.length,items:cartItems.map(i=>({productId:i.productId,quantity:i.quantity}))},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/5e8bf3cb-007b-4391-a1cc-13e16d0edec7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'CartContext.tsx:46',message:'Cart saved to localStorage successfully',data:{saved:true},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
      } catch (error) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/5e8bf3cb-007b-4391-a1cc-13e16d0edec7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'CartContext.tsx:48',message:'Error saving cart to localStorage',data:{error:error instanceof Error?error.message:'Unknown error'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
        console.error("Error saving cart to localStorage:", error);
      }
    }
  }, [cartItems, isLoaded]);

  const addToCart = (product: Product, quantity: number = 1) => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/5e8bf3cb-007b-4391-a1cc-13e16d0edec7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'CartContext.tsx:53',message:'addToCart called',data:{productId:product.id,productName:product.name,quantity,price:product.price},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.productId === product.id);

      if (existingItem) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/5e8bf3cb-007b-4391-a1cc-13e16d0edec7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'CartContext.tsx:58',message:'Product already in cart, updating quantity',data:{productId:product.id,oldQuantity:existingItem.quantity,newQuantity:existingItem.quantity+quantity},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
        // Update quantity if product already in cart
        const updated = prevItems.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/5e8bf3cb-007b-4391-a1cc-13e16d0edec7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'CartContext.tsx:63',message:'Cart updated with new quantity',data:{cartItemCount:updated.length,totalItems:updated.reduce((sum,item)=>sum+item.quantity,0)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
        return updated;
      } else {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/5e8bf3cb-007b-4391-a1cc-13e16d0edec7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'CartContext.tsx:66',message:'Adding new product to cart',data:{productId:product.id,quantity,currentCartSize:prevItems.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
        // Add new item to cart
        const newItems = [...prevItems, { productId: product.id, product, quantity }];
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/5e8bf3cb-007b-4391-a1cc-13e16d0edec7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'CartContext.tsx:67',message:'New item added to cart',data:{cartItemCount:newItems.length,totalItems:newItems.reduce((sum,item)=>sum+item.quantity,0)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
        return newItems;
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = item.product.price || 0;
      return total + price * item.quantity;
    }, 0);
  };

  const isInCart = (productId: string) => {
    return cartItems.some((item) => item.productId === productId);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
