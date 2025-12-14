"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useCategories } from "@/lib/hooks/admin/useCategories";
import { useCategoryForm } from "@/lib/hooks/admin/useCategoryForm";
import AlertMessage from "@/components/admin/AlertMessage";
import CategoryEmptyState from "@/components/admin/categories/CategoryEmptyState";
import CategoryTable from "@/components/admin/categories/CategoryTable";
import CategoryModal from "@/components/admin/categories/CategoryModal";

export default function CategoriesPage() {
  const { isAdmin, isLoading } = useAuth();
  const router = useRouter();
  const [success, setSuccess] = useState("");
  const [globalError, setGlobalError] = useState("");

  const showMessage = (message: string, type: 'success' | 'error') => {
    if (type === 'success') {
      setSuccess(message);
      setGlobalError("");
    } else {
      setGlobalError(message);
      setSuccess("");
    }
    setTimeout(() => {
      setSuccess("");
      setGlobalError("");
    }, 3000);
  };

  // Custom hooks for data and form management
  const { categories, loading, error, fetchCategories, deleteCategory } = useCategories();
  const [parentCategories, setParentCategories] = useState<Array<{ id: string; name: string }>>([]);
  
  const {
    showModal,
    editingCategory,
    formData,
    submitting,
    error: formError,
    openCreateModal,
    openEditModal,
    closeModal,
    updateFormField,
    handleSubmit,
  } = useCategoryForm((isUpdate) => {
    showMessage(
      isUpdate ? "Category updated successfully!" : "Category created successfully!",
      'success'
    );
    fetchCategories();
    fetchParentCategories();
  });

  // Fetch parent categories for the dropdown
  const fetchParentCategories = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/categories`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      if (data.success) {
        // Filter to only parent categories (no parentId)
        const parents = data.data
          .filter((cat: any) => !cat.parentId)
          .map((cat: any) => ({ id: cat.id, name: cat.name }));
        setParentCategories(parents);
      }
    } catch (error) {
      console.error("Failed to fetch parent categories:", error);
    }
  };

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push("/dashboard");
    }
  }, [isAdmin, isLoading, router]);

  useEffect(() => {
    if (isAdmin) {
      fetchCategories();
      fetchParentCategories();
    }
  }, [isAdmin, fetchCategories]);

  const handleDelete = async (categoryId: string) => {
    if (!confirm("Are you sure you want to delete this category? This action cannot be undone.")) {
      return;
    }

    const result = await deleteCategory(categoryId);
    if (result.success) {
      showMessage("Category deleted successfully!", 'success');
      fetchCategories();
    } else {
      showMessage(result.error || "Failed to delete category", 'error');
    }
  };

  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#310101]">Categories</h1>
          <p className="text-gray-600 mt-1">Organize your products</p>
        </div>
        <button
          onClick={openCreateModal}
          className="form-button-primary flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Add Category
        </button>
      </div>

      {/* Messages */}
      {(globalError || error) && <AlertMessage message={globalError || error} type="error" />}
      {success && <AlertMessage message={success} type="success" />}

      {/* Categories List */}
      {categories.length === 0 ? (
        <CategoryEmptyState onAddClick={openCreateModal} />
      ) : (
        <CategoryTable
          categories={categories}
          onEdit={openEditModal}
          onDelete={handleDelete}
        />
      )}

      {/* Add/Edit Category Modal */}
      <CategoryModal
        isOpen={showModal}
        editingCategory={editingCategory}
        formData={formData}
        error={formError}
        submitting={submitting}
        parentCategories={parentCategories}
        onClose={closeModal}
        onSubmit={handleSubmit}
        onFormChange={updateFormField}
      />
    </div>
  );
}
