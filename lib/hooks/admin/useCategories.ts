import { useState, useCallback } from "react";

interface Category {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    parentId: string | null;
    createdAt: string;
}

export function useCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchCategories = useCallback(async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/categories`,
                {
                    credentials: "include",
                }
            );
            const data = await response.json();
            if (data.success) {
                setCategories(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch categories:", error);
            setError("Failed to load categories");
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteCategory = useCallback(async (categoryId: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/categories/${categoryId}`,
                {
                    method: "DELETE",
                    credentials: "include",
                }
            );

            const data = await response.json();

            if (data.success) {
                return { success: true };
            } else {
                return { success: false, error: data.error || "Failed to delete category" };
            }
        } catch (error) {
            console.error("Failed to delete category:", error);
            return { success: false, error: "An error occurred while deleting the category" };
        }
    }, []);

    return {
        categories,
        loading,
        error,
        fetchCategories,
        deleteCategory,
    };
}
