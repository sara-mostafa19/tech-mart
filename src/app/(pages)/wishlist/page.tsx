import { apiServices } from "@/services/api";
import React from "react";
import InnerWishlist from "./InnerWishlist";

export default async function Wishlist() {
  async function fetchWishlist() {
    const response = await apiServices.getUserWishlist();
    return response;
  }

  const response = await fetchWishlist();

  return (
    <div className="container mx-auto px-4 py-8">
      <InnerWishlist wishlistData={response} />
    </div>
  );
}
