import Link from "next/link";

const PromoBanner = () => {
  return (
    <div className=" bg-[#2067a8] py-4 md:py-5 mt-[5px]">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-6 px-10">
        <h2 className="text-white text-base md:text-xl font-montserrat tracking-wide text-center md:text-left">
          Buy one, get one 50% off** | code: BOGO_50
        </h2>
        <div className="flex items-center gap-4">
          <Link href="/mens" className="btn-pill btn-white !px-6 !py-2.5">
            SHOP MENS
          </Link>
          <Link href="/womens" className="btn-pill btn-white !px-6 !py-2.5">
            SHOP WOMENS
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PromoBanner;
