import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { CheckCircle, Landmark, Truck, Lock, Copy, PartyPopper } from "lucide-react";
import api  from "../api/axios";
import { toast } from "sonner";

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState("address"); // 'address', 'payment'
  const [addressComplete, setAddressComplete] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("pending"); // 'pending', 'awaiting_confirmation'
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer"); // 'bank_transfer', 'pay_on_delivery'
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    state: "",
    country: "Nigeria",
    zip: "",
  });

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : "",
        email: user.email || "",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        zip: user.zip || "",
      }));
    }
  }, [user]);

  const subtotal = cart.reduce((acc, item) => acc + (parseFloat(item.price) || 0) * (item.qty || 1), 0);
  const shipping = subtotal > 100000 ? 0 : 3000;
  const tax = 0;
  const grandTotal = subtotal + shipping + tax;

  const formatCurrency = (amount) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(amount);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.address || !form.city || !form.state || !form.zip) {
      toast.error("Please fill in all shipping information.");
      return;
    }
    setLoading(true);
    try {
      const { name, ...addressData } = form;
      const response = await api.put("/auth/user/address", addressData);
      setUser(response.user);
      setAddressComplete(true);
      setActiveStep("payment");
      toast.success("Address updated successfully!");
    } catch (err) {
      // Error handled by axios
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    if (method === "pay_on_delivery") {
      setPaymentComplete(true);
      setPaymentStatus("pending"); 
    } else {
      setPaymentComplete(false);
      setPaymentStatus("pending");
    }
  };

  const handleConfirmPayment = () => {
    setPaymentStatus("awaiting_confirmation");
    setPaymentComplete(true);
    setActiveStep(""); // Collapse the payment section
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const orderData = {
        cart,
        totalAmount: grandTotal,
        paymentMethod,
      };

      await api.post('/order', orderData);

      clearCart();
      setOrderSuccess(true);
      toast.success("Order placed successfully!");

    } catch (err) {
      // Error handled by axios
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="px-4 md:px-8 lg:px-16 py-16 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="max-w-2xl mx-auto text-center p-12 bg-white rounded-2xl shadow-xl border border-gray-200">
          <PartyPopper className="w-20 h-20 mx-auto text-green-500 mb-6" />
          <h2 className="text-5xl font-bold text-gray-800 mb-4">Order Placed Successfully!</h2>
          <p className="text-lg text-gray-600 mb-8">Thank you for your purchase. We've received your order and will begin processing it shortly.</p>
          <button onClick={() => navigate("/")} className="px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-500/40">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="px-4 md:px-8 lg:px-16 py-16 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="max-w-2xl mx-auto text-center p-12 bg-white rounded-2xl shadow-xl border border-gray-200">
          <h2 className="text-5xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
          <p className="text-lg text-gray-600 mb-8">Looks like you haven't added anything to your cart yet. Start shopping to find something you love!</p>
          <button onClick={() => navigate("/products")} className="px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-500/40">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-8 lg:px-16 py-12 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-serif font-bold text-gray-800 mb-10 text-center">Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Shipping Address */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="flex items-center justify-between p-6 cursor-pointer" onClick={() => setActiveStep("address")}>
                <div className="flex items-center space-x-4">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${addressComplete ? "bg-green-500" : "bg-blue-600"} text-white font-bold text-lg`}>
                    {addressComplete ? <CheckCircle size={24} /> : "1"}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Shipping Address</h2>
                </div>
                {addressComplete && <span className="text-green-500 font-semibold">Completed</span>}
              </div>
              {activeStep === "address" && (
                <form onSubmit={handleAddressSubmit} className="p-6 bg-gray-50 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                      <input type="text" name="name" required value={form.name} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" placeholder="Enter your full name" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                      <input type="email" name="email" required value={form.email} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" placeholder="Enter your email" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Street Address</label>
                      <input type="text" name="address" required value={form.address} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" placeholder="Enter your street address" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                      <input type="text" name="city" required value={form.city} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" placeholder="e.g. Lagos" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                      <input type="text" name="state" required value={form.state} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" placeholder="e.g. Lagos" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
                      <input type="text" name="country" required value={form.country} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-200 cursor-not-allowed" disabled />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">ZIP Code</label>
                      <input type="text" name="zip" required value={form.zip} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" placeholder="e.g. 100001" />
                    </div>
                  </div>
                  <button type="submit" disabled={loading} className="w-full mt-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-500/40 disabled:bg-blue-300">
                    {loading ? "Saving..." : "Save & Continue"}
                  </button>
                </form>
              )}
            </div>

            {/* Step 2: Payment Method */}
            <div className={`bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden ${!addressComplete && "opacity-50"}`}>
              <div className="flex items-center justify-between p-6 cursor-pointer" onClick={() => addressComplete && setActiveStep("payment")}>
                <div className="flex items-center space-x-4">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${paymentComplete ? "bg-green-500" : activeStep === 'payment' ? "bg-blue-600" : "bg-gray-300"} text-white font-bold text-lg`}>
                    {paymentComplete ? <CheckCircle size={24} /> : "2"}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Payment Method</h2>
                </div>
                {paymentComplete && <span className="text-green-500 font-semibold">Completed</span>}
              </div>
              {activeStep === "payment" && addressComplete && (
                <div className="p-6 bg-gray-50 border-t border-gray-200">
                  <div className="space-y-4">
                    <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-blue-50 transition">
                      <input type="radio" name="paymentMethod" value="bank_transfer" checked={paymentMethod === "bank_transfer"} onChange={() => handlePaymentMethodChange("bank_transfer")} className="w-5 h-5 text-blue-600 focus:ring-blue-500" />
                      <Landmark className="w-6 h-6 ml-4 text-gray-600" />
                      <span className="ml-3 text-lg font-medium text-gray-800">Bank Transfer</span>
                    </label>
                    <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-blue-50 transition">
                      <input type="radio" name="paymentMethod" value="pay_on_delivery" checked={paymentMethod === "pay_on_delivery"} onChange={() => handlePaymentMethodChange("pay_on_delivery")} className="w-5 h-5 text-blue-600 focus:ring-blue-500" />
                      <Truck className="w-6 h-6 ml-4 text-gray-600" />
                      <span className="ml-3 text-lg font-medium text-gray-800">Pay on Delivery</span>
                    </label>
                  </div>

                  {paymentMethod === "bank_transfer" && (
                    <div className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
                      <h3 className="font-bold text-lg text-gray-800 mb-4">Please transfer the total amount to:</h3>
                      <div className="space-y-3 text-gray-700">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">Bank:</span>
                          <span>Zenith Bank</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">Account Name:</span>
                          <span>Earnest Tech</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">Account Number:</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold text-gray-900">1219301144</span>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText("1219301144");
                                setCopied(true);
                                setTimeout(() => setCopied(false), 2000);
                              }}
                              className="p-1 text-gray-500 hover:text-gray-800"
                              title="Copy account number"
                            >
                              {copied ? <CheckCircle size={18} className="text-green-500" /> : <Copy size={18} />}
                            </button>
                          </div>
                        </div>
                      </div>

                      {paymentStatus === "pending" ? (
                        <button onClick={handleConfirmPayment} className="w-full mt-6 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition shadow-md">
                          I have paid {formatCurrency(grandTotal)}
                        </button>
                      ) : (
                        <div className="mt-6 text-center py-3 bg-yellow-100 text-yellow-800 font-bold rounded-lg">Awaiting Confirmation...</div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-200 sticky top-24">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-gray-200">Order Summary</h3>
              <div className="max-h-60 overflow-y-auto pr-2 space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item._id} className="flex justify-between items-center text-gray-700">
                    <span className="font-medium truncate pr-3">{item.title} × {item.qty}</span>
                    <span className="font-bold text-gray-900">{formatCurrency(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-dashed border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between text-md"><span>Subtotal</span><span className="font-bold">{formatCurrency(subtotal)}</span></div>
                <div className="flex justify-between text-md"><span>Shipping</span><span className="font-bold text-green-600">{shipping === 0 ? "FREE" : formatCurrency(shipping)}</span></div>
              </div>
              <div className="mt-6 pt-6 border-t-2 border-blue-500">
                <div className="flex justify-between text-2xl font-extrabold text-gray-800"><span>Total</span><span>{formatCurrency(grandTotal)}</span></div>
              </div>
              <button
                onClick={handlePlaceOrder}
                disabled={!addressComplete || !paymentComplete || loading}
                className="w-full mt-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold text-xl rounded-xl shadow-lg shadow-blue-500/40 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
              <p className="text-center text-sm text-gray-500 mt-6 flex items-center justify-center">
                <Lock size={16} className="text-green-600 mr-2" />
                Your payment is safe and encrypted.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;