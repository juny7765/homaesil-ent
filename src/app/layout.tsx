import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CLINIC } from "@/lib/content";

export const metadata: Metadata = {
  metadataBase: new URL(CLINIC.site),
  title: { default: `${CLINIC.name} | 수면·어지럼증·성장·귀코목 클리닉`, template: `%s | ${CLINIC.name}` },
  description: "수원 권선구 호매실. 이비인후과 전문의 2인과 소아청소년과 전문의가 귀·코·목 진료와 수면·어지럼증·성장 클리닉을 한곳에서 진료합니다.",
  openGraph: { type: "website", locale: "ko_KR", siteName: CLINIC.name },
  robots: { index: true, follow: true },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#15305c" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
