import { notFound } from "next/navigation";
import { backendClient } from "@/lib/api/backendClient";
import { ProductGallery } from "@/components/app/ProductGallery";
import { ProductInfo } from "@/components/app/ProductInfo";

interface ProductPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { slug } = await params;

    let product = null;
    try {
        // Try to get product by slug first
        product = await backendClient.product.getProductBySlug(slug);
    } catch (error) {
        // If not found by slug, try to get by ID as fallback
        try {
            product = await backendClient.product.getProductById(slug);
        } catch (idError) {
            // If neither works, product not found
            notFound();
        }
    }

    if (!product) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    {/* Image Gallery */}
                    <ProductGallery images={product.images} productName={product.name} />

                    {/* Product Info */}
                    <ProductInfo product={product} />
                </div>
            </div>
        </div>
    );
}