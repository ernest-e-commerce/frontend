import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getProductsByCategory } from "../api/productService";
import ProductCard from "../components/ProductCard";
import { ProductGridSkeleton } from "../components/ProductCardSkeleton";

const Products = () => {
  const [searchParams] = useSearchParams();
  const { products: productsFromContext, categories: productCategories } = useCart();

  const activeCat = searchParams.get("category") || "all";
  const urlQuery = searchParams.get("q") || "";

  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        if (activeCat === "all") {
          setDisplayedProducts(productsFromContext?.products || []);
        } else {
          const category = productCategories.find((c) => c.slug === activeCat);
          if (category) {
            const data = await getProductsByCategory(category.name);
            setDisplayedProducts(data || []);
          } else {
            setDisplayedProducts([]);
          }
        }
      } catch (err) {
        console.error(`Failed to load category ${activeCat}:`, err);
        setError("Failed to load products. Please try again later.");
        setDisplayedProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (activeCat === "all" && (!productsFromContext || !productsFromContext.products)) return;
    if (activeCat !== "all" && (!productCategories || productCategories.length === 0)) return;

    load();
  }, [activeCat, productsFromContext, productCategories]);

  const filteredByQuery = (displayedProducts || []).filter((p) => {
    return urlQuery.trim() === ""
      ? true
      : p.name.toLowerCase().includes(urlQuery.toLowerCase());
  });

  const searchQueryDisplay =
    urlQuery.trim() !== "" ? `(Searching for: "${urlQuery}")` : "";

  const categoryLabel =
    activeCat === "all"
      ? "All Products"
      : productCategories.find((c) => c.slug === activeCat)?.name || "Products";

  return (
    <div className="px-4 md:px-8 lg:px-16 py-10 bg-gray-50 min-h-screen">
      <nav className="max-w-7xl mx-auto mb-6 flex items-center gap-2 text-sm">
        <Link to="/" className="text-gray-500 hover:text-blue-600">
          Home
        </Link>
        <span className="text-gray-400">›</span>
        <span className="font-medium text-gray-800">{categoryLabel}</span>
      </nav>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-sm text-gray-500">
            Results: <span className="font-semibold text-gray-700">{filteredByQuery.length}</span>{" "}
            {searchQueryDisplay}
          </span>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            <ProductGridSkeleton count={12} />
          </div>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {filteredByQuery.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
            {filteredByQuery.length === 0 && (
              <p className="col-span-full text-center text-gray-500">
                No products found matching your criteria.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
