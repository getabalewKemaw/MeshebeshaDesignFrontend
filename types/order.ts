import type {
  DeliveryPreference,
  ShippingAddress,
  ContactInformation,
  CartSyncItem,
} from "@/types/cart";

export interface OrderLineItem extends CartSyncItem {
  title: string;
  unitPrice: number;
  total: number;
}

export interface OrderPreview {
  currency: string;
  subtotal: number;
  items: OrderLineItem[];
}

export interface PaymentRecord {
  id: string;
  provider: string;
  providerTx?: string | null;
  amount: number;
  currency: string;
  status: string;
  metadata?: Record<string, unknown> | null;
  createdAt?: string;
}

export interface ShippingInfo {
  contact?: ContactInformation | null;
  address?: ShippingAddress | null;
  deliveryPreference?: DeliveryPreference | null;
}

export interface OrderSummary {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  currency: string;
  createdAt: string;
  updatedAt?: string;
  shippingInfo?: ShippingInfo | null;
  items: Array<{
    id?: string;
    variantId: string;
    title: string;
    quantity: number;
    unitPrice: number;
    size?: string | null;
    product?: {
      id: string;
      title: string;
      slug?: string;
      image?: string | null;
    };
  }>;
  payments?: PaymentRecord[];
  user?: {
    id: string;
    name: string;
    email: string;
  } | null;
}

export interface CreateOrderPayload {
  items: CartSyncItem[];
  contact: ContactInformation;
  shippingAddress: ShippingAddress;
  deliveryPreference: DeliveryPreference;
  paymentNote?: string;
}

export type AdminOrder = OrderSummary;

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

