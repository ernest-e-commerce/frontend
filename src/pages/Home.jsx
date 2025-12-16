import React, { useState, useEffect } from "react";
import ProductSlider from "../components/ProductSlider";
import CategoriesGrid from "../components/CategoriesGrid";
import DealsSection from "../components/DealsSection";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";

const Home = () => {
  const { products: productData } = useCart();
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    if (productData && productData.products && productData.products.length > 0) {
      const shuffled = [...productData.products].sort(() => 0.5 - Math.random());
      setFeatured(shuffled.slice(0, 10));
    }
  }, [productData]);

  return (
    <div>
      <ProductSlider />
      <CategoriesGrid />
      <DealsSection />

      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Featured Products</h2>
            <a href="/products" className="text-sm text-orange-500">See all</a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
            {featured.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;