import { supabase } from "../lib/supabase";

const ORDER_SELECT = `
  id, total_amount, status, payment_status, payment_method, transaction_id,
  shipping_full_name, shipping_street, shipping_city, shipping_state,
  shipping_zip, shipping_country, created_at, updated_at,
  order_items ( id, product_id, name, quantity, price )
`;

const normalizeOrder = (row) => {
  if (!row) return null;
  return {
    _id: row.id,
    id: row.id,
    totalAmount: Number(row.total_amount),
    status: row.status,
    paymentStatus: row.payment_status,
    paymentMethod: row.payment_method,
    transactionId: row.transaction_id,
    shippingAddress: {
      fullName: row.shipping_full_name,
      street: row.shipping_street,
      city: row.shipping_city,
      state: row.shipping_state,
      zipCode: row.shipping_zip,
      country: row.shipping_country,
    },
    items: (row.order_items || []).map((it) => ({
      _id: it.id,
      productId: it.product_id,
      name: it.name,
      quantity: it.quantity,
      price: Number(it.price),
    })),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

export const placeOrder = async ({ cart, shipping, paymentMethod }) => {
  const items = cart.map((c) => ({
    product_id: c._id,
    quantity: c.qty || 1,
  }));

  const { data: orderId, error } = await supabase.rpc("place_order", {
    p_items: items,
    p_shipping: shipping,
    p_payment_method: paymentMethod,
  });

  if (error) throw error;
  return orderId;
};

export const getMyOrders = async () => {
  const { data, error } = await supabase
    .from("orders")
    .select(ORDER_SELECT)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(normalizeOrder);
};

export const getOrderById = async (id) => {
  const { data, error } = await supabase
    .from("orders")
    .select(ORDER_SELECT)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return normalizeOrder(data);
};

export const getAllOrders = async () => {
  // RLS lets admins see everything; for non-admins this returns only their own.
  const { data, error } = await supabase
    .from("orders")
    .select(ORDER_SELECT)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(normalizeOrder);
};

export const updateOrderStatus = async (orderId, status) => {
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);
  if (error) throw error;
};
