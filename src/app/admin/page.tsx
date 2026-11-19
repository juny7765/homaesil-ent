"use client";
import { useEffect, useMemo, useState } from "react";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const DEPLOY_HOOK = process.env.NEXT_PUBLIC_DEPLOY_HOOK ?? "";

type Tab = "health_posts" | "notices" | "press";
const TABS: { key: Tab; label: string }[] = [{ key: "health_posts", label: "건강정보" }, { key: "notices", label: "병원 공지" }, { key: "press", label: "언론보도" }];
const EMPTY: Record<Tab, Record<string, any>> = {
  health_posts: { slug: "", track: "sleep", title: "", summary: "", body: "", reviewer: "", link: "", published: false, published_at: new Date().toISOString().slice(0, 10) },
  notices: { category: "진료", title: "", body: "", published: true, published_at: new Date().toISOString().slice(0, 10) },
  press: { outlet: "", title: "", url: "", thumbnail: "", published: true, published_at: new Date().toISOString().slice(0, 10) },
};

export default function Admin() {
  const sb = useMemo<SupabaseClient | null>(() => (URL_ && KEY ? createClient(URL_, KEY) : null), []);
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState(""); const [pw, setPw] = useState("");
  const [tab, setTab] = useState<Tab>("health_posts");
  const [rows, setRows] = useState<any[]>([]);
  const [edit, setEdit] = useState<Record<string, any> | null>(null);
  const [msg, setMsg] = useState("");

  useEffect(() => { sb?.auth.getUser().then(({ data }) => setUser(data.user)); }, [sb]);
  useEffect(() => { if (user) load(); /* eslint-disable-next-line */ }, [user, tab]);

  async function load() { if (!sb) return; const { data, error } = await sb.from(tab).select("*").order("published_at", { ascending: false }); if (error) setMsg(error.message); else setRows(data ?? []); }
  async function login(e: React.FormEvent) { e.preventDefault(); if (!sb) return; const { data, error } = await sb.auth.signInWithPassword({ email, password: pw }); if (error) setMsg(error.message); else setUser(data.user); }
  async function save() {
    if (!sb || !edit) return; const { id, created_at, updated_at, ...payload } = edit;
    const q = id ? sb.from(tab).update(payload).eq("id", id) : sb.from(tab).insert(payload);
    const { error } = await q; if (error) { setMsg(error.message); return; }
    setEdit(null); setMsg("저장했습니다. 사이트 반영은 '사이트 다시 빌드'를 누르세요."); load();
  }
  async function remove(id: number) { if (!sb || !confirm("삭제할까요?")) return; const { error } = await sb.from(tab).delete().eq("id", id); if (error) setMsg(error.message); else load(); }
  async function syncV2() {
    setMsg("V2 원고를 가져오는 중입니다…");
    const { data, error } = await sb!.functions.invoke("sync-v2", { body: {} });
    if (error) { setMsg(`가져오기 실패: ${error.message}`); return; }
    const d = data as { fetched: number; inserted: number; skipped: number; short?: number; error?: string | null };
    if (d?.error) { setMsg(`가져오기 실패: ${d.error}`); return; }
    setMsg(`V2 승인 원고 ${d.fetched}건 확인 — 새로 ${d.inserted}건을 '비공개'로 가져왔습니다(이미 있는 ${d.skipped}건${d.short ? `, 본문이 비어 있는 ${d.short}건` : ""} 제외). 내용 확인 후 '비공개' 버튼을 눌러 공개로 바꾸고 '사이트 다시 빌드'를 누르면 반영됩니다.`);
    load();
  }
  async function togglePublish(r: any) { if (!sb) return; const { error } = await sb.from(tab).update({ published: !r.published }).eq("id", r.id); if (error) setMsg(error.message); else load(); }
  async function rebuild() { if (!DEPLOY_HOOK) { setMsg("배포 훅(NEXT_PUBLIC_DEPLOY_HOOK)이 설정되지 않았습니다."); return; } await fetch(DEPLOY_HOOK, { method: "POST" }); setMsg("다시 빌드를 요청했습니다. 2~3분 뒤 사이트에 반영됩니다."); }

  if (!sb) return <Shell><p>Supabase 환경변수(NEXT_PUBLIC_SUPABASE_URL / ANON_KEY)가 설정되지 않았습니다.</p></Shell>;
  if (!user) return (
    <Shell>
      <form onSubmit={login} className="stack" style={{ maxWidth: 360 }}>
        <h1 className="h2">관리자 로그인</h1>
        <input className="inp" placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="inp" type="password" placeholder="비밀번호" value={pw} onChange={(e) => setPw(e.target.value)} />
        <button className="btn p" type="submit">로그인</button>
        {msg && <p className="review">{msg}</p>}
      </form>
    </Shell>
  );
  const fields = Object.keys(EMPTY[tab]);
  return (
    <Shell>
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <div className="tabs">{TABS.map((t) => <button key={t.key} className={`tab ${tab === t.key ? "on" : ""}`} onClick={() => { setTab(t.key); setEdit(null); }}>{t.label}</button>)}</div>
        <span style={{ marginLeft: "auto" }} />
        <button className="btn s sm" onClick={() => setEdit({ ...EMPTY[tab] })}>+ 새 글</button>
        {tab === "health_posts" && <button className="btn s sm" onClick={syncV2}>V2 원고 가져오기</button>}
        <button className="btn p sm" onClick={rebuild}>사이트 다시 빌드</button>
        <button className="btn s sm" onClick={() => sb.auth.signOut().then(() => setUser(null))}>로그아웃</button>
      </div>
      {msg && <p className="review">{msg}</p>}
      {edit && (
        <div className="plain stack" style={{ gap: 12 }}>
          {fields.map((f) => (
            <label key={f} style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 13, color: "var(--mute)" }}>{LABEL[f] ?? f}
              {f === "body" ? <textarea className="inp" rows={10} value={edit[f] ?? ""} onChange={(e) => setEdit({ ...edit, [f]: e.target.value })} />
                : f === "published" ? <input type="checkbox" checked={!!edit[f]} onChange={(e) => setEdit({ ...edit, [f]: e.target.checked })} />
                : f === "track" ? <select className="inp" value={edit[f]} onChange={(e) => setEdit({ ...edit, [f]: e.target.value })}>{["sleep", "dizziness", "growth", "ent"].map((o) => <option key={o} value={o}>{o}</option>)}</select>
                : <input className="inp" value={edit[f] ?? ""} onChange={(e) => setEdit({ ...edit, [f]: e.target.value })} />}
            </label>
          ))}
          <div className="actions"><button className="btn p" onClick={save}>저장</button><button className="btn s" onClick={() => setEdit(null)}>취소</button></div>
        </div>
      )}
      <div className="tbl"><table><thead><tr><th>날짜</th><th>제목</th><th>출처</th><th>발행</th><th></th></tr></thead><tbody>
        {rows.map((r) => <tr key={r.id}><td>{r.published_at}</td><td>{r.title}{tab === "health_posts" && r.track && <span style={{ marginLeft: 6, fontSize: 12, color: "var(--mute)" }}>{TRACK_KO[r.track] ?? r.track}</span>}</td><td>{r.source === "v2" ? "V2 자동" : "직접 작성"}</td><td><button className={`btn sm ${r.published ? "p" : "s"}`} onClick={() => togglePublish(r)}>{r.published ? "공개" : "비공개"}</button></td><td style={{ whiteSpace: "nowrap" }}><button className="btn s sm" onClick={() => setEdit(r)}>수정</button> <button className="btn s sm" onClick={() => remove(r.id)}>삭제</button></td></tr>)}
      </tbody></table></div>
      <style>{`.inp{min-height:44px;padding:8px 12px;border:1.5px solid var(--line);border-radius:10px;font-size:15px;width:100%}textarea.inp{min-height:200px;font-family:ui-monospace,monospace}`}</style>
    </Shell>
  );
}
const TRACK_KO: Record<string, string> = { sleep: "수면", dizziness: "어지럼증", growth: "성장", ent: "귀코목" };
const LABEL: Record<string, string> = { slug: "URL 슬러그(영문)", track: "분야", title: "제목(질문형)", summary: "핵심 답변(2~3문장)", body: "본문(HTML 허용)", reviewer: "검토 의료진", link: "관련 진료 페이지 경로", published: "발행", published_at: "게시일", category: "구분", outlet: "매체명", url: "기사 URL", thumbnail: "썸네일 URL" };
function Shell({ children }: { children: React.ReactNode }) {
  return <main className="section"><div className="wrap stack"><p className="eyebrow">호매실연세이비인후과 관리자</p>{children}</div></main>;
}
