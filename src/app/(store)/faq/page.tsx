'use client';

import React from "react";
import { Sacramento } from "next/font/google";
import MegaHeader from "@/components/shared/mega-header";
import { HelpCircle } from "lucide-react";

const sacramento = Sacramento({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export default function FAQPage() {
  const faqs = [
    {
      q: "How do I place an order for a custom cake?",
      a: "You can place an order by contacting Chef Lochi directly through our bespoke studio inquiry form, or by exploring our product catalog and selecting your preferred cake styling options. We recommend ordering at least 14 days in advance to secure your event date."
    },
    {
      q: "What are your delivery options and timelines?",
      a: "We offer professional, delivery and structural setup for all custom and multi-tiered bakes in Colombo and surrounding suburbs. Delivery fees are calculated based on your event location. Delivery timings are scheduled with the venue coordinator to ensure perfect presentation."
    },
    {
      q: "Can I modify my cake decoration or flavor profile after booking?",
      a: "Yes, you can request changes to your custom design details or flavor options up to 21 days before the scheduled delivery date. Unfortunately, we cannot accept any modifications within 14 days of your event as our pastry team begins custom sourcing and early stage preparations."
    },
    {
      q: "Do you offer organic or custom dietary options?",
      a: "Yes! We take absolute pride in baking with organic, premium ingredients. We also offer curated dietary selections (such as vegan, gluten-free, or reduced-sugar bakes) that do not compromise on structural elegance or rich flavor profile quality."
    },
    {
      q: "What is your cancellation and refund policy?",
      a: "All custom design orders require a 50% non-refundable deposit to secure your booking date. Cancellations made more than 14 days before delivery will forfeit the deposit but require no further payment. Cancellations within 14 days of delivery are not eligible for refunds or store credits."
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#fdfbf7] dark:bg-bg-vanilla-cream transition-colors duration-500 overflow-x-hidden font-sans flex flex-col justify-between">
      <MegaHeader />
      
      <main className="w-full pt-[120px] px-6 md:px-12 flex flex-col items-center flex-grow">
        <section className="relative w-full max-w-4xl py-16 flex flex-col gap-12 text-left">
          
          <div className="text-center flex flex-col items-center gap-2">
            <span className={`${sacramento.className} text-4xl text-primary-pink-deep dark:text-primary-pink`}>
              Client Services
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-accent-chocolate dark:text-white uppercase mt-1">
              Frequently Asked Questions
            </h1>
            <span className="w-12 h-0.5 bg-primary-pink/40 mt-3" />
          </div>

          <div className="flex flex-col gap-6">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="bg-white/40 dark:bg-white/5 border border-white/30 dark:border-white/10 rounded-[2.5rem] p-6 sm:p-8 shadow-sm backdrop-blur-sm"
              >
                <h3 className="font-serif text-base sm:text-lg font-bold text-accent-chocolate dark:text-white flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-primary-pink-deep dark:text-primary-pink shrink-0 mt-0.5" />
                  <span>{faq.q}</span>
                </h3>
                <p className="text-xs sm:text-sm text-accent-chocolate-light dark:text-slate-300 leading-relaxed mt-3 pl-8 font-normal">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>

        </section>
      </main>
    </div>
  );
}
