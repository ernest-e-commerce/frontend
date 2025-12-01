// Mock API service for cart operations
// In a real app, these would make HTTP requests to the backend

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const processPayment = async (orderData) => {
  await delay(2000); // Simulate processing time

  // Mock validation
  if (!orderData.name || !orderData.email || !orderData.address) {
    throw new Error('Missing required fields');
  }

  if (orderData.paymentMethod === 'card') {
    if (!orderData.cardNumber || !orderData.expiry || !orderData.cvv) {
      throw new Error('Invalid card details');
    }
  }

  // Mock success
  return {
    orderId: `ORD-${Date.now()}`,
    status: 'success',
    message: 'Payment processed successfully'
  };
};

export const createOrder = async (cartItems, shippingInfo) => {
  await delay(1000);

  return {
    id: `ORD-${Date.now()}`,
    items: cartItems,
    shipping: shippingInfo,
    total: cartItems.reduce((sum, item) => sum + item.price * item.qty, 0),
    status: 'pending'
  };
};