import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Header, Footer } from "@/components/chrome";
import { Intro, SubTemplate, TrackMain } from "@/components/templates";
import { About, Health, VisitPage } from "@/components/common-pages";
import { JsonLd } from "@/components/jsonld";
import { PAGES, findPage, MAIN } from "@/lib/content";
import { clinicLd, faqLd, pageMeta, webPageLd } from "@/lib/seo";

export const dynamicParams = false;
export function generateStaticParams() {
  return PAGES.map((p) => ({ path: p.url === "/" ? [] : p.url.split("/").filter(Boolean) }));
}
export async function generateMetadata({ params }: { params: Promise<{ path?: string[] }> }): Promise<Metadata> {
  const { path = [] } = await params; const p = findPage(path); if (!p) return {};
  const m = pageMeta(p);
  return { title: m.title, description: m.description, alternates: { canonical: m.url }, openGraph: { title: m.title, description: m.description, url: m.url, images: [ogImage(p)] } };
}
function ogImage(p: ReturnType<typeof findPage>) {
  if (!p) return "/img/hero_about.jpg";
  if (p.type === "main") return `/img/hero_${p.track}.jpg`;
  if (p.type === "sub") return `/img/sub_${p.page.slug}.jpg`;
  if (p.type === "intro") return "/img/hero_about.jpg";
  return `/img/hero_${p.type}.jpg`;
}

export default async function Page({ params }: { params: Promise<{ path?: string[] }> }) {
  const { path = [] } = await params;
  const p = findPage(path); if (!p) notFound();
  const m = pageMeta(p);
  const ld: object[] = [webPageLd(p, m.title, m.description)];
  if (p.type === "intro") ld.unshift(clinicLd());
  if (p.type === "main") ld.push(faqLd(MAIN[p.track].faq));
  if (p.type === "sub" && p.page.data.faq) ld.push(faqLd(p.page.data.faq));

  const current = p.type === "main" || p.type === "sub" ? p.track : p.url;
  return (
    <div className={p.type === "intro" ? "intro-page" : undefined}>
      <Header current={current} />
      <main>
        <JsonLd data={ld} />
        {p.type === "intro" && <Intro />}
        {p.type === "main" && <TrackMain k={p.track} />}
        {p.type === "sub" && <SubTemplate track={p.track} page={p.page} url={p.url} parent={p.parent} />}
        {p.type === "about" && <About />}
        {p.type === "visit" && <VisitPage />}
        {p.type === "health" && <Health />}
      </main>
      <Footer />
    </div>
  );
}
