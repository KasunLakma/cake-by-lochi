import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-[#fdfbf7]/80 dark:bg-bg-vanilla-cream/80 backdrop-blur-md border-b border-accent-chocolate/10 px-6 py-4 flex items-center justify-between gap-4 h-[80px]">
        {/* Logo */}
        <Link href="/" className="group flex flex-col items-center flex-shrink-0 select-none">
          <span className="font-serif text-sm font-bold tracking-tight text-accent-chocolate dark:text-white uppercase">
            Cake By Lochi
          </span>
          <span className="text-[8px] font-bold tracking-[0.2em] uppercase text-primary-pink-deep dark:text-primary-pink">
            Admin Panel
          </span>
        </Link>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 border border-accent-chocolate/10 rounded-full text-xs font-bold uppercase tracking-widest text-accent-chocolate dark:text-white hover:bg-accent-chocolate/5 transition-all duration-300 shadow-sm flex-shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Storefront</span>
        </Link>
      </header>
      {children}
    </>
  );
}
