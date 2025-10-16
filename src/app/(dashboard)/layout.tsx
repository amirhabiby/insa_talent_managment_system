import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "../globals.css";
import Link from "next/link";
import Image from "next/image";
import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex overflow-y-auto">
      {/* LEFT */}
      <div className="w-1/6 md:w-[8%] lg:w-[16%] bg-white xl:w-[14%] p-4 shadow">
        <Link href="/">
          <Image
            className="block lg:hidden"
            src="/insa_logo.png"
            alt="logo"
            width={80}
            height={80}
          />
          <Image
            className="hidden lg:block mr-5"
            src="/insa_logoo.png"
            alt="logo_for_lg"
            width={140}
            height={200}
          />
        </Link>
        <Menu />
      </div>
      {/* RIGHT */}
      <div className="w-5/6 md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] overflow-scroll flex flex-col">
        <Navbar />
        {children}
      </div>
    </div>
  );
}
