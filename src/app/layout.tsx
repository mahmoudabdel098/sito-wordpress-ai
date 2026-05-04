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
      "telephone": "+39 02 123 4567",
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
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "18:00"
      },
      "sameAs": [
        "https://instagram.com/link2digital",
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
              "name": "Sviluppo Siti Web Next.js Milano"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Ottimizzazione SEO e AEO"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Digital Identity & Branding"
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
