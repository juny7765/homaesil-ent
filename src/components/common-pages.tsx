import Link from "next/link";
import { CLINIC, DOCS } from "@/lib/content";
import { getNotices, getPosts, getPress, TRACK_LABEL } from "@/lib/cms";
import { Btn, Card, Eyebrow, Faq, Grid, H2, Section, Table, TrackCards, Visit } from "./ui";

const SCHED: Record<string, string[][]> = {
  lee: [["오전", "○", "○", "○", "휴무", "○", "○", "2·4주"], ["오후", "○", "○", "○", "휴무", "○", "-", "-"]],
  park: [["오전", "○", "○", "휴무", "○", "○", "○", "-"], ["오후", "○", "○", "휴무", "○", "○", "-", "-"]],
  kim: [["오전", "○", "휴무", "○", "○", "○", "○", "-"], ["오후", "~18:30", "휴무", "~18:30", "~18:30", "~18:30", "-", "-"]],
};
const EQUIP = [
  ["수면", "LEVEL 1 FULL PSG 수면다원검사 · 1인 수면검사실 · 양압기", "수면클리닉"],
  ["청각", "순음·임피던스·이음향방사검사·음장검사", "난청·이명 · 보청기"],
  ["코", "CT · 미세절삭기 · RF 고주파 · 레이저 · 설하면역요법 · 히스토불린 주사", "비염·축농증 · 코 수술 · 면역치료"],
  ["목", "후두 내시경(연성·경성) · 경부 초음파 · 광섬유내시경 연하검사(FEES) · 후각검사", "목 질환 · 갑상선·침샘·림프절 · 삼킴·후각 평가"],
  ["소아", "소아 전용 X-ray(방사선 저감) · 영유아검진 · 예방접종", "소아 진료"],
  ["특화", "브레인바디 검사(뇌파 EEG · 맥파 PPG)", "어지럼·이명·수면·피로 보조 검사"],
  ["어지럼증", "비디오안진검사(VNG) · 자동평형검사(Posturography)", "어지럼증클리닉"],
  ["성장", "AI 골연령 판독(VUNO Med-BoneAge) · 초음파 · 혈액 검사", "성장클리닉"],
];

export async function About() {
  const press = await getPress();
  return (
    <>
      <section className="hero" style={{ background: "var(--tint)" }}><div className="wrap">
        <div className="txt"><Eyebrow>병원소개</Eyebrow>
          <h1 className="h1" style={{ fontSize: 40 }}>호매실연세이비인후과의원은<br />이비인후과 전문의 2인과<br />소아청소년과 전문의가 진료합니다.</h1>
          <div className="actions"><Btn href="/visit/" kind="s">진료·방문안내</Btn></div></div>
        <div className="pic"><img src="/img/hero_about.jpg" alt="호매실연세이비인후과 접수·대기 공간" width={1536} height={1024} fetchPriority="high" /></div>
      </div></section>
      <Section id="doctors"><H2>진료하는 의료진</H2>
        <div className="docs2">{(Object.keys(DOCS) as (keyof typeof DOCS)[]).map((k) => { const d = DOCS[k]; return (
          <div className="doc2" key={k}>
            <img src={`/img/doc_${k}.jpg`} alt={`${d.name} 프로필`} width={480} height={600} loading="lazy" />
            <div className="body">
              <b>{d.name}</b><div className="spec">{d.spec}</div><div className="tr">담당 · {d.tracks}</div>
              <ul>{d.lines.map((l) => <li key={l}>{l}</li>)}</ul>
              <Table head={["요일", "월", "화", "수", "목", "금", "토", "일"]} rows={SCHED[k]} />
            </div>
          </div>); })}</div>
      </Section>
      <Section alt><H2>언론보도</H2>
        <Grid cols={4}>{press.map((p) => <a className="plain" key={p.id} href={p.url === "#" ? "/about/#press" : p.url} target={p.url === "#" ? undefined : "_blank"} rel="noopener"><h3>{p.title}</h3><p>{p.outlet} · {p.published_at}</p></a>)}</Grid>
      </Section>
      <Section><H2>병원의 진료 방향</H2>
        <Grid cols={3}>
          {[["검사로 원인을 확인합니다", "수면다원검사·평형 검사·청력 검사·성장판 검사 등 객관적 검사 결과를 바탕으로 진료 방향을 정합니다."], ["결과를 설명하고 함께 결정합니다", "치료를 온라인이나 전화로 확정하지 않고, 결과 설명 뒤 환자·보호자와 선택지를 함께 검토합니다."], ["두 과가 연계해 진료합니다", "이비인후과 전문의 2인과 소아청소년과 전문의 1인이 코골이·성장·소아 질환을 한 병원 안에서 연계합니다."]].map(([a, b]) => <div className="plain" key={a}><h3>{a}</h3><p>{b}</p></div>)}
        </Grid>
      </Section>
      <Section alt><H2 sub="현 사이트 둘러보기 사진 재사용 예정">병원 공간과 실제 장비</H2>
        <Grid cols={4}>{["내부 전경", "진료실 · 내시경", "검사실 · 청력 부스", "검사실 · X-ray", "수술실", "수면센터 · 1인 검사실", "수면센터 · 판독실", "수면센터 · 양압기"].map((x) => <div className="plain" key={x} style={{ minHeight: 160, display: "flex", alignItems: "flex-end", background: "var(--soft)", border: 0 }}><p style={{ color: "var(--mute)" }}>{x} 사진</p></div>)}</Grid>
        <Table head={["구분", "장비·시설", "사용 진료"]} rows={EQUIP} />
      </Section>
      <Section><H2>관심 진료 메인으로 이동</H2><TrackCards /></Section>
      <Section alt><H2>진료시간과 방문 안내</H2><Visit /></Section>
    </>
  );
}

export function VisitPage() {
  return (
    <>
      <section className="hero" style={{ background: "var(--tint)" }}><div className="wrap">
        <div className="txt"><Eyebrow>진료 및 방문안내</Eyebrow><h1 className="h1" style={{ fontSize: 40 }}>진료시간 · 예약 · 오시는 길</h1>
          <p className="lead">어떤 클리닉으로 오시든 진료시간·위치·주차·문의 방법은 같습니다.</p>
          <div className="actions"><Btn href={`tel:${CLINIC.tel.replace(/-/g, "")}`}>전화 {CLINIC.tel}</Btn><Btn href="#booking" kind="s">네이버 예약</Btn><Btn href="#map" kind="s">길찾기</Btn></div></div>
        <div className="pic"><img src="/img/hero_visit.jpg" alt="접수 안내 장면" width={1536} height={1024} fetchPriority="high" /></div>
      </div></section>
      <Section><H2>진료시간과 휴진 안내</H2>
        <Table head={["구분", "이비인후과", "소아청소년과", "비고"]} rows={[["월~금", "09:00 – 19:30", "09:00 – 18:30", "점심 13:00 – 14:00"], ["토요일", "09:00 – 14:00", "09:00 – 13:00", "-"], ["2·4주 일요일 · 공휴일", "09:00 – 13:00", "-", "1·3주 일요일 휴진"], ["수면다원검사", "저녁 내원 ~ 익일 아침", "-", "예약제"]]} />
        <Table head={["의료진", "휴무", "비고"]} rows={[["이유재 대표원장", "목요일", "2·4주 일요일 진료"], ["박중수 원장", "수요일", "일요일 진료 없음"], ["김수현 원장", "화요일", "평일 ~18:30 · 토 ~13:00 · 일요일 없음"]]} />
      </Section>
      <Section id="booking" alt><H2>예약과 문의</H2>
        <Grid cols={4}><Card title="전화 예약·문의" body={`${CLINIC.tel} · 진료시간 내 통화`} /><Card title="네이버 예약" body="[운영 여부 병원 확인]" /><Card title="카카오 채널" body="[운영 여부 병원 확인]" /><Card title="수면다원검사 예약" body="검사 전 상담 필수 · 전화 또는 외래 예약" href="/sleep/psg/" /></Grid>
      </Section>
      <Section id="map"><H2>오시는 길과 주차</H2>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          <div style={{ flex: "2 1 560px" }}><iframe className="video" style={{ aspectRatio: "16/10" }} title="오시는 길 지도" loading="lazy" src={`https://maps.google.com/maps?q=${encodeURIComponent(CLINIC.address)}&output=embed`} /></div>
          <div style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", gap: 12 }}>
            {[["주소", `${CLINIC.address}`], ["대중교통", "버스 [정류장·노선 병원 확인] · 수인분당선 오목천역 [도보·버스 안내]"], ["주차", "[건물 주차장 · 무료/유료 · 등록 방법]"]].map(([a, b]) => <div className="plain" key={a}><h3>{a}</h3><p>{b}</p></div>)}
          </div>
        </div>
      </Section>
      <Section alt><H2>방문 전 자주 묻는 질문</H2>
        <Faq items={[["예약 없이 가도 되나요?", "[병원 확인] 일반 진료는 당일 접수 가능 여부와 대기 안내, 검사는 예약제인지 표시합니다."], ["초진 때 무엇을 준비하나요?", "신분증, 복용 중인 약 목록, 다른 병원 검사 결과·소견서가 있으면 지참해 주세요."], ["아이 혼자 진료받을 수 있나요?", "미성년자는 보호자 동반이 원칙이며 예외 기준은 병원 안내를 따릅니다."], ["주차는 얼마나 무료인가요?", "[병원 확인] 주차 지원 시간과 등록 방법을 안내합니다."]]} />
      </Section>
      <Section><H2>관심 진료 메인으로 이동</H2><TrackCards /></Section>
    </>
  );
}

export async function Health() {
  const [posts, notices] = await Promise.all([getPosts(), getNotices()]);
  return (
    <>
      <section className="hero" style={{ background: "var(--tint)" }}><div className="wrap">
        <div className="txt"><Eyebrow>건강정보</Eyebrow><h1 className="h1" style={{ fontSize: 40 }}>환자가 자주 묻는 질문에 의료진이 답합니다</h1>
          <p className="lead">수면·어지럼증·성장·귀코목 네 분야의 질문형 콘텐츠와 병원 공지를 한곳에 모았습니다. 모든 의학 내용은 의료진 검토 후 공개합니다.</p>
          <div className="tabs">{Object.entries(TRACK_LABEL).map(([k, v]) => <a className="tab" key={k} href={`#${k}`}>{v}</a>)}</div></div>
        <div className="pic"><img src="/img/hero_health.jpg" alt="의료진이 건강정보를 검토하는 장면" width={1536} height={1024} fetchPriority="high" /></div>
      </div></section>
      {(["sleep", "dizziness", "growth", "ent"] as const).map((k, i) => {
        const list = posts.filter((p) => p.track === k); if (!list.length) return null;
        return <Section key={k} id={k} alt={i % 2 === 1}><H2>{TRACK_LABEL[k]} 건강정보</H2>
          <Grid cols={4}>{list.map((p) => <Link className="q" key={p.slug} href={`/health/${p.slug}/`}><span className="tag">{TRACK_LABEL[p.track]}</span><h3>Q. {p.title}</h3><small>의학 정보 검토 {p.reviewer} · {p.published_at}</small></Link>)}</Grid></Section>;
      })}
      <Section id="notice"><H2>병원 공지</H2><Table head={["날짜", "구분", "제목"]} rows={notices.map((n) => [n.published_at, n.category, n.title])} /></Section>
      <Section alt><H2>관련 진료로 이동</H2><TrackCards /></Section>
    </>
  );
}

export function PostPage({ post }: { post: Awaited<ReturnType<typeof getPosts>>[number] }) {
  return (
    <>
      <section className="hero sub"><div className="wrap" style={{ flexDirection: "column", alignItems: "flex-start", gap: 16 }}>
        <nav className="crumb" aria-label="현재 위치"><Link href="/">홈</Link><span>›</span><Link href="/health/">건강정보</Link><span>›</span><b>{TRACK_LABEL[post.track]}</b></nav>
        <Eyebrow>{TRACK_LABEL[post.track]} 건강정보</Eyebrow>
        <h1 className="h1 sm">Q. {post.title}</h1>
        <div className="answer" style={{ maxWidth: 820 }}>{post.summary}</div>
        <p className="review">의학 정보 검토 {post.reviewer} · {post.published_at}</p>
      </div></section>
      <Section><div className="prose" dangerouslySetInnerHTML={{ __html: post.body }} />
        {post.link && <div className="actions"><Btn href={post.link}>관련 진료 페이지 보기</Btn><Btn href="/visit/" kind="s">진료 예약·문의</Btn></div>}
      </Section>
      <Section alt><H2>관련 진료로 이동</H2><TrackCards /></Section>
    </>
  );
}
