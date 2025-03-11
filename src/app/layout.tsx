import type { Metadata } from "next";
import "./main.css";
import { ItemsContextProvider } from "./context/ItemsContext";

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
      <body>
        <ItemsContextProvider>{children}</ItemsContextProvider>
      </body>
    </html>
  );
}
