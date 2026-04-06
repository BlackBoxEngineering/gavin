import type { Metadata } from "next";
import { Suspense } from "react";
import { Cormorant_Garamond, IBM_Plex_Sans } from "next/font/google";
import "@aws-amplify/ui-react/styles.css";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuthModal from "@/components/auth/AuthModal";
import ScrollToTop from "@/components/layout/ScrollToTop";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const googleSiteVerification =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || process.env.GOOGLE_SITE_VERIFICATION;

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
    images: [
      {
        url: "/photos/gavin-woodhouse-executive-headshot.jpg",
        width: 1200,
        height: 630,
        alt: "Gavin Woodhouse — Business Advisor & Mentor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Business Advisor & Mentor`,
    description: "Gavin Woodhouse - strategic business advisor and mentor. Trusted counsel for business owners navigating growth, crisis, and recovery.",
    images: ["/photos/gavin-woodhouse-executive-headshot.jpg"],
  },
  verification: googleSiteVerification ? { google: googleSiteVerification } : undefined,
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
            __html: `(function(){try{if(window.location.hostname==='www.gavinwoodhouse.com'){window.location.replace('https://gavinwoodhouse.com'+window.location.pathname+window.location.search+window.location.hash);}}catch(e){}})()`,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t)document.documentElement.setAttribute('data-theme',t);}catch(e){}})()`,
          }}
        />
      </head>
      <body
        className={`${plexSans.variable} ${cormorant.variable}`}
        suppressHydrationWarning
      >
        <div className="site-shell">
          <Suspense fallback={null}>
            <ScrollToTop />
          </Suspense>
          <Navbar />
          <main className="site-main">{children}</main>
          <Footer />
          <AuthModal />
        </div>
      </body>
    </html>
  );
}
