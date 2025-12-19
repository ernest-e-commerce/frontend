import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { toast } from "sonner";
import ShoppingCartIcon from "./ShoppingCartIcon";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import StarIcon from "./StarIcon";

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const { user, setUser } = useAuth();

    const [isRated, setIsRated] = useState(false);
    const [ratingCount, setRatingCount] = useState(product.rating || 0);

    useEffect(() => {
        if (user && user.ratedProducts) {
            setIsRated(user.ratedProducts.includes(product._id));
        } else {
            setIsRated(false);
        }
    }, [user, product._id]);

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product);
        toast.success("Added to cart!");
    };

    const handleRate = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            toast.error("You must be logged in to rate products.");
            return;
        }

        const originalIsRated = isRated;
        const originalRatingCount = ratingCount;

        const newRatedStatus = !isRated;
        const newRatingCount = newRatedStatus
            ? ratingCount + 1
            : ratingCount - 1;
        setIsRated(newRatedStatus);
        setRatingCount(newRatingCount);

        try {
            await api.post(`/products/rating/${product._id}`);

            const response = await api.get("/auth/user");
            setUser(response.user);
            toast.success("Thanks for your rating!");
        } catch (error) {
            setIsRated(originalIsRated);
            setRatingCount(originalRatingCount);
            toast.error("Failed to save rating. Please try again.");
            console.error("Failed to rate product", error);
        }
    };

    return (
        <Link
            to={`/product/${product._id}`}
            className="group block overflow-hidden"
        >
            <div className="relative bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-200/80">
                <div className="relative pt-[100%] bg-gray-100 rounded-t-lg overflow-hidden">
                    <img
                        src={product.media?.[0]?.url}
                        alt={product.name}
                        className="absolute top-0 left-0 w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                    />
                    <div
                        className="absolute top-2 right-2 z-10 flex items-center cursor-pointer bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm"
                        onClick={handleRate}
                    >
                        <StarIcon
                            filled={isRated}
                            className={`w-5 h-5 ${
                                isRated ? "text-yellow-500" : "text-gray-300"
                            }`}
                        />
                        <span className="text-gray-800 font-semibold ml-1 text-sm">
                            {ratingCount}
                        </span>
                    </div>
                </div>

                <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 truncate">
                        {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 truncate">
                        {product.shortDescription || "High-performance unit"}
                    </p>

                    <div className="flex items-center justify-between mt-4">
                        <p className="text-lg font-bold text-gray-900">
                            ₦{product.price?.toLocaleString()}
                        </p>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-sm transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
                    <button
                        onClick={handleAddToCart}
                        className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300"
                    >
                        <ShoppingCartIcon className="mr-2" />
                        Add to Cart
                    </button>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;