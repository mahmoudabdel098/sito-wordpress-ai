import "./globals.css";
import CinematicProvider from "@/components/CinematicProvider";
import Preloader from "@/components/Preloader";

export const metadata: Metadata = {
  title: "Link2Digital | Web Agency",
  description: "Elevate your digital presence with Link2Digital.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it" suppressHydrationWarning>
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
