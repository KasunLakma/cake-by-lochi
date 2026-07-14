'use client';

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/cart-context";
import MegaHeader from "@/components/shared/mega-header";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ShoppingBag, CreditCard, DollarSign, Calendar, Lock } from "lucide-react";
import { Sacramento } from "next/font/google";

const sacramento = Sacramento({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

type PaymentMethod = "COD" | "CARD" | "KOKO";

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, cartSubtotal, clearCart } = useCart();

  // Form states
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  // Payment State Machine Choice
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD");

  // Card placeholder states
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const deliveryFee = cartSubtotal > 0 ? 4500 : 0;
  const grandTotal = cartSubtotal + deliveryFee;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      setError("Your shopping bag is empty.");
      return;
    }
    if (!email || !name || !address || !phone) {
      setError("Please complete all customer details.");
      return;
    }

    if (paymentMethod === "CARD") {
      if (!cardName || !cardNumber || !cardExpiry || !cardCvv) {
        setError("Please complete card credentials.");
        return;
      }
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          address,
          phone,
          paymentMethod,
          cartItems,
          total: grandTotal,
          cardDetails: paymentMethod === "CARD" ? { cardName, cardNumber, cardExpiry } : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      // Success: Clear cart and redirect
      clearCart();
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to create order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#fdfbf7] dark:bg-bg-vanilla-cream transition-colors duration-500 overflow-x-hidden font-sans flex flex-col">
      <MegaHeader />

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[140px] pb-24 flex-grow z-10">
        
        {/* Checkout Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className={`${sacramento.className} text-4xl text-primary-pink-deep dark:text-primary-pink`}>
            Order Customization
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-accent-chocolate dark:text-white uppercase mt-1">
            Secure Checkout
          </h1>
          <span className="w-12 h-0.5 bg-primary-pink/40 mt-3 block mx-auto" />
        </div>

        {error && (
          <div className="max-w-4xl mx-auto mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-400 text-xs font-semibold text-center">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 max-w-5xl mx-auto">
          
          {/* Left Side: Forms (7 columns) */}
          <form onSubmit={handleCheckout} className="lg:col-span-7 space-y-8">
            
            {/* Step 1: Customer Details */}
            <div className="glass-card border border-white/30 dark:border-white/10 p-6 sm:p-8 rounded-3xl bg-white/20 dark:bg-white/5 shadow-md text-left">
              <h2 className="font-serif text-xl font-bold text-accent-chocolate dark:text-white uppercase mb-6 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary-pink text-white flex items-center justify-center text-xs font-bold font-sans">1</span>
                Customer Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-accent-chocolate-light dark:text-slate-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="guest@example.com"
                    className="w-full bg-white/40 dark:bg-white/5 border border-accent-chocolate/10 dark:border-white/10 rounded-2xl px-4 py-3.5 text-sm text-accent-chocolate dark:text-white placeholder:text-accent-chocolate-light/40 focus:outline-none focus:border-primary-pink transition-colors font-sans"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-accent-chocolate-light dark:text-slate-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Genevieve Sterling"
                    className="w-full bg-white/40 dark:bg-white/5 border border-accent-chocolate/10 dark:border-white/10 rounded-2xl px-4 py-3.5 text-sm text-accent-chocolate dark:text-white placeholder:text-accent-chocolate-light/40 focus:outline-none focus:border-primary-pink transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-accent-chocolate-light dark:text-slate-300 mb-2">
                    Shipping Address
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="42 Golden Crescent, Colombo"
                    className="w-full bg-white/40 dark:bg-white/5 border border-accent-chocolate/10 dark:border-white/10 rounded-2xl px-4 py-3.5 text-sm text-accent-chocolate dark:text-white placeholder:text-accent-chocolate-light/40 focus:outline-none focus:border-primary-pink transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-accent-chocolate-light dark:text-slate-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+94 77 123 4567"
                    className="w-full bg-white/40 dark:bg-white/5 border border-accent-chocolate/10 dark:border-white/10 rounded-2xl px-4 py-3.5 text-sm text-accent-chocolate dark:text-white placeholder:text-accent-chocolate-light/40 focus:outline-none focus:border-primary-pink transition-colors font-sans"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Payment Selection State Machine */}
            <div className="glass-card border border-white/30 dark:border-white/10 p-6 sm:p-8 rounded-3xl bg-white/20 dark:bg-white/5 shadow-md text-left">
              <h2 className="font-serif text-xl font-bold text-accent-chocolate dark:text-white uppercase mb-6 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary-pink text-white flex items-center justify-center text-xs font-bold font-sans">2</span>
                Payment Choice
              </h2>
              
              {/* Tabs State Switcher */}
              <div className="grid grid-cols-3 gap-2 bg-accent-chocolate/5 dark:bg-white/5 p-1 rounded-2xl border border-accent-chocolate/5 mb-6">
                {(["COD", "CARD", "KOKO"] as PaymentMethod[]).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`py-3 px-2 rounded-xl text-center text-xs font-bold transition-all cursor-pointer ${
                      paymentMethod === method
                        ? "bg-accent-chocolate text-white dark:bg-primary-pink dark:text-white shadow-sm"
                        : "text-accent-chocolate-light dark:text-slate-300 hover:bg-white/30 dark:hover:bg-white/5"
                    }`}
                  >
                    {method === "COD" ? "Cash" : method === "CARD" ? "Card" : "Koko Pay"}
                  </button>
                ))}
              </div>

              {/* State Machine Content Viewer */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={paymentMethod}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4 min-h-[160px] flex flex-col justify-center"
                >
                  {paymentMethod === "COD" && (
                    <div className="p-5 rounded-2xl bg-primary-pink/5 border border-primary-pink/10 flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-primary-pink-deep dark:text-primary-pink">
                        <DollarSign className="w-5 h-5" />
                        <span className="text-xs font-bold uppercase tracking-wider">Cash on Delivery (COD)</span>
                      </div>
                      <p className="text-xs text-accent-chocolate-light dark:text-slate-200 leading-relaxed font-normal">
                        Pay with cash upon receipt. Perfect for local Colombo residents. A culinary courier will hand over your fresh artisan bake directly at your doorstep.
                      </p>
                    </div>
                  )}

                  {paymentMethod === "CARD" && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-primary-pink-deep dark:text-primary-pink mb-2">
                        <CreditCard className="w-5 h-5" />
                        <span className="text-xs font-bold uppercase tracking-wider">Credit or Debit Card</span>
                      </div>
                      <div>
                        <input
                          type="text"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          placeholder="Cardholder Name"
                          className="w-full bg-white/40 dark:bg-white/5 border border-accent-chocolate/10 dark:border-white/10 rounded-2xl px-4 py-2.5 text-xs text-accent-chocolate dark:text-white placeholder:text-accent-chocolate-light/40 focus:outline-none focus:border-primary-pink transition-colors"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="Card Number (4000 1234 5678 9010)"
                          className="w-full bg-white/40 dark:bg-white/5 border border-accent-chocolate/10 dark:border-white/10 rounded-2xl px-4 py-2.5 text-xs text-accent-chocolate dark:text-white placeholder:text-accent-chocolate-light/40 focus:outline-none focus:border-primary-pink transition-colors font-sans"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full bg-white/40 dark:bg-white/5 border border-accent-chocolate/10 dark:border-white/10 rounded-2xl px-4 py-2.5 text-xs text-accent-chocolate dark:text-white placeholder:text-accent-chocolate-light/40 focus:outline-none focus:border-primary-pink transition-colors font-sans"
                        />
                        <input
                          type="password"
                          maxLength={4}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="CVV"
                          className="w-full bg-white/40 dark:bg-white/5 border border-accent-chocolate/10 dark:border-white/10 rounded-2xl px-4 py-2.5 text-xs text-accent-chocolate dark:text-white placeholder:text-accent-chocolate-light/40 focus:outline-none focus:border-primary-pink transition-colors font-sans"
                        />
                      </div>
                      <div className="flex items-center gap-1.5 text-[9px] text-accent-chocolate-light/75 dark:text-slate-400 mt-2">
                        <Lock className="w-3 h-3 text-gold-accent" />
                        Fully encrypted bank-grade checkout gateway simulation.
                      </div>
                    </div>
                  )}

                  {paymentMethod === "KOKO" && (
                    <div className="p-5 rounded-2xl bg-yellow-500/5 border border-yellow-500/10 flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                        <Calendar className="w-5 h-5" />
                        <span className="text-xs font-bold uppercase tracking-wider">Koko Buy Now Pay Later (BNPL)</span>
                      </div>
                      <p className="text-xs text-accent-chocolate-light dark:text-slate-200 leading-relaxed font-normal">
                        Split this transaction into 3 interest-free monthly installments of <strong className="text-yellow-600 dark:text-yellow-400">Rs. {Math.round(grandTotal / 3).toLocaleString()}</strong>. 
                        Your order is processed instantly and baked for your event immediately.
                      </p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || cartItems.length === 0}
              className="glass-button w-full py-4 px-6 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 bg-primary-pink border-primary-pink text-white hover:bg-primary-pink-deep transition-all duration-300 shadow-md cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                "Processing Order..."
              ) : (
                <>
                  Complete Order (Rs. {grandTotal.toLocaleString()})
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Right Side: Order Summary (5 columns) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-card border border-white/30 dark:border-white/10 p-6 sm:p-8 rounded-3xl bg-white/20 dark:bg-white/5 shadow-md text-left sticky top-[140px]">
              <h2 className="font-serif text-xl font-bold text-accent-chocolate dark:text-white uppercase mb-6 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary-pink" />
                Your Bag
              </h2>

              {/* Items List */}
              <div className="divide-y divide-accent-chocolate/5 dark:divide-white/5 max-h-[300px] overflow-y-auto pr-2 flex flex-col gap-4">
                {cartItems.length === 0 ? (
                  <p className="text-xs text-accent-chocolate-light/80 dark:text-slate-300 py-4 font-normal">
                    No items in bag.
                  </p>
                ) : (
                  cartItems.map((item) => (
                    <div key={`${item.id}-${item.flavor}`} className="flex gap-4 items-center pt-4 first:pt-0">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-accent-chocolate/5">
                        <Image src={item.image || "/cake_hero_main.png"} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-grow flex flex-col">
                        <span className="text-xs font-bold text-accent-chocolate dark:text-white leading-snug">{item.name}</span>
                        <span className="text-[9px] text-accent-chocolate-light/80 dark:text-slate-300">
                          Qty: {item.quantity} | Flavor: {item.flavor}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-accent-chocolate dark:text-white">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))
                )}
              </div>

              {/* Bills Calculations */}
              <div className="border-t border-accent-chocolate/10 dark:border-white/10 pt-4 mt-6 space-y-2">
                <div className="flex justify-between text-xs text-accent-chocolate-light dark:text-slate-200">
                  <span>Cart Subtotal</span>
                  <span>Rs. {cartSubtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-accent-chocolate-light dark:text-slate-200">
                  <span>Delivery Charges</span>
                  <span>Rs. {deliveryFee.toLocaleString()}</span>
                </div>
                <div className="border-t border-accent-chocolate/5 dark:border-white/5 pt-2 mt-2 flex justify-between font-bold text-sm text-accent-chocolate dark:text-white">
                  <span>Grand Total</span>
                  <span className="text-primary-pink-deep dark:text-primary-pink">Rs. {grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
