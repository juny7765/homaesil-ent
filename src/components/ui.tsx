import Link from "next/link";
import iconsJson from "@/data/icons.json";
import { CLINIC, DOCS, ORDER, TRACKS, TrackKey, doctorsFor } from "@/lib/content";

const ICONS = iconsJson as unknown as { icons: Record<string, string>; rules: [string, string][] };

export function Icon({ title }: { title: string }) {
  const rule = ICONS.rules.find(([k]) => title.includes(k));
  const svg = ICONS.icons[rule ? rule[1] : "default"] ?? ICONS.icons.default;
  return <span className="ico" aria-hidden="true" dangerouslySetInnerHTML={{ __html: svg }} />;
}

export function Btn({ href, children, kind = "p", className = "" }: { href: string; children: React.ReactNode; kind?: "p" | "s" | "w"; className?: string }) {
  const ext = href.startsWith("http") || href.startsWith("tel:");
  const cls = `btn ${kind} ${className}`;
  return ext ? <a className={cls} href={href}>{children}</a> : <Link className={cls} href={href}>{children}</Link>;
}
export const BookBtn = () => <Btn href="/visit/">진료 예약·문의</Btn>;

export function Section({ children, alt, soft, id, className = "" }: { children: React.ReactNode; alt?: boolean; soft?: boolean; id?: string; className?: string }) {
  return <section id={id} className={`section ${alt ? "alt" : ""} ${soft ? "soft" : ""} ${className}`}><div className="wrap stack">{children}</div></section>;
}
export function H2({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return <div><h2 className="h2">{children}</h2>{sub && <p className="h2sub">{sub}</p>}</div>;
}
export const Eyebrow = ({ children }: { children: React.ReactNode }) => <span className="eyebrow">{children}</span>;

export function Card({ title, body, href, icon }: { title: string; body: string; href?: string; icon?: boolean }) {
  const inner = <>{icon && <Icon title={title} />}<h3>{title}</h3><p>{body}</p>{href && href !== "#" && <span className="more">자세히 보기 →</span>}</>;
  return href && href !== "#" ? <Link className="card" href={href}>{inner}</Link> : <div className="card">{inner}</div>;
}
export const Grid = ({ cols, children }: { cols: 2 | 3 | 4; children: React.ReactNode }) => <div className={`grid g${cols}`}>{children}</div>;

export function Steps({ items }: { items: [string, string][] }) {
  return <ol className="steps">{items.map(([t, d], i) => <li className="step" key={i}><i>{i + 1}</i><b>{t}</b><p>{d}</p></li>)}</ol>;
}
export function Check({ items }: { items: string[] }) { return <ul className="check">{items.map((x) => <li key={x}>{x}</li>)}</ul>; }
export function Faq({ items, reviewer }: { items: [string, string][]; reviewer?: string }) {
  return (
    <>
      <div className="faq">{items.map(([q, a], i) => <details key={i} {...(i === 0 ? { open: true } : {})}><summary>Q. {q}</summary><div className="a">{a}</div></details>)}</div>
      {reviewer && <p className="review">의학 정보 검토 {reviewer} · 검토일 2026.11</p>}
    </>
  );
}
export function Table({ head, rows }: { head: string[]; rows: string[][] }) {
  return <div className="tbl"><table><thead><tr>{head.map((h) => <th key={h}>{h}</th>)}</tr></thead><tbody>{rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody></table></div>;
}
export function Chips({ items }: { items: [string, string][] }) {
  return <div className="chips">{items.map(([t, h]) => <Link className="chip" href={h} key={t}>{t} →</Link>)}</div>;
}

export function Doctors({ track, slug }: { track: TrackKey; slug: string }) {
  return (
    <div className="docs">
      {doctorsFor(track, slug).map((d) => (
        <div className="doc" key={d.key}>
          <img src={`/img/doc_${d.key}.jpg`} alt={`${d.name} 프로필`} width={112} height={140} loading="lazy" />
          <div><b>{d.name}</b><div className="spec">{d.spec}</div><ul>{d.lines.slice(0, 2).map((l) => <li key={l}>{l}</li>)}</ul><Link className="lnk" href="/about/#doctors">의료진 소개와 진료 일정 →</Link></div>
        </div>
      ))}
    </div>
  );
}

export function Visit() {
  return (
    <div className="visit">
      <div className="hours">
        <div><small>평일</small>월~금 09:00 – 19:30 (소아과 ~18:30)</div>
        <div><small>토요일</small>09:00 – 14:00 (소아과 ~13:00)</div>
        <div><small>2·4주 일요일·공휴일</small>09:00 – 13:00</div>
        <div><small>점심시간</small>13:00 – 14:00 · 수면검사는 예약제</div>
        <div style={{ gridColumn: "1 / -1" }}><small>오시는 길</small>{CLINIC.address}</div>
      </div>
      <div className="book">
        <b>예약 · 문의</b>
        <div className="tel">{CLINIC.tel}</div>
        <div className="actions"><Btn href={`tel:${CLINIC.tel.replace(/-/g, "")}`}>전화 걸기</Btn><Btn href="/visit/#booking" kind="w">네이버 예약</Btn></div>
      </div>
    </div>
  );
}

export function TrackCards() {
  return (
    <Grid cols={4}>
      {ORDER.map((k) => (
        <Link className="plain" key={k} href={TRACKS[k].url} style={{ background: "var(--soft)", border: 0 }}>
          <h3>{TRACKS[k].name}</h3><p style={{ color: "var(--brand)", fontWeight: 600 }}>{TRACKS[k].url} 전용 메인 →</p>
        </Link>
      ))}
    </Grid>
  );
}

export function Crumb({ track, title, parent }: { track: TrackKey; title: string; parent?: { name: string; href: string } }) {
  return (
    <nav className="crumb" aria-label="현재 위치">
      <Link href="/">홈</Link><span>›</span><Link href={TRACKS[track].url}>{TRACKS[track].name}</Link><span>›</span>
      {parent && <><Link href={parent.href}>{parent.name}</Link><span>›</span></>}<b>{title}</b>
    </nav>
  );
}

export const DOC_KEYS = Object.keys(DOCS) as (keyof typeof DOCS)[];
