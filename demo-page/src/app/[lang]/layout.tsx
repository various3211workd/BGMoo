import { Inter } from "next/font/google";
import "./style.css";
import type React from "react"; // Import React

const inter = Inter({ subsets: ["latin"] });

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "ja" }];
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
