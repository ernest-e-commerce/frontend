import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

const ProductList = ({ products, handleEdit, handleDelete }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-md">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Product</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Price</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Stock</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Category</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {products?.map((p) => (
            <tr key={p._id} className="hover:bg-gray-50 transition">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="shrink-0 h-12 w-12">
                    <img className="h-12 w-12 rounded-md object-cover" src={p.media[0]?.url} alt={p.name} />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-semibold text-gray-900">{p.name}</div>
                    <div className="text-sm text-gray-500">ID: {p._id}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">₦{p.price?.toLocaleString()}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <div className="flex flex-col items-start space-y-1">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      p.availableQuantity > 20
                        ? "bg-green-100 text-green-800"
                        : p.availableQuantity > 0
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {p.availableQuantity > 0
                      ? `${p.availableQuantity} in stock`
                      : "Out of stock"}
                  </span>
                  {p.hotDeal && (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                      Hot Deal
                    </span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{p.categories.join(', ')}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <button onClick={() => handleEdit(p)} className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-full transition">
                  <Edit size={18} />
                </button>
                <button onClick={() => handleDelete(p._id)} className="p-2 text-red-600 hover:bg-red-100 rounded-full transition">
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;