import Link from "next/link";

interface Banner {
  title: string;
  subtitle: string;
  image: string;
  cta: string;
  link: string;
}

const BannerSection = ({ banners }: { banners: Banner[] }) => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2">
      {banners.map((banner, index) => (
        <div key={index} className="relative h-[600px] group overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
            style={{ backgroundImage: `url(${banner.image})` }}
          >
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-500" />
          </div>
          <div className="relative h-full flex flex-col items-center justify-center text-center text-white p-8">
            <p className="text-[10px] md:text-xs font-montserrat font-bold tracking-[0.4em] mb-4 uppercase">
              {banner.subtitle}
            </p>
            <h2 className="text-3xl md:text-5xl font-montserrat font-extrabold tracking-[0.1em] mb-8 uppercase leading-tight">
              {banner.title}
            </h2>
            <Link
              href={banner.link}
              className="btn-pill btn-white min-w-[180px]"
            >
              {banner.cta}
            </Link>
          </div>
        </div>
      ))}
    </section>
  );
};

export default BannerSection;
