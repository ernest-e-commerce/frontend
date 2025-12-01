import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Checkout = () => {
  const { cart, updateQty, removeFromCart, clearCart } = useCart();

  const subtotal = cart.reduce(
    (acc, item) => acc + (item.price || 0) * (item.qty || 1),
    0
  );

  return (
    <div className="px-4 md:px-8 lg:px-16 py-10 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">

        {/* PAGE TITLE */}
        <h2 className="text-2xl font-bold mb-6">Your Cart</h2>

        {/* EMPTY CART */}
        {cart.length === 0 ? (
          <div className="bg-white p-10 rounded-lg shadow text-center">
            <p className="text-gray-600 text-lg mb-4">
              Your cart is empty.
            </p>
            <Link
              to="/products"
              className="px-6 py-3 bg-orange-500 text-white rounded-lg shadow font-semibold"
            >
              Shop Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* CART ITEMS */}
            <div className="lg:col-span-2 space-y-5">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg p-4 shadow-sm flex items-center gap-4"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-24 h-24 object-contain rounded"
                  />

                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">
                      {item.title}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      ₦{item.price?.toLocaleString()}
                    </p>

                    {/* QUANTITY CONTROL */}
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateQty(item.id, Math.max(1, (item.qty || 1) - 1))
                        }
                        className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-100"
                      >
                        -
                      </button>

                      <span className="px-3 font-semibold">
                        {item.qty}
                      </span>

                      <button
                        onClick={() =>
                          updateQty(item.id, (item.qty || 1) + 1)
                        }
                        className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* ITEM TOTAL & REMOVE */}
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">
                      ₦{((item.price || 0) * (item.qty || 1)).toLocaleString()}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="mt-2 text-red-600 text-sm hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* ORDER SUMMARY */}
            <aside className="bg-white rounded-lg p-5 shadow-sm h-fit">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-lg">Order Summary</h4>
                <button
                  onClick={clearCart}
                  className="text-sm text-gray-500 hover:underline"
                >
                  Clear Cart
                </button>
              </div>

              <div className="flex justify-between text-sm mb-3">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">
                  ₦{subtotal.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between text-sm mb-3">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-600">₦0 (Free)</span>
              </div>

              <hr className="my-3" />

              <div className="flex justify-between text-lg font-bold mb-5">
                <span>Total</span>
                <span>₦{subtotal.toLocaleString()}</span>
              </div>

              <button
                className="w-full py-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-lg font-semibold shadow hover:opacity-95"
              >
                Proceed to Checkout
              </button>

              <p className="text-xs text-gray-500 text-center mt-3">
                Secure payment • Fast delivery • Free returns
              </p>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
