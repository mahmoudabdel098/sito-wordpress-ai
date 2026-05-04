import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Social Studio | Content Strategy Milano | Link2Digital",
  description: "Ottimizza la tua presenza sui social media con il Social Studio di Link2Digital. Strategie di contenuto basate su pillar, autorità e innovazione per brand d'élite.",
  openGraph: {
    title: "Social Studio | Link2Digital Milano",
    description: "Crea contenuti social d'impatto con la nostra piattaforma proprietaria.",
  },
};

export default function SocialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
