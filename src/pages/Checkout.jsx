import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    zip: "",
    paymentMethod: "instant",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  // Safely calculate totals with proper number conversion
  const subtotal = cart.reduce((acc, item) => {
    const price = parseFloat(item.price) || 0;
    const qty = parseInt(item.qty, 10) || 1;
    return acc + price * qty;
  }, 0);

  const shipping = subtotal > 50000 ? 0 : 5000;
  const tax = subtotal * 0.05; // 5% tax
  const grandTotal = subtotal + shipping + tax;

  // Nigerian Naira formatter (₦12,345)
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(amount)
      .replace("NGN", "₦"); // Replace "NGN" with ₦ symbol
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    // Simple validation
    if (!form.name || !form.email || !form.address || !form.city || !form.zip) {
      alert("Please fill in all shipping information.");
      return;
    }

    if (form.paymentMethod === "instant") {
      if (!form.cardNumber || !form.expiry || !form.cvv) {
        alert("Please complete all payment details.");
        return;
      }
    }

    // Mock successful checkout
    alert("Order placed successfully! Thank you for shopping with Earnest Mall.");
    clearCart();
    navigate("/");
  };

  // Empty cart
  if (cart.length === 0) {
    return (
      <div className="px-4 md:px-8 lg:px-16 py-16 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto text-center p-12 bg-white rounded-2xl shadow-xl border border-gray-200">
          <div className="text-6xl mb-6">Empty Cart</div>
          <p className="text-xl text-gray-600 mb-8">
            Your cart is empty. Start shopping to add items!
          </p>
          <a
            href="/products"
            className="inline-block px-8 py-4 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition shadow-lg"
          >
            Continue Shopping
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-8 lg:px-16 py-12 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-serif font-bold text-gray-800 mb-10 text-center lg:text-left border-b border-gray-300 pb-6">
          Secure Checkout
        </h2>

        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* LEFT: Forms */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping Information */}
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
              <h3 className="text-2xl font-bold text-orange-600 mb-6 pb-3 border-b-2 border-orange-200">
                1. Shipping Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {["name", "email", "address", "city", "zip"].map((field) => (
                  <div key={field} className={field === "address" ? "md:col-span-2" : ""}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 capitalize">
                      {field === "zip" ? "ZIP Code" : field}
                    </label>
                    <input
                      type={field === "email" ? "email" : "text"}
                      name={field}
                      required
                      value={form[field]}
                      onChange={handleInputChange}
                      className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-orange-300 focus:border-orange-500 transition-all outline-none"
                      placeholder={field === "zip" ? "e.g. 100001" : ""}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
              <h3 className="text-2xl font-bold text-orange-600 mb-6 pb-3 border-b-2 border-orange-200">
                2. Payment Method
              </h3>
              <div className="space-y-5">
                <label className="flex items-center p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="instant"
                    checked={form.paymentMethod === "instant"}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-orange-600 focus:ring-orange-500"
                  />
                  <span className="ml-4 text-lg font-medium text-gray-800">Pay with Card (Instant)</span>
                </label>

                <label className="flex items-center p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="delivery"
                    checked={form.paymentMethod === "delivery"}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-orange-600 focus:ring-orange-500"
                  />
                  <span className="ml-4 text-lg font-medium text-gray-800">Pay on Delivery</span>
                </label>
              </div>
            </div>

            {/* Card Details - Only if instant payment */}
            {form.paymentMethod === "instant" && (
              <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
                <h3 className="text-2xl font-bold text-orange-600 mb-6 pb-3 border-b-2 border-orange-200">
                  3. Card Information
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Card Number</label>
                    <input
                      type="text"
                      name="cardNumber"
                      required
                      value={form.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                      className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-orange-300 focus:border-orange-500 transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Expiry Date</label>
                      <input
                        type="text"
                        name="expiry"
                        required
                        value={form.expiry}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        maxLength="5"
                        className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-orange-300 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">CVV</label>
                      <input
                        type="text"
                        name="cvv"
                        required
                        value={form.cvv}
                        onChange={handleInputChange}
                        placeholder="123"
                        maxLength="4"
                        className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-orange-300 focus:border-orange-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-200 sticky top-24">
              <h3 className="text-2xl font-bold text-orange-600 mb-6 pb-3 border-b-2 border-orange-200">
                4. Order Summary
              </h3>

              <div className="max-h-64 overflow-y-auto pr-2 space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-gray-700">
                    <span className="text-sm font-medium truncate pr-3">
                      {item.title} × {item.qty || 1}
                    </span>
                    <span className="font-bold text-gray-900">
                      {formatCurrency((parseFloat(item.price) || 0) * (item.qty || 1))}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t-2 border-dashed border-gray-200 rounded-xl p-5 space-y-3">
                <div className="flex justify-between text-lg">
                  <span>Subtotal</span>
                  <span className="font-bold">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span>Shipping</span>
                  <span className="font-bold text-green-600">
                    {shipping === 0 ? "FREE" : formatCurrency(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-lg">
                  <span>Tax (5%)</span>
                  <span className="font-bold">{formatCurrency(tax)}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t-4 border-orange-500">
                <div className="flex justify-between text-2xl font-extrabold text-orange-600">
                  <span>Total</span>
                  <span>{formatCurrency(grandTotal)}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-8 py-5 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-xl rounded-xl shadow-2xl hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-300"
              >
                Place Order Now
              </button>

              <p className="text-center text-sm text-gray-500 mt-6 flex items-center justify-center">
                <span className="text-green-600 text-xl mr-2">Secure Lock</span>
                Your payment is safe and encrypted
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;