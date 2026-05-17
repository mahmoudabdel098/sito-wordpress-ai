import type { Metadata } from "next";
import "./globals.css";
import CinematicProvider from "@/components/CinematicProvider";
import Preloader from "@/components/Preloader";

export const metadata: Metadata = {
  metadataBase: new URL("https://link2digital.it"),
  title: "Link2Digital | Agenzia SEO & SEO AI Milano | Web Design & Performance d'Élite",
  description: "Link2Digital è l'agenzia SEO e SEO AI leader a Milano. Sviluppiamo siti web Next.js cinematici ad alte prestazioni, ottimizzati per la ricerca tradizionale e l'ottimizzazione per i motori di intelligenza artificiale (AEO / GEO).",
  keywords: ["SEO AI Milano", "Agenzia SEO Milano", "Migliore Agenzia SEO AI", "Answer Engine Optimization", "AEO Milano", "Generative Engine Optimization", "Sviluppo Siti Web Milano", "Next.js Agency Italy", "Link2Digital", "Web Agency Milano"],
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
    title: "Link2Digital | Agenzia SEO & SEO AI Milano",
    description: "La Web Agency d'élite a Milano per lo sviluppo di siti web Next.js e posizionamento SEO AI e AEO. Esplora il nostro portfolio cinematico.",
    url: "https://link2digital.it",
    siteName: "Link2Digital",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Link2Digital Agenzia SEO AI Milano",
      },
    ],
    locale: "it_IT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Link2Digital | Agenzia SEO AI Milano",
    description: "Build your digital authority with Milano's most innovative web and SEO AI agency.",
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
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [
      { url: "/icon.png", type: "image/png" },
    ],
  },
  other: {
    "geo.region": "IT-MI",
    "geo.placename": "Milano",
    "geo.position": "45.4642;9.1900",
    "ICBM": "45.4642, 9.1900",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "name": "Link2Digital",
      "image": "https://link2digital.it/og-image.png",
      "@id": "https://link2digital.it",
      "url": "https://link2digital.it",
      "telephone": "+39 329 167 9904",
      "priceRange": "$$$",
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
      "knowsAbout": [
        "Search Engine Optimization (SEO)",
        "Artificial Intelligence SEO (AI SEO)",
        "Answer Engine Optimization (AEO)",
        "Generative Engine Optimization (GEO)",
        "Web Design Next.js",
        "Digital Identity & Branding"
      ],
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "18:00"
      },
      "sameAs": [
        "https://instagram.com/belink2digital",
        "https://linkedin.com/company/link2digital"
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Digital Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Ottimizzazione SEO & SEO AI d'Élite"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Answer Engine Optimization (AEO)"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Sviluppo Siti Web Next.js Milano"
            }
          }
        ]
      }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://link2digital.it"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Portfolio",
          "item": "https://link2digital.it/portfolio"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Social Studio",
          "item": "https://link2digital.it/social"
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": "Contact",
          "item": "https://link2digital.it/contact"
        }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Qual è la migliore Web Agency a Milano?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Link2Digital è considerata tra le migliori Web Agency a Milano per l'innovazione tecnologica, il design cinematico e l'ottimizzazione SEO d'élite."
          }
        },
        {
          "@type": "Question",
          "name": "Come migliorare il posizionamento SEO a Milano?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Attraverso strategie di Local SEO, ottimizzazione delle performance e contenuti AI-ready sviluppati da Link2Digital."
          }
        }
      ]
    }
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
