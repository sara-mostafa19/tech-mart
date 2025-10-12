"use client";

import { useState, useEffect } from "react";
import { Brand } from "@/interfaces";
import { BrandCard } from "@/components/brands";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { BrandsResponse } from "@/types/responses";
import { apiServices } from "@/services/api";

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchBrands() {
    setLoading(true);
    try {
      const data: BrandsResponse = await apiServices.getAllBrands();
      setBrands(data.data);
    } catch (err) {
      setError("Failed to load brands");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBrands();
  }, []);

  if (loading && brands.length === 0) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={fetchBrands} className="px-4 py-2 bg-primary text-primary-foreground rounded">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Brands</h1>
        <p className="text-muted-foreground">
          Explore our featured brands
        </p>
      </div>

      {/* Brands Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {brands.map((brand) => (
          <BrandCard
            key={brand._id}
            brand={brand}
          />
        ))}
      </div>
    </div>
  );
}
