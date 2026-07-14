'use client';

import React from "react";
import { Sacramento } from "next/font/google";
import MegaHeader from "@/components/shared/mega-header";

const sacramento = Sacramento({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export default function TermsPage() {
  return (
    <div className="relative min-h-screen bg-[#fdfbf7] dark:bg-bg-vanilla-cream transition-colors duration-500 overflow-x-hidden font-sans">
      <MegaHeader />
      
      <main className="w-full pt-[120px] px-6 md:px-12 flex flex-col items-center">
        <section className="relative w-full max-w-4xl py-16 flex flex-col gap-12 text-left">
          
          <div className="text-center flex flex-col items-center gap-2">
            <span className={`${sacramento.className} text-4xl text-primary-pink-deep dark:text-primary-pink`}>
              Legalities
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-accent-chocolate dark:text-white uppercase mt-1">
              Terms & Conditions
            </h1>
            <span className="w-12 h-0.5 bg-primary-pink/40 mt-3" />
          </div>

          <div className="flex flex-col gap-8 text-accent-chocolate dark:text-white">
            <div className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-accent-chocolate dark:text-white">1. Order Placement & Deposits</h2>
              <p className="text-xs sm:text-sm leading-relaxed text-accent-chocolate-light dark:text-slate-300">
                All custom cake requests require a 50% non-refundable deposit to secure the event date on our calendar. The remaining balance must be paid in full at least 14 days prior to the scheduled delivery or pickup date.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-accent-chocolate dark:text-white">2. Cancellations & Modifications</h2>
              <p className="text-xs sm:text-sm leading-relaxed text-accent-chocolate-light dark:text-slate-300">
                Modifications to custom designs can be requested up to 21 days before the event. Cancellations made within 14 days of the delivery date are not eligible for refunds or store credits, as custom preparation and ingredient sourcing begins early.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-accent-chocolate dark:text-white">3. Delivery & Setup Care</h2>
              <p className="text-xs sm:text-sm leading-relaxed text-accent-chocolate-light dark:text-slate-300">
                We offer professional white-glove delivery and structural setup for all multi-tiered wedding cakes. Once set up and approved at the venue, Cake By Lochi is not responsible for any subsequent damage caused by temperature issues, unstable tables, or improper handling.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-accent-chocolate dark:text-white">4. Cake Storage & Servings</h2>
              <p className="text-xs sm:text-sm leading-relaxed text-accent-chocolate-light dark:text-slate-300">
                Bespoke buttercream and fondant cakes should be stored in a cool, air-conditioned environment prior to serving. Avoid direct sunlight or high humidity. Any structural supports or internal dowels must be removed before slicing.
              </p>
            </div>
          </div>

        </section>
      </main>
    </div>
  );
}
