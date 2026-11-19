// 호매실연세이비인후과 — V2 원고(contentauto-V2) → 홈페이지 건강정보(health_posts) 동기화
// 호출: 관리자 페이지 "V2 원고 가져오기" 버튼(로그인 JWT) 또는 pg_cron 일일 호출
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const V2_URL = Deno.env.get("V2_SUPABASE_URL") ?? "https://phcrpjtakigtwscypzxj.supabase.co";
const V2_KEY = Deno.env.get("V2_SUPABASE_ANON_KEY") ?? "sb_publishable_tzmKk0g5Ey34L3OfeDY9xw_64PFy8It"; // V2 publishable(공개) 키, 시크릿으로 덮어쓰기 가능
// 광고주 13(호매실) 필터는 V2 측 뷰 homaesil_site_feed 안에서 적용됨

const TRACK_RULES: [RegExp, "sleep" | "dizziness" | "growth" | "ent"][] = [
  [/코골이|수면|무호흡|기면|불면|양압기|하지불안|렘수면|과수면/, "sleep"],
  [/어지럼|이석|메니에르|전정|현훈|평형/, "dizziness"],
  [/성장클리닉|키 ?성장|성장호르몬|성조숙|소아비만|성장판|골연령|성장 ?검사|저신장/, "growth"],
];
const REVIEWER = { sleep: "박중수 원장", dizziness: "이유재 대표원장", growth: "김수현 원장", ent: "이유재 대표원장" };
const LINK = { sleep: "/sleep/", dizziness: "/dizziness/", growth: "/growth/", ent: "/ent/" };

function esc(s: string) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
function inline(s: string) { return esc(s).replace(/\*\*(.+?)\*\*/g, "$1").replace(/\*(.+?)\*/g, "$1"); }

/** V2 마크다운 본문 → 홈페이지 본문 HTML (h1 제거, ## → h2, [IMAGE_n] 제거, 해시태그 줄 제거) */
function mdToHtml(md: string): string {
  const out: string[] = []; let para: string[] = []; let list: string[] = [];
  const flushP = () => { if (para.length) { out.push(`<p>${para.map(inline).join(" ")}</p>`); para = []; } };
  const flushL = () => { if (list.length) { out.push(`<ul>${list.map((l) => `<li>${inline(l)}</li>`).join("")}</ul>`); list = []; } };
  for (const raw of md.split(/\r?\n/)) {
    // 이미지 마커·img 태그·구분선 제거 (줄 어디에 있든)
    let line = raw.replace(/\[IMAGE_\d+\]/g, "").replace(/<img[^>]*>/gi, "").replace(/^[!.\s]+(?=<|#|$)/, "").trim();
    line = line.replace(/^(\[ \]|☐|□)\s*/, "");
    if (!line || /^-{3,}$/.test(line)) { flushP(); flushL(); continue; }
    if (/^(#\S+\s*)+$/.test(line)) continue; // 해시태그 줄
    if (/^#\s/.test(line)) continue; // h1 = 제목 중복
    if (/^##\s/.test(line)) { flushP(); flushL(); out.push(`<h2>${inline(line.replace(/^##\s+/, ""))}</h2>`); continue; }
    if (/^###\s/.test(line)) { flushP(); flushL(); out.push(`<h3>${inline(line.replace(/^###\s+/, ""))}</h3>`); continue; }
    if (/^[-*•]\s/.test(line)) { flushP(); list.push(line.replace(/^[-*•]\s+/, "").replace(/^(\[ \]|☐|□)\s*/, "")); continue; }
    if (/^<(h2|h3|p|ul|ol|li|div|footer|span)/i.test(line)) { flushP(); flushL(); out.push(line.replace(/<span class="imgmarker">.*?<\/span>/g, "")); continue; }
    flushL(); para.push(line);
  }
  flushP(); flushL();
  return out.join("\n");
}
function track(text: string) { for (const [re, t] of TRACK_RULES) if (re.test(text)) return t; return "ent" as const; }
function stripTitle(t: string) { return t.replace(/^#+\s*/, "").trim(); }

Deno.serve(async (req) => {
  const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type" };
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...cors, "Content-Type": "application/json" } });
  if (!V2_KEY) return json({ error: "V2_SUPABASE_ANON_KEY 시크릿이 설정되지 않았습니다." }, 500);

  const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const log = { fetched: 0, inserted: 0, skipped: 0, short: 0, error: null as string | null };
  try {
    // V2에 만든 읽기 전용 뷰(homaesil_site_feed): 광고주 13의 승인 원고만 노출
    const url = `${V2_URL}/rest/v1/homaesil_site_feed?select=*&order=id.desc&limit=500`;
    const r = await fetch(url, { headers: { apikey: V2_KEY, Authorization: `Bearer ${V2_KEY}` } });
    if (!r.ok) throw new Error(`V2 조회 실패 ${r.status}: ${await r.text()}`);
    const rows = (await r.json()) as any[];
    const items = rows.map((row) => ({ cr: { topic: row.topic, keywords: row.keywords }, fc: row }));
    log.fetched = items.length;

    // 2) 이미 가져온 것 제외
    const { data: existing } = await sb.from("health_posts").select("source_id").eq("source", "v2");
    const have = new Set((existing ?? []).map((e) => e.source_id));

    // 3) 변환 후 미발행(published=false)으로 적재
    const inserts = items.filter(({ fc }) => !have.has(fc.id)).map(({ cr, fc }) => {
      const t = track(`${cr.topic} ${(cr.keywords ?? []).join(" ")} ${fc.title}`);
      const body = mdToHtml(fc.body ?? "");
      if (body.replace(/<[^>]+>/g, "").length < 800) { log.short++; return null; } // 본문 누락·이미지만 있는 원고 제외
      return {
        slug: `v2-${fc.id}`, source: "v2", source_id: fc.id, track: t,
        title: stripTitle(fc.title), summary: (fc.meta_description ?? "").slice(0, 300), body,
        reviewer: REVIEWER[t], link: LINK[t], keywords: cr.keywords ?? [], published: false,
        published_at: (fc.approved_at ?? new Date().toISOString()).slice(0, 10),
      };
    }).filter((x): x is NonNullable<typeof x> => x !== null);
    log.skipped = log.fetched - inserts.length - log.short;
    if (inserts.length) { const { error } = await sb.from("health_posts").insert(inserts); if (error) throw error; log.inserted = inserts.length; }
  } catch (e) { log.error = String((e as Error).message ?? e); }
  await sb.from("sync_log").insert(log);
  return json(log, log.error ? 500 : 200);
});
