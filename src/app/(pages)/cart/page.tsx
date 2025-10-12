import { apiServices } from "@/services/api";
import React from "react";
import InnerCart from "./InnerCart";
import AddressContextProvider from "@/contexts/addressContext";

export default async function Cart() {
  async function fetchCart() {
    const response = await apiServices.getUserCart();
    return response;
  }

  const response = await fetchCart();

  return (
    <AddressContextProvider>
      <div className="container mx-auto px-4 py-8">
        <InnerCart cartData={response} />
      </div>
    </AddressContextProvider>
  );
}
