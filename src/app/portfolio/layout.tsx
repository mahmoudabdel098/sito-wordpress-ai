import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio | Link2Digital Web Agency Milano",
  description: "Esplora i capolavori digitali di Link2Digital. Da portali immobiliari a brand di lifestyle, scopri come la nostra Web Agency a Milano trasforma le visioni in realtà.",
  openGraph: {
    title: "Portfolio Eccellente | Link2Digital Milano",
    description: "Guarda i nostri ultimi progetti web e digital masterpiece.",
  },
};

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
