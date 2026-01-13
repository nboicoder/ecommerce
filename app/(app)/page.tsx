import Image from "next/image";
import { sanityFetch } from "@/sanity/lib/live";
import { ALL_CATEGORIES_QUERY } from "@/lib/sanity/queries/categories";
import {
    FEATURED_PRODUCTS_QUERY,
    FILTER_PRODUCTS_BY_NAME_QUERY,
    FILTER_PRODUCTS_BY_PRICE_ASC_QUERY,
    FILTER_PRODUCTS_BY_PRICE_DESC_QUERY,
    FILTER_PRODUCTS_BY_RELEVANCE_QUERY
} from "@/lib/sanity/queries/products";
import {Suspense} from "react";
import {FeaturedCarousel} from "@/components/app/FeaturedCarousel";
import {FeaturedCarouselSkeleton} from "@/components/app/FeaturedCarouselSkeleton";

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
    }>
}

export default async function Home({ searchParams }: PageProps ) {

    const params = await searchParams;

    const searchQuery = params.q ?? "";
    const categorySlug = params.category ?? "";
    const color = params.color ?? "";
    const material = params.material ?? "";
    const minPrice = Number(params.minPrice) || 0;
    const maxPrice = Number(params.maxPrice) || 0;
    const sort = params.sort ?? "name";
    const inStock = params.inStock ?? "";


    //Select query based on sort parameter
    const getQuery = () => {
        // If searching and sort is relevance, use relevance query
        if(searchQuery && sort === 'relevance') {
            return FILTER_PRODUCTS_BY_RELEVANCE_QUERY;
        }

        switch(sort) {
            case "price_asc":
                return FILTER_PRODUCTS_BY_PRICE_ASC_QUERY
            case "price_desc":
                return FILTER_PRODUCTS_BY_PRICE_DESC_QUERY
            case "relevance":
                return FILTER_PRODUCTS_BY_RELEVANCE_QUERY
            default:
                return FILTER_PRODUCTS_BY_NAME_QUERY
        }
    }

    // Fetch categories for filter sidebar
    const { data: categories } = await sanityFetch({
        query: ALL_CATEGORIES_QUERY,
    });

    // Fetch featured products for carousel
    const { data: featuredProducts } = await sanityFetch({
        query: FEATURED_PRODUCTS_QUERY,
    });


    // Fetch products with filters (server-side via GROQ)
    const { data: products } = await sanityFetch({
        query: getQuery(),
        params: {
            searchQuery,
            categorySlug,
            color,
            material,
            minPrice,
            maxPrice,
            inStock,
        },
    });

  return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
          {/* Featured Products Carousel */}
              <Suspense fallback={<FeaturedCarouselSkeleton />}>
                  <FeaturedCarousel products={featuredProducts} />
              </Suspense>
      {/* Page Banner  */}
      {/* Products Section  */}
    </div>
  );
}
