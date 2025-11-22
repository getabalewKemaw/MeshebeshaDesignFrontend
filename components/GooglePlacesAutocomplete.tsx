"use client";

import { useEffect, useRef, useState } from "react";
import type { ShippingAddress } from "@/types/cart";

interface GooglePlacesAutocompleteProps {
  value: string;
  onChange: (address: Partial<ShippingAddress>) => void;
  placeholder?: string;
  className?: string;
}

declare global {
  interface Window {
    google: any;
    initGooglePlaces: () => void;
  }
}

export default function GooglePlacesAutocomplete({
  value,
  onChange,
  placeholder = "Start typing an address...",
  className = "",
}: GooglePlacesAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if Google Maps is already loaded
    if (window.google && window.google.maps && window.google.maps.places) {
      setIsLoaded(true);
      setIsLoading(false);
      initializeAutocomplete();
      return;
    }

    // Load Google Maps script
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setIsLoaded(true);
      setIsLoading(false);
      initializeAutocomplete();
    };
    script.onerror = () => {
      console.error("Failed to load Google Maps script");
      setIsLoading(false);
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup
      if (autocompleteRef.current) {
        window.google?.maps?.event?.clearInstanceListeners?.(autocompleteRef.current);
      }
    };
  }, []);

  const initializeAutocomplete = () => {
    if (!inputRef.current || !window.google?.maps?.places) return;

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ["address"],
      fields: [
        "formatted_address",
        "place_id",
        "geometry",
        "address_components",
        "name",
      ],
    });

    autocompleteRef.current = autocomplete;

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();

      if (!place.geometry || !place.geometry.location) {
        console.warn("No geometry data available for selected place");
        return;
      }

      // Extract address components
      const addressComponents: Record<string, string> = {};
      place.address_components?.forEach((component: any) => {
        const type = component.types[0];
        addressComponents[type] = component.long_name;
      });

      // Build address data
      const addressData: Partial<ShippingAddress> = {
        mode: "google",
        formattedAddress: place.formatted_address || value,
        placeId: place.place_id || undefined,
        latitude: place.geometry.location.lat(),
        longitude: place.geometry.location.lng(),
        // Extract individual components
        line1: addressComponents.street_number
          ? `${addressComponents.street_number} ${addressComponents.route || ""}`.trim()
          : addressComponents.route || place.name || "",
        line2: addressComponents.subpremise || undefined,
        city: addressComponents.locality || addressComponents.sublocality || "",
        state: addressComponents.administrative_area_level_1 || undefined,
        country: addressComponents.country || "",
        postalCode: addressComponents.postal_code || undefined,
      };

      onChange(addressData);
    });
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => {
          onChange({ formattedAddress: e.target.value });
        }}
        placeholder={isLoading ? "Loading Google Maps..." : placeholder}
        disabled={isLoading}
        className={`border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full ${
          isLoading ? "bg-gray-100 cursor-not-allowed" : ""
        } ${className}`}
      />
      {isLoading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
        </div>
      )}
      {!isLoading && !isLoaded && (
        <p className="text-xs text-amber-600 mt-1">
          ⚠️ Google Maps API key not configured. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env file.
        </p>
      )}
    </div>
  );
}


