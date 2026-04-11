import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import TelegramPopup from "@/components/TelegramPopup";
import Notification from "@/components/Notification";
import SpinWheel from "@/components/SpinWheel";
import FlashSale from "@/components/FlashSale";
import LiveSalesPopup from "@/components/LiveSalesPopup";
import { CurrencyProvider } from "@/components/CurrencyProvider";
import DeviceOptimizer from "@/components/DeviceOptimizer";

export const viewport: Viewport = {
  themeColor: "#6C3CE1",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

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
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
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
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <CurrencyProvider>
            <DeviceOptimizer showDebug={false} />
            {children}
            <FlashSale />
            <SpinWheel />
            <LiveSalesPopup />
            <TelegramPopup />
            <Notification />
          </CurrencyProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

