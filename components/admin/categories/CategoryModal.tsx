import { X, Save } from "lucide-react";

interface Category {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    createdAt: string;
}

interface CategoryModalProps {
    isOpen: boolean;
    editingCategory: Category | null;
    formData: {
        name: string;
        description: string;
        parentId: string;
    };
    error: string;
    submitting: boolean;
    parentCategories: Array<{ id: string; name: string }>;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    onFormChange: (field: 'name' | 'description' | 'parentId', value: string) => void;
}

export default function CategoryModal({
    isOpen,
    editingCategory,
    formData,
    error,
    submitting,
    parentCategories,
    onClose,
    onSubmit,
    onFormChange,
}: CategoryModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in-90 zoom-in-90">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {editingCategory ? "Edit Category" : "Add New Category"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {error && (
                    <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Category Name *
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => onFormChange('name', e.target.value)}
                            className="form-input-base"
                            placeholder="e.g., Traditional Scarves"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Parent Category (Optional)
                        </label>
                        <select
                            value={formData.parentId}
                            onChange={(e) => onFormChange('parentId', e.target.value)}
                            className="form-input-base"
                        >
                            <option value="">None (Top-level Category)</option>
                            {parentCategories
                                .filter(cat => !editingCategory || cat.id !== editingCategory.id)
                                .map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                            Leave empty to create a parent category, or select a parent to create a sub-category
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => onFormChange('description', e.target.value)}
                            rows={3}
                            className="form-input-base resize-none"
                            placeholder="Describe this category..."
                        />
                    </div>

                    {editingCategory && (
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Category Info</h4>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>
                                    <span className="text-gray-500">Slug:</span>
                                    <div className="font-mono text-gray-700">{editingCategory.slug}</div>
                                </div>
                                <div>
                                    <span className="text-gray-500">Created:</span>
                                    <div className="text-gray-700">
                                        {new Date(editingCategory.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-3 mt-6">
                        <button
                            type="submit"
                            disabled={submitting || !formData.name.trim()}
                            className="form-button-primary flex-1 gap-2"
                        >
                            {submitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                    {editingCategory ? "Updating..." : "Creating..."}
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4" />
                                    {editingCategory ? "Update Category" : "Create Category"}
                                </>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={submitting}
                            className="form-button-secondary"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
