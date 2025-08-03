import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Thar 3-Door Configurator - Build Your Dream Car",
  description: "Design and configure your perfect Thar 3-door with our interactive car configurator. Choose from variants, colors, wheels, add-ons, and more.",
  keywords: "Thar, car configurator, 3-door, customization, Mahindra, off-road, SUV",
  authors: [{ name: "Thar Configurator" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "Thar 3-Door Configurator",
    description: "Build your perfect Thar with our interactive configurator",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
