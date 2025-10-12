"use client"

import { apiServices } from "@/services/api";
import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import toast from "react-hot-toast";

type WishlistContextType = {
    wishlistCount?: number;
    setWishlistCount?: Dispatch<SetStateAction<number>>;
    wishlistItems?: any[];
    setWishlistItems?: Dispatch<SetStateAction<any[]>>;
    handleAddToWishlist?: (productId: string, setWishlistLoading: any) => Promise<void>;
    handleRemoveFromWishlist?: (productId: string, setWishlistLoading: any) => Promise<void>;
    isInWishlist?: (productId: string) => boolean;
}

export const wishlistContext = createContext<WishlistContextType>({});

export default function WishlistContextProvider({ children }: { children: ReactNode }) {
    const [wishlistCount, setWishlistCount] = useState(0);
    const [wishlistItems, setWishlistItems] = useState<any[]>([]);

    async function getWishlist() {
        try {
            const response = await apiServices.getUserWishlist();
            if (response.data && response.data.products) {
                setWishlistItems(response.data.products);
                setWishlistCount(response.data.products.length);
            }
        } catch (error) {
            console.error("Error fetching wishlist:", error);
        }
    }

    async function handleAddToWishlist(productId: string, setWishlistLoading: any) {
        setWishlistLoading(true);
        try {
            const data = await apiServices.addToWishlist(productId);
            setWishlistCount(data.numOfWishlistItems || wishlistCount + 1);
            toast.success(data.message || "Added to wishlist");
            getWishlist(); // Refresh wishlist
        } catch (error) {
            toast.error("Failed to add to wishlist");
        } finally {
            setWishlistLoading(false);
        }
    }

    async function handleRemoveFromWishlist(productId: string, setWishlistLoading: any) {
        setWishlistLoading(true);
        try {
            const data = await apiServices.removeFromWishlist(productId);
            setWishlistCount(data.numOfWishlistItems || wishlistCount - 1);
            toast.success(data.message || "Removed from wishlist");
            getWishlist(); // Refresh wishlist
        } catch (error) {
            toast.error("Failed to remove from wishlist");
        } finally {
            setWishlistLoading(false);
        }
    }

    const isInWishlist = (productId: string) => {
        return wishlistItems.some((item) => item.product.id === productId);
    };

    useEffect(() => {
        getWishlist();
    }, []);

    return (
        <wishlistContext.Provider value={{
            wishlistCount,
            setWishlistCount,
            wishlistItems,
            setWishlistItems,
            handleAddToWishlist,
            handleRemoveFromWishlist,
            isInWishlist
        }}>
            {children}
        </wishlistContext.Provider>
    );
}
