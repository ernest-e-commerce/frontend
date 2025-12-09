import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import products from "../data/Products";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find((p) => String(p.id) === String(id)) || products[0];
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  // 1. NEW STATE for toast visibility
  const [showToast, setShowToast] = useState(false); 

  const onAdd = () => {
    addToCart(product, qty);
    
    // 2. Show the toast when item is added
    setShowToast(true); 
    
    // Hide the toast after 3 seconds (3000 milliseconds)
    setTimeout(() => {
      setShowToast(false);
    }, 3000); 
  };

  const related = products.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="px-4 md:px-8 lg:px-16 py-8">
      
      {/* 3. TOAST NOTIFICATION MARKUP */}
      {showToast && (
        <div className="fixed top-20 right-8 z-50 transition-opacity duration-300">
          <div className="bg-green-600 text-white p-4 rounded-lg shadow-xl flex items-center space-x-3 min-w-[250px] animate-fade-in-down">
            {/* Optional: Add a simple checkmark icon */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            
            <span className="font-semibold">
              {product.title} Added to Cart!
            </span>
          </div>
        </div>
      )}

      {/* Tailwind CSS keyframe for animation (place this in your main CSS file, e.g., index.css) */}
      {/* @keyframes fade-in-down {
        from {
          opacity: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .animate-fade-in-down {
        animation: fade-in-down 0.3s ease-out forwards;
      }
      */}

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-lg p-4 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-lg overflow-hidden">
              <Swiper spaceBetween={10} slidesPerView={1}>
                {(product.images || [product.image]).map((src, i) => (
                  <SwiperSlide key={i}>
                    <img src={src} alt={`${product.title}-${i}`} className="w-full h-96 object-contain bg-gray-50 p-4 rounded" />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            <div className="p-2 flex flex-col gap-4">
              <div>
                <h1 className="text-2xl font-bold">{product.title}</h1>
                <p className="text-sm text-gray-500 mt-1">{product.subtitle}</p>

                <div className="mt-4 flex items-center gap-4">
                  <div className="text-2xl font-extrabold text-gray-900">₦{product.price?.toLocaleString()}</div>
                  <div className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm font-medium">{product.rating} ★</div>
                </div>

                <p className="mt-4 text-gray-700">{product.description}</p>
              </div>

              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-xs text-gray-500">Quantity</div>
                    <div className="flex items-center border rounded-md overflow-hidden">
                      <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-1 hover:bg-gray-100">-</button>
                      <div className="px-4">{qty}</div>
                      <button onClick={() => setQty((q) => q + 1)} className="px-3 py-1 hover:bg-gray-100">+</button>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-500">Stock</div>
                    <div className="text-sm font-medium">{product.stock ?? "In stock"}</div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={onAdd} className="flex-1 py-3 rounded-lg bg-linear-to-r from-orange-400 to-orange-500 text-white font-semibold shadow hover:shadow-md transform hover:scale-[1.01]">Add to Cart</button>
                  <button onClick={() => navigate("/cart")} className="flex-1 py-3 rounded-lg border border-gray-200 text-gray-700">View Cart</button>
                </div>

                <div className="text-sm text-gray-500 mt-3">Secure checkout • Free returns • 90-day returns</div>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold text-lg mb-3">Product Details</h3>
            <ul className="list-disc pl-5 text-gray-700">
              <li>Brand: {product.brand}</li>
              <li>Condition: {product.condition ?? "New"}</li>
              <li>Category: {product.category}</li>
              <li>{product.longDescription}</li>
            </ul>
          </div>
        </div>

        <aside className="hidden lg:block">
          <div className="bg-white rounded-lg p-4 shadow-sm sticky top-24 z-[9999]">
            <div className="text-sm text-gray-500 mb-2">Sponsored</div>
            <img src="/images/aside-ad-1.jpg" alt="ad" className="w-full rounded mb-3 object-cover" />
            <p className="text-sm text-gray-700">Recommended for you.</p>
          </div>

          <div className="mt-6">
            <h4 className="text-lg font-semibold mb-3">Related</h4>
            <div className="grid grid-cols-1 gap-3">
              {related.map((r) => <ProductCard key={r.id} product={r} />)}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ProductDetails;