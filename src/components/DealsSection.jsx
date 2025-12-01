import React from "react";
import { Link } from "react-router-dom";
import products from "../data/Products";
import ProductCard from "./ProductCard";

const DealsSection = () => {
  // Mock deals: products with price < 20000 or something
  const deals = products.filter((p) => p.price < 20000).slice(0, 8);

  return (
    <section className="py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Hot Deals</h2>
          <Link to="/products" className="text-sm text-orange-500 hover:underline">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {deals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DealsSection;