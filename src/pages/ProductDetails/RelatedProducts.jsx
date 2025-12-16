import React from 'react';
import ProductCard from '../../components/ProductCard';

const RelatedProducts = ({ related }) => {
  if (related.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <h4 className="text-lg font-semibold mb-3">Related Products</h4>
      <div className="grid grid-cols-1 gap-3">
        {related.map((r) => <ProductCard key={r._id} product={r} />)}
      </div>
    </div>
  );
};

export default RelatedProducts;