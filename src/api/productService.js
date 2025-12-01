// Mock API service for products
// In a real app, these would make HTTP requests to the backend

import productsData from '../data/Products';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getProducts = async (filters = {}) => {
  await delay(500); // Simulate network delay

  let products = [...productsData];

  // Apply filters
  if (filters.category && filters.category !== 'all') {
    products = products.filter(p => p.category === filters.category);
  }

  if (filters.search) {
    const query = filters.search.toLowerCase();
    products = products.filter(p =>
      p.title.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query)
    );
  }

  return products;
};

export const getProductById = async (id) => {
  await delay(300);

  const product = productsData.find(p => String(p.id) === String(id));

  if (!product) {
    throw new Error('Product not found');
  }

  return product;
};

export const getCategories = async () => {
  await delay(200);

  const categories = [...new Set(productsData.map(p => p.category))];

  return categories.map(cat => ({
    name: cat.charAt(0).toUpperCase() + cat.slice(1),
    slug: cat
  }));
};