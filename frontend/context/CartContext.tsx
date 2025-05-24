import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  vendorId: string;
  vendorName: string;
}

interface CartContextType {
  cart: CartItem[];
  vendorId: string | null;
  vendorName: string | null;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [vendorId, setVendorId] = useState<string | null>(null);
  const [vendorName, setVendorName] = useState<string | null>(null);
  
  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedVendorId = localStorage.getItem('vendorId');
    const savedVendorName = localStorage.getItem('vendorName');
    
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    
    if (savedVendorId) {
      setVendorId(savedVendorId);
    }
    
    if (savedVendorName) {
      setVendorName(savedVendorName);
    }
  }, []);
  
  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    
    if (vendorId) {
      localStorage.setItem('vendorId', vendorId);
    } else {
      localStorage.removeItem('vendorId');
    }
    
    if (vendorName) {
      localStorage.setItem('vendorName', vendorName);
    } else {
      localStorage.removeItem('vendorName');
    }
  }, [cart, vendorId, vendorName]);
  
  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    // Check if item is from a different vendor
    if (cart.length > 0 && vendorId && item.vendorId !== vendorId) {
      if (!confirm(`Your cart contains items from ${vendorName}. Adding items from a different vendor will clear your current cart. Do you want to proceed?`)) {
        return;
      }
      setCart([]);
    }
    
    setVendorId(item.vendorId);
    setVendorName(item.vendorName);
    
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(
        cartItem => cartItem.menuItemId === item.menuItemId
      );
      
      if (existingItemIndex >= 0) {
        // If item already exists, increment quantity
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += 1;
        return updatedCart;
      } else {
        // Otherwise add new item with quantity 1
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };
  
  const removeFromCart = (menuItemId: string) => {
    setCart(prevCart => {
      const updatedCart = prevCart.filter(item => item.menuItemId !== menuItemId);
      
      // If cart is now empty, reset vendor
      if (updatedCart.length === 0) {
        setVendorId(null);
        setVendorName(null);
      }
      
      return updatedCart;
    });
  };
  
  const updateQuantity = (menuItemId: string, quantity: number) => {
    if (quantity < 1) return;
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.menuItemId === menuItemId ? { ...item, quantity } : item
      )
    );
  };
  
  const clearCart = () => {
    setCart([]);
    setVendorId(null);
    setVendorName(null);
  };
  
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity, 
    0
  );
  
  return (
    <CartContext.Provider 
      value={{ 
        cart, 
        vendorId, 
        vendorName,
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart,
        totalItems,
        totalAmount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};