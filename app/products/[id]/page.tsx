import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/ProductDetail";
import { createServerClient } from "@/lib/supabase";

interface PageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const supabase = createServerClient();
    const { data: product } = await supabase
      .from("products")
      .select("name, description, detailed_description, image_url")
      .eq("id", params.id)
      .single();

    if (!product) {
      return {
        title: "Product Not Found - Gursimran Ayurvedic Clinic",
      };
    }

    return {
      title: `${product.name} - Gursimran Ayurvedic Clinic`,
      description: product.description || product.detailed_description || "",
      openGraph: {
        title: product.name,
        description: product.description || product.detailed_description || "",
        images: product.image_url ? [product.image_url] : [],
      },
    };
  } catch {
    return {
      title: "Product - Gursimran Ayurvedic Clinic",
    };
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  return <ProductDetail productId={params.id} />;
}
