import seed from "@/data/seed.json";

export interface Post { slug: string; track: string; title: string; summary: string; body: string; reviewer: string; published_at: string; link?: string | null }
export interface Notice { id: number; category: string; title: string; body: string; published_at: string }
export interface Press { id: number; outlet: string; title: string; url: string; published_at: string; thumbnail?: string | null }

const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function fetchTable<T>(table: string, order: string): Promise<T[] | null> {
  if (!URL_ || !KEY) return null;
  try {
    const r = await fetch(`${URL_}/rest/v1/${table}?select=*&published=eq.true&order=${order}.desc`, { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` }, cache: "no-store" });
    if (!r.ok) return null;
    return (await r.json()) as T[];
  } catch { return null; }
}
export async function getPosts(): Promise<Post[]> { return (await fetchTable<Post>("health_posts", "published_at")) ?? (seed.posts as Post[]); }
export async function getNotices(): Promise<Notice[]> { return (await fetchTable<Notice>("notices", "published_at")) ?? (seed.notices as Notice[]); }
export async function getPress(): Promise<Press[]> { return (await fetchTable<Press>("press", "published_at")) ?? (seed.press as Press[]); }
export const TRACK_LABEL: Record<string, string> = { sleep: "수면", dizziness: "어지럼증", growth: "성장", ent: "귀·코·목", notice: "병원 공지" };
