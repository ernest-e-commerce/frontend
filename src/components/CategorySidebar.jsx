import React from "react";
import { useCart } from "../context/CartContext";
import { getCategoryImage } from "../lib/categoryIcons";

const CategorySidebar = ({
  active = "all",
  onSelect = () => {},
  variant = "fixed",
  fill = false,
}) => {
  const { categories: productCategories } = useCart();

  const categories = productCategories.map((c) => ({
    id: c.slug,
    name: c.name,
    icon: c.icon,
  }));

  // "fixed" keeps the original Products-page behaviour; "inline" sits within a
  // layout column. `fill` lets it stretch to the full row height (Home hero)
  // instead of matching just the slider (h-96).
  const isInline = variant === "inline";
  const heightCls = fill ? "md:h-full" : "md:h-96";
  const layout = isInline
    ? `hidden md:flex ${heightCls} flex-col w-full bg-white p-3 rounded-lg border border-gray-200 shadow-sm`
    : "hidden md:block fixed left-0 top-24 h-[calc(100vh-6rem)] w-64 bg-white p-4 rounded-r-lg border-r border-gray-200 shadow-sm overflow-y-auto scrollbar-hide";

  return (
    <aside className={layout}>
      <ul className={isInline ? "flex flex-1 flex-col" : "flex flex-col gap-1"}>
        {categories.map((c) => {
          const img = getCategoryImage(c.name);
          return (
            <li key={c.id} className={isInline ? "flex-1" : ""}>
              <button
                onClick={() => onSelect(c.id)}
                className={`flex w-full items-center gap-3 border-l-[3px] px-3 text-left text-sm font-medium transition ${
                  isInline ? "h-full" : "py-2"
                } ${
                  active === c.id
                    ? "border-blue-600 font-semibold text-blue-600"
                    : "border-transparent text-gray-700 hover:text-blue-600"
                }`}
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-md bg-gray-100">
                  {img ? (
                    <img
                      src={img}
                      alt=""
                      aria-hidden="true"
                      className="h-full w-full object-contain p-1"
                    />
                  ) : (
                    <span className="text-base leading-none">{c.icon}</span>
                  )}
                </span>
                <span className="truncate">{c.name}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default CategorySidebar;
