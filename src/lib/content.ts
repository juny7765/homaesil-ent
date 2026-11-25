import raw from "@/data/content.json";

export type TrackKey = "sleep" | "dizziness" | "growth" | "ent";
export type Kind = "A" | "B" | "C" | "D" | "H";

export interface Track { name: string; short: string; url: string; accent: string; tint: string }
export interface Doc { name: string; spec: string; lines: string[]; tracks: string }
export interface SubPage { slug: string; title: string; kind: Kind; data: Record<string, any> }
export interface DetailGroup { name: string; href: string; pages: SubPage[] }

export interface MainData {
  h1: string; sub: string; features?: [string, string][];
  chips_t: string; chips: [string, string, string][];
  flow_t: string; flow: (string | undefined)[][]; flow_t_override?: string; flow_note?: string;
  s4_t: string; s4: [string, string, string][];
  doc: string; faq: [string, string][];
}

const C = raw as unknown as {
  tracks: Record<TrackKey, Track>;
  order: TrackKey[];
  main: Record<TrackKey, MainData>;
  subs: Record<TrackKey, SubPage[]>;
  detail: Record<"ear" | "nose" | "throat", DetailGroup>;
  hub_links: Record<string, string>;
  gfaq: [string, string][];
  docs: Record<"lee" | "park" | "kim", Doc>;
  track_docs: Record<TrackKey, string[]>;
  pedi_pages: string[];
};

export const TRACKS = C.tracks;
export const ORDER = C.order;
export const MAIN = C.main;
export const SUBS = C.subs;
export const DETAIL = C.detail;
export const GFAQ = C.gfaq;
export const DOCS = C.docs;
export const TRACK_DOCS = C.track_docs;
export const PEDI = new Set(C.pedi_pages);

/* ---------------- page registry ---------------- */
export type PageEntry =
  | { type: "intro"; url: "/" ; title: string }
  | { type: "main"; url: string; track: TrackKey; title: string }
  | { type: "sub"; url: string; track: TrackKey; page: SubPage; parent?: { name: string; href: string }; title: string }
  | { type: "about" | "visit" | "health"; url: string; title: string };

function subUrl(track: TrackKey, slug: string, urlpath?: string) {
  const base = TRACKS[track].url;
  if (urlpath) return base + urlpath;
  const tail = slug.includes("-") ? slug.split("-").slice(1).join("-") : slug;
  return base + tail + "/";
}

/** dc.html 파일명 → 사이트 URL */
const DC: Record<string, string> = { "Main.dc.html": "/", "about.dc.html": "/about/", "visit.dc.html": "/visit/", "health.dc.html": "/health/" };
export const PAGES: PageEntry[] = [{ type: "intro", url: "/", title: "호매실연세이비인후과" }];

for (const k of ORDER) {
  DC[`${k}.dc.html`] = TRACKS[k].url;
  PAGES.push({ type: "main", url: TRACKS[k].url, track: k, title: TRACKS[k].name });
  for (const p of SUBS[k]) {
    const url = subUrl(k, p.slug);
    DC[`${p.slug}.dc.html`] = url;
    PAGES.push({ type: "sub", url, track: k, page: p, title: p.title });
  }
}
for (const g of ["ear", "nose", "throat"] as const) {
  const grp = DETAIL[g];
  for (const p of grp.pages) {
    const url = subUrl("ent", p.slug, `${g}/${p.slug.split("-").slice(1).join("-")}/`);
    DC[`${p.slug}.dc.html`] = url;
    PAGES.push({ type: "sub", url, track: "ent", page: p, parent: { name: grp.name, href: href(grp.href) }, title: p.title });
  }
}
PAGES.push({ type: "about", url: "/about/", title: "병원소개" }, { type: "visit", url: "/visit/", title: "진료 및 방문안내" }, { type: "health", url: "/health/", title: "건강정보" });

/** 와이어프레임 링크(.dc.html, #anchor) → 사이트 href */
export function href(h: string): string {
  if (!h || h === "#") return "#";
  if (h.startsWith("#")) return h;
  if (h.startsWith("http")) return h;
  const [file, hash] = h.split("#");
  const u = DC[file];
  return (u ?? "#") + (hash ? `#${hash}` : "");
}
export function hubHref(title: string) { return href(C.hub_links[title] ?? "#"); }

export function findPage(segments: string[]): PageEntry | undefined {
  const url = "/" + (segments.length ? segments.join("/") + "/" : "");
  return PAGES.find((p) => p.url === url);
}
export function doctorsFor(track: TrackKey, slug: string) {
  let keys = [...TRACK_DOCS[track]];
  if (PEDI.has(slug) && !keys.includes("kim")) keys.push("kim");
  // 이유재 대표원장(lee)은 항상 첫 번째로 노출
  keys = keys.filter((k) => k !== "lee");
  keys.unshift("lee");
  return keys.map((k) => ({ key: k, ...DOCS[k as keyof typeof DOCS] }));
}
export const REVIEWER: Record<TrackKey, string> = {
  sleep: "박중수 원장(이비인후과 전문의)", dizziness: "이유재 대표원장(이비인후과 전문의)",
  growth: "김수현 원장(소아청소년과 전문의)", ent: "이유재 대표원장(이비인후과 전문의)",
};
export const CLINIC = {
  name: "호매실연세이비인후과",
  tel: "031-293-7582",
  address: "경기도 수원시 권선구 호매실로 104번길 24-43 중앙 파크뷰 A동 4층",
  email: "hyonselent@naver.com",
  hours: ["월~금 09:00–19:30 (소아과 ~18:30)", "토 09:00–14:00 (소아과 ~13:00)", "2·4주 일요일·공휴일 09:00–13:00", "점심 13:00–14:00"],
  site: process.env.NEXT_PUBLIC_SITE_URL || "https://homaesilent.com",
};
