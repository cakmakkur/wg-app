import type { Metadata } from "next";
import "./main.css";

export const metadata: Metadata = {
  title: "WG App",
  description: "an app to meet wg's needs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
