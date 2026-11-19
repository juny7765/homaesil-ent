"use client";
import { useEffect, useState } from "react";

// 인트로 첫 진입 시 흰 화면 인사말 → 사라진 뒤 4개 클리닉 노출. 세션당 1회, 클릭하면 바로 넘어감.
export function IntroSplash() {
  const [state, setState] = useState<"hidden" | "show" | "out">("hidden");
  useEffect(() => {
    try {
      if (sessionStorage.getItem("hs_splash")) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      sessionStorage.setItem("hs_splash", "1");
    } catch { /* storage 불가 시에도 1회 표시 */ }
    setState("show");
    const t1 = setTimeout(() => setState("out"), 2200);
    const t2 = setTimeout(() => setState("hidden"), 2900);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);
  if (state === "hidden") return null;
  return (
    <div className={`splash ${state}`} onClick={() => setState("hidden")} aria-hidden="true">
      <p><span>안녕하세요</span><span>호매실연세이비인후과입니다.</span></p>
    </div>
  );
}
