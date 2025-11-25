"use client";

import Toast from "@/components/ui/Toast";
import { useToast } from "@/lib/hooks/useToast";

export default function ToastContainer() {
    const { toasts, removeToast } = useToast();

    return (
        <>
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </>
    );
}
