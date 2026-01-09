import Hero from "@/components/Hero";
import Services from "@/components/Services";
import FeaturedProducts from "@/components/FeaturedProducts";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <FeaturedProducts />
      <Testimonials />
      <CTA />
    </>
  );
}
