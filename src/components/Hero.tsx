"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, EffectFade } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

interface HeroProps {
  data: {
    title: string;
    subtitle: string;
    image: string;
    cta: { label: string; link: string }[];
  }[];
}

const Hero = ({ data }: HeroProps) => {
  return (
    <section className="relative h-[90vh] w-full group">
      <Swiper
        modules={[Navigation, Autoplay, EffectFade]}
        effect="fade"
        navigation={{
          prevEl: ".hero-button-prev",
          nextEl: ".hero-button-next",
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={true}
        className="h-full w-full"
      >
        {data.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-full w-full flex items-center justify-start px-8 md:px-24 overflow-hidden">
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[10000ms] scale-100 hover:scale-110"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <div className="absolute inset-0 bg-black/20" />
              </div>

              {/* Content */}
              <div className="relative z-10 text-left text-white max-w-xl">
                <h1 className="text-4xl md:text-6xl font-montserrat font-bold mb-4 leading-tight">
                  {slide.title}
                </h1>
                <p className="text-sm md:text-base font-roboto mb-10 tracking-wide">
                  {slide.subtitle}
                </p>
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  {slide.cta.map((button) => (
                    <Link
                      key={button.label}
                      href={button.link}
                      className="btn-pill btn-white w-full sm:w-auto min-w-[150px]"
                    >
                      {button.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Arrows */}
      <button className="hero-button-prev absolute left-4 top-1/2 -translate-y-1/2 z-20 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:text-gray-300">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
      </button>
      <button className="hero-button-next absolute right-4 top-1/2 -translate-y-1/2 z-20 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:text-gray-300">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
      </button>
    </section>
  );
};

export default Hero;
