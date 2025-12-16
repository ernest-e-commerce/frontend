import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import api from "../api/axios";

const DealsSection = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHotDeals = async () => {
      try {
        setLoading(true);
        const response = await api.get("/products/hot-deals");
        setDeals(response || []);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch hot deals:", err);
        setError("Could not load deals at this time.");
      } finally {
        setLoading(false);
      }
    };

    fetchHotDeals();
  }, []);

  if (loading) {
    return (
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
          <h2 className="text-2xl font-bold mb-6">Hot Deals</h2>
          <p>Loading deals...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
          <h2 className="text-2xl font-bold mb-6">Hot Deals</h2>
          <p className="text-red-500">{error}</p>
        </div>
      </section>
    );
  }

  if (deals.length === 0) {
    return null; // Don't render the section if there are no hot deals
  }

  return (
    <section className="py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Hot Deals</h2>
          <Link
            to="/products"
            className="text-sm text-orange-500 hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {deals.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DealsSection;