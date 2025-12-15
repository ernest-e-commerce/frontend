import { useState, useEffect } from 'react';
import { getProducts, getCategories } from '../api/productService';

const useProductsData = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories()
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    products,
    categories,
    loading,
    error,
    refetch: () => {
      setLoading(true);
      setError(null);
      // Refetch logic if needed
    }
  };
};

export default useProductsData;