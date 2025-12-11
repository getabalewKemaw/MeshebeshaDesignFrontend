import { apiRequest, ApiResponse } from "./request";

export interface CustomRequestData {
    name?: string;
    phone?: string;
    description: string;
    media: string[]; // URLs of uploaded files
    preferredDeadline?: string;
}

export const submitCustomRequest = async (data: CustomRequestData): Promise<ApiResponse<any>> => {
    return apiRequest('/api/v1/custom-requests', {
        method: 'POST',
        data // Use 'data' property as axios expects for body
    });
};

export const uploadCustomRequestMedia = async (file: File): Promise<ApiResponse<{ url: string }>> => {
    const formData = new FormData();
    formData.append('media', file);

    return apiRequest('/api/v1/custom-requests/upload', {
        method: 'POST',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};
