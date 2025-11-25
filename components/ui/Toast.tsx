"use client";

import { useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning";

interface ToastProps {
    message: string;
    type: ToastType;
    onClose: () => void;
    duration?: number;
}

export default function Toast({
    message,
    type,
    onClose,
    duration = 3000,
}: ToastProps) {
    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const icons = {
        success: <CheckCircle className="w-5 h-5" />,
        error: <AlertCircle className="w-5 h-5" />,
        info: <Info className="w-5 h-5" />,
        warning: <AlertTriangle className="w-5 h-5" />,
    };

    const styles = {
        success: "bg-green-50 border-green-500 text-green-800",
        error: "bg-red-50 border-red-500 text-red-800",
        info: "bg-blue-50 border-blue-500 text-blue-800",
        warning: "bg-yellow-50 border-yellow-500 text-yellow-800",
    };

    return (
        <div
            className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border-l-4 shadow-lg animate-slide-in ${styles[type]}`}
            role="alert"
        >
            <div className="flex-shrink-0">{icons[type]}</div>
            <p className="text-sm font-medium flex-1">{message}</p>
            <button
                onClick={onClose}
                className="flex-shrink-0 hover:opacity-70 transition-opacity"
                aria-label="Close notification"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}
