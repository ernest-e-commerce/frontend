// src/pages/AdminProducts.jsx
import React, { useState } from 'react';
import products from "../data/Products"; 

// Example Categories (for the dropdown)
const CATEGORIES = [
  'Electronics',
  'Apparel',
  'Books',
  'Home & Kitchen',
  'Toys & Games',
];

// Placeholder for the form component
const AddProductForm = ({ onSave, onCancel }) => {
  const [productData, setProductData] = useState({
    title: '',
    price: 0,
    stock: 0,
    category: CATEGORIES[0],
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would be an API call (POST /api/products)
    console.log('New Product Data:', productData);
    onSave(productData); // Call the save handler
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-xl mb-6 border border-gray-200">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Add New Product</h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Product Title</label>
          <input
            type="text"
            name="title"
            value={productData.title}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
        
        {/* Category Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            name="category"
            value={productData.category}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 bg-white"
            required
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Price (₦)</label>
          <input
            type="number"
            name="price"
            value={productData.price}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
            min="0.01"
            step="0.01"
            required
          />
        </div>

        {/* Stock */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Stock Quantity</label>
          <input
            type="number"
            name="stock"
            value={productData.stock}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
            min="0"
            required
          />
        </div>

        {/* Description (Full Width) */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={productData.description}
            onChange={handleChange}
            rows="3"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
            required
          ></textarea>
        </div>

        {/* Action Buttons */}
        <div className="md:col-span-2 flex justify-end space-x-3 mt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
          >
            Create Product
          </button>
        </div>
      </form>
    </div>
  );
};


const AdminProducts = () => {
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const handleSave = (newProduct) => {
    // Logic to add product to the state/backend
    console.log('Product Saved:', newProduct);
    setIsAddingProduct(false); // Close the form
    // You would typically refetch/update the products list here
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-700">Product Management ({products.length})</h2>
        <button 
          onClick={() => setIsAddingProduct(true)}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          + Add New Product
        </button>
      </div>
      
      {/* 1. Add Product Form (Conditionally Rendered) */}
      {isAddingProduct && (
        <AddProductForm 
          onSave={handleSave} 
          onCancel={() => setIsAddingProduct(false)} 
        />
      )}

      {/* 2. Product List Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price (₦)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.slice(0, 5).map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{p.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">₦{p.price?.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{p.stock ?? 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button className="text-indigo-600 hover:text-indigo-900">Edit</button>
                  <button className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;