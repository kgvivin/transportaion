import type { Metadata } from "next";
import { FamilySafeProvider } from "./context";
import "./globals.css";

export const metadata: Metadata = {
  title: "FamilySafe - Smart Family Budget & Emergency Planner",
  description: "Plan Today. Be Ready for Tomorrow.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <FamilySafeProvider>
          {children}
        </FamilySafeProvider>
      </body>
    </html>
  );
}
