import { Suspense } from "react";
import { FeaturedCarousel } from "@/components/app/FeaturedCarousel";
import { FeaturedCarouselSkeleton } from "@/components/app/FeaturedCarouselSkeleton";
import { CategoryTiles } from "@/components/app/CategoryTiles";
import { ProductSection } from "@/components/app/ProductSection";
import { backendClient } from "@/lib/api/backendClient";

interface PageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    color?: string;
    material?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    inStock?: string;
  }>;
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;

  const searchQuery = params.q ?? "";
  const categorySlug = params.category ?? "";
  const color = params.color ?? "";
  const material = params.material ?? "";
  const minPrice = Number(params.minPrice) || 0;
  const maxPrice = Number(params.maxPrice) || 0;
  const sort = params.sort ?? "name";
  const inStock = params.inStock ?? "";

  console.log('Params ===>>', params);
  console.log('Search query ===>>', searchQuery);

  // Fetch categories for filter sidebar
  const categories = await backendClient.category.getAllCategories();

  // Fetch all products for now (we'll implement filtering later)
  let products = await backendClient.product.getAllProducts();

    console.log('Categories =>', categories)
    console.log('Products =>', products)


  // Apply client-side filtering based on search parameters
  if (searchQuery) {
    products = products.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (categorySlug && categorySlug !== 'all') {
    // Find category by slug
    const matchedCategory = categories.find(cat =>
      cat.slug.toLowerCase() === categorySlug.toLowerCase()
    );
    if (matchedCategory) {
      products = products.filter(product =>
        product.categoryId === matchedCategory.id
      );
    }
  }

  if (color) {
    products = products.filter(product =>
      product.color?.toLowerCase() === color.toLowerCase()
    );
  }

  if (material) {
    products = products.filter(product =>
      product.material?.toLowerCase() === material.toLowerCase()
    );
  }

  if (minPrice > 0) {
    products = products.filter(product =>
      Number(product.price) >= minPrice
    );
  }

  if (maxPrice > 0) {
    products = products.filter(product =>
      Number(product.price) <= maxPrice
    );
  }

  if (inStock === 'true') {
    products = products.filter(product =>
      product.stock > 0
    );
  }

  // Apply sorting
  switch (sort) {
    case "price_asc":
      products.sort((a, b) => Number(a.price) - Number(b.price));
      break;
    case "price_desc":
      products.sort((a, b) => Number(b.price) - Number(a.price));
      break;
    case "relevance":
      // For now, relevance is handled by search filtering above
      break;
    default:
      products.sort((a, b) => a.name.localeCompare(b.name));
      break;
  }

  // For featured products carousel, filter featured products
  const featuredProducts = products.filter(product => product.featured);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">

      {/* Featured Products Carousel */}
      <Suspense fallback={<FeaturedCarouselSkeleton />}>
        <FeaturedCarousel products={featuredProducts} />
      </Suspense>

      {/* Page Banner */}
      <div className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Shop {categorySlug ? categorySlug : "All Products"}
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Premium furniture for your home
          </p>
        </div>

        {/* Category Tiles - Full width */}
        <div className="mt-6">
          <CategoryTiles
            categories={categories}
            activeCategory={categorySlug || undefined}
          />
        </div>
      </div>

      {/* Products Section  */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <ProductSection
          categories={categories}
          products={products}
          searchQuery={searchQuery}
        />
      </div>
    </div>
  );
}
