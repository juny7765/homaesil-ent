"use client";
import { useEffect, useState } from "react";

// 인트로 첫 진입 시 흰 화면 인사말 → 사라진 뒤 4개 클리닉 노출. 세션당 1회, 클릭하면 바로 넘어감.
export function IntroSplash() {
  const [state, setState] = useState<"hidden" | "show" | "out">("hidden");
  const ready = () => document.documentElement.classList.add("intro-ready"); // 클리닉 타일 노출 신호
  useEffect(() => {
    let skip = false;
    try {
      if (sessionStorage.getItem("hs_splash")) skip = true;
      else if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) skip = true;
      else sessionStorage.setItem("hs_splash", "1");
    } catch { /* storage 불가 시에도 1회 표시 */ }
    if (skip) { ready(); return; }
    setState("show");
    const t1 = setTimeout(() => setState("out"), 3800);
    const t2 = setTimeout(() => { setState("hidden"); setTimeout(ready, 200); }, 5500); // 인사말이 완전히 사라진 뒤 0.2초 후 타일 등장
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);
  if (state === "hidden") return null;
  return (
    <div className={`splash ${state}`} onClick={() => { setState("hidden"); setTimeout(ready, 200); }} aria-hidden="true">
      <p><span>안녕하세요</span><span>호매실연세이비인후과입니다.</span></p>
    </div>
  );
}
