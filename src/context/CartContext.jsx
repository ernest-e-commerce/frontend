import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  fetchProductsPaginated,
  searchProductsByName,
} from "../api/productService";
import {
  MdDevices,
  MdCheckroom,
  MdKitchen,
  MdMenuBook,
  MdSportsSoccer,
  MdSpa,
  MdSportsEsports,
  MdWatch,
  MdLocalGroceryStore,
  MdPets,
} from "react-icons/md";

const CartContext = createContext();

export const productCategories = [
  { name: "Electronics", slug: "electronics", Icon: MdDevices },
  { name: "Clothing", slug: "clothing", Icon: MdCheckroom },
  { name: "Home & Kitchen", slug: "home-kitchen", Icon: MdKitchen },
  { name: "Books", slug: "books", Icon: MdMenuBook },
  { name: "Sports & Outdoors", slug: "sports-outdoors", Icon: MdSportsSoccer },
  { name: "Health & Beauty", slug: "health-beauty", Icon: MdSpa },
  { name: "Toys & Games", slug: "toys-games", Icon: MdSportsEsports },
  { name: "Jewelry & Watches", slug: "jewelry-watches", Icon: MdWatch },
  { name: "Groceries", slug: "groceries", Icon: MdLocalGroceryStore },
  { name: "Pet Supplies", slug: "pet-supplies", Icon: MdPets },
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
  const [productsLoading, setProductsLoading] = useState(true);

  const fetchProducts = useCallback(async (page = 1, limit = 10) => {
    setProductsLoading(true);
    try {
      const result = await fetchProductsPaginated({ page, limit });
      setProducts(result);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setProducts({ products: [], totalPages: 1, currentPage: 1, totalProducts: 0 });
    } finally {
      setProductsLoading(false);
    }
  }, []);

  const searchProducts = useCallback(
    async (searchTerm, page = 1, limit = 10) => {
      if (!searchTerm) {
        fetchProducts(page, limit);
        return;
      }
      setProductsLoading(true);
      try {
        const result = await searchProductsByName({ query: searchTerm, page, limit });
        setProducts(result);
      } catch (error) {
        console.error("Failed to search products:", error);
        setProducts({ products: [], totalPages: 1, currentPage: 1, totalProducts: 0 });
      } finally {
        setProductsLoading(false);
      }
    },
    [fetchProducts]
  );

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const removeProductById = (productId) => {
    setProducts((prev) => ({
      ...prev,
      products: prev.products.filter((p) => p._id !== productId),
    }));
  };

  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (_e) {
      void 0;
    }
  }, [cart]);

  const addToCart = (product, qty = 1) => {
    setCart((prev) => {
      const exists = prev.find((p) => p._id === product._id);
      if (exists) {
        return prev.map((p) =>
          p._id === product._id ? { ...p, qty: (p.qty || 1) + qty } : p
        );
      }

      const firstImage = product.media?.find((m) => !m.url.includes("/video/"));
      const imageUrl = firstImage ? firstImage.url : product.media?.[0]?.url || null;

      return [...prev, { ...product, qty, image: imageUrl }];
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
    <CartContext.Provider
      value={{
        cart,
        products,
        productsLoading,
        categories: productCategories,
        fetchProducts,
        searchProducts,
        removeProductById,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
