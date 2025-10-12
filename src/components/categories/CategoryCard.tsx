"use client";

import Image from "next/image";
import Link from "next/link";
import { Category } from "@/interfaces";

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <div className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-1">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={category.image || "/placeholder-category.png"}
          alt={category.name}
          fill
          className="object-fit-contain group-hover:scale-110 transition-transform duration-700 ease-out"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </div>

      {/* Content */}
      <div className="relative p-6 bg-white">
        <h3 className="font-bold text-lg mb-2 text-center text-gray-800 group-hover:text-primary transition-colors duration-300 line-clamp-2">
          <Link
            href={`/products?category=${category.slug}`}
            className="hover:underline decoration-2 underline-offset-4"
          >
            {category.name}
          </Link>
        </h3>

        <div className="w-12 h-1 bg-gradient-to-r from-primary to-primary/60 rounded-full mx-auto mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Hover Border Effect */}
      <div className="absolute inset-0 rounded-xl border-2 border-primary/0 group-hover:border-primary/20 transition-colors duration-500 pointer-events-none" />
    </div>
  );
}
