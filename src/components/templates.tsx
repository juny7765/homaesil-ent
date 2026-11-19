import Link from "next/link";
import { IntroSplash } from "./splash";
import { MAIN, TRACKS, TrackKey, SubPage, href, hubHref, REVIEWER, CLINIC, ORDER } from "@/lib/content";
import { Btn, BookBtn, Card, Check, Chips, Crumb, Doctors, Eyebrow, Faq, Grid, H2, Section, Steps, Table, Visit, Icon } from "./ui";

/* ---------- 전용 메인 ---------- */
export function TrackMain({ k }: { k: TrackKey }) {
  const m = MAIN[k]; const t = TRACKS[k];
  return (
    <>
      <section className="hero"><div className="wrap">
        <div className="txt">
          <Eyebrow>{t.name}</Eyebrow>
          <h1 className="h1">{m.h1}</h1>
          <p className="lead">{m.sub}</p>
          <div className="actions"><BookBtn /></div>
        </div>
        <div className="pic"><img src={`/img/hero_${k}.jpg`} alt={`${t.name} 진료 장면`} width={1152} height={768} fetchPriority="high" /></div>
      </div></section>

      {m.features && (
        <Section><H2>{t.short}클리닉의 6가지 약속</H2>
          <Grid cols={3}>{m.features.map(([a, b]) => <div className="feat" key={a}><div><b>{a}</b><p>{b}</p></div></div>)}</Grid>
        </Section>
      )}
      <Section alt><H2>{m.chips_t}</H2>
        <Grid cols={Math.min(m.chips.length, 4) as 2 | 3 | 4}>{m.chips.map(([a, b, h]) => <Card key={a} title={a} body={b} href={href(h)} icon />)}</Grid>
      </Section>
      <Section id="flow"><H2>{m.flow_t_override ?? m.flow_t}</H2><Steps items={m.flow} />
        {m.flow_note && <><div className="box">{m.flow_note}</div><div className="actions"><Btn href="/visit/">예약하기</Btn><Btn href={`tel:${CLINIC.tel.replace(/-/g, "")}`} kind="s">전화 문의하기</Btn></div></>}
      </Section>
      <Section alt><H2>{m.s4_t}</H2>
        <Grid cols={Math.min(m.s4.length, 4) as 2 | 3 | 4}>{m.s4.map(([a, b, h]) => <Card key={a} title={a} body={b} href={href(h)} icon />)}</Grid>
      </Section>
      <Section><H2>진료하는 의료진</H2><Doctors track={k} slug={k} /></Section>
      <Section alt><H2>{t.short} 진료 전 자주 묻는 질문</H2><Faq items={m.faq} reviewer={REVIEWER[k]} /></Section>
      <Section><H2>진료시간과 방문 안내</H2><Visit /></Section>
    </>
  );
}

/* ---------- 서브 (A 질환 / B 검사 / C 치료 / D 소아·연계 / H 허브) ---------- */
export function SubTemplate({ track, page, url, parent }: { track: TrackKey; page: SubPage; url: string; parent?: { name: string; href: string } }) {
  const { slug, title, kind, data: d } = page; const t = TRACKS[track];
  const video: [string, string] | undefined = d.video;
  const hasPoster = true;
  const pic = video ? (
    video[1].startsWith("http")
      ? <iframe className="video" src={video[1].replace("youtu.be/", "www.youtube.com/embed/")} title={video[0]} loading="lazy" allowFullScreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
      : <div className="poster"><img src={`/img/sub_${slug}.jpg`} alt={`${title} 관련 장면`} width={1152} height={768} /><div className="play"><span><svg width="24" height="24" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z" /></svg></span><span className="cap">▶ {video[0]}</span></div></div>
  ) : <img src={`/img/sub_${slug}.jpg`} alt={`${title} 관련 장면`} width={1152} height={768} fetchPriority="high" />;

  let n = 0; const alt = () => (n++ % 2 === 0);
  const flowTitle = kind === "C" ? "치료는 어떻게 진행되나요?" : "진료·검사는 어떻게 진행되나요?";
  return (
    <>
      <section className="hero sub"><div className="wrap">
        <div className="txt">
          <Crumb track={track} title={title} parent={parent} />
          <Eyebrow>{t.name}</Eyebrow>
          <h1 className="h1 sm">{title}</h1>
          <div className="answer">{d.answer}</div>
          <div className="actions"><BookBtn /></div>
        </div>
        <div className="pic">{hasPoster && pic}</div>
      </div></section>

      {(kind === "A" || kind === "D") && <Section alt={alt()}><H2 sub="2개 이상 해당하면 진료를 권합니다">{kind === "A" ? "이런 증상이 있다면 확인해 보세요" : "보호자가 확인할 신호"}</H2><Check items={d.check} /></Section>}
      {kind === "H" && <Section alt={alt()}><H2>어떤 질환이 있나요?</H2><Grid cols={3}>{(d.hub as [string, string][]).map(([a, b]) => <Card key={a} title={a} body={b} href={hubHref(a)} icon />)}</Grid></Section>}
      {kind === "A" && <Section alt={alt()}><H2>{d.cause_t}</H2><Grid cols={3}>{(d.cause as [string, string][]).map(([a, b]) => <div className="plain" key={a}><h3>{a}</h3><p>{b}</p></div>)}</Grid></Section>}
      {kind === "B" && <Section alt={alt()}><H2>어떤 경우에 받나요?</H2><Check items={d.when} /></Section>}
      {kind === "C" && <Section alt={alt()}><H2>누구에게 해당하나요?</H2><Check items={d.who} /></Section>}
      {kind === "D" && <Section alt={alt()}><H2>진료 범위와 연계</H2><Grid cols={Math.min(d.scope.length, 4) as 2 | 3 | 4}>{(d.scope as [string, string, string][]).map(([a, b, h]) => <Card key={a} title={a} body={b} href={href(h)} />)}</Grid></Section>}

      <Section id="flow" alt={alt()}><H2>{flowTitle}</H2><Steps items={d.flow} /></Section>

      {kind === "B" && <Section alt={alt()}><H2>검사 전 준비사항과 안내</H2>
        <Grid cols={4}>{(d.info as [string, string][]).map(([a, b]) => <div className="info" key={a}><small>{a}</small><b>{b}</b></div>)}</Grid>
        <div className="box">준비사항 · {(d.prep as string[]).join(" · ")}</div></Section>}
      {kind === "A" && <Section alt={alt()}><H2>치료와 관리</H2>
        <Grid cols={3}>{(d.treat as string[][]).map((x) => x.length > 2 ? <Card key={x[0]} title={x[0]} body={x[1]} href={href(x[2])} /> : <div className="plain" key={x[0]}><h3>{x[0]}</h3><p>{x[1]}</p></div>)}</Grid></Section>}
      {kind === "C" && <><Section alt={alt()}><H2>선택지 비교</H2><Table head={d.compare_h} rows={d.compare} /></Section><Section alt={alt()}><H2>치료 후 관리</H2><Check items={d.after} /></Section></>}

      <Section alt={alt()}><H2>진료하는 의료진</H2><Doctors track={track} slug={slug} /></Section>
      <Section alt={alt()}><H2>자주 묻는 질문</H2><Faq items={d.faq} reviewer={REVIEWER[track]} /></Section>
      {d.notice && <div className="wrap" style={{ paddingBottom: 24 }}><div className="notice">{d.notice}</div></div>}
      <Section alt={alt()}><H2>관련 진료</H2><Chips items={(d.rel as [string, string][]).map(([a, h]) => [a, href(h)])} /><Visit /></Section>
    </>
  );
}

/* ---------- 인트로 ---------- */
const INTRO_META: Record<TrackKey, [string, string]> = {
  sleep: ["코골이·무호흡 · 기면증 · 렘수면행동장애", "코를 골거나 자도 피곤한 분, 수면 전 다리 불편, 잠꼬대가 심한 분"],
  dizziness: ["이석증·메니에르·전정 질환 진료", "어지럼이 반복되거나 갑자기 심한 분"],
  growth: ["키 성장·성조숙증·소아비만 평가와 관리", "아이의 키·사춘기 속도가 걱정되는 보호자"],
  ent: ["증상별 이비인후과 진료 안내", "귀·코·목 불편으로 진료를 찾는 분"],
};
export function Intro() {
  return (
    <section className="intro2">
      <IntroSplash />
      <h1 className="sr">안녕하세요 호매실연세이비인후과입니다.</h1>
      <div className="grid4">
        {ORDER.map((k, i) => (
          <Link className="tile2" key={k} href={TRACKS[k].url}>
            <img src={`/img/tile_${k}.jpg`} alt={`${TRACKS[k].name} 진료 장면`} width={1536} height={1024} loading="eager" />
            <div className="veil" />
            <div className="t">
              <span className="n">{TRACKS[k].url.replace(/\//g, "")} clinic</span>
              <h2>{TRACKS[k].name}</h2>
              <p>{INTRO_META[k][0]}</p>
              <span className="go">{TRACKS[k].short} 전용 메인 →</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
export { Icon };
