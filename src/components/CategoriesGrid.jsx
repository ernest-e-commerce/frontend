import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const CategoriesGrid = () => {
  const { categories } = useCart();
  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/products?category=${cat.slug}`}
              className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow text-center"
            >
              <div className="text-3xl mb-2">{cat.icon}</div>
              <div className="text-sm font-medium">{cat.name}</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesGrid;