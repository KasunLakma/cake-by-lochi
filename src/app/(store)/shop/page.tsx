'use client';

import React, { Suspense } from "react";
import MegaHeader from "@/components/shared/mega-header";
import ProductCatalog from "@/components/shared/product-catalog";

export default function ShopPage() {
  return (
    <div className="relative min-h-screen bg-[#fdfbf7] dark:bg-bg-vanilla-cream transition-colors duration-500 overflow-x-hidden font-sans">
      <MegaHeader />
      
      <main className="w-full pt-[120px]">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[400px] text-accent-chocolate dark:text-white font-serif">
            Loading Catalog...
          </div>
        }>
          <ProductCatalog />
        </Suspense>
      </main>
    </div>
  );
}
