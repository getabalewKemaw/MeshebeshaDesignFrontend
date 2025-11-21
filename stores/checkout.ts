"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import type {
  AddressCaptureMode,
  ContactInformation,
  DeliveryPreference,
  ShippingAddress,
} from "@/types/cart";

interface CheckoutState {
  contactInfo: ContactInformation;
  shippingAddress: ShippingAddress;
  deliveryPreference: DeliveryPreference;
  paymentNote: string;
  hasHydrated: boolean;
  setContactInfo: (payload: Partial<ContactInformation>) => void;
  setShippingAddress: (payload: Partial<ShippingAddress>) => void;
  setAddressMode: (mode: AddressCaptureMode) => void;
  setDeliveryPreference: (payload: Partial<DeliveryPreference>) => void;
  setPaymentNote: (note: string) => void;
  reset: () => void;
}

const defaultContact: ContactInformation = {
  fullName: "",
  email: "",
  phone: "",
};

const defaultAddress: ShippingAddress = {
  mode: "manual",
  line1: "",
  line2: "",
  city: "",
  state: "",
  country: "",
  postalCode: "",
};

const defaultDelivery: DeliveryPreference = {
  speed: "standard",
  preferredDate: null,
  preferredWindow: "",
  instructions: "",
};

const storage =
  typeof window !== "undefined"
    ? createJSONStorage<CheckoutState>(() => sessionStorage)
    : undefined;

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set) => ({
      contactInfo: defaultContact,
      shippingAddress: defaultAddress,
      deliveryPreference: defaultDelivery,
      paymentNote: "",
      hasHydrated: false,
      setContactInfo: (payload) =>
        set((state) => ({
          contactInfo: { ...state.contactInfo, ...payload },
        })),
      setShippingAddress: (payload) =>
        set((state) => ({
          shippingAddress: { ...state.shippingAddress, ...payload },
        })),
      setAddressMode: (mode) =>
        set((state) => ({
          shippingAddress: {
            ...state.shippingAddress,
            mode,
            ...(mode === "google"
              ? { line1: "", line2: "", city: "", state: "", postalCode: "" }
              : { formattedAddress: "", placeId: undefined }),
          },
        })),
      setDeliveryPreference: (payload) =>
        set((state) => ({
          deliveryPreference: {
            ...state.deliveryPreference,
            ...payload,
          },
        })),
      setPaymentNote: (note) => set({ paymentNote: note }),
      reset: () =>
        set({
          contactInfo: defaultContact,
          shippingAddress: defaultAddress,
          deliveryPreference: defaultDelivery,
          paymentNote: "",
        }),
    }),
    {
      name: "meshebesha-checkout",
      storage,
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.hasHydrated = true;
        }
      },
    }
  )
);

