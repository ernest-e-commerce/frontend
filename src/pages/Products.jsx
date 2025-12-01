import React, { useState } from "react";
import { useSearchParams } from "react-router-dom"; // 👈 Import useSearchParams
import productsData from "../data/Products";
import ProductCard from "../components/ProductCard";
import CategorySidebar from "../components/CategorySidebar";

const Products = () => {
  const [activeCat, setActiveCat] = useState("all");
  
  // 👈 Read the search query directly from the URL
  const [searchParams] = useSearchParams();
  const urlQuery = searchParams.get("q") || ""; // Get the 'q' parameter

  const filtered = productsData.filter((p) => {
    const matchCat = activeCat === "all" ? true : p.category === activeCat;
    
    // 👈 Use the URL query for filtering
    const matchQuery =
      urlQuery.trim() === "" ? true : p.title.toLowerCase().includes(urlQuery.toLowerCase());
    
    return matchCat && matchQuery;
  });
  
  // Conditionally display the current search term for clarity
  const searchQueryDisplay = urlQuery.trim() !== "" 
    ? `(Searching for: "${urlQuery}")` 
    : "";


  return (
    <div className="px-4 md:px-8 lg:px-16 py-10 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* LEFT SIDEBAR */}
        <aside className="md:col-span-1">
          <CategorySidebar active={activeCat} onSelect={setActiveCat} />
        </aside>

        {/* MAIN CONTENT */}
        <section className="md:col-span-3">

          {/* Result Count */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
   
            <span className="text-sm text-gray-500">
              Results: <span className="font-semibold text-gray-700">{filtered.length}</span> {searchQueryDisplay}
            </span>
          </div>

          {/* PRODUCT GRID */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          {filtered.length === 0 && (
            <p className="md:col-span-4 text-center text-gray-500">
              No products found matching your criteria.
            </p>
          )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Products;