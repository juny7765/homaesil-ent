import { CLINIC, MAIN, PageEntry, TRACKS, REVIEWER } from "@/lib/content";

export function pageMeta(p: PageEntry) {
  const url = CLINIC.site + p.url;
  if (p.type === "intro") return { title: `${CLINIC.name} | 수면·어지럼증·성장·귀코목 클리닉`, description: "수원 권선구 호매실. 이비인후과 전문의 2인과 소아청소년과 전문의가 함께 진료합니다. 코골이·수면무호흡, 어지럼증, 소아 성장, 귀·코·목 질환.", url };
  if (p.type === "main") { const m = MAIN[p.track]; return { title: `${TRACKS[p.track].name} | 수원 호매실`, description: m.sub.slice(0, 150), url }; }
  if (p.type === "sub") return { title: `${p.title} | ${TRACKS[p.track].name}`, description: String(p.page.data.answer ?? "").slice(0, 155), url };
  const d: Record<string, string> = { about: "의료진 소개, 진료 방향, 장비와 공간, 언론보도.", visit: "진료시간, 휴진 안내, 예약 방법, 오시는 길과 주차.", health: "수면·어지럼증·성장·귀코목 질문형 건강정보와 병원 공지.", location: "호매실연세이비인후과 오시는 길. 수원시 권선구 호매실로 104번길 24-43 중앙 파크뷰 A동 4층. 자가용·주차·대중교통 안내와 지도 길찾기." };
  return { title: p.title, description: d[p.type] ?? "", url };
}

export function clinicLd() {
  return {
    "@context": "https://schema.org", "@type": "MedicalClinic", name: CLINIC.name, url: CLINIC.site, telephone: CLINIC.tel,
    address: { "@type": "PostalAddress", streetAddress: "호매실로 104번길 24-43 중앙 파크뷰 A동 4층", addressLocality: "수원시 권선구", addressRegion: "경기도", addressCountry: "KR" },
    medicalSpecialty: ["Otolaryngologic", "Pediatric"],
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "19:30" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "09:00", closes: "14:00" },
    ],
    department: Object.values(TRACKS).map((t) => ({ "@type": "MedicalClinic", name: t.name, url: CLINIC.site + t.url })),
  };
}
export function faqLd(items: [string, string][]) {
  return { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: items.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) };
}
export function webPageLd(p: PageEntry, title: string, description: string) {
  const reviewer = p.type === "main" || p.type === "sub" ? REVIEWER[p.track] : undefined;
  return { "@context": "https://schema.org", "@type": "MedicalWebPage", name: title, description, url: CLINIC.site + p.url, inLanguage: "ko",
    ...(reviewer ? { reviewedBy: { "@type": "Physician", name: reviewer.split("(")[0] } } : {}),
    publisher: { "@type": "MedicalClinic", name: CLINIC.name, url: CLINIC.site } };
}
