import type { Metadata } from "next";
import "./globals.css";
import { AppHydrator } from "@/components/AppHydrator";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

export const metadata: Metadata = {
  title: "냉모",
  description: "장보기 리스트 관리",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko">
      <body>
        <AppHydrator />
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  );
}
