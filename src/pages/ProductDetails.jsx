import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import api from "../api/axios";
import { useCart } from "../context/CartContext";

import ProductImage from "./ProductDetails/ProductImage";
import ProductInfo from "./ProductDetails/ProductInfo";
import AddToCart from "./ProductDetails/AddToCart";
import RelatedProducts from "./ProductDetails/RelatedProducts";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products: allProductsContext } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response);
      } catch (err) {
        setError("Failed to fetch product details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const related = product && allProductsContext?.products
    ? allProductsContext.products.filter((p) => p._id !== product._id).slice(0, 4)
    : [];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-red-600 mb-2">{error || "Product not found."}</h2>
        <p className="text-gray-600">We couldn't find the product you're looking for.</p>
        <button onClick={() => navigate('/')} className="mt-6 px-6 py-2 bg-orange-500 text-white rounded-lg shadow hover:bg-orange-600">
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-8 lg:px-16 py-8">
      {showToast && (
        <div className="fixed top-20 right-8 z-50 transition-opacity duration-300">
          <div className="bg-green-600 text-white p-4 rounded-lg shadow-xl flex items-center space-x-3 min-w-[250px] animate-fade-in-down">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span className="font-semibold">{product.name} Added to Cart!</span>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-lg p-4 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProductImage name={product.name} media={product.media} />
            
            <div className="p-2 flex flex-col gap-4">
              <ProductInfo product={product} />
              <AddToCart product={product} onAddToCart={handleAddToCart} />
            </div>
          </div>

          <div className="mt-6 bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold text-lg mb-3">Product Details</h3>
            <div className="text-gray-700 space-y-2">
              <p><strong>Category:</strong> {product.categories?.join(', ')}</p>
              <p>{product.fullDescription}</p>
            </div>
          </div>
        </div>

        <aside className="hidden lg:block">
          <div className="bg-white rounded-lg p-4 shadow-sm sticky top-24">
            <div className="text-sm text-gray-500 mb-2">Sponsored</div>
            <img src="/images/banner.avif" alt="ad" className="w-full rounded mb-3 object-cover" />
            <p className="text-sm text-gray-700">Recommended for you.</p>
          </div>

          <RelatedProducts related={related} />
        </aside>
      </div>
    </div>
  );
};

export default ProductDetails;