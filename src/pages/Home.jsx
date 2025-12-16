import React, { useState, useEffect } from "react";
import ProductSlider from "../components/ProductSlider";
import CategoriesGrid from "../components/CategoriesGrid";
import DealsSection from "../components/DealsSection";
import ProductCard from "../components/ProductCard";
import ValuePropsBanner from "../components/ValuePropsBanner";
import { useCart } from "../context/CartContext";

const Home = () => {
  const { products: productData } = useCart();
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    if (productData && productData.products && productData.products.length > 0) {
      const shuffled = [...productData.products].sort(() => 0.5 - Math.random());
      setFeatured(shuffled.slice(0, 8)); 
    }
  }, [productData]);

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <ProductSlider />
      <div className="py-8 bg-white shadow-2xl rounded-xl -mt-12 relative z-10 max-w-7xl mx-auto px-6 md:px-10 border border-gray-100">
        <ValuePropsBanner className="text-blue-800" />
      </div>
      <section className="max-w-7xl mx-auto px-4 md:px-8 pt-32 pb-20">
        <header className="mb-16 text-center">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-800 tracking-tight">Explore Technology & Innovation</h2>
            <div className="w-12 h-1 bg-blue-800 mx-auto my-4 rounded-full" />
            <p className="text-lg font-light text-gray-500 mt-3 max-w-3xl mx-auto">Discover advanced solutions and high-performance gear deployed by our team.</p>
        </header>
        <CategoriesGrid />
      </section>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-24">
        <div className="bg-blue-50 border border-blue-200 rounded-[2rem] p-8 md:p-16 shadow-inner">
            <DealsSection className="text-gray-900" />
        </div>
      </div>
      <section className="max-w-7xl mx-auto px-4 md:px-8 pt-20 pb-32">
        <header className="flex flex-col md:flex-row items-end justify-between mb-16">
          <div>
            <span className="text-sm font-semibold text-blue-800 uppercase tracking-widest">Core Collection</span>
            <h2 className="text-4xl lg:text-6xl font-black text-gray-900 tracking-tighter mt-1">New Units Deployed</h2>
          </div>
          <a
            href="/products"
            className="mt-8 md:mt-0 px-10 py-3.5 text-lg bg-blue-800 text-white font-semibold rounded-lg shadow-2xl shadow-blue-800/50 hover:bg-blue-900 transition duration-300 transform hover:scale-[1.01]"
          >
            Access Full Catalog →
          </a>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
          {featured.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      </section>
      
    </main>
  );
};

export default Home;