import { Header, Footer } from "@/components/chrome";
import { Section, H2 } from "@/components/ui";
import { CLINIC } from "@/lib/content";
export const metadata = { title: "개인정보처리방침" };
export default function Page() {
  return (<><Header /><main><Section><H2>개인정보처리방침</H2><div className="prose"><p>{CLINIC.name}은 개인정보보호법에 따라 이용자의 개인정보를 보호합니다. [병원 확인: 수집 항목·목적·보유기간·위탁·책임자 정보를 기재합니다.]</p></div></Section></main><Footer /></>);
}
