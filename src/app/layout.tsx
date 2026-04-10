import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import TelegramPopup from "@/components/TelegramPopup";
import Notification from "@/components/Notification";
import SpinWheel from "@/components/SpinWheel";
import FlashSale from "@/components/FlashSale";
import LiveSalesPopup from "@/components/LiveSalesPopup";

export const metadata: Metadata = {
  title: "تفاعلكم - أرخص وأسرع منصة خدمات SMM عربية",
  description: "تفاعلكم هي منصة رائدة لخدمات التسويق الرقمي وزيادة المتابعين والتفاعل الحقيقي على جميع وسائل التواصل الاجتماعي: إنستغرام، تيك توك، يوتيوب، وتويتر بأقل الأسعار وجودة عالمية.",
  keywords: "تفاعلكم, SMM Panel, زيادة متابعين, شراء متابعين, تسويق رقمي, متابعين حقيقيين, أرخص سيرفر متابعين, متجر تفاعلكم",
  authors: [{ name: "تفاعلكم" }],
  openGraph: {
    title: "تفاعلكم | نمو حساباتك بضغطة زر",
    description: "الخيار الأول للمؤثرين والشركات لزيادة التفاعل الحقيقي والنمو السريع.",
    images: ["/logo.png"],
    type: "website",
    locale: "ar_SA",
  },
  twitter: {
    card: "summary_large_image",
    title: "تفاعلكم - منصة التسويق الذكي",
    description: "زد متابعينك وتفاعلك الآن مع أرخص سيرفر عربي.",
    images: ["/logo.png"],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider>
          {children}
          <FlashSale />
          <SpinWheel />
          <LiveSalesPopup />
          <TelegramPopup />
          <Notification />
        </ThemeProvider>
      </body>
    </html>
  );
}
