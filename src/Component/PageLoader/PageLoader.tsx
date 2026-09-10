import Image from "next/image";
import TestOrbitLogo from "../../../public/UpdatedTestOrbitLogo.png";

const PageLoader = () => {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-white/70 dark:bg-secondary-950/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-card flex flex-col items-center gap-5 rounded-3xl px-10 py-9">
        {/* Orbit ring + logo */}
        <div className="relative flex h-20 w-20 items-center justify-center">
          {/* Static track */}
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              strokeWidth="4"
              className="stroke-slate-200 dark:stroke-white/10"
            />
          </svg>

          {/* Rotating arc */}
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 h-full w-full animate-spin"
            style={{ animationDuration: "1.4s" }}
          >
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="66 264"
              className="stroke-orange-500"
            />
          </svg>

          {/* Orbiting dot */}
          <div
            className="absolute inset-0 animate-spin"
            style={{ animationDuration: "1.4s" }}
          >
            <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500 shadow-glow" />
          </div>

          {/* Center logo */}
          <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-secondary-900">
            <Image
              src={TestOrbitLogo}
              alt="TestOrbit"
              width={50}
              height={50}
              className="animate-pulseGlow"
            />
          </div>
        </div>

        {/* Wordmark */}
        <p className="text-sm font-semibold tracking-tight text-slate-700 dark:text-white">
          Test<span className="text-orange-500">Orbit</span>
        </p>

        {/* Shimmer progress bar */}
        <div className="relative h-1 w-32 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
          <div
            className="absolute inset-0 animate-shimmer"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(237,98,20,0.6) 50%, transparent 100%)",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PageLoader;