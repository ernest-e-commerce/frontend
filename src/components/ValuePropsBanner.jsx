import React from 'react';
import { Truck, RotateCcw, Headphones } from 'lucide-react';

const ValuePropsBanner = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div className="flex flex-col items-center">
          <Truck className="text-4xl text-blue-600 mb-3" />
          <h3 className="text-lg font-semibold text-gray-900">Free Shipping</h3>
          <p className="text-sm text-gray-500">On all orders over $50</p>
        </div>
        <div className="flex flex-col items-center">
          <RotateCcw className="text-4xl text-blue-600 mb-3" />
          <h3 className="text-lg font-semibold text-gray-900">Easy Returns</h3>
          <p className="text-sm text-gray-500">30-day money back guarantee</p>
        </div>
        <div className="flex flex-col items-center">
          <Headphones className="text-4xl text-blue-600 mb-3" />
          <h3 className="text-lg font-semibold text-gray-900">24/7 Support</h3>
          <p className="text-sm text-gray-500">Customer care when you need it</p>
        </div>
      </div>
    </div>
  );
};

export default ValuePropsBanner;