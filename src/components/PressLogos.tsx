"use client";

const PressLogos = () => {
  return (
    <section className="bg-[#F0EFEA] py-16 overflow-hidden">
      <div className="container mx-auto px-10 text-center mb-10">
        <h3 className="text-xl md:text-2xl font-serif text-black">
          “MVMT has an elevated coolness about it.”
        </h3>
      </div>
      
      {/* Infinite Logo Marquee */}
      <div className="relative w-full flex overflow-hidden">
        {/* We need enough content to scroll smoothly */}
        <div className="animate-marquee flex whitespace-nowrap items-center py-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-16 md:gap-32 px-8 md:px-16">
              <span className="text-xl md:text-2xl font-serif text-zinc-500 font-bold tracking-tight">The New York Times</span>
              <span className="text-2xl md:text-3xl font-serif italic font-black text-zinc-500 tracking-tighter">Esquire</span>
              <span className="text-2xl md:text-3xl font-sans font-black tracking-tighter text-zinc-500">GQ</span>
              <span className="text-lg md:text-xl font-sans font-bold tracking-[0.2em] uppercase text-zinc-500">GEAR PATROL</span>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-25%);
          }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
          width: 400%;
        }
      `}</style>
    </section>
  );
};

export default PressLogos;
