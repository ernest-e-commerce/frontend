import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const AddToCart = ({ product, onAddToCart }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, qty);
    if (onAddToCart) {
      onAddToCart();
    }
  };

  return (
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
          <div className="text-sm font-medium">{product.availableQuantity > 0 ? `${product.availableQuantity} in stock` : "Out of Stock"}</div>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={handleAddToCart} className="flex-1 py-3 rounded-lg bg-blue-600 text-white font-semibold shadow hover:shadow-md transform hover:scale-[1.01] hover:bg-blue-700">Add to Cart</button>
        <button onClick={() => navigate("/cart")} className="flex-1 py-3 rounded-lg border border-gray-200 text-gray-700">View Cart</button>
      </div>

      <div className="text-sm text-gray-500 mt-3">Secure checkout • Free returns • 90-day returns</div>
    </div>
  );
};

export default AddToCart;