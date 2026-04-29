import Link from "next/link";

const AnnouncementBar = ({ data }: { data: { text: string; link: string } }) => {
  return (
    <div className="bg-black text-white text-[10px] md:text-xs font-montserrat font-semibold tracking-[0.2em] py-2.5 text-center uppercase">
      <Link href={data.link} className="hover:opacity-80 transition-opacity">
        {data.text}
      </Link>
    </div>
  );
};

export default AnnouncementBar;
