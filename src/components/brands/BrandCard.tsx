"use client";

import Image from "next/image";
import Link from "next/link";
import { Brand } from "@/interfaces";

interface BrandCardProps {
  brand: Brand;
}

export function BrandCard({ brand }: BrandCardProps) {
  return (
    <div className="group flex flex-col justify-between relative bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={brand.image}
          alt={brand.name}
          fill
          className="object-fit-contain group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-sm mb-2 line-clamp-2 hover:text-primary transition-colors text-center">
          <Link href={`/products?brand=${brand.slug}`}>{brand.name}</Link>
        </h3>
      </div>
    </div>
  );
}
