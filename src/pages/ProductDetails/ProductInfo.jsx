import React from 'react';

const ProductInfo = ({ product }) => {
  return (
    <div>
      <h1 className="text-2xl font-bold">{product.name}</h1>
      <p className="text-sm text-gray-500 mt-1">{product.shortDescription}</p>

      <div className="mt-4 flex items-center gap-4">
        <div className="text-2xl font-extrabold text-gray-900">
          ₦{product.price?.toLocaleString()}
        </div>
        <div className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm font-medium">
          {product.rating || 0} ★
        </div>
      </div>

      <p className="mt-4 text-gray-700">{product.shortDescription}</p>
    </div>
  );
};

export default ProductInfo;