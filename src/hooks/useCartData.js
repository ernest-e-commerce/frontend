import { useState, useEffect } from 'react';
import api from '../api/axios';

const useCartData = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCart = async () => {
    try {
      setLoading(true);
      // Assuming there's an endpoint to get cart
      const response = await api.get('/cart');
      setCart(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      setLoading(true);
      await api.post('/cart', { productId, quantity });
      await fetchCart(); // Refetch cart
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      setLoading(true);
      await api.delete(`/cart/${productId}`);
      await fetchCart();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return {
    cart,
    loading,
    error,
    addToCart,
    removeFromCart,
    refetch: fetchCart
  };
};

export default useCartData;