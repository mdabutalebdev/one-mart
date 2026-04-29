import Link from "next/link";
import Image from "next/image";

interface CategoryItem {
  title: string;
  subtitle: string;
  image: string;
  link: string;
  colSpan: number;
}

interface ShopByCategoryProps {
  categories: CategoryItem[];
}

const ShopByCategory = ({ categories }: ShopByCategoryProps) => {
  return (
    <section className="container mx-auto px-4 md:px-10 py-10">
      <h3 className="text-4xl font-montserrat mb-8 font-medium">Shop By Categories</h3>
      <div className="grid grid-cols-1 md:grid-cols-6 gap-2 md:gap-4">
        {categories.map((category, index) => {
          // Determine the column span class
          let colSpanClass = "md:col-span-6";
          if (category.colSpan === 4) colSpanClass = "md:col-span-4";
          if (category.colSpan === 3) colSpanClass = "md:col-span-3";
          if (category.colSpan === 2) colSpanClass = "md:col-span-2";

          return (
            <Link 
              key={index} 
              href={category.link}
              className={`relative h-[250px] md:h-[350px] rounded-lg overflow-hidden group ${colSpanClass} block`}
            >
              {/* Background Image */}
              <div className="absolute inset-0 transition-transform duration-[2000ms] group-hover:scale-105">
                <Image 
                  src={category.image}
                  alt={category.title}
                  fill
                  className="object-cover"
                />
                {/* Gradient Overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              
              {/* Content Overlay */}
              <div className="absolute top-0 left-0 p-6 flex flex-col justify-start items-start text-white">
                <h3 className="text-xl md:text-2xl font-montserrat mb-1 flex items-center">
                  {category.title}
                  {category.subtitle && (
                    <span className="text-sm font-normal ml-2 border-l border-white/50 pl-2">
                      {category.subtitle}
                    </span>
                  )}
                </h3>
                <div className="text-[10px] font-montserrat tracking-widest flex items-center mt-2 group-hover:underline uppercase">
                  SHOP ALL 
                  <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default ShopByCategory;
