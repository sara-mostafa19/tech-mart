"use client";
import Link from "next/link";
import {
  Search,
  Home,
  ShoppingBag,
  Smartphone,
  Shirt,
  Sofa,
  Dumbbell,
  Percent,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const popularCategories = [
    { name: "Electronics", href: "/electronics", icon: Smartphone },
    { name: "Fashion", href: "/fashion", icon: Shirt },
    { name: "Home & Garden", href: "/home", icon: Sofa },
    { name: "Sports", href: "/sports", icon: Dumbbell },
    { name: "Deals", href: "/deals", icon: Percent },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4 text-center">
      {/* 404 Number */}
      <h1 className="text-8xl font-extrabold text-primary">404</h1>
      <p className="text-xl text-muted-foreground mt-4">
        Oops! The page you’re looking for doesn’t exist.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
        <Button asChild>
          <Link href="/">
            <Home className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/search">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Link>
        </Button>
      </div>

      {/* Popular Categories */}
      <div className="mt-12 w-full max-w-2xl">
        <h2 className="text-lg font-semibold mb-6">Popular Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {popularCategories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="group flex flex-col items-center justify-center p-6 border rounded-xl shadow-sm bg-card hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              <cat.icon className="h-8 w-8 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
