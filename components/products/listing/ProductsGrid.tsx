import type { ProductWithDetails } from "@/types/product";
import ProductCard from "@/components/products/ProductCard";

interface ProductsGridProps {
    products: ProductWithDetails[];
}

export default function ProductsGrid({ products }: ProductsGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => {
                const firstImage = product.media?.[0];

                return (
                    <ProductCard
                        key={product.id}
                        id={product.id}
                        title={product.title}
                        price={product.price}
                        currency={product.currency}
                        image={firstImage?.url}
                        averageRating={product.averageRating || undefined}
                        totalReviews={product.totalReviews || undefined}
                    />
                );
            })}
        </div>
    );
}
