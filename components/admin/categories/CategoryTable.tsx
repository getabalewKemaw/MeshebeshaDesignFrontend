import CategoryTableRow from "./CategoryTableRow";

interface Category {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    createdAt: string;
}

interface CategoryTableProps {
    categories: Category[];
    onEdit: (category: Category) => void;
    onDelete: (categoryId: string) => void;
}

export default function CategoryTable({ categories, onEdit, onDelete }: CategoryTableProps) {
    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#310101] text-white text-xl">
                    <tr>
                        <th className="px-6 py-3 text-left  font-medium uppercase tracking-wider">
                            Name
                        </th>
                        <th className="px-6 py-3 text-left  font-medium uppercase tracking-wider">
                            Slug
                        </th>
                        <th className="px-6 py-3 text-left  font-medium uppercase tracking-wider">
                            Description
                        </th>
                        <th className="px-6 py-3 text-left  font-medium uppercase tracking-wider">
                            Created
                        </th>
                        <th className="px-6 py-3 text-right  font-medium  uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {categories.map((category) => (
                        <CategoryTableRow
                            key={category.id}
                            category={category}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}
