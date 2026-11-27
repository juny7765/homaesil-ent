import Link from "next/link";
import { CLINIC, DOCS } from "@/lib/content";
import { getNotices, getPosts, getPress, HEALTH_ORDER, TRACK_LABEL } from "@/lib/cms";
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
      {press.length > 0 && <Section alt><H2>언론보도</H2>
        <Grid cols={4}>{press.map((p) => <a className="plain" key={p.id} href={p.url === "#" ? "/about/#press" : p.url} target={p.url === "#" ? undefined : "_blank"} rel="noopener"><h3>{p.title}</h3><p>{p.outlet} · {p.published_at}</p></a>)}</Grid>
      </Section>}
      <Section><H2>병원의 진료 방향</H2>
        <Grid cols={3}>
          {[["검사로 원인을 확인합니다", "수면다원검사·평형 검사·청력 검사·성장판 검사 등 객관적 검사 결과를 바탕으로 진료 방향을 정합니다."], ["결과를 설명하고 함께 결정합니다", "치료를 온라인이나 전화로 확정하지 않고, 결과 설명 뒤 환자·보호자와 선택지를 함께 검토합니다."], ["두 과가 연계해 진료합니다", "이비인후과 전문의 2인과 소아청소년과 전문의 1인이 코골이·성장·소아 질환을 한 병원 안에서 연계합니다."]].map(([a, b]) => <div className="plain" key={a}><h3>{a}</h3><p>{b}</p></div>)}
        </Grid>
      </Section>
      <Section alt><H2>병원 공간과 장비</H2>
        <Grid cols={2}>
          <Card title="병원 둘러보기" body="내부 전경·진료실·검사실·수술실·수면센터 등 환자분이 이용하시는 공간을 사진으로 안내합니다." href="/about/tour/" />
          <Card title="장비 소개" body="수면다원검사·내시경·초음파·골연령 판독 등 정확한 진단을 위한 장비와 시설을 진료별로 소개합니다." href="/about/equipment/" />
        </Grid>
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
        <Grid cols={4}><Card title="전화 예약·문의" body={`${CLINIC.tel} · 진료시간 내 통화`} /><Card title="네이버 예약" body="네이버 지도에서 호매실연세이비인후과 검색 후 예약" /><Card title="이메일 문의" body={`${CLINIC.email} · 검사·수술 관련 문의`} /><Card title="수면다원검사 예약" body="검사 전 상담 필수 · 전화 또는 외래 예약" href="/sleep/psg/" /></Grid>
      </Section>
      <Section id="map"><H2>오시는 길과 주차</H2>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          <div style={{ flex: "2 1 560px" }}><iframe className="video" style={{ aspectRatio: "16/10" }} title="오시는 길 지도" loading="lazy" src={`https://maps.google.com/maps?q=${encodeURIComponent(CLINIC.address)}&output=embed`} /></div>
          <div style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", gap: 12 }}>
            {[["주소", `${CLINIC.address}`], ["대중교통", "수인분당선 오목천역에서 버스 환승 · 호매실로 정류장 하차 후 도보"], ["주차", "중앙 파크뷰 건물 주차장 이용 · 접수 시 차량 번호 등록"]].map(([a, b]) => <div className="plain" key={a}><h3>{a}</h3><p>{b}</p></div>)}
          </div>
        </div>
      </Section>
      <Section alt><H2>방문 전 자주 묻는 질문</H2>
        <Faq items={[["예약 없이 가도 되나요?", "일반 진료는 예약 없이 당일 접수하실 수 있고, 예약하시면 대기 시간이 줄어듭니다. 수면다원검사·알레르기 검사 등 검사는 예약제로 운영합니다."], ["초진 때 무엇을 준비하나요?", "신분증, 복용 중인 약 목록, 다른 병원 검사 결과·소견서가 있으면 지참해 주세요."], ["아이 혼자 진료받을 수 있나요?", "미성년자는 보호자 동반이 원칙입니다. 보호자가 함께 오기 어려운 중고생은 보호자와 전화 연결이 가능하면 진료할 수 있습니다."], ["주차는 얼마나 무료인가요?", "진료 시 접수대에 차량 번호를 말씀하시면 주차 등록해 드립니다. 건물 주차장이 혼잡한 시간에는 인근 공영주차장 이용을 권합니다."]]} />
      </Section>
      <Section><H2>관심 진료 메인으로 이동</H2><TrackCards /></Section>
    </>
  );
}

export function Tour() {
  const tiles = ["내부 전경", "진료실 · 내시경", "검사실 · 청력 부스", "검사실 · X-ray", "수술실", "수면센터 · 1인 검사실", "수면센터 · 판독실", "수면센터 · 양압기"];
  return (
    <>
      <section className="hero sub"><div className="wrap" style={{ flexDirection: "column", alignItems: "flex-start", gap: 16 }}>
        <nav className="crumb" aria-label="현재 위치"><Link href="/">홈</Link><span>›</span><Link href="/about/">병원소개</Link><span>›</span><b>둘러보기</b></nav>
        <Eyebrow>병원소개</Eyebrow><h1 className="h1 sm">병원 둘러보기</h1>
        <div className="answer" style={{ maxWidth: 820 }}>내부 전경부터 진료실·검사실·수술실, 그리고 수면센터까지 환자분이 이용하시는 공간을 사진으로 안내합니다.</div>
      </div></section>
      <Section><Grid cols={4}>{tiles.map((x) => <div className="plain" key={x} style={{ minHeight: 180, display: "flex", alignItems: "flex-end", background: "var(--soft)", border: 0 }}><p style={{ color: "var(--mute)" }}>{x} 사진</p></div>)}</Grid></Section>
      <Section alt><H2>장비도 함께 확인해 보세요</H2>
        <p className="lead">진료별 장비·시설이 궁금하시면 장비 소개 페이지에서 확인하실 수 있습니다.</p>
        <div className="actions"><Btn href="/about/equipment/">장비 소개 보기</Btn><Btn href="/visit/" kind="s">진료·방문안내</Btn></div>
      </Section>
    </>
  );
}

const LOC = {
  mapQ: "권선구 호매실로 104번길 24-43 중앙 파크뷰",
  kakao: "https://place.map.kakao.com/1386623615",
  naver: "https://map.naver.com/p/search/" + encodeURIComponent("호매실연세이비인후과"),
  car: [
    ["내비게이션 검색", "‘호매실연세이비인후과’ 또는 ‘호매실중앙파크뷰’로 검색하세요."],
    ["주소", "경기도 수원시 권선구 호매실로 104번길 24-43 중앙 파크뷰 A동 4층"],
    ["주차", "중앙 파크뷰 건물 주차장을 이용하시고, 접수하실 때 차량 번호를 알려 주세요."],
  ] as [string, string][],
  transit: [
    ["지하철", "수인분당선 오목천역·고색역에서 호매실 방면 버스로 환승합니다."],
    ["도착 후", "중앙 파크뷰 A동 엘리베이터로 4층에 올라오시면 됩니다."],
  ] as [string, string][],
  /* 버스: [정류장 이름, 병원까지 도보, 노선 번호] — 병원 확인 후 입력 */
  bus: [] as [string, string, string][],
};
const PinIco = () => <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" /></svg>;
const MailIco = () => <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm9 8 8.5-6h-17L12 13z" /></svg>;
const TelIco = () => <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.6 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .6 3.6 1 1 0 0 1-.25 1L6.6 10.8z" /></svg>;

export function Location() {
  const tel = `tel:${CLINIC.tel.replace(/-/g, "")}`;
  const short = CLINIC.address.replace("경기도 수원시 ", "");
  return (
    <>
      <section className="hero sub"><div className="wrap" style={{ flexDirection: "column", alignItems: "flex-start", gap: 16 }}>
        <nav className="crumb" aria-label="현재 위치"><Link href="/">홈</Link><span>›</span><Link href="/about/">병원소개</Link><span>›</span><b>오시는길</b></nav>
        <Eyebrow>병원소개</Eyebrow><h1 className="h1 sm">오시는 길</h1>
        <div className="answer" style={{ maxWidth: 820 }}>{CLINIC.name}는 수원시 권선구 호매실로 104번길 24-43 중앙 파크뷰 A동 4층에 있습니다. 자가용과 대중교통으로 오시는 방법을 안내합니다.</div>
      </div></section>
      <Section>
        <div className="loc">
          <div className="loc-map"><iframe title={`${CLINIC.name} 위치 지도`} loading="lazy" src={`https://maps.google.com/maps?q=${encodeURIComponent(LOC.mapQ)}&t=m&z=16&output=embed&iwloc=near`} /></div>
          <div className="loc-info">
            <h2>{CLINIC.name}</h2>
            <ul>
              <li><PinIco /><span>{short}</span></li>
              <li><MailIco /><a href={`mailto:${CLINIC.email}`}>{CLINIC.email}</a></li>
              <li><TelIco /><a href={tel}>{CLINIC.tel}</a></li>
            </ul>
            <p className="loc-ask">언제든지 문의 주세요!</p>
            <a className="loc-tel" href={tel}>{CLINIC.tel}</a>
            <div className="actions"><Btn href={LOC.naver}>네이버 지도 길찾기</Btn><Btn href={LOC.kakao} kind="s">카카오맵 길찾기</Btn></div>
          </div>
        </div>
        <div className="loc-ways">
          <div className="loc-way">
            <h3><span className="loc-badge">자가용</span>자가용으로 오실 때</h3>
            <dl>{LOC.car.map(([a, b]) => <div key={a}><dt>{a}</dt><dd>{b}</dd></div>)}</dl>
          </div>
          <div className="loc-way">
            <h3><span className="loc-badge">대중교통</span>대중교통으로 오실 때</h3>
            <dl>
              {LOC.transit.slice(0, 1).map(([a, b]) => <div key={a}><dt>{a}</dt><dd>{b}</dd></div>)}
              {LOC.bus.length > 0
                ? LOC.bus.map(([stop, walk, nums]) => <div key={stop}><dt>버스</dt><dd><b>{stop}</b> 정류장 하차 · {walk}<br />{nums}</dd></div>)
                : <div><dt>버스</dt><dd>출발지에 따라 노선이 다릅니다. 위 지도 길찾기에서 출발지를 넣으면 타실 버스와 내리실 정류장을 바로 확인하실 수 있습니다.</dd></div>}
              {LOC.transit.slice(1).map(([a, b]) => <div key={a}><dt>{a}</dt><dd>{b}</dd></div>)}
            </dl>
          </div>
        </div>
      </Section>
      <Section alt><H2>진료시간도 함께 확인하세요</H2>
        <p className="lead">진료시간·예약 방법·방문 전 준비 사항은 진료·방문안내에서 보실 수 있습니다.</p>
        <div className="actions"><Btn href="/visit/">진료·방문안내</Btn><Btn href="/about/tour/" kind="s">병원 둘러보기</Btn></div>
      </Section>
    </>
  );
}

export function Equipment() {
  return (
    <>
      <section className="hero sub"><div className="wrap" style={{ flexDirection: "column", alignItems: "flex-start", gap: 16 }}>
        <nav className="crumb" aria-label="현재 위치"><Link href="/">홈</Link><span>›</span><Link href="/about/">병원소개</Link><span>›</span><b>장비소개</b></nav>
        <Eyebrow>병원소개</Eyebrow><h1 className="h1 sm">장비 소개</h1>
        <div className="answer" style={{ maxWidth: 820 }}>수면다원검사·내시경·초음파·AI 골연령 판독 등 정확한 진단과 치료를 위한 장비와 시설을 진료별로 소개합니다.</div>
      </div></section>
      <Section><Grid cols={2}>{EQUIP.map(([cat, items, use]) => <div className="plain" key={cat}><h3>{cat}</h3><p>{items}</p><small style={{ color: "var(--mute)", display: "block", marginTop: 8 }}>사용 진료 · {use}</small></div>)}</Grid></Section>
      <Section alt><H2>장비·시설 한눈에 보기</H2><Table head={["구분", "장비·시설", "사용 진료"]} rows={EQUIP} /></Section>
      <Section><H2>병원 공간이 궁금하신가요?</H2>
        <p className="lead">진료실·검사실·수면센터 등 병원 공간은 둘러보기 페이지에서 보실 수 있습니다.</p>
        <div className="actions"><Btn href="/about/tour/">병원 둘러보기</Btn></div>
      </Section>
    </>
  );
}

export async function Column() {
  const posts = await getPosts();
  const cols = posts.filter((p) => p.track === "column");
  return (
    <>
      <section className="hero" style={{ background: "var(--tint)" }}><div className="wrap">
        <div className="txt"><Eyebrow>칼럼</Eyebrow><h1 className="h1" style={{ fontSize: 40 }}>의료진이 전하는 건강 칼럼</h1>
          <p className="lead">자주 묻는 질문을 넘어, 증상과 질환을 조금 더 깊이 있게 풀어 전하는 의료진 칼럼입니다. 모든 내용은 의료진 검토 후 공개합니다.</p></div>
        <div className="pic"><img src="/img/hero_health.jpg" alt="의료진이 건강 칼럼을 검토하는 장면" width={1536} height={1024} fetchPriority="high" /></div>
      </div></section>
      <Section>{cols.length
        ? <Grid cols={3}>{cols.map((p) => <Link className="q" key={p.slug} href={`/health/${p.slug}/`}><span className="tag">칼럼</span><h3>{p.title}</h3></Link>)}</Grid>
        : <p className="lead">칼럼을 준비 중입니다. 곧 의료진이 작성한 건강 칼럼을 만나보실 수 있습니다.</p>}
      </Section>
      <Section alt><H2>관련 진료로 이동</H2><TrackCards /></Section>
    </>
  );
}

export async function Health() {
  const [posts, notices] = await Promise.all([getPosts(), getNotices()]);
  return (
    <>
      <section className="hero" style={{ background: "var(--tint)" }}><div className="wrap">
        <div className="txt"><Eyebrow>건강정보</Eyebrow><h1 className="h1" style={{ fontSize: 40 }}>환자가 자주 묻는 질문에 의료진이 답합니다</h1>
          <p className="lead">수면·어지럼증·성장·코·귀·목 여섯 분야의 질문형 콘텐츠와 병원 공지를 한곳에 모았습니다. 모든 의학 내용은 의료진 검토 후 공개합니다.</p>
          <div className="tabs">{HEALTH_ORDER.map((k) => <a className="tab" key={k} href={`#${k}`}>{TRACK_LABEL[k]}</a>)}<a className="tab" href="#notice">병원 공지</a></div></div>
        <div className="pic"><img src="/img/hero_health.jpg" alt="의료진이 건강정보를 검토하는 장면" width={1536} height={1024} fetchPriority="high" /></div>
      </div></section>
      {HEALTH_ORDER.map((k, i) => {
        const list = posts.filter((p) => p.track === k); if (!list.length) return null;
        return <Section key={k} id={k} alt={i % 2 === 1}><H2>{TRACK_LABEL[k]} 건강정보</H2>
          <Grid cols={4}>{list.map((p) => <Link className="q" key={p.slug} href={`/health/${p.slug}/`}><span className="tag">{TRACK_LABEL[p.track]}</span><h3>Q. {p.title}</h3></Link>)}</Grid></Section>;
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
      </div></section>
      <Section><div className="prose" dangerouslySetInnerHTML={{ __html: post.body }} />
        {post.link && <div className="actions"><Btn href={post.link}>관련 진료 페이지 보기</Btn><Btn href="/visit/" kind="s">진료 예약·문의</Btn></div>}
      </Section>
      <Section alt><H2>관련 진료로 이동</H2><TrackCards /></Section>
    </>
  );
}
