import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductSlider from "../components/ProductSlider";
import CategoriesGrid from "../components/CategoriesGrid";
import CategorySidebar from "../components/CategorySidebar";
import DealsSection from "../components/DealsSection";
import ProductCard from "../components/ProductCard";
import { ProductGridSkeleton } from "../components/ProductCardSkeleton";
import ValuePropsBanner from "../components/ValuePropsBanner";
import AdBanner from "../components/AdBanner";
import { ADS } from "../lib/ads";
import { useCart } from "../context/CartContext";

const Home = () => {
    const { products: productData, productsLoading } = useCart();
    const navigate = useNavigate();
    const [featured, setFeatured] = useState([]);

    const goToCategory = (slug) => navigate(`/products?category=${slug}`);

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
            {/* Hero: categories (left) + slider (center) + ads (right) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-[220px_minmax(0,1fr)_180px]">
                    <aside className="hidden md:block">
                        <CategorySidebar
                            variant="inline"
                            fill
                            active="all"
                            onSelect={goToCategory}
                        />
                    </aside>

                    <div className="min-w-0">
                        <div className="overflow-hidden rounded-2xl">
                            <ProductSlider />
                        </div>
                        {/* Compact ad below the slider on mobile */}
                        <div className="mt-4 flex justify-center md:hidden">
                            <AdBanner unit={ADS.mobileBanner} />
                        </div>
                        {/* Trust badges — sit under the slider to fill the height beside the tall ad */}
                        <div className="mt-6 rounded-2xl border border-gray-100 bg-white py-8 shadow-sm">
                            <ValuePropsBanner />
                        </div>
                    </div>

                    {/* Ad rail to the right of the slider (desktop) */}
                    <aside className="hidden md:flex md:justify-center">
                        <AdBanner unit={ADS.skyscraper} />
                    </aside>
                </div>
            </div>

            {/* Category grid — kept for mobile where the sidebar is hidden */}
            <section className="py-8 md:hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <CategoriesGrid />
                </div>
            </section>

            <section className="bg-blue-50 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <DealsSection />
                </div>
            </section>

            {/* Mid-page rectangle ad */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex justify-center">
                <AdBanner unit={ADS.rectangle} />
            </div>

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
                        {productsLoading && featured.length === 0 ? (
                            <ProductGridSkeleton count={8} />
                        ) : (
                            featured.map((p) => (
                                <ProductCard key={p._id} product={p} />
                            ))
                        )}
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