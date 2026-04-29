import Image from "next/image";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  image: string;
  category: string;
  swatches: string[];
  extraSwatches: number;
  inStock: boolean;
}

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div className="group cursor-pointer flex flex-col h-full">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden mb-2 bg-white">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-contain transition-transform duration-700 group-hover:scale-105"
        />
        {/* Mock Slider Dots */}
        <div className="absolute top-4 right-4 flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-black"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-zinc-300"></div>
        </div>
      </div>

      {/* Product Info */}
      <div className="text-center flex-1 flex flex-col">
        {/* Swatches */}
        <div className="flex justify-center gap-1.5 mb-4">
          {product.swatches.map((color, index) => (
            <div
              key={index}
              className="w-8 h-8 md:w-10 md:h-10 border border-zinc-100 flex items-center justify-center p-0.5 relative"
            >
              <div
                className="w-full h-full bg-zinc-200"
                style={{ backgroundColor: color }}
              />
            </div>
          ))}
          {product.extraSwatches > 0 && (
            <div className="w-8 h-8 md:w-10 md:h-10 border border-zinc-100 flex items-center justify-center text-[11px] font-bold font-montserrat text-zinc-800">
              +{product.extraSwatches}
            </div>
          )}
        </div>

        {/* Text details */}
        <h3 className="text-[9px] md:text-[10px] font-montserrat font-bold tracking-[0.15em] mb-1.5 uppercase text-zinc-800">
          {product.name}
        </h3>
        <p className="text-[11px] md:text-[12px] font-roboto text-zinc-500 mb-3 md:mb-4">
          {product.subtitle}
        </p>
        <p className="text-[11px] md:text-[12px] font-montserrat font-bold mb-4 md:mb-5">
          Tk{product.price.toLocaleString()}.00
        </p>

        {/* Action Button */}
        <div className="mt-auto pt-2 w-full px-2 md:px-4">
          {product.inStock ? (
            <button className="w-full bg-black text-white text-[9px] md:text-[10px] font-montserrat font-bold py-3 md:py-4 rounded-full tracking-widest uppercase hover:bg-zinc-800 transition-colors">
              ADD TO CART
            </button>
          ) : (
            <button className="w-full bg-[#b5b5b5] text-white text-[9px] md:text-[10px] font-montserrat font-bold py-3 md:py-4 rounded-full tracking-widest uppercase cursor-not-allowed">
              SOLD OUT
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const ProductGrid = ({ data }: { data: { title: string; products: Product[] } }) => {
  return (
    <section className="section-padding">
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-montserrat font-extrabold tracking-[0.2em] uppercase">
          {data.title}
        </h2>
        <div className="w-12 h-0.5 bg-black mx-auto mt-4" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
        {data.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <div className="text-center mt-16">
        <Link href="/shop-all" className="text-[11px] font-montserrat font-bold tracking-[0.3em] border-b-2 border-black pb-1 hover:text-zinc-500 hover:border-zinc-500 transition-all uppercase">
          Shop All
        </Link>
      </div>
    </section>
  );
};

export default ProductGrid;
