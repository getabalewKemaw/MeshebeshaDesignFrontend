import { FolderTree, Plus } from "lucide-react";

interface CategoryEmptyStateProps {
    onAddClick: () => void;
}

export default function CategoryEmptyState({ onAddClick }: CategoryEmptyStateProps) {
    return (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <FolderTree className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No categories yet
            </h3>
            <p className="text-gray-600 mb-6">
                Create your first category to organize products
            </p>
            <button
                onClick={onAddClick}
                className="form-button-primary inline-flex items-center gap-2"
            >
                <Plus className="h-5 w-5" />
                Add Your First Category
            </button>
        </div>
    );
}
