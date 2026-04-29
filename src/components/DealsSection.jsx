import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import { getHotDeals } from "../api/productService";

const DealsSection = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getHotDeals();
        setDeals(data || []);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch hot deals:", err);
        setError("Could not load deals at this time.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading hot deals...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (deals.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Today's Hot Deals</h2>
        <Link
          to="/products"
          className="px-6 py-2 text-sm font-semibold text-blue-600 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors"
        >
          View All
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {deals.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default DealsSection;
