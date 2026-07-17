import React from "react";

// Placeholder that mirrors ProductCard's shape while products load.
const ProductCardSkeleton = () => (
  <div className="animate-pulse overflow-hidden rounded-lg border border-gray-200/80 bg-white shadow-md">
    {/* Square image placeholder (matches pt-[100%] in ProductCard) */}
    <div className="w-full bg-gray-200 pt-[100%]" />
    <div className="p-4">
      <div className="h-5 w-3/4 rounded bg-gray-200" />
      <div className="mt-2 h-4 w-1/2 rounded bg-gray-200" />
      <div className="mt-4 h-6 w-1/3 rounded bg-gray-200" />
    </div>
  </div>
);

// Renders a grid of skeletons. Pass `count` to control how many.
export const ProductGridSkeleton = ({ count = 8 }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </>
);

export default ProductCardSkeleton;
