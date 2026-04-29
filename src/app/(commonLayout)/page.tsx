import React from 'react'
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import PromoBanner from "@/components/PromoBanner";
import CategoryCards from "@/components/CategoryCards";
import ShopByCategory from "@/components/ShopByCategory";
import FeaturedStories from "@/components/FeaturedStories";
import BannerSection from "@/components/BannerSection";
import PressLogos from "@/components/PressLogos";
import OurPromises from "@/components/OurPromises";
import homepageData from "../../../public/data/homepage.json";

const Home = () => {
  return (
    <div className="flex flex-col">
      <Hero data={homepageData.hero} />
      <PromoBanner />
      <CategoryCards categories={homepageData.categories} />
      <ShopByCategory categories={homepageData.shopByCategory} />
      <FeaturedStories data={homepageData.featuredStories} />
      <BannerSection banners={homepageData.banners} />
      <div className="bg-white">
        <ProductGrid data={homepageData.bestSellers} />
      </div>
      <PressLogos />
      <OurPromises />
    </div>
  )
}

export default Home