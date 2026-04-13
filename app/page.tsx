import Hero from "@/components/Hero";
import Lashes from "@/components/Lashes";
import Nails from "@/components/Nails";
import WhyChooseUs from "@/components/WhyChooseUs";
import Portfolio from "@/components/Portfolio";
import Footer from "@/components/Footer";
import ScrollColorShift from "@/components/ScrollColorShift";

export default function Home() {
  return (
    <main>
      <ScrollColorShift />
      <Hero />
      <Lashes />
      <Nails />
      <WhyChooseUs />
      <Portfolio />
      <Footer />
    </main>
  );
}
