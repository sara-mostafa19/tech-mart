"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Product } from "@/interfaces";
import {ProductCard}  from "@/components/products/ProducCard";
import  LoadingSpinner  from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Search, Filter, Grid, List, X } from "lucide-react";
import { ProductsResponse } from "@/types/responses";
import Link from "next/link";

export default function ProductsPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const searchParams = useSearchParams();
  const brandFilter = searchParams.get("brand");
  const categoryFilter = searchParams.get("category");

  async function fetchProducts() {
    setLoading(true);
    const data: ProductsResponse = await fetch(
      "https://ecommerce.routemisr.com/api/v1/products"
    ).then((res) => res.json());
    setLoading(false);
    setAllProducts(data.data);
  }

  useEffect(() => {
    fetchProducts();
  }, []);


  const products = allProducts.filter(product => {
    if (brandFilter && product.brand.slug !== brandFilter) return false;
    if (categoryFilter && product.category.slug !== categoryFilter) return false;
    return true;
  });

  if (loading && products.length === 0) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Products</h1>
        <p className="text-muted-foreground">
          Discover amazing products from our collection
        </p>
        {(brandFilter || categoryFilter) && (
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            <span className="text-sm text-muted-foreground">Filtering by:</span>
            {brandFilter && (
              <span className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm font-medium">
                Brand: {brandFilter}
              </span>
            )}
            {categoryFilter && (
              <span className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm font-medium">
                Category: {categoryFilter}
              </span>
            )}
            <Link href="/products">
              <Button variant="outline" size="sm">
                <X className="h-4 w-4 mr-1" />
                Clear Filters
              </Button>
            </Link>
          </div>
        )}
      </div>

      <div className="flex items-center justify-end mb-6">
        <div className="flex items-center border rounded-md">
     <Button
  size="sm"
  onClick={() => setViewMode("grid")}
  className={`rounded-r-none ${
    viewMode === "grid"
      ? "bg-black text-white hover:bg-black/90"
      : "bg-transparent text-black hover:bg-gray-200"
  }`}
>
  <Grid className="h-4 w-4" />
</Button>
<Button
  size="sm"
  onClick={() => setViewMode("list")}
  className={`rounded-l-none ${
    viewMode === "list"
      ? "bg-black text-white hover:bg-black/90"
      : "bg-transparent text-black hover:bg-gray-200"
  }`}
>
  <List className="h-4 w-4" />
</Button>

        </div>
      </div>

      {/* Products Grid */}
      <div
        className={`grid gap-6 ${
          viewMode === "grid"
            ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
            : "grid-cols-1"
        }`}
      >
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            viewMode={viewMode}
          />
        ))}
      </div>
    </div>
  );
}
