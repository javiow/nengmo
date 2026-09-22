import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "냉모",
  description: "장보기 리스트 관리",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
