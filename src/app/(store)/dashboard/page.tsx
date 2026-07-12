'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import MegaHeader from "@/components/shared/mega-header";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, 
  ArrowRight, 
  Check, 
  Clock, 
  Package, 
  Truck, 
  Smile, 
  LogOut, 
  Play, 
  CreditCard,
  Mail
} from "lucide-react";
import { Sacramento } from "next/font/google";

const sacramento = Sacramento({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  flavor: string | null;
}

interface PaymentStatus {
  status: string;
  method: string;
  amount: number;
}

interface DeliveryTracking {
  status: string;
  description: string | null;
}

interface Order {
  id: string;
  total: number;
  createdAt: string;
  items: OrderItem[];
  paymentStatus: PaymentStatus | null;
  deliveryTracking: DeliveryTracking | null;
}

interface User {
  userId: string;
  email: string;
  name: string;
  isAdmin?: boolean;
}

interface EventBooking {
  id: string;
  eventTitle: string;
  eventType: string;
  eventDate: string;
  name: string;
  seats: number;
  intakeNotes: string | null;
  ticketCode: string | null;
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [bookings, setBookings] = useState<EventBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [simulatingId, setSimulatingId] = useState<string | null>(null);

  async function checkSession() {
    try {
      const res = await fetch("/api/auth/session");
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
        fetchOrders();
      } else {
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
    }
  }

  // 1. Fetch current session on mount
  useEffect(() => {
    checkSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchOrders() {
    try {
      const res = await fetch("/api/dashboard/orders");
      const data = await res.json();
      if (data.orders) {
        setOrders(data.orders);
      }
      if (data.bookings) {
        setBookings(data.bookings);
      }
    } catch (e) {
      console.error("Failed to load dashboard data", e);
    } finally {
      setLoading(false);
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;
    setAuthLoading(true);
    setAuthError("");

    try {
      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      setUser(data.user);
      setLoading(true);
      fetchOrders();
    } catch (err: any) {
      setAuthError(err.message || "Something went wrong.");
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/session", { method: "DELETE" });
      setUser(null);
      setOrders([]);
    } catch (e) {
      console.error("Sign out failed", e);
    }
  };

  const handleSimulateStatus = async (orderId: string) => {
    setSimulatingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}/simulate`, {
        method: "POST",
      });
      const data = await res.json();

      if (res.ok && data.tracking) {
        // Update local orders state
        setOrders((prev) =>
          prev.map((order) => {
            if (order.id === orderId) {
              return {
                ...order,
                deliveryTracking: {
                  status: data.tracking.status,
                  description: data.tracking.description,
                },
                // If now delivered, update payment to PAID
                paymentStatus: order.paymentStatus
                  ? {
                      ...order.paymentStatus,
                      status: data.tracking.status === "DELIVERED" ? "PAID" : order.paymentStatus.status,
                    }
                  : null,
              };
            }
            return order;
          })
        );
      }
    } catch (e) {
      console.error("Simulation failed", e);
    } finally {
      setSimulatingId(null);
    }
  };

  const getStepClass = (currentStatus: string, step: string) => {
    const statuses = ["PENDING", "PREPARING", "SHIPPED", "DELIVERED"];
    const currentIndex = statuses.indexOf(currentStatus);
    const stepIndex = statuses.indexOf(step);

    if (stepIndex < currentIndex) {
      return "bg-green-500 text-white border-green-500"; // Passed
    }
    if (stepIndex === currentIndex) {
      return "bg-primary-pink text-white border-primary-pink ring-4 ring-primary-pink/20 scale-110"; // Active
    }
    return "bg-white/40 dark:bg-white/5 text-accent-chocolate/40 dark:text-bg-vanilla/30 border-accent-chocolate/10 dark:border-white/10"; // Upcoming
  };

  if (loading) {
    return (
      <div className="relative min-h-screen bg-[#fdfbf7] dark:bg-bg-vanilla-cream transition-colors duration-500 overflow-x-hidden font-sans flex flex-col justify-between">
        <MegaHeader />
        <div className="flex-grow flex items-center justify-center min-h-[400px] text-accent-chocolate dark:text-white font-serif mt-[120px]">
          Verifying secure session token...
        </div>
      </div>
    );
  }

  // Login Screen if not authenticated
  if (!user) {
    return (
      <div className="relative min-h-screen bg-[#fdfbf7] dark:bg-bg-vanilla-cream transition-colors duration-500 overflow-x-hidden font-sans flex flex-col justify-between">
        <MegaHeader />
        <div className="flex-grow flex items-center justify-center px-4 pt-[140px] pb-24 z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md glass-card border border-white/30 dark:border-white/10 p-8 rounded-3xl bg-white/20 dark:bg-white/5 shadow-xl text-left"
          >
            <div className="text-center mb-8">
              <span className={`${sacramento.className} text-4xl text-primary-pink-deep dark:text-primary-pink`}>
                Bespoke Orders
              </span>
              <h2 className="font-serif text-2xl font-bold tracking-tight text-accent-chocolate dark:text-white uppercase mt-1">
                Access Dashboard
              </h2>
              <p className="text-xs text-accent-chocolate-light dark:text-bg-vanilla/60 mt-3 font-normal">
                Enter your email address to securely access your active orders and real-time delivery status.
              </p>
            </div>

            {authError && (
              <div className="mb-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-400 text-xs font-semibold text-center">
                {authError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-accent-chocolate-light dark:text-bg-vanilla/60 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full bg-white/40 dark:bg-white/5 border border-accent-chocolate/10 dark:border-white/10 rounded-2xl pl-10 pr-4 py-3 text-sm text-accent-chocolate dark:text-white focus:outline-none focus:border-primary-pink transition-colors font-sans"
                  />
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-accent-chocolate-light/40" />
                </div>
              </div>
              <button
                type="submit"
                disabled={authLoading}
                className="glass-button w-full py-3.5 px-6 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 bg-primary-pink border-primary-pink text-white hover:bg-primary-pink-deep transition-all duration-300 shadow-md cursor-pointer disabled:opacity-50"
              >
                {authLoading ? "Authenticating..." : "Access Dashboard"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#fdfbf7] dark:bg-bg-vanilla-cream transition-colors duration-500 overflow-x-hidden font-sans flex flex-col">
      <MegaHeader />

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[140px] pb-24 flex-grow z-10">
        
        {/* Welcome Block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12 border-b border-accent-chocolate/5 pb-8">
          <div className="text-left">
            <span className={`${sacramento.className} text-4xl text-primary-pink-deep dark:text-primary-pink`}>
              Greetings, {user.name}
            </span>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-accent-chocolate dark:text-white uppercase mt-1">
              Your Sweet Portfolio
            </h1>
          </div>
          <div className="flex gap-2">
            {user.isAdmin && (
              <Link
                href="/admin"
                className="glass-button text-xs py-2.5 px-4 font-bold uppercase tracking-widest bg-primary-pink border-primary-pink text-white hover:bg-primary-pink-deep flex items-center gap-2 transition-all text-center"
              >
                Admin Panel
              </Link>
            )}
            <button
              onClick={handleSignOut}
              className="glass-button text-xs py-2.5 px-4 font-bold uppercase tracking-widest hover:bg-red-500/10 hover:text-red-500 border-red-500/20 text-accent-chocolate-light dark:text-bg-vanilla/60 flex items-center gap-2 cursor-pointer transition-all"
            >
              <LogOut className="w-4 h-4" /> Log Out
            </button>
          </div>
        </div>

        {/* Upcoming Events Section */}
        {bookings.length > 0 && (
          <div className="mb-12 max-w-4xl mx-auto space-y-6 text-left">
            <h2 className="font-serif text-xl font-bold tracking-tight text-accent-chocolate dark:text-white uppercase">
              Upcoming Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bookings.map((booking) => (
                <div 
                  key={booking.id}
                  className="glass-card border border-white/30 dark:border-white/10 rounded-3xl bg-white/20 dark:bg-white/5 p-6 shadow-md relative overflow-hidden flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-primary-pink-deep dark:text-primary-pink">
                        {booking.eventType}
                      </span>
                      <span className="text-[10px] font-semibold text-accent-chocolate-light dark:text-bg-vanilla/60 font-sans">
                        {booking.eventDate}
                      </span>
                    </div>
                    <h3 className="font-serif text-lg font-bold text-accent-chocolate dark:text-white leading-snug uppercase">
                      {booking.eventTitle}
                    </h3>
                    <p className="text-xs text-accent-chocolate-light dark:text-bg-vanilla/80 font-normal">
                      Reserved for <strong className="text-accent-chocolate dark:text-white font-bold">{booking.name}</strong> 
                      {booking.seats > 1 && ` (+${booking.seats - 1} seats)`}
                    </p>
                    {booking.intakeNotes && (
                      <div className="p-3 rounded-xl bg-accent-chocolate/5 dark:bg-white/5 border border-accent-chocolate/5 text-[11px] text-accent-chocolate-light dark:text-bg-vanilla-cream/70 leading-relaxed italic font-normal">
                        "{booking.intakeNotes}"
                      </div>
                    )}
                  </div>

                  {booking.ticketCode && (
                    <div className="border-t border-accent-chocolate/10 dark:border-white/10 pt-4 mt-4 flex items-center justify-between text-xs font-sans">
                      <span className="font-mono text-accent-chocolate dark:text-white font-bold tracking-wider">
                        Pass: {booking.ticketCode}
                      </span>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-green-600 dark:text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded">
                        Active Pass
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="text-center py-16 glass-card border border-white/30 dark:border-white/10 rounded-3xl bg-white/20 dark:bg-white/5 max-w-3xl mx-auto">
            <ShoppingBag className="w-12 h-12 stroke-[1.2] text-primary-pink/60 mx-auto mb-4" />
            <h2 className="font-serif text-xl font-bold text-accent-chocolate dark:text-white mb-2">
              No Orders Found
            </h2>
            <p className="text-xs text-accent-chocolate-light dark:text-bg-vanilla/60 max-w-md mx-auto mb-8 font-normal">
              You haven't commissioned any custom cakes or fine pastries yet. Browse our menu to begin!
            </p>
            <Link
              href="/shop"
              className="glass-button text-xs py-3.5 px-6 font-bold uppercase tracking-widest hover:bg-primary-pink hover:text-white transition-all duration-300 shadow-md inline-flex items-center gap-2"
            >
              Explore Creations
            </Link>
          </div>
        ) : (
          <div className="space-y-8 max-w-4xl mx-auto">
            {orders.map((order) => (
              <div 
                key={order.id}
                className="glass-card border border-white/30 dark:border-white/10 rounded-3xl bg-white/20 dark:bg-white/5 shadow-lg overflow-hidden"
              >
                {/* Order Top Summary Bar */}
                <div className="bg-accent-chocolate/5 dark:bg-white/5 px-6 py-4 border-b border-accent-chocolate/5 flex flex-wrap justify-between items-center gap-4 text-left">
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-accent-chocolate-light/60 dark:text-bg-vanilla/40 block">Order ID</span>
                    <span className="text-xs font-mono font-bold text-accent-chocolate dark:text-white">{order.id}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-accent-chocolate-light/60 dark:text-bg-vanilla/40 block">Commission Date</span>
                    <span className="text-xs font-bold text-accent-chocolate dark:text-white">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: 'numeric', month: 'long', day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-accent-chocolate-light/60 dark:text-bg-vanilla/40 block">Grand Total</span>
                    <span className="text-xs font-bold text-primary-pink-deep dark:text-primary-pink">${order.total}</span>
                  </div>
                  
                  {/* Real-time status simulation button */}
                  <button
                    onClick={() => handleSimulateStatus(order.id)}
                    disabled={simulatingId === order.id}
                    className="glass-button py-2 px-4 rounded-xl text-[10px] font-bold uppercase tracking-widest bg-primary-pink/10 hover:bg-primary-pink hover:text-white text-primary-pink-deep dark:text-primary-pink flex items-center gap-1.5 cursor-pointer transition-colors border-white/50"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    {simulatingId === order.id ? "Updating..." : "Advance Status"}
                  </button>
                </div>

                {/* Tracking Stepper */}
                {order.deliveryTracking && (
                  <div className="p-6 sm:p-8 border-b border-accent-chocolate/5">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-6 sm:gap-4 relative mb-6">
                      
                      {/* Connection lines (desktop only) */}
                      <div className="hidden sm:block absolute left-8 right-8 top-1/2 -translate-y-1/2 h-0.5 bg-accent-chocolate/10 dark:bg-white/10 z-0" />
                      
                      {/* Step 1: PENDING */}
                      <div className="flex flex-col items-center gap-2 z-10 text-center">
                        <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold transition-all duration-300 ${getStepClass(order.deliveryTracking.status, "PENDING")}`}>
                          <Clock className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-accent-chocolate dark:text-white">Placed</span>
                      </div>

                      {/* Step 2: PREPARING */}
                      <div className="flex flex-col items-center gap-2 z-10 text-center">
                        <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold transition-all duration-300 ${getStepClass(order.deliveryTracking.status, "PREPARING")}`}>
                          <Package className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-accent-chocolate dark:text-white">Baking</span>
                      </div>

                      {/* Step 3: SHIPPED */}
                      <div className="flex flex-col items-center gap-2 z-10 text-center">
                        <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold transition-all duration-300 ${getStepClass(order.deliveryTracking.status, "SHIPPED")}`}>
                          <Truck className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-accent-chocolate dark:text-white">Shipped</span>
                      </div>

                      {/* Step 4: DELIVERED */}
                      <div className="flex flex-col items-center gap-2 z-10 text-center">
                        <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold transition-all duration-300 ${getStepClass(order.deliveryTracking.status, "DELIVERED")}`}>
                          <Smile className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-accent-chocolate dark:text-white">Delivered</span>
                      </div>
                    </div>

                    {/* Status Description Info Box */}
                    <div className="p-4 rounded-2xl bg-primary-pink/5 border border-primary-pink/10 text-left">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-primary-pink-deep dark:text-primary-pink block mb-1">Status Update</span>
                      <p className="text-xs text-accent-chocolate-light dark:text-bg-vanilla-cream/90 font-normal leading-relaxed">
                        {order.deliveryTracking.description}
                      </p>
                    </div>
                  </div>
                )}

                {/* Items & Payment Info */}
                <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 text-left">
                  
                  {/* Items list (7 columns) */}
                  <div className="md:col-span-8 space-y-4">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-accent-chocolate-light/80 dark:text-bg-vanilla/60 mb-2">Items Commissioned</h3>
                    <div className="divide-y divide-accent-chocolate/5 dark:divide-white/5 space-y-3">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center pt-3 first:pt-0">
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-accent-chocolate dark:text-white">{item.name}</span>
                            <span className="text-[9px] text-accent-chocolate-light/80 dark:text-bg-vanilla/60 mt-0.5">
                              Qty: {item.quantity} | Flavor: {item.flavor || "Standard"}
                            </span>
                          </div>
                          <span className="text-xs font-bold text-accent-chocolate dark:text-white">${item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payment Details (4 columns offset) */}
                  <div className="md:col-span-4 bg-accent-chocolate/5 dark:bg-white/5 p-5 rounded-2xl border border-accent-chocolate/5 flex flex-col justify-between">
                    <div>
                      <h3 className="text-[9px] font-bold uppercase tracking-widest text-accent-chocolate-light/80 dark:text-bg-vanilla/60 mb-3 flex items-center gap-1">
                        <CreditCard className="w-3.5 h-3.5" />
                        Billing Details
                      </h3>
                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between text-accent-chocolate-light dark:text-bg-vanilla/80">
                          <span>Method</span>
                          <span className="font-semibold uppercase text-accent-chocolate dark:text-white">{order.paymentStatus?.method}</span>
                        </div>
                        <div className="flex justify-between text-accent-chocolate-light dark:text-bg-vanilla/80">
                          <span>Status</span>
                          <span className={`font-semibold px-2 py-0.5 rounded text-[10px] ${
                            order.paymentStatus?.status === "PAID"
                              ? "bg-green-500/10 text-green-700 dark:text-green-400"
                              : "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
                          }`}>
                            {order.paymentStatus?.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="border-t border-accent-chocolate/5 dark:border-white/5 pt-3 mt-4 flex justify-between font-bold text-xs text-accent-chocolate dark:text-white">
                      <span>Grand Total</span>
                      <span className="text-primary-pink-deep dark:text-primary-pink">${order.total}</span>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}
