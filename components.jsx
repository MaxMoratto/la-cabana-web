/* global React */
const { useState, useEffect, useRef, useCallback } = React;

/* ============================================================
   SHARED COMPONENTS — La Cabaña
   ============================================================ */

/* ---------- Logo ---------- */
function Logo({ size = 44, light = true }) {
  const c = light ? "var(--crema)" : "var(--espresso)";
  const accent = "var(--terracota-soft)";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <svg width={size} height={size} viewBox="0 0 60 60" aria-hidden="true">
        {/* roof */}
        <path d="M8 26 L30 8 L52 26 Z" fill="none" stroke={c} strokeWidth="1.6" />
        <path d="M30 8 L30 26" stroke={c} strokeWidth="1.6" />
        <circle cx="30" cy="20" r="2.2" fill={accent} />
        {/* walls */}
        <rect x="14" y="26" width="32" height="24" fill="none" stroke={c} strokeWidth="1.6" />
        <rect x="26" y="36" width="8" height="14" fill={accent} opacity="0.85" />
        {/* small windows */}
        <rect x="18" y="30" width="4" height="4" fill={c} opacity="0.6" />
        <rect x="38" y="30" width="4" height="4" fill={c} opacity="0.6" />
      </svg>
      <div style={{ lineHeight: 1 }}>
        <div style={{
          fontFamily: "var(--serif)",
          fontSize: 22,
          fontWeight: 500,
          letterSpacing: "-0.01em",
          color: c,
        }}>
          La <em style={{ color: accent, fontStyle: "italic" }}>Cabaña</em>
        </div>
        <div style={{
          fontFamily: "var(--mono)",
          fontSize: 8.5,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          color: light ? "oklch(0.94 0.03 80 / 0.55)" : "oklch(0.22 0.025 40 / 0.6)",
          marginTop: 4,
        }}>
          Social House · Iztacalco
        </div>
      </div>
    </div>
  );
}

/* ---------- Cinematic placeholder (+ optional real photo) ---------- */
function Shot({ atm = "wood", src, title, label, ref0, ratio = "4 / 3", style = {}, children }) {
  const aspect = typeof ratio === "string" ? ratio : `${ratio.w} / ${ratio.h}`;
  return (
    <div className={`shot atm-${atm}`} style={{ aspectRatio: aspect, ...style }}>
      {src ? (
        <div className="shot__bg" style={{
          backgroundImage: `url("${src}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }} />
      ) : (
        <div className="shot__bg" />
      )}
      <div className="shot__glow"></div>
      {!src && <div className="shot__stripes"></div>}
      <div className="shot__vignette"></div>
      {title && <div className="shot__title">{title}</div>}
      {children}
      {label && (
        <div className="shot__label">
          <span><span className="dot"></span>{label}</span>
          {ref0 && <span>{ref0}</span>}
        </div>
      )}
    </div>
  );
}

/* ---------- Scroll reveal ---------- */
function Reveal({ children, delay = 0, as: Tag = "div", className = "", style = {} }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("is-in");
          obs.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <Tag ref={ref} className={`reveal ${className}`} style={{ "--d": `${delay}ms`, ...style }}>
      {children}
    </Tag>
  );
}

/* ---------- Arrow icon ---------- */
function Arrow({ size = 14 }) {
  return (
    <svg className="arrow" width={size} height={size} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M1 7 H13 M8 2 L13 7 L8 12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ---------- Section eyebrow ---------- */
function Eyebrow({ children }) {
  return <span className="eyebrow">{children}</span>;
}

/* ---------- Embers (small ambient ambar glow on dark sections) ---------- */
function Embers({ count = 8 }) {
  const items = Array.from({ length: count });
  return (
    <div aria-hidden="true" style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {items.map((_, i) => {
        const left = (i * 13) % 100;
        const delay = (i * 0.9) % 7;
        const dur = 6 + (i % 4);
        return (
          <span
            key={i}
            className="ember"
            style={{
              left: `${left}%`,
              bottom: `${(i * 7) % 30}px`,
              animationDelay: `${delay}s`,
              animationDuration: `${dur}s`,
            }}
          />
        );
      })}
    </div>
  );
}

/* ---------- Toast ---------- */
function Toast({ message, onDone }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onDone, 3200);
    return () => clearTimeout(t);
  }, [message, onDone]);
  if (!message) return null;
  return (
    <div style={{
      position: "fixed",
      bottom: 28,
      left: "50%",
      transform: "translateX(-50%)",
      background: "var(--espresso)",
      color: "var(--crema)",
      padding: "14px 22px",
      borderRadius: 999,
      fontFamily: "var(--sans)",
      fontSize: 13.5,
      letterSpacing: "0.04em",
      boxShadow: "0 18px 40px -12px oklch(0.10 0.008 50 / 0.6)",
      border: "1px solid oklch(0.94 0.03 80 / 0.15)",
      zIndex: 9999,
      animation: "toast-in 0.4s ease",
    }}>
      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translate(-50%, 20px); }
          to   { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
      {message}
    </div>
  );
}

/* ---------- Store subscription hook (shared across sections) ---------- */
function useStoreSlice(path, fallback) {
  const [value, setValue] = useState(() => {
    if (!window.LaCabanaStore) return fallback;
    try {
      const v = window.LaCabanaStore.getPath(path);
      return (v == null || (Array.isArray(v) && v.length === 0)) ? fallback : v;
    } catch { return fallback; }
  });
  useEffect(() => {
    if (!window.LaCabanaStore) return;
    return window.LaCabanaStore.subscribe(() => {
      try {
        const v = window.LaCabanaStore.getPath(path);
        setValue((v == null || (Array.isArray(v) && v.length === 0)) ? fallback : v);
      } catch { setValue(fallback); }
    });
  }, [path]);
  return value;
}

Object.assign(window, { Logo, Shot, Reveal, Arrow, Eyebrow, Embers, Toast, PapelPicado, useStoreSlice });

/* ---------- Papel Picado banner ---------- */
function PapelPicado({
  count = 7,
  colors = ["var(--terracota)", "var(--olivo)", "var(--terracota)", "var(--rojo-quemado)"],
  bg = "oklch(0.95 0.022 80)",
  height = 110,
  swing = true,
}) {
  const flagW = 150;
  const flagH = 100;
  const totalW = flagW * count;
  const cord = "oklch(0.30 0.05 42)";
  return (
    <div
      aria-hidden="true"
      style={{
        width: "100%",
        lineHeight: 0,
        overflow: "hidden",
        height,
        position: "relative",
      }}
    >
      <svg
        viewBox={`0 0 ${totalW} ${flagH + 10}`}
        preserveAspectRatio="xMidYMid slice"
        style={{ width: "100%", height: "100%", display: "block" }}
      >
        {/* cord */}
        <path
          d={`M 0 8 Q ${totalW / 2} ${swing ? 28 : 8} ${totalW} 8`}
          stroke={cord}
          strokeWidth="2"
          fill="none"
        />
        {Array.from({ length: count }).map((_, i) => {
          const x = i * flagW;
          const t = i / (count - 1);
          const dip = swing ? Math.sin(t * Math.PI) * 18 : 0;
          const color = colors[i % colors.length];
          const W = flagW - 14;
          // sawtooth bottom
          const teeth = 6;
          const toothW = W / teeth;
          let bottom = "";
          for (let k = 0; k <= teeth; k++) {
            const px = k * toothW;
            const py = k % 2 === 0 ? 78 : 95;
            bottom += `L ${px} ${py} `;
          }
          return (
            <g key={i} transform={`translate(${x + 7}, ${4 + dip})`}>
              {/* flag body */}
              <path
                d={`M 0 4 L ${W} 4 ${bottom} Z`}
                fill={color}
              />
              {/* cutouts — punched with bg color */}
              <circle cx={W / 2} cy="34" r="11" fill={bg} />
              <circle cx={W / 2} cy="34" r="4" fill={color} />
              <circle cx="18" cy="22" r="5" fill={bg} />
              <circle cx={W - 18} cy="22" r="5" fill={bg} />
              <circle cx="18" cy="58" r="3" fill={bg} />
              <circle cx={W - 18} cy="58" r="3" fill={bg} />
              {/* tiny diamonds */}
              <rect x={W / 2 - 4} y="8" width="8" height="8" transform={`rotate(45 ${W / 2} 12)`} fill={bg} />
              <rect x={W / 2 - 4} y="56" width="8" height="8" transform={`rotate(45 ${W / 2} 60)`} fill={bg} />
              <rect x={14} y="40" width="6" height="6" transform={`rotate(45 17 43)`} fill={bg} />
              <rect x={W - 20} y="40" width="6" height="6" transform={`rotate(45 ${W - 17} 43)`} fill={bg} />
              {/* tie at top */}
              <rect x={W / 2 - 5} y="0" width="10" height="6" fill={cord} />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
