export type CartDeliverySpeed = 'standard' | 'express';

export interface CartItemInput {
  productId: string;
  variantId?: string | null;
  title: string;
  subtitle?: string | null;
  color?: string | null;
  size?: string | null;
  image?: string | null;
  currency: string;
  unitPrice: number;
  stock?: number | null;
}

export interface CartItem extends CartItemInput {
  /**
   * Deterministic identifier used to merge duplicates
   */
  key: string;
  quantity: number;
  addedAt: number;
}

export interface CartTotals {
  itemCount: number;
  subtotal: number;
}

export interface DeliveryPreference {
  speed: CartDeliverySpeed;
  preferredDate?: string | null;
  preferredWindow?: string | null;
  instructions?: string;
}

export interface ContactInformation {
  fullName: string;
  email: string;
  phone?: string;
}

export type AddressCaptureMode = 'google' | 'manual';

export interface ShippingAddress {
  mode: AddressCaptureMode;
  formattedAddress?: string;
  placeId?: string;
  latitude?: number | null;
  longitude?: number | null;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  country: string;
  postalCode?: string;
}

export interface CartSyncItem {
  variantId: string;
  quantity: number;
  size?: string | null;
}

export interface ServerCartItem {
  variantId: string;
  productId: string;
  quantity: number;
  title: string;
  subtitle?: string | null;
  color?: string | null;
  size?: string | null;
  currency: string;
  unitPrice: number;
  stock?: number | null;
  image?: string | null;
}

export interface ServerCartSnapshot {
  items: ServerCartItem[];
  totals: {
    itemCount: number;
    subtotal: number;
    currency: string;
  };
}

