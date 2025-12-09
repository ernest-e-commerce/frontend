import React from 'react';

const Pagination = ({ products, handlePageChange }) => {

  return (
    <div className="flex justify-between items-center mt-6">
      <div>
        <p className="text-sm text-gray-700">
          Showing <span className="font-medium">{products?.products?.length > 0 ? (products.currentPage - 1) * 10 + 1 : 0}</span> to <span className="font-medium">{Math.min(products.currentPage * 10, products.totalProducts)}</span> of{' '}
          <span className="font-medium">{products?.totalProducts}</span> results
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handlePageChange(products.currentPage - 1)}
          disabled={products.currentPage <= 1}
          className="px-3 py-1 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm text-gray-700">
          Page <span className="font-medium">{products.currentPage}</span> of <span className="font-medium">{products.totalPages}</span>
        </span>
        <button
          onClick={() => handlePageChange(products.currentPage + 1)}
          disabled={products.currentPage >= products.totalPages}
          className="px-3 py-1 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;