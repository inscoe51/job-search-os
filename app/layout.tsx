import type { Metadata } from "next";
import type { ReactNode } from "react";

import { PageShell } from "@/components/shared/page-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: "Job Search OS",
  description: "First-pass MVP scaffold for job intake, analysis, and tracking."
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <PageShell>{children}</PageShell>
      </body>
    </html>
  );
}
