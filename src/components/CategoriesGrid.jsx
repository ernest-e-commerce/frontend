import React from "react";
import { Link } from "react-router-dom";

const categories = [
  { name: 'Electronics', slug: 'electronics', icon: '📱' },
  { name: 'Clothing', slug: 'clothing', icon: '👕' },
  { name: 'Home & Kitchen', slug: 'home-kitchen', icon: '🏠' },
  { name: 'Books', slug: 'books', icon: '📚' },
  { name: "Sports & Outdoors", slug: "sports-outdoors", icon: "⚽" },
  { name: 'Health & Beauty', slug: 'health-beauty', icon: '💅' },
  { name: 'Toys & Games', slug: 'toys-games', icon: '🎮' },
  // { name: 'Automotive', slug: 'automotive', icon: '🚗' },
  { name: 'Jewelry & Watches', slug: 'jewelry-watches', icon: '💍' },
  { name: 'Groceries', slug: 'groceries', icon: '🛒' },
  { name: 'Pet Supplies', slug: 'pet-supplies', icon: '🐾' },
  { name: 'Office Products', slug: 'office-products', icon: '📎' },
  { name: 'Musical Instruments', slug: 'musical-instruments', icon: '🎸' },
  // { name: 'Handmade', slug: 'handmade', icon: '🎨' }
];

const CategoriesGrid = () => {
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