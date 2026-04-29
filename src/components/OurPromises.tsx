const promises = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13"></rect>
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
        <circle cx="5.5" cy="18.5" r="2.5"></circle>
        <circle cx="18.5" cy="18.5" r="2.5"></circle>
        <line x1="2" y1="12" x2="6" y2="12"></line>
        <line x1="2" y1="9" x2="8" y2="9"></line>
        <line x1="2" y1="6" x2="10" y2="6"></line>
      </svg>
    ),
    title: "Free Shipping",
    subtitle: "Over $75"
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        <text x="12" y="12" textAnchor="middle" fontSize="8" fontWeight="bold" strokeWidth="0" fill="currentColor">2</text>
        <text x="12" y="16" textAnchor="middle" fontSize="4" strokeWidth="0" fill="currentColor">YEARS</text>
      </svg>
    ),
    title: "Two Year Warranty",
    subtitle: ""
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
        <path d="M3 3v5h5"></path>
        <rect x="8" y="10" width="8" height="8" rx="1"></rect>
        <path d="M8 12l4-2 4 2"></path>
        <path d="M12 10v8"></path>
      </svg>
    ),
    title: "Easy Returns",
    subtitle: ""
  }
];

const OurPromises = () => {
  return (
    <section className="bg-[#F4F6F8] py-16">
      <div className="container mx-auto px-10">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-serif text-black">
            Our Promises
          </h2>
        </div>
        
        <div className="flex flex-col md:flex-row justify-center items-center gap-12 md:gap-32">
          {promises.map((item, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="mb-4 text-black">
                {item.icon}
              </div>
              <h4 className="text-[12px] md:text-[13px] font-roboto text-black leading-tight">
                {item.title}
                {item.subtitle && <><br />{item.subtitle}</>}
              </h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurPromises;
