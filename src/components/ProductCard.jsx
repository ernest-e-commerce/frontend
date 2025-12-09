import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => (
  <Link
    to={`/product/${product._id}`}
    className="bg-white rounded-xl p-4 shadow-sm hover:shadow-lg transition-all border border-gray-100 hover:-translate-y-1"
  >
    {/* Image Area */}
    <div className="relative h-48 bg-gray-50 rounded-lg overflow-hidden">
      <img
        src={product.media?.[0]?.url}
        alt={product.name}
        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
      />
    </div>

    {/* Info Area */}
    <div className="mt-3">
      <h3 className="text-sm font-semibold line-clamp-2 text-gray-800">
        {product.name}
      </h3>

      <p className="text-xs text-gray-500 mt-1 line-clamp-1">
        {product.shortDescription || ""}
      </p>

      <div className="flex items-center justify-between mt-3">
        <div className="text-lg font-bold text-black">
          ₦{product.price?.toLocaleString()}
        </div>

        <div className="text-xs font-medium bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
          {product.rating}★
        </div>
      </div>
    </div>
  </Link>
);

export default ProductCard;