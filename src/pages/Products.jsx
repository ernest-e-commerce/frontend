import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import CategorySidebar from "../components/CategorySidebar";
import { Loader2 } from "lucide-react";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products: productsFromContext, categories: productCategories } = useCart();

  const activeCat = searchParams.get("category") || "all";
  const urlQuery = searchParams.get("q") || "";

  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductsForCategory = async () => {
      setIsLoading(true);
      setError(null);
      try {
        if (activeCat === "all") {
          setDisplayedProducts(productsFromContext?.products || []);
        } else {
          const category = productCategories.find(c => c.slug === activeCat);
          if (category) {
            const response = await api.get(`/products/category/${category.name}`);
            setDisplayedProducts(response || []);
          } else {
            console.warn(`Category slug "${activeCat}" not found.`);
            setDisplayedProducts([]);
          }
        }
      } catch (err) {
        console.error(`Failed to fetch products for category ${activeCat}:`, err);
        setError("Failed to load products. Please try again later.");
        setDisplayedProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (activeCat === 'all' && (!productsFromContext || !productsFromContext.products)) {
        return;
    }
    if (activeCat !== 'all' && (!productCategories || productCategories.length === 0)) {
        return;
    }

    fetchProductsForCategory();
  }, [activeCat, productsFromContext, productCategories]);

  const handleCategorySelect = (categorySlug) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set('category', categorySlug);
      return newParams;
    });
  };

  const filteredByQuery = (displayedProducts || []).filter((p) => {
    return urlQuery.trim() === ""
      ? true
      : p.name.toLowerCase().includes(urlQuery.toLowerCase());
  });

  const searchQueryDisplay =
    urlQuery.trim() !== "" ? `(Searching for: "${urlQuery}")` : "";

  return (
    <div className="px-4 md:px-8 lg:px-16 py-10 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* LEFT SIDEBAR */}
        <aside className="md:col-span-1">
          <CategorySidebar active={activeCat} onSelect={handleCategorySelect} />
        </aside>

        {/* MAIN CONTENT */}
        <section className="md:col-span-3">
          {/* Result Count */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <span className="text-sm text-gray-500">
              Results: <span className="font-semibold text-gray-700">{filteredByQuery.length}</span> {searchQueryDisplay}
            </span>
          </div>

          {/* PRODUCT GRID */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : error ? (
            <p className="md:col-span-4 text-center text-red-500">{error}</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              {filteredByQuery.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
              {filteredByQuery.length === 0 && (
                <p className="md:col-span-4 text-center text-gray-500">
                  No products found matching your criteria.
                </p>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Products;