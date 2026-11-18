import Header from "@/components/layout/Header";
import HeroSlider from "@/components/home/HeroSlider";
import PopularOffers from "@/components/home/PopularOffers";
import PopularStores from "@/components/home/PopularStores";
import TopCoupons from "@/components/home/TopCoupons";
import DealsOfTheDay from "@/components/home/DealsOfTheDay";
import NewToday from "@/components/home/NewToday";
import CustomerFeedback from "@/components/home/CustomerFeedback";
import FAQ from "@/components/home/FAQ";
import Footer from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <>
      <Header />

      <main>
        <HeroSlider />
        <PopularOffers />
        <PopularStores />
        <TopCoupons />
        <DealsOfTheDay />
        <NewToday />
        <CustomerFeedback />
        <FAQ />
      </main>

      <Footer />
    </>
  );
}
