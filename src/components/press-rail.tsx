"use client";
import { useEffect, useRef, useState } from "react";

export type PressItem = { title: string; img?: string; url?: string; outlet?: string; date?: string };

/* 언론보도 슬라이드: 한 번에 한 칸씩 옆으로 이동, 끝에서 처음으로 이어짐 */
export function PressRail({ items, interval = 3200 }: { items: PressItem[]; interval?: number }) {
  const n = items.length;
  const loop = [...items, ...items, ...items];
  const track = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(n);
  const [anim, setAnim] = useState(true);
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const [missing, setMissing] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const measure = () => {
      const el = track.current; if (!el || !el.children[1]) return;
      setStep((el.children[1] as HTMLElement).offsetLeft - (el.children[0] as HTMLElement).offsetLeft);
    };
    measure(); window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    if (paused || n < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((v) => v + 1), interval);
    return () => clearInterval(t);
  }, [paused, n, interval]);

  const onEnd = () => {
    if (i >= 2 * n || i < n) { setAnim(false); setI(((i % n) + n) % n + n); }
  };
  useEffect(() => { if (!anim) { const r = requestAnimationFrame(() => requestAnimationFrame(() => setAnim(true))); return () => cancelAnimationFrame(r); } }, [anim]);

  const go = (d: number) => setI((v) => v + d);
  const cur = ((i % n) + n) % n;

  return (
    <div className="press" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <button type="button" className="press-arrow prev" aria-label="이전 기사" onClick={() => go(-1)}>‹</button>
      <div className="press-view">
        <div className="press-track" ref={track} onTransitionEnd={onEnd} style={{ transform: `translate3d(${-i * step}px,0,0)`, transition: anim ? "transform .7s cubic-bezier(.2,.7,.2,1)" : "none" }}>
          {loop.map((p, k) => {
            const idx = k % n;
            const body = (
              <>
                <span className="press-img">
                  {p.img && !missing[idx] ? <img src={p.img} alt="" width={480} height={320} loading="lazy" onError={() => setMissing((m) => ({ ...m, [idx]: true }))} /> : <span className="press-ph">언론보도</span>}
                </span>
                {(p.outlet || p.date) && <small>{[p.outlet, p.date].filter(Boolean).join(" · ")}</small>}
                <b>{p.title}</b>
              </>
            );
            const hidden = k < n || k >= 2 * n;
            return p.url
              ? <a className="press-card" key={k} href={p.url} target="_blank" rel="noopener" aria-hidden={hidden || undefined} tabIndex={hidden ? -1 : undefined}>{body}</a>
              : <div className="press-card" key={k} aria-hidden={hidden || undefined}>{body}</div>;
          })}
        </div>
      </div>
      <button type="button" className="press-arrow next" aria-label="다음 기사" onClick={() => go(1)}>›</button>
      <div className="press-dots" role="tablist" aria-label="기사 선택">
        {items.map((_, k) => <button type="button" key={k} className={k === cur ? "on" : ""} aria-label={`${k + 1}번째 기사`} onClick={() => setI(n + k)} />)}
      </div>
    </div>
  );
}
