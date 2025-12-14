import { useState, useCallback } from "react";

interface Category {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    createdAt: string;
}

interface FormData {
    name: string;
    description: string;
    parentId: string;
}

export function useCategoryForm(onSuccess: (isUpdate: boolean) => void) {
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState<FormData>({
        name: "",
        description: "",
        parentId: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const openCreateModal = useCallback(() => {
        setShowModal(true);
        setEditingCategory(null);
        setFormData({ name: "", description: "", parentId: "" });
        setError("");
    }, []);

    const openEditModal = useCallback((category: Category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            description: category.description || "",
            parentId: (category as any).parentId || "",
        });
        setShowModal(true);
        setError("");
    }, []);

    const closeModal = useCallback(() => {
        setShowModal(false);
        setEditingCategory(null);
        setFormData({ name: "", description: "", parentId: "" });
        setError("");
    }, []);

    const updateFormField = useCallback((field: 'name' | 'description' | 'parentId', value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    }, []);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");

        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/categories`;
            const method = editingCategory ? 'PUT' : 'POST';
            const body: any = {
                name: formData.name,
                description: formData.description,
            };
            
            // Only include parentId if it's provided
            if (formData.parentId) {
                body.parentId = formData.parentId;
            } else if (editingCategory) {
                // When editing, explicitly set to null if no parent selected
                body.parentId = null;
            }

            const response = await fetch(
                editingCategory ? `${url}/${editingCategory.id}` : url,
                {
                    method,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify(body),
                }
            );

            const data = await response.json();

            if (data.success) {
                const isUpdate = !!editingCategory;
                closeModal();
                onSuccess(isUpdate);
            } else {
                setError(data.error || `Failed to ${editingCategory ? 'update' : 'create'} category`);
            }
        } catch (error) {
            console.error(`Failed to ${editingCategory ? 'update' : 'create'} category:`, error);
            setError(`An error occurred while ${editingCategory ? 'updating' : 'creating'} the category`);
        } finally {
            setSubmitting(false);
        }
    }, [editingCategory, formData, onSuccess, closeModal]);

    return {
        showModal,
        editingCategory,
        formData,
        submitting,
        error,
        openCreateModal,
        openEditModal,
        closeModal,
        updateFormField,
        handleSubmit,
    };
}
