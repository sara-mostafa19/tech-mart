"use client";

import { useState, useEffect } from "react";
import { Category } from "@/interfaces";
import { CategoryCard } from "@/components/categories";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { CategoriesResponse } from "@/types/responses";
import { apiServices } from "@/services/api";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchCategories() {
    setLoading(true);
    try {
      const data: CategoriesResponse = await apiServices.getAllCategories();
      setCategories(data.data);
    } catch (err) {
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading && categories.length === 0) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={fetchCategories} className="px-4 py-2 bg-primary text-primary-foreground rounded">
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
        <h1 className="text-3xl font-bold mb-4">Categories</h1>
        <p className="text-muted-foreground">
          Explore our product categories
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {categories.map((category) => (
          <CategoryCard
            key={category._id}
            category={category}
          />
        ))}
      </div>
    </div>
  );
}
