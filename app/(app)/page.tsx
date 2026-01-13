import Image from "next/image";
import { Button } from "@/components/ui/button";
import { sanityFetch } from "@/sanity/lib/live";
import { ALL_CATEGORIES_QUERY } from "@/lib/sanity/queries/categories";

export default async function Home() {
  const {} = await sanityFetch({
    query: ALL_CATEGORIES_QUERY,
  });

  return (
    <div>
      {/* Featured Products Carousel */}
      <Button>Click me</Button>
      {/* Page Banner  */}
      {/* Products Section  */}
    </div>
  );
}
