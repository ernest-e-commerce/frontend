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
            const shuffled = [...productData.products].sort(
                () => 0.5 - Math.random()
            );
            setFeatured(shuffled.slice(0, 8));
        }
    }, [productData]);

    return (
        <main className="min-h-screen bg-gray-50 text-gray-900">
            <ProductSlider />

            <div className="py-12 bg-white -mt-16 relative z-10 rounded-t-2xl shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ValuePropsBanner />
                </div>
            </div>

            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <CategoriesGrid />
                </div>
            </section>

            <section className="bg-blue-50 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <DealsSection />
                </div>
            </section>

            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <header className="text-center mb-16">
                        <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
                            Featured Collection
                        </h2>
                        <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                            Check out our latest and greatest units, curated just for you.
                        </p>
                    </header>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {featured.map((p) => (
                            <ProductCard key={p._id} product={p} />
                        ))}
                    </div>

                    <div className="text-center mt-16">
                        <a
                            href="/products"
                            className="inline-block px-10 py-4 text-lg bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
                        >
                            Shop All Products
                        </a>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Home;