"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface Story {
  title: string;
  video: string;
  link: string;
}

interface FeaturedStoriesProps {
  data: {
    title: string;
    subtitle: string;
    stories: Story[];
  };
}

const FeaturedStories = ({ data }: FeaturedStoriesProps) => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  return (
    <section className="w-full py-16 md:py-24 overflow-hidden relative group">
      <div className="text-center mb-10 px-4">
        <h2 className="text-3xl md:text-4xl font-montserrat font-medium mb-3">
          {data.title}
        </h2>
        <p className="text-xs md:text-sm font-roboto tracking-widest text-zinc-600">
          {data.subtitle}
        </p>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 md:px-8 relative">
        <Swiper
          modules={[Navigation, Autoplay, Pagination]}
          spaceBetween={16}
          slidesPerView={1.2}
          breakpoints={{
            480: { slidesPerView: 2.2 },
            768: { slidesPerView: 3.5 },
            1024: { slidesPerView: 4.5 },
            1280: { slidesPerView: 5 },
          }}
          navigation={{
            prevEl: ".stories-prev",
            nextEl: ".stories-next",
          }}
          pagination={{
            type: "progressbar",
            el: ".stories-pagination",
          }}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          loop={true}
          className="w-full pb-10"
        >
          {data.stories.map((story, index) => (
            <SwiperSlide key={index}>
              <div
                className="block relative aspect-[4/5] rounded-xl overflow-hidden bg-zinc-900 group/card cursor-pointer"
                onClick={() => setSelectedVideo(story.video)}
              >
                {/* YouTube Video Background (Muted) */}
                <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
                  <iframe
                    className="absolute top-1/2 left-1/2 w-[300%] h-[300%] -translate-x-1/2 -translate-y-1/2"
                    src={`https://www.youtube.com/embed/${story.video}?autoplay=1&mute=1&controls=0&loop=1&playlist=${story.video}&showinfo=0&rel=0&modestbranding=1&playsinline=1`}
                    title={story.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>

                {/* Subtle overlay for better aesthetics, but no text */}
                <div className="absolute inset-0 bg-black/10 group-hover/card:bg-black/0 transition-colors duration-500" />

                {/* Play Icon Indicator */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Arrows */}
        <button className="stories-prev absolute left-0 md:left-4 top-[40%] -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center bg-white/80 hover:bg-white text-black rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 disabled:opacity-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
        </button>
        <button className="stories-next absolute right-0 md:right-4 top-[40%] -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center bg-white/80 hover:bg-white text-black rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 disabled:opacity-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
        </button>

        {/* Custom Progress Bar Container */}
        <div className="stories-pagination h-1 bg-zinc-200 mt-4 max-w-sm mx-auto relative overflow-hidden rounded-full"></div>
      </div>

      {/* Video Popup Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 px-4 backdrop-blur-sm">
          {/* Close Background Area */}
          <div className="absolute inset-0" onClick={() => setSelectedVideo(null)}></div>

          {/* Close Button */}
          <button
            className="absolute top-6 right-6 text-white hover:text-gray-300 z-[10000] p-2"
            onClick={() => setSelectedVideo(null)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>

          {/* Video Container */}
          <div className="relative w-full max-w-5xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl z-[10000]">
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1&mute=0&controls=1&showinfo=0&rel=0`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      <style jsx global>{`
        .stories-pagination .swiper-pagination-progressbar-fill {
          background-color: #000 !important;
        }
      `}</style>
    </section>
  );
};

export default FeaturedStories;
