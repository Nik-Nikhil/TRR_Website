import type { ReactNode } from "react";

interface PageBackgroundProps {
  children: ReactNode;
  type: "home" | "roshan" | "default";
  homeBackgrounds?: string[];
  currentHomeIndex?: number;
  roshanBackgrounds?: string[];
  currentRoshanIndex?: number;
}

export default function PageBackground({
  children,
  type,
  homeBackgrounds = [],
  currentHomeIndex = 0,
  roshanBackgrounds = [],
  currentRoshanIndex = 0,
}: PageBackgroundProps) {
  return (
    <>
      {/* Home Page Background */}
      {type === "home" && (
        <div className="fixed inset-0 z-0">
          {homeBackgrounds.map((bg, index) => (
            <div
              key={bg}
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-2000 ease-in-out"
              style={{
                backgroundImage: `url(${bg})`,
                opacity: index === currentHomeIndex ? 0.6 : 0,
              }}
            />
          ))}
          
          {/* Enhanced gradient overlays for better atmosphere */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-slate-800/40 to-slate-900/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-transparent to-red-900/20" />
          
          {/* Subtle animated overlay for depth */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan-500/10 via-transparent to-orange-500/10 animate-pulse" style={{ animationDuration: '4s' }} />
          </div>
        </div>
      )}

      {/* Roshan Background (Rules Page) */}
      {type === "roshan" && (
        <>
          <div className="fixed inset-0 -z-20">
            {roshanBackgrounds.map((bg, index) => (
              <div
                key={bg}
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1500 ease-in-out"
                style={{
                  backgroundImage: `url(${bg})`,
                  opacity: index === currentRoshanIndex ? 1 : 0,
                }}
              />
            ))}
          </div>
          {/* Dark overlay for readability */}
          <div className="fixed inset-0 bg-black/70 -z-10" />
        </>
      )}

      {/* Default Background (Other Pages) */}
      {type === "default" && (
        <div className="fixed inset-0 z-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </>
  );
}
