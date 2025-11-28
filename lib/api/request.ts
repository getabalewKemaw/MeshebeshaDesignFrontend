import { axiosClient } from "../axiosClient";
import axios, { AxiosRequestConfig } from "axios";

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
    pagination?: {
        total: number;
        limit: number;
        offset: number;
        totalPages: number;
    };
    [key: string]: any; // Allow for other properties like unreadCount
}

interface RequestOptions extends AxiosRequestConfig {
    method?: string;
    body?: any;
}

/**
 * Generic helper to make API requests using axiosClient
 */
export async function apiRequest<T>(
    endpoint: string,
    options: RequestOptions = {}
): Promise<ApiResponse<T>> {
    try {
        const config: AxiosRequestConfig = {
            url: endpoint,
            method: options.method || "GET",
            data: options.body,
            headers: options.headers,
            ...options, // Pass through other axios config options
        };

        // Remove custom properties that shouldn't be passed to axios directly if they exist in options
        delete (config as any).body;

        const response = await axiosClient.request(config);
        return response.data;
    } catch (error: unknown) {
        console.error(`API request failed for ${endpoint}:`, error);

        if (axios.isAxiosError(error)) {
            // Handle axios error response
            if (error.response?.data) {
                // If the server returned a structured error response, return it
                // Ensure it matches ApiResponse shape
                const errorData = error.response.data;
                if (typeof errorData === 'object' && errorData !== null) {
                    return {
                        success: false,
                        error: errorData.error || error.message,
                        ...errorData
                    } as ApiResponse<T>;
                }
                return {
                    success: false,
                    error: JSON.stringify(errorData)
                };
            }

            return {
                success: false,
                error: error.message || "Network error",
            };
        }

        if (error instanceof Error) {
            return {
                success: false,
                error: error.message,
            };
        }

        return {
            success: false,
            error: "An unexpected error occurred",
        };
    }
}
