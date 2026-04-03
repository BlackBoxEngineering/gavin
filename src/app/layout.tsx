import type { Metadata } from "next";
import { Cormorant_Garamond, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} | Business Advisor & Mentor`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Gavin Woodhouse - strategic business advisor and mentor. Trusted counsel for business owners navigating growth, crisis, and recovery.",
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: "/gavin_woodhouse_symbol.png",
    shortcut: "/gavin_woodhouse_symbol.png",
    apple: "/gavin_woodhouse_symbol.png",
  },
  openGraph: {
    siteName: SITE_NAME,
    locale: "en_GB",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t)document.documentElement.setAttribute('data-theme',t);}catch(e){}})()`,
          }}
        />
      </head>
      <body className={`${plexSans.variable} ${cormorant.variable}`}>
        <div className="site-shell">
          <Navbar />
          <main className="site-main">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
