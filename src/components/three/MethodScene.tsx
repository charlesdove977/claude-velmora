// "The Velmora Method" scroll interlude. Pin + scrub logic lives here (small);
// the WebGL morph is lazy-loaded from MethodCanvas on capable desktops. Others
// get a CSS gradient form with the same copy.
import { useEffect, useRef, useState, Suspense, lazy } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { wantsHeavy3D, whenIdle } from "./support";

const MethodCanvas = lazy(() => import("./MethodCanvas"));

export interface MethodStep { n: string; title: string; body: string }

export default function MethodScene({ steps }: { steps: MethodStep[] }) {
  const progress = useRef(0);
  const root = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [use3d, setUse3d] = useState(false);
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (wantsHeavy3D()) whenIdle(() => setUse3d(true));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!root.current) return;
    if (reduce) return; // static stacked layout, no pin
    gsap.registerPlugin(ScrollTrigger);
    const st = ScrollTrigger.create({
      trigger: root.current,
      start: "top top",
      end: `+=${steps.length * 90}%`,
      pin: true,
      scrub: 0.6,
      onUpdate: (self) => {
        progress.current = self.progress;
        const idx = Math.min(steps.length - 1, Math.floor(self.progress * steps.length + 0.0001));
        setStep((s) => (s === idx ? s : idx));
      },
    });
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting));
    io.observe(root.current);
    return () => {
      st.kill();
      io.disconnect();
    };
  }, [steps.length]);

  const [reduce, setReduce] = useState(false);
  useEffect(() => { setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches); }, []);

  return (
    <div ref={root} className="method-root relative min-h-[100svh] w-full overflow-hidden bg-espresso text-bone">
      <div className="absolute inset-0" aria-hidden="true">
        {use3d ? (
          <Suspense fallback={null}><MethodCanvas progress={progress} active={active} /></Suspense>
        ) : (
          <div className="absolute left-1/2 top-1/2 h-[46vmin] w-[46vmin] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: "radial-gradient(circle at 35% 30%, #d9c2a0 0%, #b8946a 45%, #6f5837 100%)", boxShadow: "0 40px 120px -30px rgba(0,0,0,0.6)" }} />
        )}
      </div>
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-content flex-col justify-between px-4 py-24 md:px-8 xl:px-12">
        <div>
          <p className="eyebrow text-champagne">The Velmora Method</p>
          <h2 className="mt-3 max-w-md font-display text-fluid-2xl">Four steps. One calm plan.</h2>
        </div>
        <div className={reduce ? "grid gap-8 md:grid-cols-4" : "relative h-[12rem] md:h-[10rem]"}>
          {steps.map((s, i) => (
            <div
              key={s.n}
              className={reduce ? "" : "absolute inset-0 transition-all duration-700 ease-out"}
              style={reduce ? undefined : { opacity: step === i ? 1 : 0, transform: step === i ? "none" : "translateY(14px)", pointerEvents: step === i ? "auto" : "none" }}
            >
              <p className="font-display text-fluid-3xl text-champagne">{s.n}</p>
              <h3 className="mt-2 font-display text-fluid-xl">{s.title}</h3>
              <p className="mt-2 max-w-md text-fluid-base text-stone">{s.body}</p>
            </div>
          ))}
        </div>
        {!reduce && (
          <div className="flex gap-2" aria-hidden="true">
            {steps.map((s, i) => (
              <span key={s.n} className="h-px flex-1 bg-bone/20">
                <span className="block h-px bg-champagne transition-transform duration-500 origin-left" style={{ transform: `scaleX(${i < step ? 1 : i === step ? 1 : 0})` }} />
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
