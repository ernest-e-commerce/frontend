import React from "react";

const categories = [
  { id: "all", name: "All" },
  { id: "shoes", name: "Shoes" },
  { id: "speakers", name: "Speakers" },
  { id: "apparel", name: "Apparel" },
  { id: "electronics", name: "Electronics" },
  { id: "watches", name: "Watches" },
  { id: "bags", name: "Bags" },
  { id: "gaming", name: "Gaming" },
  { id: "laptops", name: "Laptops" },
  { id: "phones", name: "Phones" },
  { id: "accessories", name: "Accessories" },
  { id: "home", name: "Home Appliances" },
];

const CategorySidebar = ({ active = "all", onSelect = () => {} }) => {
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
                    ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-lg"
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
