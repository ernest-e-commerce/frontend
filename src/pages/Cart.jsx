import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Trash2, ShoppingBag } from "lucide-react";

const Cart = () => {
  const { cart, updateQty, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const total = cart.reduce((acc, c) => acc + (c.price || 0) * (c.qty || 1), 0);

  const handleCheckout = () => {
    if (user) {
      navigate("/checkout");
    } else {
      navigate("/login", { state: { from: "/checkout" } });
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Your Shopping Cart</h2>

        {cart.length === 0 ? (
          <div className="bg-white p-12 rounded-lg shadow-md text-center">
            <ShoppingBag className="mx-auto h-24 w-24 text-gray-300" />
            <h3 className="mt-6 text-xl font-semibold text-gray-700">Your cart is empty</h3>
            <p className="mt-2 text-gray-500">Looks like you haven't added anything to your cart yet.</p>
            <Link to="/products" className="mt-6 inline-block px-8 py-3 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 transition-colors">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div key={item._id} className="bg-white rounded-lg p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center shadow-sm hover:shadow-md transition-shadow">
                  <img src={item.image} alt={item.name} className="w-32 h-32 object-contain rounded-md bg-gray-50" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-800">{item.name}</h3>
                    <p className="text-orange-500 font-semibold">₦{item.price?.toLocaleString()}</p>

                    <div className="mt-3 flex items-center gap-3">
                      <div className="text-sm text-gray-500">Quantity:</div>
                      <div className="flex items-center border rounded-md overflow-hidden">
                        <button
                          onClick={() => updateQty(item._id, Math.max(1, (item.qty || 1) - 1))}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                          -
                        </button>
                        <div className="px-4 py-1 text-gray-800 font-medium">{item.qty}</div>
                        <button
                          onClick={() => updateQty(item._id, (item.qty || 1) + 1)}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between h-full self-stretch">
                    <div className="font-bold text-lg text-gray-800">₦{((item.price || 0) * (item.qty || 1)).toLocaleString()}</div>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="mt-2 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <aside className="lg:col-span-1 lg:sticky lg:top-24 h-fit">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between border-b pb-4">
                  <h4 className="font-semibold text-xl text-gray-800">Order Summary</h4>
                  <button onClick={clearCart} className="text-sm text-gray-500 hover:text-red-600 transition-colors">
                    Clear All
                  </button>
                </div>

                <div className="space-y-4 py-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold text-gray-800">₦{total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-semibold text-green-500">FREE</span>
                  </div>
                </div>

                <div className="border-t pt-4 flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-800">Total</span>
                    <span className="text-xl font-bold text-gray-900">₦{total.toLocaleString()}</span>
                </div>

                <div className="mt-6">
                  <button
                    onClick={handleCheckout}
                    className="block w-full px-4 py-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-lg font-semibold shadow text-center hover:shadow-lg transition-shadow"
                  >
                    Proceed to Checkout
                  </button>
                </div>
                <div className="mt-4 text-center">
                  <Link to="/products" className="text-sm text-orange-500 hover:underline">
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;