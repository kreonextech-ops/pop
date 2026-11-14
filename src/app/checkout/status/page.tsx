"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Clock, XCircle, Package, ArrowRight, RefreshCw } from "lucide-react";
import { useCart } from "@/components/CartContext";
import type { StoreOrder } from "@/lib/store";

function CheckoutStatusContent() {
  const params = useSearchParams();
  const oid = params.get("oid") || "";
  const ost = (params.get("ost") || "").toUpperCase();
  const { clearCart } = useCart();

  const [order, setOrder] = useState<StoreOrder | null>(null);
  const [loading, setLoading] = useState(true);

  const loadOrder = async () => {
    if (!oid) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(oid)}`);
      const data = await res.json();
      if (data.ok && data.order) {
        setOrder(data.order);
        if (String(data.order.status).toUpperCase() === "SUCCESS") {
          clearCart();
        }
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ost === "SUCCESS") {
      clearCart();
    }
    loadOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oid, ost]);

  const effectiveStatus = (order?.status || ost || "INITIATED").toUpperCase();
  const isSuccess = effectiveStatus === "SUCCESS";
  const isFailed = effectiveStatus === "FAILED" || effectiveStatus === "CANCELLED";

  return (
    <div className="min-h-[70vh] bg-[#FFF8EE] text-[#522C28] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <img src="/pop-culture-logo.svg" alt="Pop Culture" className="h-10 w-auto" />
          </Link>
          <Link
            href="/shop"
            className="text-xs font-black uppercase text-[#D73B3A] hover:underline"
          >
            Back to Shop
          </Link>
        </div>

        <div className="rounded-3xl bg-white border-2 border-[#522C28]/15 shadow-xl p-6 sm:p-10 text-center">
          {isSuccess ? (
            <CheckCircle2 className="w-16 h-16 text-[#3CA837] mx-auto mb-4" />
          ) : isFailed ? (
            <XCircle className="w-16 h-16 text-[#D73B3A] mx-auto mb-4" />
          ) : (
            <Clock className="w-16 h-16 text-[#FAC537] mx-auto mb-4" />
          )}

          <span className="px-3 py-1 rounded-full bg-[#FFF8EE] border border-[#522C28]/15 text-[11px] font-black uppercase tracking-wider">
            Order Status: {effectiveStatus}
          </span>

          <h1 className="font-display text-3xl sm:text-4xl uppercase text-[#25100E] mt-3">
            {isSuccess
              ? "Crunch Box Confirmed!"
              : isFailed
              ? "Checkout Was Not Completed"
              : "Order Processing..."}
          </h1>

          <p className="text-xs sm:text-sm font-medium text-[#522C28]/80 mt-2">
            {isSuccess
              ? "Thank you for ordering from Pop Culture! Your fresh slow-roasted makhana batch is being packed."
              : "We are syncing your latest payment and order confirmation from Shiprocket."}
          </p>

          {oid && (
            <div className="mt-5 inline-block px-4 py-2 rounded-2xl bg-[#FFF8EE] border border-[#522C28]/15 text-xs font-black text-[#25100E]">
              Order ID: {oid}
              {order?.fastrr_order_id ? ` • Shiprocket #${order.fastrr_order_id}` : ""}
            </div>
          )}

          {loading ? (
            <p className="mt-6 text-xs font-bold text-[#522C28]/60">Loading order details...</p>
          ) : order ? (
            <div className="mt-8 text-left space-y-4 border-t border-[#522C28]/10 pt-6">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-1.5 text-[#25100E]">
                  <Package className="w-4 h-4 text-[#D73B3A]" />
                  <span>Items Ordered</span>
                </span>
                <span className="uppercase text-[#522C28]/70">
                  {order.payment_type || "PREPAID"}
                </span>
              </div>

              <div className="space-y-2">
                {order.cart_data.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between text-xs font-semibold bg-[#FFF8EE] px-4 py-2.5 rounded-xl"
                  >
                    <span>
                      {item.name || `Variant #${item.variant_id}`} × {item.quantity}
                    </span>
                    <span className="font-black text-[#25100E]">
                      {item.price ? `₹${item.price * item.quantity}` : ""}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-[#522C28]/10 text-sm font-black text-[#25100E]">
                <span>Total Paid / Payable</span>
                <span>₹{order.total_amount_payable ?? order.subtotal_price ?? 0}</span>
              </div>
            </div>
          ) : null}

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {!isSuccess && oid && (
              <button
                onClick={loadOrder}
                className="px-5 py-2.5 rounded-full bg-[#FFF8EE] border border-[#522C28]/20 text-xs font-black uppercase flex items-center gap-1.5 cursor-pointer transition-[border-color,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-[#D73B3A] active:scale-95"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh Status</span>
              </button>
            )}
            <Link
              href="/account"
              className="px-5 py-2.5 rounded-full bg-[#FAC537] text-[#522C28] font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:shadow-md active:scale-95"
            >
              <span>My Orders Dashboard</span>
            </Link>
            <Link
              href="/shop"
              className="px-6 py-3 rounded-full bg-[#25100E] text-[#FAC537] font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:shadow-lg active:scale-95"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutStatusPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center text-sm font-bold text-[#522C28]">
          Loading order status...
        </div>
      }
    >
      <CheckoutStatusContent />
    </Suspense>
  );
}
