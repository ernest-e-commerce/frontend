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
    cardNumber: "",
    expiry: "",
    cvv: ""
  });

  // Calculate the total cost
  const total = cart.reduce((acc, c) => acc + (c.price || 0) * (c.qty || 1), 0);

  // Example shipping cost and tax (added for realism)
  const shipping = total > 50000 ? 0 : 5000;
  const taxRate = 0.05;
  const tax = total * taxRate;
  const grandTotal = total + shipping + tax;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const submit = (e) => {
    e.preventDefault();
    // Mock checkout
    alert("Order placed successfully! Thank you for shopping with Earnest Mall.");
    clearCart();
    navigate("/");
  };

  // Empty cart state styling
  if (cart.length === 0) {
    return (
      <div className="px-4 md:px-8 lg:px-16 py-16 bg-gray-50 min-h-[50vh]">
        <div className="max-w-4xl mx-auto text-center p-8 bg-white rounded-xl shadow-lg border border-gray-200">
          <p className="text-xl text-gray-700">
            🛒 Your cart is empty. <a href="/products" className="text-orange-500 font-semibold hover:text-orange-600 transition-colors">Shop now</a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-8 lg:px-16 py-12 bg-gray-50">
      <div className="max-w-5xl mx-auto">

        {/* Title: Elegant font-serif and primary text color */}
        <h2 className="text-4xl font-serif font-bold mb-10 text-gray-800 border-b border-gray-300 pb-4">
          Secure Checkout
        </h2>

        <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* LEFT SIDE: Shipping & Payment (span 2 columns) */}
          <div className="space-y-8 lg:col-span-2">

            {/* Shipping Information */}
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
              <h3 className="text-xl font-semibold mb-6 text-orange-500 border-b border-gray-300 pb-2">
                1. Shipping Information
              </h3>
              <div className="space-y-4">
                {/* Input Fields: Styled for Light Theme */}
                {['name', 'email', 'address', 'city', 'zip'].map((key) => (
                  <div key={key}>
                    <label className="block text-sm font-medium mb-1 text-gray-700 capitalize">
                      {key.replace('zip', 'ZIP Code').replace('cardnumber', 'Card Number')}
                    </label>
                    <input
                      type={key === 'email' ? 'email' : 'text'}
                      name={key}
                      required
                      value={form[key]}
                      onChange={handleInputChange}
                      // Input Styling: Light background, dark text, orange focus ring
                      className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
              <h3 className="text-xl font-semibold mb-6 text-orange-500 border-b border-gray-300 pb-2">
                2. Payment Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    required
                    value={form.cardNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                    placeholder="1234 5678 9012 3456"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Expiry Date</label>
                    <input
                      type="text"
                      name="expiry"
                      required
                      value={form.expiry}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">CVV</label>
                    <input
                      type="text"
                      name="cvv"
                      required
                      value={form.cvv}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                      placeholder="123"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Order Summary (span 1 column) */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 h-fit sticky top-20">
              <h3 className="text-xl font-semibold mb-6 text-orange-500 border-b border-gray-300 pb-2">
                3. Order Summary
              </h3>

              {/* Item List */}
              <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm text-gray-600">
                    <span className="truncate pr-2">{item.title} ({item.qty})</span>
                    <span className="font-medium text-gray-800">₦{((item.price || 0) * (item.qty || 1)).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* Cost Details */}
              <div className="border-t border-gray-300 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal:</span>
                  <span className="font-medium">₦{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping:</span>
                  <span className="font-medium">{shipping === 0 ? 'FREE' : `₦${shipping.toLocaleString()}`}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tax (5%):</span>
                  <span className="font-medium">₦{tax.toLocaleString()}</span>
                </div>
              </div>

              {/* Grand Total */}
              <div className="border-t border-gray-300 mt-4 pt-4">
                <div className="flex justify-between font-extrabold text-xl text-orange-500">
                  <span>Grand Total</span>
                  <span>₦{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                type="submit" // Associate with the main form
                className="w-full mt-6 px-4 py-3 bg-orange-500 text-white rounded-lg font-bold shadow-lg hover:bg-orange-600 transition-colors text-lg"
              >
                Place Order
              </button>

              {/* Security Message */}
              <p className="text-center text-xs text-gray-500 mt-3">
                <span className="text-green-500 mr-1">🔒</span> Payments are secure and encrypted.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
