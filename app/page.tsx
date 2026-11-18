import dynamic from "next/dynamic";
import Header from "@/components/layout/Header";
import HeroSlider from "@/components/home/HeroSlider";
import PopularOffers from "@/components/home/PopularOffers";
import PopularStores from "@/components/home/PopularStores";
import TopCoupons from "@/components/home/TopCoupons";
import DealsOfTheDay from "@/components/home/DealsOfTheDay";
import NewToday from "@/components/home/NewToday";
import Footer from "@/components/layout/Footer";
import { getHomeData, getReviews } from "@/components/home/data";

const CustomerFeedback = dynamic(() => import("@/components/home/CustomerFeedback"));
const FAQ = dynamic(() => import("@/components/home/FAQ"));

export const revalidate = 60;

export default async function HomePage() {
  const [{ offers, brands, banners }, reviews] = await Promise.all([getHomeData(), getReviews()]);

  return (
    <>
      <Header />

      <main>
        <HeroSlider sliders={banners} offers={offers} />
        <PopularOffers items={offers} />
        <PopularStores brands={brands} offers={offers} />
        <div className="[content-visibility:auto] [contain-intrinsic-size:auto_700px]"><TopCoupons items={offers} /></div>
        <div className="[content-visibility:auto] [contain-intrinsic-size:auto_700px]"><DealsOfTheDay items={offers} /></div>
        <div className="[content-visibility:auto] [contain-intrinsic-size:auto_700px]"><NewToday items={offers} /></div>
        <div className="[content-visibility:auto] [contain-intrinsic-size:auto_700px]"><CustomerFeedback reviews={reviews} /></div>
        <div className="[content-visibility:auto] [contain-intrinsic-size:auto_700px]"><FAQ /></div>
      </main>

      <Footer />
    </>
  );
}
