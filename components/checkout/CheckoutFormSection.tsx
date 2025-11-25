interface CheckoutFormSectionProps {
    title: string;
    description?: string;
    children: React.ReactNode;
    headerAction?: React.ReactNode;
}

export default function CheckoutFormSection({
    title,
    description,
    children,
    headerAction,
}: CheckoutFormSectionProps) {
    return (
        <section className="border border-gray-200 rounded-2xl p-6 bg-white space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                    {description && (
                        <p className="text-sm text-gray-500 mt-1">{description}</p>
                    )}
                </div>
                {headerAction && <div>{headerAction}</div>}
            </div>
            {children}
        </section>
    );
}
