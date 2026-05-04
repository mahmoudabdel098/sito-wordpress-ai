import type { Metadata } from "next";
import "./globals.css";
import CinematicProvider from "@/components/CinematicProvider";
import Preloader from "@/components/Preloader";

export const metadata: Metadata = {
  title: "Link2Digital | Web Agency Milano | Design & Performance Excellence",
  description: "Link2Digital è la Web Agency di Milano leader in design cinematico, performance Next.js e strategie digitali d'élite. Trasformiamo brand in autorità digitali con siti web ad alte prestazioni e SEO AI-ready.",
  keywords: ["Web Agency Milano", "Sviluppo Siti Web Milano", "Agenzia SEO Milano", "Next.js Agency Italy", "Digital Marketing Milano", "AI SEO Optimization", "Design Agency Milano", "Link2Digital"],
  authors: [{ name: "Link2Digital Team", url: "https://link2digital.it" }],
  creator: "Link2Digital",
  publisher: "Link2Digital",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://link2digital.it",
  },
  openGraph: {
    title: "Link2Digital | Web Agency Milano | Eccellenza Digitale",
    description: "Sviluppo siti web, SEO e strategie digitali d'élite a Milano. Esplora il nostro portfolio cinematico.",
    url: "https://link2digital.it",
    siteName: "Link2Digital",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Link2Digital Agency Milano",
      },
    ],
    locale: "it_IT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Link2Digital | Web Agency Milano",
    description: "Build your digital authority with Milano's most innovative web agency.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Link2Digital",
  "image": "https://link2digital.it/og-image.png",
  "@id": "https://link2digital.it",
  "url": "https://link2digital.it",
  "telephone": "+39 02 123 4567",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Via Montenapoleone, 12",
    "addressLocality": "Milano",
    "postalCode": "20121",
    "addressCountry": "IT"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 45.4642,
    "longitude": 9.1900
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday"
    ],
    "opens": "09:00",
    "closes": "18:00"
  },
  "sameAs": [
    "https://instagram.com/link2digital",
    "https://linkedin.com/company/link2digital"
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Preloader />
        <CinematicProvider>
          <main className="cinematic-container">
            {children}
          </main>
        </CinematicProvider>
      </body>
    </html>
  );
}
