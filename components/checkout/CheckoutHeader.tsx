import Link from "next/link";

export default function CheckoutHeader() {
    return (
        <div className="flex items-center justify-between mb-6">
            <div>
                <p className="text-sm uppercase tracking-wider text-gray-400">Checkout</p>
                <h1 className="text-3xl font-semibold text-gray-900 mt-1">Delivery details</h1>
            </div>
            <Link href="/cart" className="text-sm text-[#310101] hover:text-[#4a0202] font-medium ">
                Back to cart
            </Link>
        </div>
    );
}
