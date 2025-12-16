import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../api/axios";

const CartContext = createContext();

export const productCategories = [
  { name: 'Electronics', slug: 'electronics', icon: '📱' },
  { name: 'Clothing', slug: 'clothing', icon: '👕' },
  { name: 'Home & Kitchen', slug: 'home-kitchen', icon: '🏠' },
  { name: 'Books', slug: 'books', icon: '📚' },
  { name: "Sports & Outdoors", slug: "sports-outdoors", icon: "⚽" },
  { name: 'Health & Beauty', slug: 'health-beauty', icon: '💅' },
  { name: 'Toys & Games', slug: 'toys-games', icon: '🎮' },
  { name: 'Jewelry & Watches', slug: 'jewelry-watches', icon: '💍' },
  { name: 'Groceries', slug: 'groceries', icon: '🛒' },
  { name: 'Pet Supplies', slug: 'pet-supplies', icon: '🐾' },
  { name: 'Office Products', slug: 'office-products', icon: '📎' },
  { name: 'Musical Instruments', slug: 'musical-instruments', icon: '🎸' },
];

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem("cart");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [products, setProducts] = useState({
    products: [],
    totalPages: 1,
    currentPage: 1,
    totalProducts: 0,
  });

  const fetchProducts = useCallback(async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`/products?page=${page}&limit=${limit}`);
      const { products, totalPages, currentPage, totalProducts } = response;
      setProducts({ products: products || [], totalPages, currentPage, totalProducts });
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setProducts({ products: [], totalPages: 1, currentPage: 1, totalProducts: 0 });
    }
  }, []);

  const searchProducts = useCallback(async (searchTerm, page = 1, limit = 10) => {
    if (!searchTerm) {
      fetchProducts(page, limit);
      return;
    }
    try {
      const response = await api.get(`/products/search?name=${searchTerm}&page=${page}&limit=${limit}`);
      const { products, totalPages, currentPage, totalProducts } = response;
      setProducts({ products: products || [], totalPages, currentPage, totalProducts });
    } catch (error) {
      console.error("Failed to search products:", error);
      setProducts({ products: [], totalPages: 1, currentPage: 1, totalProducts: 0 });
    }
  }, [fetchProducts]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const removeProductById = (productId) => {
    setProducts(prev => ({
        ...prev,
        products: prev.products.filter(p => p._id !== productId)
    }));
  };

  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch {}
  }, [cart]);

  const addToCart = (product, qty = 1) => {
    setCart((prev) => {
      const exists = prev.find((p) => p._id === product._id);
      if (exists) {
        return prev.map((p) =>
          p._id === product._id ? { ...p, qty: (p.qty || 1) + qty } : p
        );
      }

      const firstImage = product.media?.find(m => !m.url.includes('/video/'));
      const imageUrl = firstImage ? firstImage.url : (product.media?.[0]?.url || null);

      const cartProduct = {
        ...product,
        qty,
        image: imageUrl
      };
      
      return [...prev, cartProduct];
    });
  };

  const updateQty = (id, qty) => {
    setCart((prev) => prev.map((p) => (p._id === id ? { ...p, qty } : p)));
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((p) => p._id !== id));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, products, categories: productCategories, fetchProducts, searchProducts, removeProductById, addToCart, updateQty, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);