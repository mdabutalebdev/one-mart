import React from 'react'
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnnouncementBar from "@/components/AnnouncementBar";
import homepageData from "../../../public/data/homepage.json";

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex flex-col min-h-screen">
            <AnnouncementBar data={homepageData.announcement} />
            <Header />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
        </div>
    )
}

export default Layout