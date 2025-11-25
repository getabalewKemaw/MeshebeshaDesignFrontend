import Link from "next/link";

interface EmptyStateProps {
    title: string;
    description?: string;
    actionLabel?: string;
    actionHref?: string;
    icon?: React.ReactNode;
}

export default function EmptyState({
    title,
    description,
    actionLabel,
    actionHref,
    icon,
}: EmptyStateProps) {
    return (
        <div className="border border-dashed border-gray-200 rounded-xl p-10 text-center space-y-4">
            {icon && <div className="flex justify-center text-gray-400">{icon}</div>}
            <p className="text-lg font-medium text-gray-700">{title}</p>
            {description && <p className="text-sm text-gray-500">{description}</p>}
            {actionLabel && actionHref && (
                <Link
                    href={actionHref}
                    className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors"
                >
                    {actionLabel}
                </Link>
            )}
        </div>
    );
}
