'use client';

import React from "react";
import { Sacramento } from "next/font/google";
import MegaHeader from "@/components/shared/mega-header";
import { ShieldCheck } from "lucide-react";

const sacramento = Sacramento({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export default function PoliciesPage() {
  const policies = [
    {
      title: "1. Booking & Payment Terms",
      content: "All orders require a 50% non-refundable deposit to secure the cake artist's calendar. Balance payment must be settled at least 14 days before delivery. We accept online card transactions, bank transfers, and Cash on Delivery (COD) for eligible totals."
    },
    {
      title: "2. Cancellation & Modifications",
      content: "Modifications to cake flavors, tiers, or core aesthetic details must be requested up to 21 days before delivery. Cancellations made within 14 days of the scheduled delivery date are non-refundable and not eligible for store credits."
    },
    {
      title: "3. Ingredient Quality & Allergies",
      content: "We source organic, fresh farm-to-table dairy and natural botanicals. While we maintain a highly sanitized studio environment, our products are prepared in a kitchen that handles nuts, dairy, wheat, and eggs. Customers must note all critical dietary restrictions during booking consultation."
    },
    {
      title: "4. Damage Limitation & Transportation",
      content: "We provide secure delivery and setup at the chosen venue. Once the cake has been accepted at the venue, Cake By Lochi accepts no liability for layout damage resulting from high heat, humidity, unstable table surfaces, or customer transport."
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#fdfbf7] dark:bg-bg-vanilla-cream transition-colors duration-500 overflow-x-hidden font-sans flex flex-col justify-between">
      <MegaHeader />
      
      <main className="w-full pt-[120px] px-6 md:px-12 flex flex-col items-center flex-grow">
        <section className="relative w-full max-w-4xl py-16 flex flex-col gap-12 text-left">
          
          <div className="text-center flex flex-col items-center gap-2">
            <span className={`${sacramento.className} text-4xl text-primary-pink-deep dark:text-primary-pink`}>
              Client Protection
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-accent-chocolate dark:text-white uppercase mt-1">
              Studio Policies
            </h1>
            <span className="w-12 h-0.5 bg-primary-pink/40 mt-3" />
          </div>

          <div className="flex flex-col gap-6">
            {policies.map((policy, index) => (
              <div 
                key={index} 
                className="bg-white/40 dark:bg-white/5 border border-white/30 dark:border-white/10 rounded-[2.5rem] p-6 sm:p-8 shadow-sm backdrop-blur-sm"
              >
                <h3 className="font-serif text-base sm:text-lg font-bold text-accent-chocolate dark:text-white flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-primary-pink-deep dark:text-primary-pink shrink-0 mt-0.5" />
                  <span>{policy.title}</span>
                </h3>
                <p className="text-xs sm:text-sm text-accent-chocolate-light dark:text-slate-300 leading-relaxed mt-3 pl-8 font-normal">
                  {policy.content}
                </p>
              </div>
            ))}
          </div>

        </section>
      </main>
    </div>
  );
}
