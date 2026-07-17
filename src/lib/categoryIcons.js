// Custom image icons for specific categories. Any category not listed here
// falls back to its emoji (`category.icon`). Keyed by the category display name.
export const CATEGORY_IMAGES = {
  Electronics: "/images/cat-electronics.png",
  Clothing: "/images/cat-clothing.png",
  "Home & Kitchen": "/images/cat-home-kitchen.png",
};

export const getCategoryImage = (name) => CATEGORY_IMAGES[name] || null;
