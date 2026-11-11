"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Settings,
  LogOut,
  RefreshCw,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  Search,
  Send,
  RotateCcw,
  Lock,
  ExternalLink,
  Trash2,
  Eye,
  X,
  Tag,
  Mail,
  Upload,
} from "lucide-react";
import type { AdminOverviewResponse } from "@/components/admin/AdminTypes";
import type { StoreOrder, StoreProduct } from "@/lib/store";

type TabId = "overview" | "orders" | "catalog" | "coupons" | "shiprocket";

export default function AdminPage() {
  const [authChecked, setAuthChecked] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);

  const [tab, setTab] = useState<TabId>("overview");
  const [data, setData] = useState<AdminOverviewResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [banner, setBanner] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Filters & Modals
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("ALL");
  const [selectedOrder, setSelectedOrder] = useState<StoreOrder | null>(null);
  const [refundAmount, setRefundAmount] = useState("");

  // Catalog edit / add
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProd, setNewProd] = useState({
    title: "",
    tagline: "",
    shortDesc: "",
    emoji: "🌶️",
    image: "/packets/peri peri.svg",
    isCombo: false,
    price: "149",
    compareAtPrice: "175",
    sku: "",
    quantity: "100",
    grams: "60",
  });
  const [newCollectionTitle, setNewCollectionTitle] = useState("");
  const [variantEdits, setVariantEdits] = useState<
    Record<number, { price: string; quantity: string; sku: string }>
  >({});

  // Shiprocket & Gmail Settings Form
  const [settingsForm, setSettingsForm] = useState({
    environment: "staging" as "staging" | "production",
    apiKey: "",
    apiSecret: "",
    sellerDomain: "localhost:3001",
    redirectBaseUrl: "",
    loyaltyEnabled: true,
    gmailUser: "",
    adminNotifyEmail: "",
  });
  const [couponForm, setCouponForm] = useState({
    code: "",
    discountType: "percent" as "percent" | "fixed",
    value: "10",
    minOrder: "0",
    maxDiscount: "",
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [siteOrigin, setSiteOrigin] = useState("http://localhost:3001");
  const [hmacTestInput, setHmacTestInput] = useState('{"order_id":"12345","amount":115}');
  const [hmacTestResult, setHmacTestResult] = useState<string | null>(null);
  const [refundReports, setRefundReports] = useState<Record<string, unknown>[] | null>(null);

  const showMsg = (type: "success" | "error", text: string) => {
    setBanner({ type, text });
    setTimeout(() => setBanner(null), 5000);
  };

  const fetchOverview = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/overview");
      if (res.status === 401) {
        setAuthenticated(false);
        return;
      }
      const json = (await res.json()) as AdminOverviewResponse;
      if (json.ok) {
        setData(json);
        setSettingsForm({
          environment: json.settings.environment,
          apiKey: json.settings.apiKey,
          apiSecret: "",
          sellerDomain: json.settings.sellerDomain,
          redirectBaseUrl: json.settings.redirectBaseUrl,
          loyaltyEnabled: json.settings.loyaltyEnabled,
          gmailUser: json.settings.gmailUser || "",
          adminNotifyEmail: json.settings.adminNotifyEmail || "",
        });
        const vMap: Record<number, { price: string; quantity: string; sku: string }> = {};
        for (const p of json.products) {
          for (const v of p.variants) {
            vMap[v.id] = {
              price: v.price,
              quantity: String(v.quantity),
              sku: v.sku,
            };
          }
        }
        setVariantEdits(vMap);
      }
    } catch {
      showMsg("error", "Failed to load admin overview");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setSiteOrigin(window.location.origin);
    fetch("/api/admin/login")
      .then((r) => r.json())
      .then((res) => {
        setAuthenticated(Boolean(res.authenticated));
        setAuthChecked(true);
        if (res.authenticated) fetchOverview();
      })
      .catch(() => setAuthChecked(true));
  }, [fetchOverview]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const json = await res.json();
    if (res.ok && json.ok) {
      setAuthenticated(true);
      setPassword("");
      fetchOverview();
    } else {
      setLoginError(json.error || "Invalid password");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    setAuthenticated(false);
    setData(null);
  };

  const handleCopy = (key: string, val: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settingsForm),
    });
    const json = await res.json();
    if (json.ok) {
      showMsg("success", "Store, Shiprocket & Email settings saved!");
      fetchOverview();
    } else {
      showMsg("error", json.error || "Failed to save settings");
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: couponForm.code,
        discountType: couponForm.discountType,
        value: Number(couponForm.value),
        minOrder: Number(couponForm.minOrder) || 0,
        maxDiscount: couponForm.maxDiscount ? Number(couponForm.maxDiscount) : null,
      }),
    });
    const json = await res.json();
    if (json.ok) {
      showMsg("success", `Coupon ${json.coupon.code} created!`);
      setCouponForm({ code: "", discountType: "percent", value: "10", minOrder: "0", maxDiscount: "" });
      fetchOverview();
    } else {
      showMsg("error", json.error || "Failed creating coupon");
    }
  };

  const handleToggleCoupon = async (code: string, active: boolean) => {
    const res = await fetch("/api/admin/coupons", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, active: !active }),
    });
    if (res.ok) fetchOverview();
  };

  const handleDeleteCoupon = async (code: string) => {
    if (!confirm(`Delete coupon ${code}?`)) return;
    const res = await fetch(`/api/admin/coupons?code=${encodeURIComponent(code)}`, {
      method: "DELETE",
    });
    if (res.ok) {
      showMsg("success", `Deleted coupon ${code}`);
      fetchOverview();
    }
  };

  const handleUploadImage = async (file: File) => {
    setUploadingImage(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (json.ok && json.url) {
        setNewProd((p) => ({ ...p, image: json.url }));
        showMsg("success", `Uploaded image (${json.storage}): ${json.url}`);
      } else {
        showMsg("error", json.error || "Upload failed");
      }
    } catch {
      showMsg("error", "Network error uploading image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSyncCall = async (
    action: string,
    extra: Record<string, unknown> = {}
  ) => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...extra }),
      });
      const json = await res.json();
      if (action === "test_hmac") {
        setHmacTestResult(json.hmac || null);
      } else if (action === "refund_reports") {
        if (json.ok) {
          setRefundReports(json.data?.data?.refunds || []);
          showMsg("success", "Fetched refund reports from Shiprocket.");
        } else {
          showMsg("error", json.error || "Could not fetch refund reports");
        }
      } else if (json.ok) {
        showMsg("success", `Action "${action}" completed successfully.`);
        await fetchOverview();
      } else {
        showMsg("error", json.error || `Action "${action}" failed`);
      }
    } catch {
      showMsg("error", "Network error communicating with backend");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProductVariants = async (product: StoreProduct) => {
    const variantsPayload = product.variants.map((v) => {
      const edit = variantEdits[v.id];
      return {
        id: v.id,
        price: edit ? parseFloat(edit.price) || parseFloat(v.price) : parseFloat(v.price),
        quantity: edit ? parseInt(edit.quantity, 10) || 0 : v.quantity,
        sku: edit ? edit.sku : v.sku,
      };
    });

    const res = await fetch("/api/admin/products", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: product.id, variants: variantsPayload }),
    });
    const json = await res.json();
    if (json.ok) {
      const syncNote = json.shiprocketSync?.pushed
        ? json.shiprocketSync.ok
          ? " + pushed to Shiprocket webhook!"
          : " (saved locally; Shiprocket webhook returned error)"
        : "!";
      showMsg("success", `Updated ${product.title}${syncNote}`);
      fetchOverview();
    } else {
      showMsg("error", json.error || "Failed to update product");
    }
  };

  const handleToggleProductStatus = async (product: StoreProduct) => {
    const nextStatus = product.status === "active" ? "draft" : "active";
    const res = await fetch("/api/admin/products", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: product.id, status: nextStatus }),
    });
    const json = await res.json();
    if (json.ok) {
      showMsg("success", `${product.title} set to ${nextStatus}`);
      fetchOverview();
    }
  };

  const handleDeleteProduct = async (product: StoreProduct) => {
    if (!confirm(`Delete "${product.title}" from catalog?`)) return;
    const res = await fetch(`/api/admin/products?id=${product.id}`, { method: "DELETE" });
    const json = await res.json();
    if (json.ok) {
      showMsg("success", `Deleted ${product.title}`);
      fetchOverview();
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...newProd,
        price: Number(newProd.price),
        compareAtPrice: Number(newProd.compareAtPrice),
        quantity: Number(newProd.quantity),
        grams: Number(newProd.grams),
      }),
    });
    const json = await res.json();
    if (json.ok) {
      showMsg("success", `Created "${json.product.title}" (#${json.product.id})`);
      setShowAddProduct(false);
      setNewProd({
        title: "",
        tagline: "",
        shortDesc: "",
        emoji: "🌶️",
        image: "/packets/peri peri.svg",
        isCombo: false,
        price: "149",
        compareAtPrice: "175",
        sku: "",
        quantity: "100",
        grams: "60",
      });
      fetchOverview();
    } else {
      showMsg("error", json.error || "Could not create product");
    }
  };

  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollectionTitle.trim()) return;
    const res = await fetch("/api/admin/collections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newCollectionTitle.trim() }),
    });
    const json = await res.json();
    if (json.ok) {
      showMsg("success", `Collection "${json.collection.title}" created (#${json.collection.id})`);
      setNewCollectionTitle("");
      fetchOverview();
    } else {
      showMsg("error", json.error || "Failed to create collection");
    }
  };

  if (!authChecked) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#FFF8EE] text-[#522C28] font-bold">
        Checking admin session...
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-[75vh] bg-[#FFF8EE] flex items-center justify-center px-4 py-12">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md bg-white rounded-3xl border-2 border-[#522C28]/15 shadow-xl p-8 space-y-5"
        >
          <div className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#D73B3A] text-white flex items-center justify-center mx-auto mb-3 shadow-md">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="font-display text-3xl uppercase text-[#25100E]">
              Pop Culture Admin
            </h1>
            <p className="text-xs font-semibold text-[#522C28]/70 mt-1">
              Manage orders, catalog, inventory & Shiprocket Checkout
            </p>
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-[#25100E] mb-1.5">
              Admin Password
            </label>
            <input
              type="password"
              required
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-[#522C28]/15 bg-[#FFF8EE] text-sm font-bold focus:outline-none focus:border-[#D73B3A]"
            />
            <p className="text-[11px] text-[#522C28]/60 font-medium mt-1.5">
              Default local password: <code className="font-black text-[#25100E]">popculture2026</code> (override via <code className="font-mono">ADMIN_PASSWORD</code> env var)
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-700">
              {loginError}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 rounded-full bg-[#25100E] hover:bg-[#1A0A09] text-[#FAC537] font-black text-xs uppercase tracking-wider shadow-md cursor-pointer"
          >
            Unlock Dashboard
          </button>

          <div className="text-center pt-2">
            <Link href="/" className="text-xs font-bold text-[#D73B3A] hover:underline">
              ← Return to Storefront
            </Link>
          </div>
        </form>
      </div>
    );
  }

  const filteredOrders = (data?.orders || []).filter((o) => {
    const matchesStatus =
      orderStatusFilter === "ALL" || o.status.toUpperCase() === orderStatusFilter;
    const q = orderSearch.trim().toLowerCase();
    const matchesQuery =
      !q ||
      o.order_id.toLowerCase().includes(q) ||
      (o.fastrr_order_id || "").toLowerCase().includes(q) ||
      (o.phone || "").toLowerCase().includes(q) ||
      (o.email || "").toLowerCase().includes(q);
    return matchesStatus && matchesQuery;
  });

  const onboardingEndpoints = [
    {
      label: "Fetch Products (GET)",
      url: `${siteOrigin}/api/shiprocket/catalog/products?page=1&limit=100`,
    },
    {
      label: "Fetch Collections (GET)",
      url: `${siteOrigin}/api/shiprocket/catalog/collections?page=1&limit=100`,
    },
    {
      label: "Fetch Products By Collection (GET)",
      url: `${siteOrigin}/api/shiprocket/catalog/collection-products?collection_id=200001&page=1&limit=100`,
    },
    {
      label: "Order Webhook Receiver (POST)",
      url: `${siteOrigin}/api/shiprocket/webhook/order`,
    },
    {
      label: "Loyalty Fetch Points (POST)",
      url: `${siteOrigin}/api/shiprocket/loyalty/fetch`,
    },
    {
      label: "Loyalty Block Points (POST)",
      url: `${siteOrigin}/api/shiprocket/loyalty/block`,
    },
    {
      label: "Loyalty Unblock Points (POST)",
      url: `${siteOrigin}/api/shiprocket/loyalty/unblock`,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFF8EE] text-[#522C28] font-sans">
      {/* Top Admin Bar */}
      <header className="w-full bg-[#25100E] text-[#FFF8EE] sticky top-0 z-40 border-b-2 border-[#FAC537]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="bg-[#FFF8EE] px-2.5 py-1 rounded-xl">
              <img src="/pop-culture-logo.svg" alt="Pop Culture" className="h-7 w-auto" />
            </Link>
            <div>
              <h1 className="font-display text-xl uppercase text-[#FAC537] leading-none">
                Command Center
              </h1>
              <p className="text-[10px] font-bold text-white/75 mt-0.5">
                Shiprocket Mode:{" "}
                <span className="uppercase text-[#FAC537]">
                  {data?.settings.environment || "staging"}
                </span>{" "}
                •{" "}
                {data?.settings.apiKey && data?.settings.hasApiSecret
                  ? "Keys Configured ✓"
                  : "Sandbox Demo Mode"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/shop"
              className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold flex items-center gap-1.5"
            >
              <span>View Shop</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={fetchOverview}
              className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>
            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 rounded-full bg-[#D73B3A] hover:bg-[#ED0006] text-white text-xs font-black flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-1 overflow-x-auto pb-2">
          {(
            [
              { id: "overview", label: "Overview", icon: LayoutDashboard },
              { id: "orders", label: `Orders (${data?.orders.length || 0})`, icon: ShoppingCart },
              { id: "catalog", label: `Catalog (${data?.products.length || 0})`, icon: Package },
              { id: "coupons", label: `Coupons (${data?.coupons?.length || 0})`, icon: Tag },
              { id: "shiprocket", label: "Settings & Logs", icon: Settings },
            ] as const
          ).map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 whitespace-nowrap cursor-pointer transition-colors ${
                  active
                    ? "bg-[#FAC537] text-[#25100E]"
                    : "text-white/80 hover:bg-white/10"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {banner && (
          <div
            className={`p-4 rounded-2xl border-2 flex items-center justify-between text-xs font-bold ${
              banner.type === "success"
                ? "bg-emerald-50 border-emerald-400 text-emerald-900"
                : "bg-red-50 border-red-400 text-red-900"
            }`}
          >
            <span>{banner.text}</span>
            <button onClick={() => setBanner(null)} className="cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* =================================================================
            TAB 1: OVERVIEW
            ================================================================= */}
        {tab === "overview" && data && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-3xl bg-white border-2 border-[#522C28]/15 shadow-sm">
                <p className="text-[11px] font-black uppercase text-[#522C28]/70">
                  Confirmed Revenue
                </p>
                <p className="font-display text-3xl text-[#25100E] mt-1">
                  ₹{data.stats.totalRevenue.toLocaleString("en-IN")}
                </p>
                <p className="text-[11px] font-bold text-[#3CA837] mt-1">
                  {data.stats.successOrders} Paid / Confirmed Orders
                </p>
              </div>

              <div className="p-5 rounded-3xl bg-white border-2 border-[#522C28]/15 shadow-sm">
                <p className="text-[11px] font-black uppercase text-[#522C28]/70">
                  Total Checkouts
                </p>
                <p className="font-display text-3xl text-[#25100E] mt-1">
                  {data.stats.totalOrders}
                </p>
                <p className="text-[11px] font-bold text-[#522C28]/70 mt-1">
                  {data.stats.initiatedOrders} Initiated / Pending
                </p>
              </div>

              <div className="p-5 rounded-3xl bg-white border-2 border-[#522C28]/15 shadow-sm">
                <p className="text-[11px] font-black uppercase text-[#522C28]/70">
                  Synced Catalog
                </p>
                <p className="font-display text-3xl text-[#25100E] mt-1">
                  {data.stats.totalProducts} Items
                </p>
                <p className="text-[11px] font-bold text-[#522C28]/70 mt-1">
                  {data.stats.totalVariants} Total SKUs / Variants
                </p>
              </div>

              <div className="p-5 rounded-3xl bg-white border-2 border-[#522C28]/15 shadow-sm">
                <p className="text-[11px] font-black uppercase text-[#522C28]/70">
                  Inventory Alerts
                </p>
                <p className="font-display text-3xl text-[#D73B3A] mt-1">
                  {data.stats.lowStockVariants} Low Stock
                </p>
                <p className="text-[11px] font-bold text-[#522C28]/70 mt-1">
                  SKUs with ≤ 15 packs left
                </p>
              </div>
            </div>

            {/* Shiprocket Integration Checklist Card */}
            <div className="p-6 rounded-3xl bg-[#25100E] text-[#FFF8EE] border-2 border-[#FAC537] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#FAC537] text-[#25100E] text-[10px] font-black uppercase">
                  Shiprocket Checkout Integration
                </span>
                <h2 className="font-display text-2xl uppercase text-white mt-2">
                  {data.settings.apiKey && data.settings.hasApiSecret
                    ? `Live on ${data.settings.environment.toUpperCase()} API`
                    : "Ready for Shiprocket Credentials"}
                </h2>
                <p className="text-xs text-white/80 font-medium mt-1 max-w-2xl">
                  Catalog sync APIs, Order Webhook receiver, Access Token HMAC signing, and Loyalty APIs are live. Add your Shiprocket API Key & Secret Key in the Shiprocket tab when onboarding completes.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setTab("shiprocket")}
                  className="px-4 py-2.5 rounded-full bg-[#FAC537] text-[#25100E] font-black text-xs uppercase cursor-pointer"
                >
                  Configure Keys & URLs
                </button>
                {data.settings.apiKey && data.settings.hasApiSecret && (
                  <button
                    onClick={() => handleSyncCall("push_catalog")}
                    className="px-4 py-2.5 rounded-full bg-[#D73B3A] text-white font-black text-xs uppercase cursor-pointer"
                  >
                    Push Catalog Sync
                  </button>
                )}
              </div>
            </div>

            {/* Recent Orders + Webhook Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl bg-white border-2 border-[#522C28]/15 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-xl uppercase text-[#25100E]">
                    Recent Orders
                  </h3>
                  <button
                    onClick={() => setTab("orders")}
                    className="text-xs font-black text-[#D73B3A] hover:underline cursor-pointer"
                  >
                    View All →
                  </button>
                </div>
                {data.orders.length === 0 ? (
                  <p className="text-xs font-medium text-[#522C28]/60 py-6 text-center">
                    No orders placed yet. Test adding a pouch to cart and checking out!
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {data.orders.slice(0, 5).map((o) => (
                      <div
                        key={o.order_id}
                        className="p-3 rounded-2xl bg-[#FFF8EE] border border-[#522C28]/10 flex items-center justify-between text-xs"
                      >
                        <div>
                          <p className="font-black text-[#25100E]">
                            #{o.order_id}{" "}
                            {o.isDemo && (
                              <span className="ml-1 px-1.5 py-0.5 rounded bg-amber-200 text-[9px]">
                                SANDBOX
                              </span>
                            )}
                          </p>
                          <p className="text-[11px] text-[#522C28]/70 font-semibold">
                            {o.phone || "Guest"} • {o.payment_type || "Checkout"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-[#25100E]">
                            ₹{o.total_amount_payable ?? o.subtotal_price ?? 0}
                          </p>
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                              o.status === "SUCCESS"
                                ? "bg-emerald-100 text-emerald-800"
                                : o.status === "FAILED"
                                ? "bg-red-100 text-red-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {o.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-6 rounded-3xl bg-white border-2 border-[#522C28]/15 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-xl uppercase text-[#25100E]">
                    Recent Webhook & Sync Logs
                  </h3>
                  <button
                    onClick={() => setTab("shiprocket")}
                    className="text-xs font-black text-[#D73B3A] hover:underline cursor-pointer"
                  >
                    Full Logs →
                  </button>
                </div>
                {data.webhookLogs.length === 0 ? (
                  <p className="text-xs font-medium text-[#522C28]/60 py-6 text-center">
                    No webhook traffic logged yet.
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {data.webhookLogs.slice(0, 5).map((l) => (
                      <div
                        key={l.id}
                        className="p-3 rounded-2xl bg-[#FFF8EE] border border-[#522C28]/10 text-xs flex items-start justify-between gap-2"
                      >
                        <div>
                          <span className="font-black text-[#25100E]">{l.event}</span>
                          <p className="text-[11px] text-[#522C28]/80 font-medium mt-0.5">
                            {l.summary}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                            l.ok ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {l.httpStatus || "ERR"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* =================================================================
            TAB 2: ORDERS & REFUNDS
            ================================================================= */}
        {tab === "orders" && data && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[260px]">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#522C28]/50" />
                  <input
                    type="text"
                    placeholder="Search Order ID, Phone, Email..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-full bg-white border border-[#522C28]/20 text-xs font-bold"
                  />
                </div>
                {(["ALL", "SUCCESS", "INITIATED", "FAILED"] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-black uppercase cursor-pointer ${
                      orderStatusFilter === st
                        ? "bg-[#25100E] text-[#FAC537]"
                        : "bg-white border border-[#522C28]/15 text-[#522C28]"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSyncCall("pull_order_list")}
                  className="px-4 py-2 rounded-full bg-white border border-[#522C28]/20 text-xs font-black uppercase hover:bg-[#FAECE7] cursor-pointer"
                >
                  Pull Shiprocket Orders
                </button>
                <button
                  onClick={() => handleSyncCall("refund_reports")}
                  className="px-4 py-2 rounded-full bg-[#25100E] text-[#FAC537] text-xs font-black uppercase cursor-pointer"
                >
                  Refund Reports
                </button>
              </div>
            </div>

            {refundReports && (
              <div className="p-5 rounded-3xl bg-white border-2 border-[#FAC537] shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display text-lg uppercase text-[#25100E]">
                    Shiprocket Refund Reports ({refundReports.length})
                  </h3>
                  <button
                    onClick={() => setRefundReports(null)}
                    className="text-xs font-bold text-[#D73B3A] cursor-pointer"
                  >
                    Close
                  </button>
                </div>
                {refundReports.length === 0 ? (
                  <p className="text-xs text-[#522C28]/70">No refunds found in the last 30 days.</p>
                ) : (
                  <pre className="text-[11px] bg-[#FFF8EE] p-3 rounded-xl overflow-x-auto">
                    {JSON.stringify(refundReports, null, 2)}
                  </pre>
                )}
              </div>
            )}

            <div className="rounded-3xl bg-white border-2 border-[#522C28]/15 shadow-sm overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#FFF8EE] border-b border-[#522C28]/15 text-[11px] font-black uppercase text-[#25100E]">
                    <th className="py-3.5 px-4">Order ID</th>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Items</th>
                    <th className="py-3.5 px-4">Payment</th>
                    <th className="py-3.5 px-4">Total</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#522C28]/10">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-10 text-center text-[#522C28]/60 font-semibold">
                        No matching orders found.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.order_id} className="hover:bg-[#FFF8EE]/50">
                        <td className="py-3 px-4 font-black text-[#25100E]">
                          <div>{order.order_id}</div>
                          {order.fastrr_order_id && (
                            <div className="text-[10px] text-[#522C28]/60 font-semibold">
                              SR #{order.fastrr_order_id}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold">{order.phone || "—"}</div>
                          <div className="text-[11px] text-[#522C28]/65">{order.email || "—"}</div>
                        </td>
                        <td className="py-3 px-4 font-semibold">
                          {order.cart_data.items.map((it, idx) => (
                            <div key={idx}>
                              {it.name || `Variant ${it.variant_id}`} × {it.quantity}
                            </div>
                          ))}
                        </td>
                        <td className="py-3 px-4 font-bold uppercase text-[11px]">
                          {order.payment_type || "PENDING"}
                        </td>
                        <td className="py-3 px-4 font-black text-[#25100E]">
                          ₹{order.total_amount_payable ?? order.subtotal_price ?? 0}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                              order.status === "SUCCESS"
                                ? "bg-emerald-100 text-emerald-800"
                                : order.status === "FAILED"
                                ? "bg-red-100 text-red-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setRefundAmount(
                                String(order.total_amount_payable ?? order.subtotal_price ?? "")
                              );
                            }}
                            className="px-3 py-1.5 rounded-full bg-[#FFF8EE] border border-[#522C28]/20 text-[11px] font-bold hover:bg-[#FAECE7] cursor-pointer inline-flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Inspect</span>
                          </button>
                          {!order.isDemo && (
                            <button
                              onClick={() =>
                                handleSyncCall("sync_order_detail", { order_id: order.order_id })
                              }
                              className="px-3 py-1.5 rounded-full bg-[#25100E] text-[#FAC537] text-[11px] font-bold cursor-pointer inline-flex items-center gap-1"
                            >
                              <RefreshCw className="w-3 h-3" />
                              <span>Sync</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =================================================================
            TAB 3: CATALOG & INVENTORY
            ================================================================= */}
        {tab === "catalog" && data && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-2xl uppercase text-[#25100E]">
                  Products, Variants & Stock
                </h2>
                <p className="text-xs font-semibold text-[#522C28]/75">
                  All products carry unique Shiprocket <code className="font-mono">long</code> IDs and sync automatically to the Shop page & Shiprocket webhooks.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setShowAddProduct(true)}
                  className="px-4 py-2.5 rounded-full bg-[#D73B3A] hover:bg-[#ED0006] text-white font-black text-xs uppercase flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Add Flavour / Combo</span>
                </button>
                <button
                  onClick={() => handleSyncCall("push_catalog")}
                  className="px-4 py-2.5 rounded-full bg-[#25100E] text-[#FAC537] font-black text-xs uppercase flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Sync All to Shiprocket</span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {data.products.map((prod) => (
                <div
                  key={prod.id}
                  className="p-5 rounded-3xl bg-white border-2 border-[#522C28]/15 shadow-sm space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-[#522C28]/10">
                    <div className="flex items-center gap-3.5">
                      <img
                        src={prod.image}
                        alt={prod.title}
                        className="w-12 h-14 object-contain bg-[#FFF8EE] rounded-xl p-1"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-display text-xl uppercase text-[#25100E]">
                            {prod.title}
                          </h3>
                          <span className="px-2 py-0.5 rounded-full bg-[#FFF8EE] border border-[#522C28]/15 text-[10px] font-black">
                            ID: {prod.id}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              prod.status === "active"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-gray-200 text-gray-700"
                            }`}
                          >
                            {prod.status}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-[#522C28]/70">
                          {prod.product_type} • /{prod.slug}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => handleToggleProductStatus(prod)}
                        className="px-3 py-1.5 rounded-full bg-[#FFF8EE] border border-[#522C28]/20 text-[11px] font-bold cursor-pointer"
                      >
                        Set {prod.status === "active" ? "Draft" : "Active"}
                      </button>
                      <button
                        onClick={() => handleSyncCall("push_product", { product_id: prod.id })}
                        className="px-3 py-1.5 rounded-full bg-[#FFF8EE] border border-[#522C28]/20 text-[11px] font-bold hover:bg-[#FAECE7] cursor-pointer flex items-center gap-1"
                      >
                        <Send className="w-3 h-3" />
                        <span>Push Webhook</span>
                      </button>
                      <button
                        onClick={() => handleSaveProductVariants(prod)}
                        className="px-4 py-1.5 rounded-full bg-[#3CA837] hover:bg-emerald-700 text-white text-[11px] font-black uppercase cursor-pointer"
                      >
                        Save Variants
                      </button>
                      {prod.id > 100007 && (
                        <button
                          onClick={() => handleDeleteProduct(prod)}
                          className="p-1.5 rounded-full text-red-600 hover:bg-red-50 cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Variants Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="text-[10px] font-black uppercase text-[#522C28]/60 border-b border-[#522C28]/10">
                          <th className="py-2 pr-4">Variant ID</th>
                          <th className="py-2 pr-4">Pack Title</th>
                          <th className="py-2 pr-4">SKU</th>
                          <th className="py-2 pr-4">Price (₹)</th>
                          <th className="py-2 pr-4">Stock Qty</th>
                          <th className="py-2">Weight</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#522C28]/10">
                        {prod.variants.map((v) => {
                          const edit = variantEdits[v.id] || {
                            price: v.price,
                            quantity: String(v.quantity),
                            sku: v.sku,
                          };
                          return (
                            <tr key={v.id}>
                              <td className="py-2 pr-4 font-mono text-[11px] font-bold text-[#25100E]">
                                {v.id}
                              </td>
                              <td className="py-2 pr-4 font-bold">{v.title}</td>
                              <td className="py-2 pr-4">
                                <input
                                  value={edit.sku}
                                  onChange={(e) =>
                                    setVariantEdits({
                                      ...variantEdits,
                                      [v.id]: { ...edit, sku: e.target.value },
                                    })
                                  }
                                  className="px-2.5 py-1 rounded-lg border border-[#522C28]/20 bg-[#FFF8EE] text-xs font-mono w-36"
                                />
                              </td>
                              <td className="py-2 pr-4">
                                <input
                                  type="number"
                                  value={edit.price}
                                  onChange={(e) =>
                                    setVariantEdits({
                                      ...variantEdits,
                                      [v.id]: { ...edit, price: e.target.value },
                                    })
                                  }
                                  className="px-2.5 py-1 rounded-lg border border-[#522C28]/20 bg-[#FFF8EE] text-xs font-black w-24"
                                />
                              </td>
                              <td className="py-2 pr-4">
                                <input
                                  type="number"
                                  value={edit.quantity}
                                  onChange={(e) =>
                                    setVariantEdits({
                                      ...variantEdits,
                                      [v.id]: { ...edit, quantity: e.target.value },
                                    })
                                  }
                                  className="px-2.5 py-1 rounded-lg border border-[#522C28]/20 bg-[#FFF8EE] text-xs font-black w-20"
                                />
                              </td>
                              <td className="py-2 text-[#522C28]/70 font-semibold">
                                {v.grams}g
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>

            {/* Collections Section */}
            <div className="p-6 rounded-3xl bg-white border-2 border-[#522C28]/15 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-display text-xl uppercase text-[#25100E]">
                  Collections ({data.collections.length})
                </h3>
                <form onSubmit={handleCreateCollection} className="flex items-center gap-2">
                  <input
                    placeholder="New collection title..."
                    value={newCollectionTitle}
                    onChange={(e) => setNewCollectionTitle(e.target.value)}
                    className="px-3.5 py-2 rounded-full border border-[#522C28]/20 bg-[#FFF8EE] text-xs font-bold"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-full bg-[#25100E] text-[#FAC537] text-xs font-black uppercase cursor-pointer"
                  >
                    + Add Collection
                  </button>
                </form>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {data.collections.map((c) => (
                  <div
                    key={c.id}
                    className="p-3.5 rounded-2xl bg-[#FFF8EE] border border-[#522C28]/15 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-black text-xs text-[#25100E] uppercase">{c.title}</p>
                      <p className="text-[11px] font-mono text-[#522C28]/70">
                        ID: {c.id} • /{c.handle}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =================================================================
            TAB 4: PROMO COUPONS MANAGEMENT
            ================================================================= */}
        {tab === "coupons" && data && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <form
              onSubmit={handleCreateCoupon}
              className="lg:col-span-5 p-6 rounded-3xl bg-white border-2 border-[#522C28]/15 shadow-sm space-y-4 h-fit"
            >
              <h2 className="font-display text-2xl uppercase text-[#25100E]">Create Promo Coupon</h2>
              <div>
                <label className="block text-[11px] font-black uppercase mb-1">Coupon Code</label>
                <input
                  required
                  placeholder="e.g. MAKHANA20"
                  value={couponForm.code}
                  onChange={(e) =>
                    setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#522C28]/20 bg-[#FFF8EE] text-xs font-mono font-bold uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-black uppercase mb-1">Discount Type</label>
                  <select
                    value={couponForm.discountType}
                    onChange={(e) =>
                      setCouponForm({
                        ...couponForm,
                        discountType: e.target.value as "percent" | "fixed",
                      })
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-[#522C28]/20 bg-[#FFF8EE] text-xs font-bold"
                  >
                    <option value="percent">Percentage (%)</option>
                    <option value="fixed">Flat Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-black uppercase mb-1">Value</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={couponForm.value}
                    onChange={(e) => setCouponForm({ ...couponForm, value: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#522C28]/20 bg-[#FFF8EE] text-xs font-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-black uppercase mb-1">Min Order (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={couponForm.minOrder}
                    onChange={(e) => setCouponForm({ ...couponForm, minOrder: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#522C28]/20 bg-[#FFF8EE] text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black uppercase mb-1">
                    Max Cap ₹ (opt.)
                  </label>
                  <input
                    type="number"
                    min={0}
                    placeholder="No cap"
                    value={couponForm.maxDiscount}
                    onChange={(e) => setCouponForm({ ...couponForm, maxDiscount: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#522C28]/20 bg-[#FFF8EE] text-xs font-bold"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#D73B3A] hover:bg-[#ED0006] text-white font-black text-xs uppercase tracking-wider shadow-md cursor-pointer"
              >
                Create Coupon
              </button>
            </form>

            <div className="lg:col-span-7 p-6 rounded-3xl bg-white border-2 border-[#522C28]/15 shadow-sm space-y-4">
              <h2 className="font-display text-2xl uppercase text-[#25100E]">
                Active Store Coupons
              </h2>
              <div className="space-y-2.5">
                {(data.coupons || []).map((c) => (
                  <div
                    key={c.code}
                    className="p-4 rounded-2xl bg-[#FFF8EE] border border-[#522C28]/15 flex flex-wrap items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-sm text-[#25100E] px-2.5 py-0.5 rounded-lg bg-[#FAC537]">
                          {c.code}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            c.active
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {c.active ? "Active" : "Paused"}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-[#522C28]/80 mt-1">
                        {c.discountType === "percent" ? `${c.value}% OFF` : `₹${c.value} OFF`} • Min
                        order ₹{c.minOrder}
                        {c.maxDiscount ? ` • Max discount ₹${c.maxDiscount}` : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleCoupon(c.code, c.active)}
                        className="px-3 py-1.5 rounded-full bg-white border border-[#522C28]/20 text-[10px] font-black uppercase cursor-pointer"
                      >
                        {c.active ? "Pause" : "Activate"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCoupon(c.code)}
                        className="p-1.5 rounded-full bg-red-50 text-red-600 hover:bg-red-100 cursor-pointer"
                        title="Delete Coupon"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =================================================================
            TAB 5: SHIPROCKET SETTINGS, GMAIL & LOGS
            ================================================================= */}
        {tab === "shiprocket" && data && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Settings Form */}
              <form
                onSubmit={handleSaveSettings}
                className="lg:col-span-6 p-6 rounded-3xl bg-white border-2 border-[#522C28]/15 shadow-sm space-y-4"
              >
                <h2 className="font-display text-2xl uppercase text-[#25100E]">
                  Shiprocket API Credentials
                </h2>

                <div>
                  <label className="block text-[11px] font-black uppercase mb-1">
                    Environment
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(["staging", "production"] as const).map((env) => (
                      <button
                        key={env}
                        type="button"
                        onClick={() => setSettingsForm({ ...settingsForm, environment: env })}
                        className={`py-2.5 rounded-xl text-xs font-black uppercase border-2 cursor-pointer ${
                          settingsForm.environment === env
                            ? "bg-[#25100E] text-[#FAC537] border-[#25100E]"
                            : "bg-[#FFF8EE] text-[#522C28] border-[#522C28]/15"
                        }`}
                      >
                        {env}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] font-semibold text-[#522C28]/65 mt-1">
                    {settingsForm.environment === "production"
                      ? "API: https://checkout-api.shiprocket.com"
                      : "API: https://fastrr-api-dev.pickrr.com"}
                  </p>
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase mb-1">
                    X-Api-Key
                  </label>
                  <input
                    value={settingsForm.apiKey}
                    onChange={(e) => setSettingsForm({ ...settingsForm, apiKey: e.target.value })}
                    placeholder="Paste Shiprocket API Key"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#522C28]/20 bg-[#FFF8EE] text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase mb-1">
                    API Secret Key (HMAC-SHA256)
                  </label>
                  <input
                    type="password"
                    value={settingsForm.apiSecret}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, apiSecret: e.target.value })
                    }
                    placeholder={
                      data.settings.hasApiSecret
                        ? `Saved (${data.settings.maskedSecret}) — enter to replace`
                        : "Paste Shiprocket Secret Key"
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#522C28]/20 bg-[#FFF8EE] text-xs font-mono font-bold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-black uppercase mb-1">
                      Seller Domain (#sellerDomain)
                    </label>
                    <input
                      value={settingsForm.sellerDomain}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, sellerDomain: e.target.value })
                      }
                      placeholder="snackpopculture.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#522C28]/20 bg-[#FFF8EE] text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-black uppercase mb-1">
                      Redirect Base URL (optional)
                    </label>
                    <input
                      value={settingsForm.redirectBaseUrl}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, redirectBaseUrl: e.target.value })
                      }
                      placeholder={siteOrigin}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#522C28]/20 bg-[#FFF8EE] text-xs font-bold"
                    />
                  </div>
                </div>

                {/* Gmail Notification Settings */}
                <div className="pt-4 border-t border-[#522C28]/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-lg uppercase text-[#25100E] flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#D73B3A]" />
                      Gmail Order Notifications
                    </h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        data.settings.gmailConfigured
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {data.settings.gmailConfigured ? "SMTP Ready" : "Set App Password in .env.local"}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-black uppercase mb-1">
                        Sender Gmail (GMAIL_USER)
                      </label>
                      <input
                        type="email"
                        value={settingsForm.gmailUser}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, gmailUser: e.target.value })
                        }
                        placeholder="orders@gmail.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#522C28]/20 bg-[#FFF8EE] text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-black uppercase mb-1">
                        Admin Alert Email
                      </label>
                      <input
                        type="email"
                        value={settingsForm.adminNotifyEmail}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, adminNotifyEmail: e.target.value })
                        }
                        placeholder="contact@snackpopculture.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#522C28]/20 bg-[#FFF8EE] text-xs font-bold"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-[#D73B3A] hover:bg-[#ED0006] text-white font-black text-xs uppercase tracking-wider shadow-md cursor-pointer"
                >
                  Save Shiprocket & Email Settings
                </button>
              </form>

              {/* Onboarding Endpoints to Share with Shiprocket */}
              <div className="lg:col-span-6 p-6 rounded-3xl bg-white border-2 border-[#522C28]/15 shadow-sm space-y-4">
                <div>
                  <h2 className="font-display text-2xl uppercase text-[#25100E]">
                    Endpoints for Shiprocket Onboarding
                  </h2>
                  <p className="text-xs font-semibold text-[#522C28]/75 mt-0.5">
                    Share these live endpoints with Shiprocket’s integration team to configure Catalog Sync, Order Webhooks & Loyalty.
                  </p>
                </div>

                <div className="space-y-2.5">
                  {onboardingEndpoints.map((ep) => (
                    <div
                      key={ep.label}
                      className="p-3 rounded-2xl bg-[#FFF8EE] border border-[#522C28]/15 flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <p className="text-[10px] font-black uppercase text-[#D73B3A]">
                          {ep.label}
                        </p>
                        <p className="text-[11px] font-mono text-[#25100E] truncate">{ep.url}</p>
                      </div>
                      <button
                        onClick={() => handleCopy(ep.label, ep.url)}
                        className="px-2.5 py-1.5 rounded-lg bg-white border border-[#522C28]/20 text-[10px] font-black uppercase flex items-center gap-1 flex-shrink-0 cursor-pointer"
                      >
                        {copiedKey === ep.label ? (
                          <>
                            <Check className="w-3 h-3 text-[#3CA837]" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>

                {/* HMAC Tester */}
                <div className="pt-3 border-t border-[#522C28]/10 space-y-2">
                  <p className="text-[11px] font-black uppercase text-[#25100E]">
                    HMAC-SHA256 Base64 Signature Tester
                  </p>
                  <div className="flex gap-2">
                    <input
                      value={hmacTestInput}
                      onChange={(e) => setHmacTestInput(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl border border-[#522C28]/20 bg-[#FFF8EE] text-xs font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => handleSyncCall("test_hmac", { sampleJson: hmacTestInput })}
                      className="px-4 py-2 rounded-xl bg-[#25100E] text-[#FAC537] text-xs font-black uppercase cursor-pointer"
                    >
                      Sign
                    </button>
                  </div>
                  {hmacTestResult && (
                    <p className="text-[11px] font-mono bg-[#FFF8EE] p-2 rounded-lg break-all border border-[#522C28]/10">
                      X-Api-HMAC-SHA256: {hmacTestResult}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Webhook Logs Table */}
            <div className="p-6 rounded-3xl bg-white border-2 border-[#522C28]/15 shadow-sm">
              <h3 className="font-display text-xl uppercase text-[#25100E] mb-4">
                Webhook & Sync Activity Log ({data.webhookLogs.length})
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#522C28]/15 text-[10px] font-black uppercase text-[#522C28]/70">
                      <th className="py-2 pr-4">Time</th>
                      <th className="py-2 pr-4">Dir</th>
                      <th className="py-2 pr-4">Event</th>
                      <th className="py-2 pr-4">Status</th>
                      <th className="py-2">Summary</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#522C28]/10">
                    {data.webhookLogs.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-[#522C28]/60">
                          No webhook events recorded yet.
                        </td>
                      </tr>
                    ) : (
                      data.webhookLogs.map((log) => (
                        <tr key={log.id}>
                          <td className="py-2.5 pr-4 whitespace-nowrap font-mono text-[11px]">
                            {new Date(log.timestamp).toLocaleString()}
                          </td>
                          <td className="py-2.5 pr-4 font-black text-[10px]">{log.direction}</td>
                          <td className="py-2.5 pr-4 font-bold">{log.event}</td>
                          <td className="py-2.5 pr-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                                log.ok
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {log.httpStatus}
                            </span>
                          </td>
                          <td className="py-2.5 font-medium">{log.summary}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* =================================================================
          MODAL: ORDER DETAIL & REFUND
          ================================================================= */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-[#25100E]/60 z-50 flex items-center justify-center p-4">
          <div className="bg-[#FFF8EE] rounded-3xl border-2 border-[#522C28]/20 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#522C28]/15">
              <div>
                <h3 className="font-display text-2xl uppercase text-[#25100E]">
                  Order #{selectedOrder.order_id}
                </h3>
                <p className="text-xs font-bold text-[#522C28]/70">
                  Created {new Date(selectedOrder.created_at).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-white border border-[#522C28]/10">
                <p className="text-[10px] font-black uppercase text-[#D73B3A]">Customer</p>
                <p className="font-bold mt-1">Phone: {selectedOrder.phone || "—"}</p>
                <p className="font-semibold">Email: {selectedOrder.email || "—"}</p>
                <p className="font-semibold">
                  Payment: {selectedOrder.payment_type || "—"} ({selectedOrder.payment_status || "Pending"})
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-[#522C28]/10">
                <p className="text-[10px] font-black uppercase text-[#D73B3A]">
                  Shipping Address
                </p>
                {selectedOrder.shipping_address ? (
                  <p className="font-semibold mt-1">
                    {String(selectedOrder.shipping_address.first_name || "")}{" "}
                    {String(selectedOrder.shipping_address.last_name || "")}
                    <br />
                    {String(selectedOrder.shipping_address.line1 || "")}{" "}
                    {String(selectedOrder.shipping_address.line2 || "")}
                    <br />
                    {String(selectedOrder.shipping_address.city || "")}{" "}
                    {String(selectedOrder.shipping_address.pincode || "")}
                  </p>
                ) : (
                  <p className="text-[#522C28]/60 mt-1">Not provided yet</p>
                )}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#522C28]/10 space-y-2 text-xs">
              <p className="text-[10px] font-black uppercase text-[#D73B3A]">Line Items</p>
              {selectedOrder.cart_data.items.map((it, idx) => (
                <div key={idx} className="flex justify-between font-bold">
                  <span>
                    {it.name || `Variant #${it.variant_id}`} × {it.quantity}
                  </span>
                  <span>{it.price ? `₹${it.price * it.quantity}` : ""}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-[#522C28]/10 flex justify-between font-black text-sm text-[#25100E]">
                <span>Total Payable</span>
                <span>₹{selectedOrder.total_amount_payable ?? selectedOrder.subtotal_price ?? 0}</span>
              </div>
            </div>

            {/* Refund Section */}
            <div className="p-4 rounded-2xl bg-white border border-[#522C28]/15 space-y-2">
              <p className="text-[11px] font-black uppercase text-[#25100E] flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5 text-[#D73B3A]" />
                <span>Initiate Shiprocket Refund</span>
              </p>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  placeholder="Amount (₹)"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-[#522C28]/20 bg-[#FFF8EE] text-xs font-black w-36"
                />
                <button
                  onClick={() =>
                    handleSyncCall("refund_initiate", {
                      order_id: selectedOrder.fastrr_order_id || selectedOrder.order_id,
                      amount: Number(refundAmount),
                    })
                  }
                  disabled={!refundAmount || selectedOrder.isDemo}
                  className="px-4 py-2 rounded-xl bg-[#D73B3A] disabled:opacity-50 text-white text-xs font-black uppercase cursor-pointer"
                >
                  Trigger Refund
                </button>
              </div>
              {selectedOrder.isDemo && (
                <p className="text-[10px] font-semibold text-[#522C28]/65">
                  Sandbox orders are local test records (live refunds activate once Shiprocket credentials are saved).
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =================================================================
          MODAL: ADD NEW FLAVOUR / COMBO
          ================================================================= */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-[#25100E]/60 z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateProduct}
            className="bg-[#FFF8EE] rounded-3xl border-2 border-[#522C28]/20 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#522C28]/15">
              <h3 className="font-display text-2xl uppercase text-[#25100E]">
                Add New Flavour or Combo
              </h3>
              <button
                type="button"
                onClick={() => setShowAddProduct(false)}
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Single Flavour", val: false },
                { label: "Combo Bundle", val: true },
              ].map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => setNewProd({ ...newProd, isCombo: opt.val })}
                  className={`py-2 rounded-xl text-xs font-black uppercase border-2 cursor-pointer ${
                    newProd.isCombo === opt.val
                      ? "bg-[#25100E] text-[#FAC537] border-[#25100E]"
                      : "bg-white text-[#522C28] border-[#522C28]/15"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-4 gap-2">
              <div className="col-span-3">
                <label className="block text-[10px] font-black uppercase mb-1">Title *</label>
                <input
                  required
                  placeholder="e.g. MINT PUDINA"
                  value={newProd.title}
                  onChange={(e) => setNewProd({ ...newProd, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#522C28]/20 bg-white text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase mb-1">Emoji</label>
                <input
                  value={newProd.emoji}
                  onChange={(e) => setNewProd({ ...newProd, emoji: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#522C28]/20 bg-white text-xs text-center"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase mb-1">Tagline</label>
              <input
                placeholder="Cool, Zesty & Crisp"
                value={newProd.tagline}
                onChange={(e) => setNewProd({ ...newProd, tagline: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#522C28]/20 bg-white text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase mb-1">Description</label>
              <textarea
                rows={2}
                placeholder="Short description for Shop & Shiprocket catalog..."
                value={newProd.shortDesc}
                onChange={(e) => setNewProd({ ...newProd, shortDesc: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#522C28]/20 bg-white text-xs font-medium"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div>
                <label className="block text-[10px] font-black uppercase mb-1">Price (₹)</label>
                <input
                  type="number"
                  required
                  value={newProd.price}
                  onChange={(e) => setNewProd({ ...newProd, price: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#522C28]/20 bg-white text-xs font-black"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase mb-1">MRP (₹)</label>
                <input
                  type="number"
                  value={newProd.compareAtPrice}
                  onChange={(e) => setNewProd({ ...newProd, compareAtPrice: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#522C28]/20 bg-white text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase mb-1">Stock</label>
                <input
                  type="number"
                  value={newProd.quantity}
                  onChange={(e) => setNewProd({ ...newProd, quantity: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#522C28]/20 bg-white text-xs font-black"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase mb-1">Weight (g)</label>
                <input
                  type="number"
                  value={newProd.grams}
                  onChange={(e) => setNewProd({ ...newProd, grams: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#522C28]/20 bg-white text-xs font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase mb-1">
                Packet Image (Preset or Upload)
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  value={newProd.image}
                  onChange={(e) => setNewProd({ ...newProd, image: e.target.value })}
                  placeholder="/packets/peri peri.svg or uploaded URL"
                  className="flex-1 px-3 py-2 rounded-xl border border-[#522C28]/20 bg-white text-xs font-bold"
                />
                <label className="px-3 py-2 rounded-xl bg-[#25100E] text-[#FAC537] text-[10px] font-black uppercase inline-flex items-center gap-1.5 cursor-pointer shrink-0">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadingImage ? "Uploading..." : "Upload Image"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) void handleUploadImage(f);
                    }}
                  />
                </label>
              </div>
              <div className="flex flex-wrap gap-2 mt-1.5">
                {[
                  { label: "Peri Peri", path: "/packets/peri peri.svg" },
                  { label: "Cheese", path: "/packets/cheese.svg" },
                  { label: "Pink Salt", path: "/packets/pink-salt-pouch.png" },
                  { label: "Raw", path: "/packets/raw-makhana-pouch.png" },
                ].map((preset) => (
                  <button
                    key={preset.path}
                    type="button"
                    onClick={() => setNewProd({ ...newProd, image: preset.path })}
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-[#522C28]/20 hover:border-[#D73B3A] cursor-pointer"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-full bg-[#D73B3A] hover:bg-[#ED0006] text-white font-black text-xs uppercase tracking-wider shadow-md cursor-pointer"
            >
              Create & Sync to Catalog
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
