import type {
  StoreProduct,
  StoreCollection,
  StoreOrder,
  StoreCoupon,
  WebhookLog,
} from "@/lib/store";
import type { ShiprocketEnv } from "@/lib/shiprocket";

export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  successOrders: number;
  initiatedOrders: number;
  totalProducts: number;
  totalVariants: number;
  lowStockVariants: number;
  totalUsers?: number;
  totalGameRuns?: number;
}

export interface AdminSettingsView {
  environment: ShiprocketEnv;
  apiKey: string;
  hasApiSecret: boolean;
  maskedSecret: string;
  sellerDomain: string;
  redirectBaseUrl: string;
  loyaltyEnabled: boolean;
  gmailUser?: string;
  adminNotifyEmail?: string;
  gmailConfigured?: boolean;
  updatedAt: string;
}

export interface AdminOverviewResponse {
  ok: boolean;
  stats: AdminStats;
  products: StoreProduct[];
  collections: StoreCollection[];
  orders: StoreOrder[];
  coupons?: StoreCoupon[];
  webhookLogs: WebhookLog[];
  settings: AdminSettingsView;
}
