import type { Metadata } from "next";
import { Inter, Tenor_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import PriceModal from "@/components/PriceModal";
import Modal from "@/components/Modal";
import DynamicCursor from "@/components/DynamicCursor";
import ScrollRevealInit from "@/components/ScrollRevealInit";
import SmoothScrollHandler from "@/components/SmoothScrollHandler";
import SmoothScrollInit from "@/components/SmoothScrollInit";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import GlobalLoader from "@/components/GlobalLoader";

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-inter" });
const tenorSans = Tenor_Sans({
  weight: "400",
  subsets: ["latin", "cyrillic"],
  variable: "--font-tenor-sans",
});

export const metadata: Metadata = {
  title: "Студия Ири&Ка: Маникюр и Наращивание ресниц",
  description: "Профессиональный маникюр, педикюр и наращивание ресниц в уютной студии красоты.",
};

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${inter.variable} ${tenorSans.variable}`}>
      <head>
        <link rel="preconnect" href="https://api-maps.yandex.ru" />
        <link rel="dns-prefetch" href="https://api-maps.yandex.ru" />
        <link rel="preload" href={`${basePath}/img/hero_photo1.webp`} as="image" type="image/webp" />
        <link rel="preload" href={`${basePath}/img/hero_photo2.webp`} as="image" type="image/webp" />
      </head>
        <body className="font-sans antialiased text-foreground bg-background">
          <GlobalLoader minDisplayTime={800} />
          <ServiceWorkerRegister />
        <SmoothScrollInit />
        <ScrollRevealInit />
        <SmoothScrollHandler duration={1000} />
        <Header />
        {children}
        <Modal />
        <PriceModal />
        <DynamicCursor />
      </body>
    </html>
  );
}
