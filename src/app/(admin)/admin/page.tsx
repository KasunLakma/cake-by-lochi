'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sacramento } from "next/font/google";
import { 
  BarChart2, 
  ShoppingBag, 
  Users, 
  Database, 
  Plus, 
  Edit3, 
  Trash2, 
  Truck, 
  ShieldAlert, 
  UploadCloud, 
  ArrowRight,
  TrendingUp
} from "lucide-react";

const sacramento = Sacramento({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

type TabType = "ANALYTICS" | "PRODUCTS" | "ORDERS" | "ACCESS";

interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  priceNumber: number;
  description: string;
  image: string;
  flavors: string;
  badge: string | null;
}

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  flavor: string | null;
}

interface Order {
  id: string;
  total: number;
  createdAt: string;
  user: {
    email: string;
    name: string | null;
  };
  items: OrderItem[];
  paymentStatus: { status: string; method: string } | null;
  deliveryTracking: { status: string; description: string | null } | null;
}

interface User {
  id: string;
  email: string;
  name: string | null;
  isAdmin: boolean;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isAdminUser, setIsAdminUser] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("ANALYTICS");
  const [loading, setLoading] = useState(true);

  // Analytics Metrics
  const [metrics, setMetrics] = useState({
    totalStock: 0,
    totalItemsSold: 0,
    totalRevenue: 0,
    recentBuyersCount: 0
  });
  const [revenueData, setRevenueData] = useState<{ date: string; amount: number }[]>([]);

  // Entities lists
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // CRUD product form states
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState({
    name: "",
    category: "Celebration Cakes",
    price: "",
    priceNumber: "",
    description: "",
    image: "",
    flavors: "",
    badge: ""
  });
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Access Control states
  const [adminEmailInput, setAdminEmailInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginError, setLoginError] = useState("");
  const [submittingLogin, setSubmittingLogin] = useState(false);

  async function checkAdminAuth() {
    try {
      const res = await fetch("/api/auth/session");
      const data = await res.json();
      if (data.user && data.user.isAdmin) {
        setIsAdminUser(true);
        fetchAdminData();
      } else {
        setIsAdminUser(false);
        setLoading(false);
      }
    } catch (e) {
      setIsAdminUser(false);
      setLoading(false);
    }
  }

  useEffect(() => {
    checkAdminAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setSubmittingLogin(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAdminUser(true);
        fetchAdminData();
      } else {
        setLoginError(data.error || "Access Denied. This terminal is strictly reserved for authorized administrators only.");
      }
    } catch (err) {
      setLoginError("Access Denied. This terminal is strictly reserved for authorized administrators only.");
    } finally {
      setSubmittingLogin(false);
    }
  };

  async function fetchAdminData() {
    try {
      setErrorMsg("");
      const res = await fetch("/api/admin/analytics");
      const data = await res.json();
      if (data.success) {
        setMetrics(data.metrics);
        setRevenueData(data.revenueData);
        setOrders(data.orders);
        setUsers(data.users);
      }

      const prodRes = await fetch("/api/admin/products");
      const prodData = await prodRes.json();
      if (prodData.success) {
        setProducts(prodData.products);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Failed to load administration data");
    } finally {
      setLoading(false);
    }
  }

  // Image upload
  const handleImageFile = async (file: File) => {
    setUploadingImage(true);
    setErrorMsg("");

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProductForm(prev => ({ ...prev, image: base64String }));
        setSuccessMsg("Image processed successfully!");
        setUploadingImage(false);
      };
      reader.onerror = () => {
        setErrorMsg("Failed to read file contents");
        setUploadingImage(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to process image asset");
      setUploadingImage(false);
    }
  };

  // Drag & Drop event list
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const onDragLeave = () => {
    setIsDragOver(false);
  };
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  };

  // Add or Edit Product Submit
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const payload = {
      ...productForm,
      price: productForm.price || `Rs. ${parseFloat(productForm.priceNumber).toLocaleString()}`,
      priceNumber: parseFloat(productForm.priceNumber)
    };

    try {
      const url = "/api/admin/products";
      const method = isEditing ? "PUT" : "POST";
      const body = isEditing ? { ...payload, id: editingId } : payload;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(isEditing ? "Product updated!" : "Product added!");
        resetProductForm();
        fetchAdminData();
      } else {
        throw new Error(data.error || "Save failed");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to save product entity");
    }
  };

  const handleEditProductClick = (prod: Product) => {
    setIsEditing(true);
    setEditingId(prod.id);
    setProductForm({
      name: prod.name,
      category: prod.category,
      price: prod.price,
      priceNumber: String(prod.priceNumber),
      description: prod.description,
      image: prod.image,
      flavors: prod.flavors,
      badge: prod.badge || ""
    });
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch(`/api/admin/products?id=${id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg("Product deleted successfully");
        fetchAdminData();
      } else {
        throw new Error(data.error || "Delete failed");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to delete product");
    }
  };

  const resetProductForm = () => {
    setIsEditing(false);
    setEditingId(null);
    setProductForm({
      name: "",
      category: "Celebration Cakes",
      price: "",
      priceNumber: "",
      description: "",
      image: "",
      flavors: "",
      badge: ""
    });
  };

  // Approve delivery
  const handleApproveDelivery = async (id: string) => {
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch(`/api/admin/orders/${id}/approve`, {
        method: "POST"
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg("Delivery dispatched and approved!");
        fetchAdminData();
      } else {
        throw new Error(data.error || "Approval failed");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to approve order delivery");
    }
  };

  // Access Roles Toggle/Save
  const handleRegisterAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmailInput) return;
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/admin/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: adminEmailInput, isAdmin: true })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`Email ${adminEmailInput} granted administrative privileges.`);
        setAdminEmailInput("");
        fetchAdminData();
      } else {
        throw new Error(data.error || "Permission assign failed");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to register secondary admin profile");
    }
  };

  const handleRevokeAdmin = async (email: string) => {
    if (!confirm(`Revoke administrative access from ${email}?`)) return;
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/admin/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, isAdmin: false })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`Revoked administrative access from ${email}`);
        fetchAdminData();
      } else {
        throw new Error(data.error || "Revoke failed");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to revoke permissions");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdfbf7] dark:bg-bg-vanilla-cream">
        <span className="text-xs uppercase tracking-widest text-accent-chocolate dark:text-white animate-pulse">
          Retrieving secure administration tunnel...
        </span>
      </div>
    );
  }

  if (isAdminUser === false) {
    return (
      <div className="relative min-h-screen bg-[#fdfbf7] dark:bg-bg-vanilla-cream transition-colors duration-500 overflow-x-hidden font-sans flex flex-col justify-between">
        
        <main className="w-full max-w-md mx-auto px-6 pt-[180px] pb-24 flex-grow z-10 flex flex-col justify-center">
          <div className="glass-card border border-white/30 dark:border-white/10 p-8 rounded-3xl bg-white/20 dark:bg-white/5 shadow-2xl text-left">
            <div className="text-center mb-6">
              <span className={`${sacramento.className} text-4xl text-primary-pink-deep dark:text-primary-pink`}>
                Administrative Port
              </span>
              <h1 className="font-serif text-2xl font-bold tracking-tight text-accent-chocolate dark:text-white uppercase mt-1">
                Workshop Access
              </h1>
              <p className="text-xs text-accent-chocolate-light dark:text-bg-vanilla/60 mt-2 font-normal leading-relaxed">
                Please authenticate using your verified administrator credentials.
              </p>
            </div>

            <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-accent-chocolate-light dark:text-bg-vanilla/60 mb-2">
                  Admin Email Address
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@cakebylochi.com"
                  className="w-full bg-white/40 dark:bg-white/5 border border-accent-chocolate/10 dark:border-white/10 rounded-xl px-4 py-3.5 text-xs text-accent-chocolate dark:text-white focus:outline-none focus:border-primary-pink transition-colors font-sans"
                />
                {loginError && (
                  <p className="mt-2 text-xs text-red-600 dark:text-red-400 font-bold leading-normal">
                    {loginError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={submittingLogin}
                className="glass-button w-full py-3.5 px-6 font-bold uppercase tracking-widest text-[9px] flex items-center justify-center gap-2 bg-primary-pink border-primary-pink text-white hover:bg-primary-pink-deep transition-all duration-300 shadow-md cursor-pointer disabled:opacity-50"
              >
                {submittingLogin ? "Authenticating..." : "Authenticate Credentials"}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#fdfbf7] dark:bg-bg-vanilla-cream transition-colors duration-500 overflow-x-hidden font-sans flex flex-col justify-between">

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[140px] pb-24 flex-grow z-10">
        
        {/* Title Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-accent-chocolate/5 pb-6">
          <div className="text-left">
            <span className={`${sacramento.className} text-4xl text-primary-pink-deep dark:text-primary-pink`}>
              Administrative Console
            </span>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-accent-chocolate dark:text-white uppercase mt-1">
              Chef Lochi's Workshop
            </h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <TabButton active={activeTab === "ANALYTICS"} label="Analytics" icon={<BarChart2 className="w-4 h-4" />} onClick={() => setActiveTab("ANALYTICS")} />
            <TabButton active={activeTab === "PRODUCTS"} label="Products CRUD" icon={<Database className="w-4 h-4" />} onClick={() => setActiveTab("PRODUCTS")} />
            <TabButton active={activeTab === "ORDERS"} label="Incoming Orders" icon={<Truck className="w-4 h-4" />} onClick={() => setActiveTab("ORDERS")} />
            <TabButton active={activeTab === "ACCESS"} label="Access Control" icon={<ShieldAlert className="w-4 h-4" />} onClick={() => setActiveTab("ACCESS")} />
          </div>
        </div>

        {/* Messaging Logs */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-400 text-xs font-semibold text-center">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400 text-xs font-semibold text-center animate-pulse">
            {successMsg}
          </div>
        )}

        {/* Tab 1: Analytics Telemetry */}
        {activeTab === "ANALYTICS" && (
          <div className="space-y-8">
            {/* Grid Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
              <MetricCard label="Total Stock Catalog" value={metrics.totalStock} icon={<Database className="w-5 h-5" />} />
              <MetricCard label="Artisan Tiers Sold" value={metrics.totalItemsSold} icon={<ShoppingBag className="w-5 h-5" />} />
              <MetricCard label="Total Revenue" value={`Rs. ${metrics.totalRevenue.toLocaleString()}`} icon={<TrendingUp className="w-5 h-5 text-green-600" />} />
              <MetricCard label="Registered Customers" value={metrics.recentBuyersCount} icon={<Users className="w-5 h-5" />} />
            </div>

            {/* Dynamic Telemetry Graph */}
            <div className="glass-card border border-white/30 dark:border-white/10 p-6 sm:p-8 rounded-[2rem] bg-white/20 dark:bg-white/5 shadow-lg text-left">
              <h2 className="font-serif text-lg font-bold text-accent-chocolate dark:text-white uppercase mb-6 flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-primary-pink" />
                Revenue Analytics (Last 7 Transaction Days)
              </h2>
              
              {/* Responsive custom graph representation using dynamic CSS flex-boxes */}
              {revenueData.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-xs text-accent-chocolate-light/60">
                  No live transactional logs mapped yet.
                </div>
              ) : (
                <div className="h-64 flex items-end gap-3 md:gap-6 border-b border-accent-chocolate/10 dark:border-white/10 pb-2">
                  {revenueData.map((data, idx) => {
                    const maxAmount = Math.max(...revenueData.map(d => d.amount), 1);
                    const percentage = (data.amount / maxAmount) * 100;
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                        <div className="text-[10px] font-bold text-primary-pink-deep dark:text-primary-pink opacity-0 group-hover:opacity-100 transition-opacity">
                          Rs. {data.amount.toLocaleString()}
                        </div>
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${percentage}%` }}
                          transition={{ delay: idx * 0.05, duration: 0.5 }}
                          className="w-full bg-gradient-to-t from-primary-pink-deep to-primary-pink dark:from-primary-pink dark:to-primary-pink-soft rounded-t-lg shadow-md"
                        />
                        <span className="text-[9px] font-bold text-accent-chocolate-light/80 dark:text-bg-vanilla/60 font-sans tracking-wide">
                          {data.date}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Products CRUD Management */}
        {activeTab === "PRODUCTS" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
            {/* Form Column (5 Tiers) */}
            <div className="lg:col-span-5">
              <div className="glass-card border border-white/30 dark:border-white/10 p-6 sm:p-8 rounded-3xl bg-white/20 dark:bg-white/5 shadow-md">
                <h2 className="font-serif text-lg font-bold text-accent-chocolate dark:text-white uppercase mb-6">
                  {isEditing ? "Modify Product Details" : "Add New Artisan Product"}
                </h2>
                
                <form onSubmit={handleProductSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-accent-chocolate-light dark:text-bg-vanilla/60 mb-1.5">
                      Artisan Name
                    </label>
                    <input
                      type="text"
                      required
                      value={productForm.name}
                      onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g. Vanilla Orchid Dream"
                      className="w-full bg-white/40 dark:bg-white/5 border border-accent-chocolate/10 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-accent-chocolate dark:text-white focus:outline-none focus:border-primary-pink transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-accent-chocolate-light dark:text-bg-vanilla/60 mb-1.5">
                        Category Classification
                      </label>
                      <select
                        value={productForm.category}
                        onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full bg-white/40 dark:bg-white/5 border border-accent-chocolate/10 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-accent-chocolate dark:text-white focus:outline-none focus:border-primary-pink transition-colors font-sans"
                      >
                        <option value="Celebration Cakes">Celebration Cakes</option>
                        <option value="Fine Pastries">Fine Pastries</option>
                        <option value="Dietary Luxe">Dietary Luxe</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-accent-chocolate-light dark:text-bg-vanilla/60 mb-1.5">
                        Price Value Tag (LKR)
                      </label>
                      <input
                        type="number"
                        required
                        value={productForm.priceNumber}
                        onChange={(e) => setProductForm(prev => ({ ...prev, priceNumber: e.target.value }))}
                        placeholder="e.g. 54000"
                        className="w-full bg-white/40 dark:bg-white/5 border border-accent-chocolate/10 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-accent-chocolate dark:text-white focus:outline-none focus:border-primary-pink transition-colors font-sans"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-accent-chocolate-light dark:text-bg-vanilla/60 mb-1.5">
                      Custom Flavor Suite (Comma Separated)
                    </label>
                    <input
                      type="text"
                      value={productForm.flavors}
                      onChange={(e) => setProductForm(prev => ({ ...prev, flavors: e.target.value }))}
                      placeholder="e.g. Lavender Bean, Matcha Foam"
                      className="w-full bg-white/40 dark:bg-white/5 border border-accent-chocolate/10 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-accent-chocolate dark:text-white focus:outline-none focus:border-primary-pink transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-accent-chocolate-light dark:text-bg-vanilla/60 mb-1.5">
                      Artisan Description
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={productForm.description}
                      onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Bespoke vanilla structure baked utilizing organic ingredients..."
                      className="w-full bg-white/40 dark:bg-white/5 border border-accent-chocolate/10 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-accent-chocolate dark:text-white focus:outline-none focus:border-primary-pink transition-colors resize-none leading-relaxed"
                    />
                  </div>

                  {/* Drag-and-drop Image Upload Zone */}
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-accent-chocolate-light dark:text-bg-vanilla/60 mb-1.5">
                      Visual Asset Image
                    </label>
                    
                    {productForm.image ? (
                      <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-accent-chocolate/10 dark:border-white/10 flex items-center justify-center">
                        <Image src={productForm.image} alt="Upload preview" fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() => setProductForm(prev => ({ ...prev, image: "" }))}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-md cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        onDrop={onDrop}
                        className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${
                          isDragOver 
                            ? "border-primary-pink bg-primary-pink/5" 
                            : "border-accent-chocolate/10 dark:border-white/10 hover:border-primary-pink/40"
                        }`}
                      >
                        <input
                          type="file"
                          id="file-upload-input"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleImageFile(e.target.files[0]);
                            }
                          }}
                        />
                        <label htmlFor="file-upload-input" className="flex flex-col items-center gap-2 cursor-pointer">
                          <UploadCloud className="w-8 h-8 text-accent-chocolate-light/40" />
                          <span className="text-[10px] font-bold uppercase tracking-wider text-accent-chocolate-light dark:text-bg-vanilla/60 text-center">
                            {uploadingImage ? "Uploading Asset..." : "Drag & Drop Image or Click to Browse"}
                          </span>
                        </label>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      className="glass-button flex-1 py-3 px-4 font-bold uppercase tracking-widest text-[9px] flex items-center justify-center gap-2 bg-primary-pink border-primary-pink text-white hover:bg-primary-pink-deep transition-all duration-300 shadow-md cursor-pointer"
                    >
                      {isEditing ? "Apply Changes" : "Create Product"}
                      <ArrowRight className="w-3 h-3" />
                    </button>
                    {isEditing && (
                      <button
                        type="button"
                        onClick={resetProductForm}
                        className="glass-button py-3 px-4 font-bold uppercase tracking-widest text-[9px]"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* List Column (7 Tiers) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="glass-card border border-white/30 dark:border-white/10 p-6 sm:p-8 rounded-3xl bg-white/20 dark:bg-white/5 shadow-md overflow-x-auto">
                <h2 className="font-serif text-lg font-bold text-accent-chocolate dark:text-white uppercase mb-6">
                  Artisan Products Catalog
                </h2>

                <table className="w-full text-xs text-left text-accent-chocolate dark:text-white font-medium border-collapse">
                  <thead>
                    <tr className="border-b border-accent-chocolate/5 dark:border-white/5 text-[9px] font-bold uppercase tracking-wider text-accent-chocolate-light dark:text-bg-vanilla/60">
                      <th className="pb-3">Product Name</th>
                      <th className="pb-3">Category</th>
                      <th className="pb-3">Price tag</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((prod) => (
                      <tr key={prod.id} className="border-b border-accent-chocolate/5 dark:border-white/5 last:border-0">
                        <td className="py-4 font-bold max-w-[150px] truncate">{prod.name}</td>
                        <td className="py-4">{prod.category}</td>
                        <td className="py-4 font-sans font-semibold text-primary-pink-deep dark:text-primary-pink">
                          {prod.price}
                        </td>
                        <td className="py-4 text-right flex justify-end gap-1.5">
                          <button
                            onClick={() => handleEditProductClick(prod)}
                            className="p-1.5 rounded-lg border border-accent-chocolate/10 hover:border-primary-pink/30 hover:text-primary-pink transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod.id)}
                            className="p-1.5 rounded-lg border border-red-500/10 hover:border-red-500/30 hover:text-red-500 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Incoming Orders Board */}
        {activeTab === "ORDERS" && (
          <div className="space-y-6 text-left">
            <div className="glass-card border border-white/30 dark:border-white/10 p-6 sm:p-8 rounded-[2rem] bg-white/20 dark:bg-white/5 shadow-md">
              <h2 className="font-serif text-xl font-bold text-accent-chocolate dark:text-white uppercase mb-6 flex items-center gap-2">
                <Truck className="w-5 h-5 text-primary-pink" />
                Active Incoming Orders Board
              </h2>

              <div className="space-y-6">
                {orders.length === 0 ? (
                  <div className="text-center py-12 text-xs text-accent-chocolate-light/60 font-normal">
                    No registered commissions logged yet.
                  </div>
                ) : (
                  orders.map((order) => (
                    <div 
                      key={order.id} 
                      className="border border-accent-chocolate/10 dark:border-white/10 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:bg-white/10 dark:hover:bg-white/5 transition-colors"
                    >
                      <div className="space-y-3 text-left">
                        <div className="flex flex-wrap gap-2 items-center">
                          <span className="text-[10px] font-bold text-accent-chocolate-light dark:text-bg-vanilla/60 font-sans">
                            Commission #{order.id.slice(0, 8).toUpperCase()}
                          </span>
                          <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                            order.deliveryTracking?.status === "SHIPPED"
                              ? "bg-green-500/10 text-green-600 border border-green-500/20"
                              : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                          }`}>
                            {order.deliveryTracking?.status || "PENDING"}
                          </span>
                        </div>

                        <div>
                          <p className="text-xs text-accent-chocolate-light dark:text-bg-vanilla/80">
                            Buyer: <strong className="text-accent-chocolate dark:text-white">{order.user.email}</strong>
                          </p>
                          <p className="text-[11px] text-accent-chocolate-light/60 dark:text-bg-vanilla-cream/50 font-sans mt-0.5">
                            Created: {new Date(order.createdAt).toLocaleString()}
                          </p>
                        </div>

                        {/* Items list */}
                        <div className="flex flex-wrap gap-1.5">
                          {order.items.map((item) => (
                            <span 
                              key={item.id} 
                              className="text-[9px] font-semibold bg-accent-chocolate/5 dark:bg-white/5 border border-accent-chocolate/5 rounded-md px-2 py-1"
                            >
                              {item.name} (x{item.quantity}) {item.flavor ? `| ${item.flavor}` : ""}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-3 w-full md:w-auto border-t md:border-t-0 border-accent-chocolate/10 dark:border-white/10 pt-4 md:pt-0 shrink-0">
                        <span className="text-base font-serif font-bold text-primary-pink-deep dark:text-primary-pink">
                          Rs. {order.total.toLocaleString()}
                        </span>
                        
                        {order.deliveryTracking?.status !== "SHIPPED" && (
                          <button
                            onClick={() => handleApproveDelivery(order.id)}
                            className="glass-button text-[9px] font-bold uppercase tracking-widest py-2.5 px-4 bg-green-600 border-green-600 text-white hover:bg-green-700 transition-colors w-full md:w-auto text-center cursor-pointer shadow-sm"
                          >
                            Approve Delivery
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Access Control panel */}
        {activeTab === "ACCESS" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
            {/* Left side: Grant permission */}
            <div className="lg:col-span-5">
              <div className="glass-card border border-white/30 dark:border-white/10 p-6 sm:p-8 rounded-3xl bg-white/20 dark:bg-white/5 shadow-md">
                <h2 className="font-serif text-lg font-bold text-accent-chocolate dark:text-white uppercase mb-4">
                  Add Administrator
                </h2>
                <p className="text-xs text-accent-chocolate-light dark:text-bg-vanilla/60 mb-6 font-normal leading-relaxed">
                  Enter a secondary user email below to instantly whitelist their profile with master administrative workspace commands.
                </p>

                <form onSubmit={handleRegisterAdmin} className="space-y-4">
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-accent-chocolate-light dark:text-bg-vanilla/60 mb-2">
                      Administrator Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={adminEmailInput}
                      onChange={(e) => setAdminEmailInput(e.target.value)}
                      placeholder="secondary-admin@domain.com"
                      className="w-full bg-white/40 dark:bg-white/5 border border-accent-chocolate/10 dark:border-white/10 rounded-xl px-4 py-3 text-xs text-accent-chocolate dark:text-white focus:outline-none focus:border-primary-pink transition-colors font-sans"
                    />
                  </div>
                  <button
                    type="submit"
                    className="glass-button w-full py-3.5 px-6 font-bold uppercase tracking-widest text-[9px] flex items-center justify-center gap-2 bg-primary-pink border-primary-pink text-white hover:bg-primary-pink-deep transition-all duration-300 shadow-md cursor-pointer"
                  >
                    Whitelist Admin Profile
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </form>
              </div>
            </div>

            {/* Right side: Admins list */}
            <div className="lg:col-span-7">
              <div className="glass-card border border-white/30 dark:border-white/10 p-6 sm:p-8 rounded-3xl bg-white/20 dark:bg-white/5 shadow-md overflow-x-auto">
                <h2 className="font-serif text-lg font-bold text-accent-chocolate dark:text-white uppercase mb-6">
                  Administrative Access Profiles
                </h2>

                <table className="w-full text-xs text-left text-accent-chocolate dark:text-white font-medium border-collapse">
                  <thead>
                    <tr className="border-b border-accent-chocolate/5 dark:border-white/5 text-[9px] font-bold uppercase tracking-wider text-accent-chocolate-light dark:text-bg-vanilla/60">
                      <th className="pb-3">Admin Email</th>
                      <th className="pb-3">Permissions Status</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.filter(u => u.isAdmin).map((usr) => (
                      <tr key={usr.id} className="border-b border-accent-chocolate/5 dark:border-white/5 last:border-0">
                        <td className="py-4 font-bold font-sans">{usr.email}</td>
                        <td className="py-4">
                          <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-green-500/10 text-green-600 border border-green-500/20">
                            Active Admin
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          {usr.email !== "guest@example.com" && usr.email !== "admin@cakebylochi.com" ? (
                            <button
                              onClick={() => handleRevokeAdmin(usr.email)}
                              className="glass-button text-[9px] font-bold uppercase tracking-widest py-1.5 px-3 hover:bg-red-500/10 hover:text-red-500 border-red-500/20 cursor-pointer"
                            >
                              Revoke Access
                            </button>
                          ) : (
                            <span className="text-[9px] font-bold uppercase tracking-widest text-accent-chocolate-light/40 dark:text-bg-vanilla/40">
                              System Owner
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

// Sub components
interface TabButtonProps {
  active: boolean;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

function TabButton({ active, label, icon, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2.5 rounded-full border text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all duration-300 shadow-sm ${
        active 
          ? "bg-accent-chocolate border-accent-chocolate text-white dark:bg-primary-pink dark:border-primary-pink dark:text-white" 
          : "bg-white/40 border-accent-chocolate/10 text-accent-chocolate hover:bg-white/80 dark:bg-white/5 dark:border-white/10 dark:text-bg-vanilla-cream dark:hover:bg-white/10"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}

function MetricCard({ label, value, icon }: MetricCardProps) {
  return (
    <div className="glass-card border border-white/30 dark:border-white/10 p-5 rounded-2xl bg-white/20 dark:bg-white/5 shadow-md flex justify-between items-center">
      <div className="space-y-1">
        <span className="text-[9px] font-bold uppercase tracking-wider text-accent-chocolate-light dark:text-bg-vanilla/60">{label}</span>
        <h3 className="font-serif text-lg font-bold text-accent-chocolate dark:text-white">{value}</h3>
      </div>
      <div className="p-2 bg-primary-pink/10 rounded-full text-primary-pink">
        {icon}
      </div>
    </div>
  );
}
