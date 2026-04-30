import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import HeroSection from "@/components/home/HeroSection";
import SkincareSection from "@/components/home/SkincareSection";
import ProductList from "@/components/product/ProductList";
import PromoBanner from "@/components/home/PromoBanner";
import BestSeller from "@/components/home/BestSeller";  
import HowItWorks from "@/components/home/HowItWorks";
import Brands from "@/components/home/Brands";
import InfoSection from "@/components/home/InfoSection";
import Testimonials from "@/components/home/Testimonials";
export default function Home() {
  return (
    <>
      <Navbar />

      <HeroSection />

      <SkincareSection />

      <HowItWorks />

      <BestSeller title="Best Sellers" />

      <PromoBanner />

      <ProductList title="New Arrivals" />

      <Brands />

      <Testimonials />
      
      <InfoSection />

      <Footer />
    </>
  );
}