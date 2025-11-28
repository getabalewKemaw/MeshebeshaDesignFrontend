import { Edit, Trash2 } from "lucide-react";

interface Category {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    createdAt: string;
}

interface CategoryTableRowProps {
    category: Category;
    onEdit: (category: Category) => void;
    onDelete: (categoryId: string) => void;
}

export default function CategoryTableRow({ category, onEdit, onDelete }: CategoryTableRowProps) {
    return (
        <tr className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                    {category.name}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">
                    {category.slug}
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="text-sm text-gray-500 line-clamp-2 max-w-md">
                    {category.description || (
                        <span className="text-gray-400 italic">No description</span>
                    )}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                    {new Date(category.createdAt).toLocaleDateString()}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end gap-3">
                    <button
                        onClick={() => onEdit(category)}
                        className="text-indigo-600 hover:text-indigo-900 transition-colors p-1 rounded hover:bg-indigo-50"
                        title="Edit category"
                    >
                        <Edit className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => onDelete(category.id)}
                        className="text-red-600 hover:text-red-900 transition-colors p-1 rounded hover:bg-red-50"
                        title="Delete category"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </td>
        </tr>
    );
}
