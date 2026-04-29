import { supabase } from "../lib/supabase";

export const getDashboardStats = async () => {
  const { data, error } = await supabase.rpc("admin_dashboard_stats");
  if (error) throw error;
  return {
    totalSales: Number(data?.totalSales || 0),
    newOrders: Number(data?.newOrders || 0),
    productsListed: Number(data?.productsListed || 0),
    totalUsers: Number(data?.totalUsers || 0),
  };
};

const normalizeAdminOrder = (row) => ({
  _id: row.id,
  id: row.id,
  userId: row.user_id,
  totalAmount: Number(row.total_amount),
  status: row.status,
  paymentStatus: row.payment_status,
  paymentMethod: row.payment_method,
  customer: {
    firstName: row.customer_first_name,
    lastName: row.customer_last_name,
    email: row.customer_email,
  },
  createdAt: row.created_at,
});

export const listAdminOrders = async () => {
  const { data, error } = await supabase.rpc("admin_list_orders");
  if (error) throw error;
  return (data || []).map(normalizeAdminOrder);
};

export const getAdminOrder = async (orderId) => {
  const { data, error } = await supabase.rpc("admin_get_order", {
    p_order_id: orderId,
  });
  if (error) throw error;
  if (!data) return null;
  return {
    _id: data.id,
    id: data.id,
    userId: data.user_id,
    totalAmount: Number(data.total_amount),
    status: data.status,
    paymentStatus: data.payment_status,
    paymentMethod: data.payment_method,
    transactionId: data.transaction_id,
    shippingAddress: {
      fullName: data.shipping_full_name,
      street: data.shipping_street,
      city: data.shipping_city,
      state: data.shipping_state,
      zipCode: data.shipping_zip,
      country: data.shipping_country,
    },
    customer: {
      firstName: data.customer?.first_name,
      lastName: data.customer?.last_name,
      email: data.customer?.email,
    },
    items: (data.items || []).map((it) => ({
      _id: it.id,
      productId: it.product_id,
      name: it.name,
      quantity: it.quantity,
      price: Number(it.price),
      imageUrl: it.image_url,
    })),
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
};

const normalizeAdminUser = (row) => ({
  _id: row.id,
  id: row.id,
  userId: row.id,
  email: row.email,
  firstName: row.first_name,
  lastName: row.last_name,
  role: row.role,
  address: row.address,
  city: row.city,
  state: row.state,
  country: row.country,
  zip: row.zip,
  isVerified: !!row.email_confirmed,
  createdAt: row.created_at,
});

export const listAdminUsers = async () => {
  const { data, error } = await supabase.rpc("admin_list_users");
  if (error) throw error;
  return (data || []).map(normalizeAdminUser);
};

export const getAdminUser = async (userId) => {
  const { data, error } = await supabase.rpc("admin_get_user", {
    p_user_id: userId,
  });
  if (error) throw error;
  if (!data) return null;
  return normalizeAdminUser({
    ...data,
    email_confirmed: data.email_confirmed,
  });
};
