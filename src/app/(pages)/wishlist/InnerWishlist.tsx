"use client";

import { Button } from '@/components';
import { ProductCard } from '@/components/products/ProducCard';
import { wishlistContext } from '@/contexts/wishlistContext';
import { formatPrice } from '@/helpers/currency';
import { GetUserCartResponse } from '@/interfaces';
import { apiServices } from '@/services/api';
import { Separator } from '@radix-ui/react-separator';
import { Trash2 } from 'lucide-react';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { cartContext } from '@/contexts/cartContext';

interface InnerWishlistProps {
    wishlistData: any;
}

export default function InnerWishlist({ wishlistData }: InnerWishlistProps) {
    const [innerWishlistData, setInnerWishlistData] = useState(wishlistData);
    const { setCartCount } = useContext(cartContext);
    const { handleRemoveFromWishlist, wishlistCount, setWishlistCount } = useContext(wishlistContext);

    const [wishlistLoading, setWishlistLoading] = useState<Record<string, boolean>>({});

    useEffect(() => {
        setCartCount!(innerWishlistData.numOfCartItems || 0);
    }, [innerWishlistData]);

    async function updateWishlist() {
        const newWishlistData = await apiServices.getUserWishlist();
        setInnerWishlistData(newWishlistData);
    }

    async function handleRemoveWishlistItem(productId: string, setIsRemoving: (value: boolean) => void) {
        setIsRemoving(true);
        try {
            await handleRemoveFromWishlist!(productId, setWishlistLoading);
            toast.success("Product removed from wishlist");
            updateWishlist();
        } catch (error) {
            toast.error("Failed to remove from wishlist");
        } finally {
            setIsRemoving(false);
        }
    }

    async function handleAddToCartFromWishlist(productId: string) {
        try {
            await apiServices.addProductToCart(productId);
            toast.success("Added to cart");
            updateWishlist(); // Refresh wishlist count if needed
        } catch (error) {
            toast.error("Failed to add to cart");
        }
    }

    async function handleClearWishlist() {
        // Clear all wishlist items - might need backend endpoint, for now remove one by one or implement clear
        // Assuming no clear endpoint, skip or implement loop
        toast.success("Clear wishlist functionality not implemented yet");
    }

    if (!innerWishlistData || !innerWishlistData.data || !innerWishlistData.data.products || innerWishlistData.data.products.length === 0) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-semibold mb-4">Your Wishlist is Empty</h2>
                <p className="text-muted-foreground mb-6">Add items to your wishlist to see them here.</p>
                <Button variant="outline" asChild>
                    <Link href="/products">Continue Shopping</Link>
                </Button>
            </div>
        );
    }

    return (
        <>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-4">Wishlist</h1>
                {innerWishlistData.data.products.length > 0 && (
                    <p className="text-muted-foreground">
                        {innerWishlistData.data.products.length} item
                        {innerWishlistData.data.products.length > 1 ? "s" : ""} in your wishlist
                    </p>
                )}
            </div>

            <div className="space-y-4">
                {innerWishlistData.data.products.map((wishlistItem: any) => {
                    const product = wishlistItem.product;
                    return (
                        <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <ProductCard product={product} viewMode="list" />
                            <div className="flex gap-2">
                                <Button
                                    onClick={() => handleAddToCartFromWishlist(product.id)}
                                    className="bg-black text-white"
                                >
                                    Add to Cart
                                </Button>
                                <Button
                                    variant="outline"
                                    className="text-red-600"
                                    onClick={() => handleRemoveWishlistItem(product.id, (value) => setWishlistLoading(prev => ({...prev, [product.id]: value})) )}
                                    disabled={wishlistLoading[product.id]}
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Remove
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Clear Wishlist */}
            {innerWishlistData.data.products.length > 0 && (
                <div className="mt-6">
                    <Button onClick={handleClearWishlist} variant="outline" className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Clear Wishlist
                    </Button>
                </div>
            )}

            <div className="mt-8">
                <Button variant="outline" asChild className="w-full">
                    <Link href="/products">Continue Shopping</Link>
                </Button>
            </div>
        </>
    );
}
