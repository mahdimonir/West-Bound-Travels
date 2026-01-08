import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import TopInfoBar from "@/components/layout/TopInfoBar";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { AuthProvider } from "@/lib/AuthContext";
import { NotificationProvider } from "@/lib/NotificationContext";
import { ToastProvider } from "@/lib/toast";
import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});



export const metadata: Metadata = {
  title: "West Bound Travels - Luxury Houseboat Tours in Bangladesh",
  description: "Experience the beauty of Tanguar Haor and Sylhet with West Bound Travels. Premium houseboat tours with luxury accommodations, gourmet meals, and unforgettable destinations.",
  keywords: "houseboat tours, Tanguar Haor, Bangladesh tourism, luxury travel, boat tours, Sylhet destinations",
  authors: [{ name: "West Bound Travels" }],
  openGraph: {
    title: "West Bound Travels - Explore Luxury Waters",
    description: "Discover Bangladesh's pristine waterways aboard our luxury houseboats",
    images: ["/images/og-image.jpg"],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} ${inter.variable} antialiased font-sans`}>
        <QueryProvider>
          <ToastProvider>
            <AuthProvider>
              <NotificationProvider>
                <div className="flex flex-col min-h-screen">
                  <TopInfoBar />
                  <Navbar />
                  <main className="flex-grow">{children}</main>
                  <Footer />
                </div>
              </NotificationProvider>
            </AuthProvider>
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
