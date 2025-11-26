import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const { cart, updateQty, removeFromCart, clearCart } = useCart();
  const total = cart.reduce((acc, c) => acc + (c.price || 0) * (c.qty || 1), 0);

  return (
    <div className="px-4 md:px-8 lg:px-16 py-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Your Cart</h2>

        {cart.length === 0 ? (
          <div className="bg-white p-8 rounded shadow text-center">
            <p className="mb-4">Your cart is empty.</p>
            <Link to="/products" className="inline-block px-6 py-3 bg-orange-500 text-white rounded">Shop Products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="bg-white rounded p-4 flex gap-4 items-center shadow-sm">
                  <img src={item.image} alt={item.title} className="w-28 h-28 object-contain rounded" />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-gray-500 text-sm">₦{item.price?.toLocaleString()}</p>

                    <div className="mt-2 flex items-center gap-2">
                      <button onClick={() => updateQty(item.id, Math.max(1, (item.qty || 1) - 1))} className="px-3 py-1 border rounded">-</button>
                      <div className="px-4">{item.qty}</div>
                      <button onClick={() => updateQty(item.id, (item.qty || 1) + 1)} className="px-3 py-1 border rounded">+</button>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">₦{((item.price || 0) * (item.qty || 1)).toLocaleString()}</div>
                    <button onClick={() => removeFromCart(item.id)} className="mt-2 text-red-600 text-sm hover:underline">Remove</button>
                  </div>
                </div>
              ))}
            </div>

            <aside className="bg-white rounded p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-lg">Order summary</h4>
                <button onClick={clearCart} className="text-sm text-gray-500 hover:underline">Clear</button>
              </div>

              <div className="flex justify-between mt-4">
                <span className="text-sm text-gray-600">Subtotal</span>
                <span className="font-semibold">₦{total.toLocaleString()}</span>
              </div>

              <div className="mt-4">
                <Link to="/checkout" className="block w-full px-4 py-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded font-semibold shadow text-center hover:shadow-md transition-shadow">Checkout</Link>
              </div>

              <div className="text-xs text-gray-500 mt-3">Secure Checkout • Free returns</div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
