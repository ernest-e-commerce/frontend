import React, { useState, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import productsData from "../data/Products";

/* ============================================
   ICONS
============================================ */

const CartIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className || "w-5 h-5"}
  >
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 12.42a2 2 0 0 0 2 1.58h9.72a2 2 0 0 0 2-1.58L23 6H6" />
  </svg>
);

const SearchIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className || "w-5 h-5"}
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

/* ============================================
   SEARCH WITH SUGGESTIONS
============================================ */

const SearchInputWithSuggestions = ({
  placeholder,
  isMobile = false,
  closeMobileMenu,
}) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const suggestions = useMemo(() => {
    if (query.length < 1) return [];

    const lowerQuery = query.toLowerCase();

    return productsData
      .filter((p) => p.title.toLowerCase().startsWith(lowerQuery))
      .map((p) => p.title)
      .slice(0, 5);
  }, [query]);

  const handleSearchSubmit = useCallback(
    (e, finalQuery) => {
      e?.preventDefault();

      const search = finalQuery?.trim() || query.trim();

      if (search) {
        navigate(`/products?q=${search}`);
      } else {
        navigate("/products");
      }

      setQuery("");
      setIsFocused(false);
      if (isMobile) closeMobileMenu();
    },
    [navigate, query, isMobile, closeMobileMenu]
  );

  return (
    <div className="relative w-full">
      <form onSubmit={(e) => handleSearchSubmit(e, query)}>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)}
          placeholder={placeholder}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                     focus:outline-none focus:border-gray-600 transition"
        />

        {!isMobile && (
          <button
            type="submit"
            className="absolute right-0 top-0 h-full p-3 
                       text-gray-500 hover:text-black transition"
          >
            <SearchIcon className="w-5 h-5" />
          </button>
        )}
      </form>

      {isFocused && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 mt-1 bg-white 
                        border border-gray-200 rounded-lg shadow-lg z-50">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              onClick={() => handleSearchSubmit(null, suggestion)}
              className="p-3 text-sm text-gray-800 
                         hover:bg-gray-100 cursor-pointer transition"
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ============================================
   NAVBAR
============================================ */

const Navbar = () => {
  const { cart } = useCart();
  const { user, logout } = useAuth();

  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const closeMobileSearch = useCallback(
    () => setIsMobileSearchOpen(false),
    []
  );

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">

          {/* BRAND */}
          <Link
            to="/"
            className="text-2xl font-bold tracking-wide text-gray-900 
                       hover:text-gray-700 transition"
          >
            MyStore
          </Link>

          {/* DESKTOP SEARCH */}
          <div className="flex-1 max-w-lg mx-8 hidden sm:block">
            <SearchInputWithSuggestions placeholder="Search products..." />
          </div>

          {/* RIGHT SECTION */}
          <div className="flex items-center gap-5">

            {/* MOBILE SEARCH BUTTON */}
            <button
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="sm:hidden p-2 rounded-full 
                         text-gray-700 hover:bg-gray-100 transition"
            >
              <SearchIcon className="w-5 h-5" />
            </button>

            {/* PRODUCTS LINK */}
            <Link
              to="/products"
              className="hidden sm:block text-gray-700 
                         font-medium hover:text-black transition"
            >
              Products
            </Link>

            {/* CART */}
            <Link
              to="/cart"
              className="relative flex items-center 
                         text-gray-700 hover:text-black transition"
            >
              <span className="hidden sm:flex items-center font-medium">
                <CartIcon className="w-5 h-5 mr-1" />
                Cart
              </span>

              <span className="sm:hidden">
                <CartIcon className="w-6 h-6" />
              </span>

              {cart.length > 0 && (
                <span
                  className="absolute -top-2 -right-3 bg-red-500 
                             text-white rounded-full text-xs 
                             w-5 h-5 flex items-center 
                             justify-center shadow"
                >
                  {cart.length}
                </span>
              )}
            </Link>

            {/* USER PROFILE / AUTH */}
            {user ? (
              <div className="flex items-center gap-4">

                {/* PROFILE LINK */}
                <Link
                  to="/profile"
                  className="flex items-center gap-2 
                             text-gray-700 hover:text-black transition"
                >
                  <div
                    className="w-9 h-9 flex items-center justify-center 
                               rounded-full bg-gray-200 text-gray-800 
                               font-bold uppercase"
                  >
                    {user.name?.charAt(0) || user.email.charAt(0)}
                  </div>

                  <span className="hidden sm:block text-sm font-medium">
                    {user.name || user.email}
                  </span>
                </Link>

                {/* LOGOUT */}
                <button
                  onClick={logout}
                  className="px-3 py-1 bg-gray-100 
                             border border-gray-300 text-gray-700 
                             rounded-lg text-sm hover:bg-gray-200 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-3 py-1.5 bg-black text-white 
                           rounded-lg font-semibold text-sm 
                           shadow hover:bg-gray-900 transition"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE SEARCH */}
      {isMobileSearchOpen && (
        <div className="sm:hidden px-4 py-2 bg-gray-50 border-t">
          <SearchInputWithSuggestions
            placeholder="Search products..."
            isMobile={true}
            closeMobileMenu={closeMobileSearch}
          />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
