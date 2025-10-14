import { Loader2 } from "lucide-react";
import React from "react";

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] gap-3 my-12">
      <div className="relative flex items-center justify-center">
        <div className="absolute h-12 w-12  " />
        <Loader2 className="h-10 w-10 text-primary animate-spin drop-shadow-lg" />
      </div>

      {/* Loading text */}
      <p className="text-sm font-medium text-muted-foreground animate-pulse tracking-wide">
        Loading, please wait...
      </p>
    </div>
  );
}
