# 호매실연세이비인후과 홈페이지 (homaesil-ent)

Next.js 15 정적 빌드(`output: export`) · 디자인 시스템 v4(네이비 × 오렌지 포인트) · Supabase CMS(건강정보·공지·언론보도) · 관리자 페이지 `/admin/`

## 구조
```
src/app/[[...path]]/page.tsx   54개 페이지 라우터(인트로·전용 메인 4·서브 46·공통 3) — src/lib/content.ts의 PAGES 레지스트리로 생성
src/app/health/[slug]/        건강정보 상세(Supabase 또는 seed)
src/app/admin/                관리자(클라이언트, Supabase Auth)
src/components/templates.tsx  인트로 / 전용 메인 / 서브(A 질환·B 검사·C 치료·D 소아연계·H 허브) 템플릿
src/components/common-pages.tsx  병원소개 · 진료및방문안내 · 건강정보 · 건강정보 상세
src/components/ui.tsx, chrome.tsx  공통 UI · 헤더/푸터
src/lib/content.ts            승인 와이어프레임 콘텐츠(src/data/content.json) 로더 + URL 레지스트리 + 병원 공통 정보
src/lib/cms.ts                Supabase REST 빌드타임 fetch(환경변수 없으면 src/data/seed.json)
src/lib/seo.ts                메타·JSON-LD(MedicalClinic·MedicalWebPage·FAQPage)
src/data/content.json         원장 승인 문구(와이어프레임 v2 기준) — 문구 수정은 이 파일에서
src/data/icons.json           질환 아이콘 39종(SVG 인라인)
public/img                    히어로·서브·인트로 이미지(현재 AI 생성 임시본, 촬영본으로 교체), 의료진 사진 doc_*.jpg
supabase/schema.sql           CMS 테이블·RLS
```

## 실행
```bash
npm install
cp .env.example .env.local   # Supabase 값 입력(없으면 seed 데이터로 빌드)
npm run dev                  # http://localhost:3000
npm run build                # out/ 에 정적 사이트 생성
```

## 배포 (Vercel 권장)
1. GitHub 레포 연결 → Framework: Next.js, Output: `out` 자동 인식
2. 환경변수: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_DEPLOY_HOOK`(Vercel Deploy Hook URL — 관리자 '사이트 다시 빌드' 버튼용)
3. 도메인 homaesilent.com 연결

## Supabase 설정
1. 새 프로젝트 → SQL Editor에서 `supabase/schema.sql` 실행
2. Authentication → 관리자 계정(이메일/비밀번호) 생성 → `/admin/` 로그인
3. 글 저장 후 "사이트 다시 빌드"를 누르면 Deploy Hook으로 재빌드되어 반영

## 콘텐츠 수정 규칙
- 진료 문구·FAQ·의료진 배정: `src/data/content.json` (원장 승인본). 수정 후 `npm run build`
- 이미지 교체: 같은 파일명으로 `public/img`에 덮어쓰기 (hero_*.jpg 1536×1024, sub_*.jpg 1152×768, intro_*.jpg 960×1440, doc_*.jpg 480×600)
- 남은 [병원 확인] 항목: 사업자번호·개설신고번호, 네이버 예약·카카오 채널 운영 여부, 주차·대중교통, 언론보도, 성장호르몬 영상 URL(3-4), 개인정보처리방침 본문

## 보류
- 연세대 로고 워터마크(의료진 섹션): 적용 코드 보류 중. 적용 시 `public/img/yonsei_logo.png` 추가 후 Doctors 컴포넌트에 배경 삽입

## V2 원고 자동 연동 (sync-v2)
- Edge Function `supabase/functions/sync-v2`: V2(contentauto-V2) DB에서 광고주 13(호매실) 승인 원고를 읽어 `health_posts`에 **published=false**로 적재. 마크다운→HTML 변환, 트랙 자동 분류(키워드 규칙), 검토 의료진 자동 지정, `source='v2', source_id=final_contents.id`로 중복 방지.
- 실행 경로: ① 관리자 페이지 건강정보 탭 "V2 원고 가져오기" 버튼 ② pg_cron `sync-v2-daily` 매일 05:00 KST → `public.run_sync_v2()`.
- 승인 흐름: 관리자에서 내용 확인 → "비공개" 버튼을 눌러 "공개"로 전환 → "사이트 다시 빌드".
- V2 읽기 권한: V2 DB에 읽기 전용 뷰 `public.homaesil_site_feed`(광고주 13, status approved/published만)를 두고 anon SELECT만 허용. 함수는 V2 publishable 키로 이 뷰만 읽음. 본문 텍스트 800자 미만 원고는 `short`로 제외.
- 실행 기록: `sync_log` 테이블.
