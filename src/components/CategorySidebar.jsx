import React from "react";
import { useCart } from "../context/CartContext";

const CategorySidebar = ({ active = "all", onSelect = () => {} }) => {
  const { categories: productCategories } = useCart();

  const categories = [
    { id: "all", name: "All" },
    ...productCategories.map((c) => ({ id: c.slug, name: c.name })),
  ];

  return (
    <aside
      className="
        hidden md:block fixed left-0 top-24 
        h-[calc(100vh-6rem)] w-64 bg-white 
        p-6 rounded-r-lg border-r border-gray-200 
        shadow-sm overflow-y-auto scrollbar-hide
      "
    >
      <h4 className="text-xl font-bold mb-6 border-b pb-2">Categories</h4>

      <ul className="flex flex-col gap-3">
        {categories.map((c) => (
          <li key={c.id}>
            <button
              onClick={() => onSelect(c.id)}
              className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition 
                ${
                  active === c.id
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/40"
                    : "hover:bg-gray-100 text-gray-700"
                }
              `}
            >
              {c.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default CategorySidebar;