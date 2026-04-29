import Link from "next/link";
import Image from "next/image";

interface Category {
  image: string;
  title: string;
  subtitle: string;
  buttons: { label: string; link: string }[];
}

interface CategoryCardsProps {
  categories: Category[];
}

const CategoryCards = ({ categories }: CategoryCardsProps) => {
  return (
    <section className="container mx-auto px-10 md:px-8 py-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {categories.map((category, index) => (
          <div key={index} className="flex flex-col rounded overflow-hidden h-full rounded-2xl">
            {/* Image */}
            <div className="relative aspect-[5/4] w-full">
              <Image 
                src={category.image}
                alt={category.title}
                fill
                className="object-cover"
              />
            </div>
            {/* Content */}
            <div className="bg-background-alt flex-1 flex flex-col items-center justify-start pt-8 pb-10 px-6 text-center">
              <h3 className="text-xl md:text-3xl font-medium font-montserrat mb-2 tracking-wide">
                {category.title}
              </h3>
              <p className="text-[16px] font-roboto mb-6 tracking-widest">
                {category.subtitle}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 mt-auto">
                {category.buttons.map((button, btnIndex) => (
                  <Link
                    key={btnIndex}
                    href={button.link}
                    className="border border-black text-black px-6 py-2.5 rounded-full text-[10px] font-montserrat font-bold tracking-[0.15em] hover:underline transition-all duration-300 uppercase"
                  >
                    {button.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoryCards;
