"use client";

import { useEffect, useRef, useState } from "react";
import type { ShippingAddress } from "@/types/cart";

interface GoogleMapPickerProps {
  value: ShippingAddress;
  onChange: (address: Partial<ShippingAddress>) => void;
  className?: string;
}

declare global {
  interface Window {
    google: any;
  }
}

export default function GoogleMapPicker({
  value,
  onChange,
  className = "",
}: GoogleMapPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      setIsLoaded(true);
      setIsLoading(false);
      initializeMap();
      return;
    }

    // Load Google Maps script
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places,geometry`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setIsLoaded(true);
      setIsLoading(false);
      initializeMap();
    };
    script.onerror = () => {
      console.error("Failed to load Google Maps script");
      setError("Failed to load Google Maps. Please check your API key.");
      setIsLoading(false);
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
      if (mapInstanceRef.current) {
        window.google?.maps?.event?.clearInstanceListeners?.(mapInstanceRef.current);
      }
    };
  }, []);

  // Initialize map when loaded
  useEffect(() => {
    if (isLoaded && mapRef.current && !mapInstanceRef.current) {
      initializeMap();
    }
  }, [isLoaded]);

  // Update marker when coordinates change externally
  useEffect(() => {
    if (
      isLoaded &&
      mapInstanceRef.current &&
      value.latitude &&
      value.longitude &&
      (!markerRef.current ||
        markerRef.current.getPosition().lat() !== value.latitude ||
        markerRef.current.getPosition().lng() !== value.longitude)
    ) {
      const position = new window.google.maps.LatLng(value.latitude, value.longitude);
      if (markerRef.current) {
        markerRef.current.setPosition(position);
      } else {
        markerRef.current = new window.google.maps.Marker({
          position,
          map: mapInstanceRef.current,
          draggable: true,
          animation: window.google.maps.Animation.DROP,
        });

        markerRef.current.addListener("dragend", () => {
          const pos = markerRef.current.getPosition();
          reverseGeocode(pos.lat(), pos.lng());
        });
      }
      mapInstanceRef.current.setCenter(position);
    }
  }, [value.latitude, value.longitude, isLoaded]);

  const initializeMap = () => {
    if (!mapRef.current || !window.google?.maps) return;

    // Default center (can be user's location or a default)
    const defaultCenter = value.latitude && value.longitude
      ? { lat: value.latitude, lng: value.longitude }
      : { lat: 9.145, lng: 38.7667 }; // Default to Addis Ababa, Ethiopia

    const map = new window.google.maps.Map(mapRef.current, {
      center: defaultCenter,
      zoom: value.latitude && value.longitude ? 15 : 12,
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true,
    });

    mapInstanceRef.current = map;

    // Add click listener to map
    map.addListener("click", (event: any) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      reverseGeocode(lat, lng);
    });

    // If we have existing coordinates, add marker
    if (value.latitude && value.longitude) {
      const position = new window.google.maps.LatLng(value.latitude, value.longitude);
      markerRef.current = new window.google.maps.Marker({
        position,
        map,
        draggable: true,
        animation: window.google.maps.Animation.DROP,
      });

      markerRef.current.addListener("dragend", () => {
        const pos = markerRef.current.getPosition();
        reverseGeocode(pos.lat(), pos.lng());
      });
    }
  };

  const reverseGeocode = (lat: number, lng: number) => {
    if (!window.google?.maps) return;

    const geocoder = new window.google.maps.Geocoder();

    geocoder.geocode({ location: { lat, lng } }, (results: any[], status: string) => {
      if (status === "OK" && results && results.length > 0) {
        const place = results[0];

        // Extract address components
        const addressComponents: Record<string, string> = {};
        place.address_components?.forEach((component: any) => {
          const type = component.types[0];
          addressComponents[type] = component.long_name;
        });

        // Build address data
        const addressData: Partial<ShippingAddress> = {
          mode: "google",
          formattedAddress: place.formatted_address,
          placeId: place.place_id || undefined,
          latitude: lat,
          longitude: lng,
          line1: addressComponents.street_number
            ? `${addressComponents.street_number} ${addressComponents.route || ""}`.trim()
            : addressComponents.route || place.formatted_address.split(",")[0] || "",
          line2: addressComponents.subpremise || undefined,
          city: addressComponents.locality || addressComponents.sublocality || "",
          state: addressComponents.administrative_area_level_1 || undefined,
          country: addressComponents.country || "",
          postalCode: addressComponents.postal_code || undefined,
        };

        onChange(addressData);

        // Update marker position
        if (!markerRef.current && mapInstanceRef.current) {
          markerRef.current = new window.google.maps.Marker({
            position: { lat, lng },
            map: mapInstanceRef.current,
            draggable: true,
            animation: window.google.maps.Animation.DROP,
          });

          markerRef.current.addListener("dragend", () => {
            const pos = markerRef.current.getPosition();
            reverseGeocode(pos.lat(), pos.lng());
          });
        } else if (markerRef.current) {
          markerRef.current.setPosition({ lat, lng });
        }
      } else {
        console.error("Geocoding failed:", status);
        setError("Failed to get address for selected location. Please try again.");
      }
    });
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        reverseGeocode(lat, lng);
        setIsLoading(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        setError("Unable to get your location. Please select a location on the map.");
        setIsLoading(false);
      }
    );
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-700">
          Click on the map to select your delivery location
        </p>
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={isLoading || !isLoaded}
          className="px-3 py-1.5 text-xs font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          📍 Use My Location
        </button>
      </div>

      <div className="relative">
        <div
          ref={mapRef}
          className="w-full h-96 rounded-lg border border-gray-300 overflow-hidden"
          style={{ minHeight: "384px" }}
        />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 rounded-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Loading map...</p>
            </div>
          </div>
        )}
        {error && (
          <div className="absolute top-2 left-2 right-2 bg-red-50 border border-red-200 rounded-lg p-2 text-xs text-red-700">
            {error}
            <button
              onClick={() => setError(null)}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        )}
        {!isLoading && !isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
            <p className="text-sm text-amber-600 text-center px-4">
              ⚠️ Google Maps API key not configured. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env file.
            </p>
          </div>
        )}
      </div>

      {value.latitude && value.longitude && (
        <div className="text-xs text-gray-500">
          Selected: {value.latitude.toFixed(6)}, {value.longitude.toFixed(6)}
        </div>
      )}
    </div>
  );
}






