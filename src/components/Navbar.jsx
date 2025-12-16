import React, { useState, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import productsData from "../data/Products";
import {
  ShoppingCart,
  Search,
  User as UserIcon,
  ChevronDown,
  LogIn,
  LogOut,
  X,
  User,
  LayoutDashboard,
} from "lucide-react";

/* ============================================
   SEARCH INPUT WITH SUGGESTIONS
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
        navigate(`/products`);
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
        <div className="relative">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 150)}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-full bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <div className="absolute left-0 top-0 h-full flex items-center pl-4 text-gray-400">
            <Search className="w-5 h-5" />
          </div>
        </div>
      </form>

      {isFocused && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="p-3 text-sm text-gray-800 hover:bg-blue-50 cursor-pointer transition"
              onClick={() => handleSearchSubmit(null, suggestion)}
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
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);

  const closeMobileSearch = useCallback(() => setIsMobileSearchOpen(false), []);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-xl sticky top-0 z-40 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center">
            <img src="/logo.jpg" alt="Earnest Mall" className="h-14 w-auto" />
          </Link>

          <div className="flex-1 max-w-xl mx-8 hidden sm:block">
            <SearchInputWithSuggestions placeholder="Search for products..." />
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="sm:hidden p-2 rounded-full text-gray-600 hover:bg-blue-50 transition"
            >
              {isMobileSearchOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Search className="w-6 h-6" />
              )}
            </button>

            <Link
              to="/products"
              className="hidden sm:block text-gray-600 font-medium hover:text-black transition"
            >
              Products
            </Link>

            <Link
              to="/cart"
              className="relative flex items-center text-gray-600 hover:text-black transition p-2 rounded-full hover:bg-blue-50"
            >
              <ShoppingCart className="w-6 h-6" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center shadow-md">
                  {cart.length}
                </span>
              )}
            </Link>

            <div className="hidden sm:block w-px h-6 bg-gray-200"></div>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen((prev) => !prev)}
                  onBlur={() => setTimeout(() => setProfileOpen(false), 200)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-blue-50 transition"
                >
                  <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center overflow-hidden">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt="avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserIcon className="w-5 h-5 text-gray-600" />
                    )}
                  </div>
                  <span className="hidden md:block font-medium text-gray-700 text-sm">
                    {user.name ? user.name.split(" ")[0] : "Profile"}
                  </span>
                  <ChevronDown
                    className={`hidden md:block w-5 h-5 text-gray-600 transition-transform ${
                      isProfileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl py-2 z-50 border border-gray-100">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-800">
                        {user.name || "Welcome"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>
                 {isAdmin ? (
                      <Link
                        to="/admin"
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition"
                        onClick={() => setProfileOpen(false)}
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Dashboard</span>
                      </Link>
                    ) : (
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition"
                        onClick={() => setProfileOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>My Profile</span>
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-blue-50 transition"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm
                           shadow-lg shadow-blue-500/40 hover:bg-blue-700 transition-colors duration-300 flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {isMobileSearchOpen && (
        <div className="sm:hidden px-4 pb-3 pt-1 bg-white border-t border-gray-200">
          <SearchInputWithSuggestions
            placeholder="Search for products..."
            isMobile={true}
            closeMobileMenu={closeMobileSearch}
          />
        </div>
      )}
    </nav>
  );
};

export default Navbar;