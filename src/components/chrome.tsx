import Link from "next/link";
import { CLINIC, ORDER, TRACKS, TrackKey } from "@/lib/content";

const COMMON = [["/about/", "병원소개"], ["/visit/", "진료·방문안내"], ["/health/", "건강정보"]] as const;

export function Header({ current }: { current?: TrackKey | string }) {
  return (
    <header className="hdr">
      <input type="checkbox" id="m" className="sr" aria-label="메뉴 열기" />
      <div className="wrap">
        <Link href="/" className="logo" aria-label={`${CLINIC.name} 홈`}><img src="/img/logo.png" alt={CLINIC.name} width={286} height={41} /></Link>
        <nav className="nav" aria-label="주요 메뉴">
          {ORDER.map((k) => <Link key={k} href={TRACKS[k].url} className={current === k ? "on" : ""}>{TRACKS[k].name}</Link>)}
        </nav>
        <div className="util">
          {COMMON.map(([h, t]) => <Link key={h} href={h} className={current === h ? "on" : ""}>{t}</Link>)}
          <Link href="/visit/" className="btn p sm cta">예약·문의</Link>
        </div>
        <label htmlFor="m" className="menu-btn" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg></label>
      </div>
      <nav className="mnav" aria-label="모바일 메뉴">
        {ORDER.map((k) => <Link key={k} href={TRACKS[k].url}>{TRACKS[k].name}</Link>)}
        {COMMON.map(([h, t]) => <Link key={h} href={h}>{t}</Link>)}
        <a href={`tel:${CLINIC.tel.replace(/-/g, "")}`}>전화 {CLINIC.tel}</a>
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="ftr">
      <div className="wrap">
        <div className="b">
          <b>{CLINIC.name}</b>
          {CLINIC.address}<br />대표번호 {CLINIC.tel} · {CLINIC.email}<br />
          대표원장 이유재 · 사업자등록번호 [병원 확인] · 의료기관 개설신고번호 [병원 확인]
        </div>
        <div className="l">{ORDER.map((k) => <Link key={k} href={TRACKS[k].url}>{TRACKS[k].name}</Link>)}</div>
        <div className="l">{COMMON.map(([h, t]) => <Link key={h} href={h}>{t}</Link>)}<Link href="/privacy/">개인정보처리방침</Link></div>
        <div className="c">© {new Date().getFullYear()} {CLINIC.name}. 이 사이트의 의학 정보는 진료를 대신하지 않으며, 증상이 있으면 의료진 진료를 받으시기 바랍니다.</div>
      </div>
    </footer>
  );
}
