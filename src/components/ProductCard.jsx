import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { toast } from "sonner";

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();

    const handleAddToCart = (e) => {
        e.stopPropagation();
        addToCart(product);
        toast.success("Added to cart!");
    };

    return (
        <Link
            to={`/product/${product._id}`}
            className="block"
        >
            <div className="relative bg-white rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-blue-500/20 transition duration-300 transform hover:translate-y-[-2px] border border-gray-100 group">
                <div className="p-4">
                    <div className="relative pt-[75%] bg-gray-100 rounded-xl overflow-hidden shadow-inner">
                        <img
                            src={product.media?.[0]?.url}
                            alt={product.name}
                            className="absolute top-0 left-0 w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                        />

                        <div className="absolute top-3 right-3 text-xs font-semibold bg-white/80 backdrop-blur-sm text-blue-600 px-3 py-1 rounded-full shadow-md border border-blue-200">
                            {product.rating}★
                        </div>
                    </div>

                    <div className="mt-4">
                        <h3 className="text-base font-semibold line-clamp-2 text-gray-900">
                            {product.name}
                        </h3>

                        <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                            {product.shortDescription || "High-performance unit"}
                        </p>

                        <div className="flex items-center mt-3">
                            <div className="text-xl font-bold text-blue-600">
                                ₦{product.price?.toLocaleString()}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-4 pb-4 pt-1">
                    <button
                        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/40 hover:bg-blue-700 transition duration-300 transform hover:scale-[1.01]"
                        onClick={handleAddToCart}
                    >
                        Add to Unit
                    </button>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;