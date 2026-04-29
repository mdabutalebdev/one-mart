import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  const newsletter = {
    title: "Get the Good Stuff",
    description: "Increase savings to 10% off your first purchase and keep up with our latest drops, special editions and members-only sales."
  };

  const columns = [
    {
      title: "Shop MVMT",
      links: ["Shop Watches", "Shop Eyewear", "Shop Jewelry", "Shop Insta"]
    },
    {
      title: "Customer Service",
      links: ["Accessibility Statement", "My Account", "Contact Us", "Shipping & Returns", "Faq", "Store Locator", "Site Map"]
    },
    {
      title: "#jointhemvmt",
      links: ["Our Story", "Our Blog", "Ambassadors & Affiliates", "US Privacy", "Cookies Settings"]
    }
  ];

  return (
    <footer className="bg-[#F0EFEA] text-[#111] pt-16 pb-8">
      <div className="container mx-auto px-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-6 mb-16">
          {/* Newsletter & Info Section */}
          <div className="md:col-span-2 pr-0 md:pr-12">
            <h3 className="text-2xl md:text-[26px] font-serif mb-4 text-black">
              {newsletter.title}
            </h3>
            <p className="text-[12px] md:text-[13px] font-roboto text-zinc-700 leading-relaxed mb-6">
              {newsletter.description}
            </p>

            {/* Email Input */}
            <div className="flex items-center justify-between bg-white rounded-full px-5 py-3 mb-8 w-full max-w-[340px] shadow-sm">
              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full text-[11px] bg-transparent outline-none placeholder:text-zinc-500 font-roboto"
                suppressHydrationWarning
              />
              <button className="flex items-center gap-2 text-[10px] font-bold font-montserrat tracking-widest text-black hover:opacity-70 transition-opacity whitespace-nowrap pl-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2a9d8f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                SIGN UP
              </button>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-5 mb-8 text-black">
              <Link href="#" className="hover:opacity-60 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </Link>
              <Link href="#" className="hover:opacity-60 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="#F0EFEA"/></svg>
              </Link>
              <Link href="#" className="hover:opacity-60 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </Link>
              <Link href="#" className="hover:opacity-60 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
              </Link>
            </div>

            {/* Country Selector */}
            <div className="flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity w-fit">
              <span className="text-base leading-none">🇧🇩</span>
              <span className="text-[11px] font-montserrat font-bold tracking-[0.15em] uppercase mt-0.5">
                BANGLADESH
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
          </div>

          {/* Links Columns */}
          {columns.map((col) => (
            <div key={col.title} className="md:col-span-1">
              <h4 className="text-[11px] font-montserrat font-bold tracking-[0.15em] mb-5 text-black">
                {col.title}
              </h4>
              <ul className="space-y-4">
                {col.links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-[12px] font-roboto text-zinc-700 hover:text-black hover:underline transition-all"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-zinc-300 pt-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-[11px] font-roboto text-zinc-600">
            © 2026 MVMT
          </div>
          <div className="flex gap-6">
            <Link href="#" className="text-[11px] font-roboto text-zinc-600 hover:text-black transition-colors">
              Terms & Conditions
            </Link>
            <Link href="#" className="text-[11px] font-roboto text-zinc-600 hover:text-black transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
