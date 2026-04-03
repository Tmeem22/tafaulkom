import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import TelegramPopup from "@/components/TelegramPopup";

export const metadata: Metadata = {
  title: "تفاعلكم || المنصة العربية الأولى لخدمات التواصل الاجتماعي",
  description: "تفاعلكم أسرع وأرخص منصة لزيادة المتابعين والتفاعل على جميع منصات التواصل الاجتماعي. إنستغرام، تيك توك، يوتيوب، تويتر، سناب شات والمزيد.",
  keywords: "تفاعلكم, زيادة متابعين, شراء متابعين, SMM panel, لوحة تسويق, متابعين انستقرام, متابعين تيك توك",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <ThemeProvider>
          {children}
          <TelegramPopup />
        </ThemeProvider>
      </body>
    </html>
  );
}
