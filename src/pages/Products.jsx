import React, { useState, useEffect, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import {
  fetchProductsPaginated,
  searchProductsByName,
  getProductsByCategory,
} from "../api/productService";
import ProductCard from "../components/ProductCard";
import { ProductGridSkeleton } from "../components/ProductCardSkeleton";

const PAGE_SIZE = 12;

const Products = () => {
  const [searchParams] = useSearchParams();
  const { categories: productCategories } = useCart();

  const activeCat = searchParams.get("category") || "all";
  const urlQuery = searchParams.get("q") || "";

  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // (Re)load the first page whenever the category or search query changes.
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setIsLoading(true);
      setError(null);
      setPage(1);
      try {
        let list = [];
        let pages = 1;
        if (activeCat !== "all") {
          // Categories load in full (no pagination needed).
          const category = productCategories.find((c) => c.slug === activeCat);
          list = category ? await getProductsByCategory(category.name) : [];
        } else if (urlQuery.trim()) {
          // Search the whole catalogue, paginated.
          const res = await searchProductsByName({ query: urlQuery, page: 1, limit: PAGE_SIZE });
          list = res.products || [];
          pages = res.totalPages || 1;
        } else {
          // All products, paginated.
          const res = await fetchProductsPaginated({ page: 1, limit: PAGE_SIZE });
          list = res.products || [];
          pages = res.totalPages || 1;
        }
        if (cancelled) return;
        setDisplayedProducts(list);
        setTotalPages(pages);
      } catch (err) {
        if (cancelled) return;
        console.error(`Failed to load products (${activeCat}):`, err);
        setError("Failed to load products. Please try again later.");
        setDisplayedProducts([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [activeCat, urlQuery, productCategories]);

  const handleLoadMore = useCallback(async () => {
    const next = page + 1;
    setIsLoadingMore(true);
    try {
      const res = urlQuery.trim()
        ? await searchProductsByName({ query: urlQuery, page: next, limit: PAGE_SIZE })
        : await fetchProductsPaginated({ page: next, limit: PAGE_SIZE });
      setDisplayedProducts((prev) => [...prev, ...(res.products || [])]);
      setPage(next);
      setTotalPages(res.totalPages || totalPages);
    } catch (err) {
      console.error("Failed to load more products:", err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [page, urlQuery, totalPages]);

  // Category results are still filtered by the search box client-side.
  const visibleProducts =
    activeCat === "all"
      ? displayedProducts
      : displayedProducts.filter((p) =>
          urlQuery.trim() === ""
            ? true
            : p.name.toLowerCase().includes(urlQuery.toLowerCase())
        );

  const searchQueryDisplay =
    urlQuery.trim() !== "" ? `(Searching for: "${urlQuery}")` : "";

  const categoryLabel =
    activeCat === "all"
      ? "All Products"
      : productCategories.find((c) => c.slug === activeCat)?.name || "Products";

  const canLoadMore = activeCat === "all" && !isLoading && page < totalPages;

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
            Results: <span className="font-semibold text-gray-700">{visibleProducts.length}</span>{" "}
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
          <>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {visibleProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
              {visibleProducts.length === 0 && (
                <p className="col-span-full text-center text-gray-500">
                  No products found matching your criteria.
                </p>
              )}
            </div>

            {canLoadMore && (
              <div className="mt-10 flex justify-center">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white shadow-md transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoadingMore ? "Loading…" : "Load more products"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Products;
