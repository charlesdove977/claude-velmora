// Tiny island. Decides poster-only vs 3D, then lazy-loads the heavy canvas
// chunk (three + drei) only on capable desktop devices, after idle.
import { useEffect, useState, Suspense, lazy } from "react";
import { wantsHeavy3D, whenIdle } from "./support";

const HeroCanvas = lazy(() => import("./HeroCanvas"));

export function HeroSceneLoader() {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    if (!wantsHeavy3D()) return;
    whenIdle(() => setOk(true));
  }, []);
  const onReady = () => document.getElementById("hero-poster")?.classList.add("is-hidden");
  if (!ok) return null;
  return (
    <Suspense fallback={null}>
      <HeroCanvas onReady={onReady} />
    </Suspense>
  );
}
export default HeroSceneLoader;
