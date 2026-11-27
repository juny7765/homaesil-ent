import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Header, Footer } from "@/components/chrome";
import { PostPage } from "@/components/common-pages";
import { JsonLd } from "@/components/jsonld";
import { getPosts } from "@/lib/cms";
import { CLINIC } from "@/lib/content";

export const dynamicParams = false;
export async function generateStaticParams() { return (await getPosts()).map((p) => ({ slug: p.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const post = (await getPosts()).find((p) => p.slug === slug); if (!post) return {};
  return { title: post.title, description: post.summary, alternates: { canonical: `${CLINIC.site}/health/${slug}/` } };
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const post = (await getPosts()).find((p) => p.slug === slug); if (!post) notFound();
  const ld = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [{ "@type": "Question", name: post.title, acceptedAnswer: { "@type": "Answer", text: post.summary } }] };
  return (<><Header current="/health/" /><main><JsonLd data={ld} /><PostPage post={post} /></main><Footer review={`${post.reviewer} · ${post.published_at}`} /></>);
}
