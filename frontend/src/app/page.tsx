import DestinationsTeaser from "@/components/home/DestinationsTeaser";
import FAQ from "@/components/home/FAQ";
import FeaturedBoats from "@/components/home/FeaturedBoats";
import HeroSection from "@/components/home/HeroSection";
import WhyChooseUs from "@/components/home/WhyChooseUs";

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturedBoats />
      <WhyChooseUs />
      <DestinationsTeaser />
      <FAQ />
    </>
  );
}

