import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { useCart } from "../context/CartContext";

// Jumia-style slide-out category drawer for mobile.
const MobileCategoryMenu = ({ open, onClose }) => {
  const { categories } = useCart();

  // Lock background scroll while the drawer is open.
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="sm:hidden" aria-hidden={!open}>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Drawer */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-72 max-w-[82%] transform flex-col bg-white shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4">
          <span className="text-lg font-bold text-gray-900">Categories</span>
          <button
            onClick={onClose}
            aria-label="Close categories menu"
            className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col overflow-y-auto py-2">
          {categories.map((c) => (
            <Link
              key={c.slug}
              to={`/products?category=${c.slug}`}
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-blue-50 hover:text-blue-600"
            >
              <c.Icon className="h-5 w-5 shrink-0" />
              {c.name}
            </Link>
          ))}
        </nav>
      </aside>
    </div>
  );
};

export default MobileCategoryMenu;
