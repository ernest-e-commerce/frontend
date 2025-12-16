import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import Modal from '../components/Modal';
import api from "../api/axios";
import ProductForm from './admin/ProductForm';
import ProductList from './admin/ProductList';
import Pagination from './admin/Pagination';
import AdminHeader from './admin/AdminHeader';

const AdminProducts = () => {
  const { products, fetchProducts, removeProductById, searchProducts } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // useEffect(() => {
  //   const handler = setTimeout(() => {
  //     if (searchTerm) {
  //       searchProducts(searchTerm, 1);
  //     } else {
  //       console.log(products?.products)
  //       if (products?.products.length === 0) {
  //           fetchProducts(1);
  //       }
  //     }
  //   }, 500);

  //   return () => {
  //     clearTimeout(handler);
  //   };
  // }, [searchTerm]);

  const handleAddNew = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${productId}`);
        removeProductById(productId);
      } catch (error) {
        console.error('Failed to delete product:', error);
      }
    }
  };

  const handleSave = () => {
    if (searchTerm) {
      searchProducts(searchTerm, products.currentPage);
    } else {
      fetchProducts(products.currentPage);
    }
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= products.totalPages) {
      if (searchTerm) {
        searchProducts(searchTerm, newPage);
      } else {
        fetchProducts(newPage);
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <AdminHeader 
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
        handleAddNew={handleAddNew}
      />
      
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
      >
        <ProductForm 
          product={editingProduct}
          onSave={handleSave} 
          onCancel={() => setIsModalOpen(false)} 
        />
      </Modal>

      <ProductList 
        products={products?.products}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />

      <Pagination 
        products={products}
        handlePageChange={handlePageChange}
      />
    </div>
  );
};

export default AdminProducts;