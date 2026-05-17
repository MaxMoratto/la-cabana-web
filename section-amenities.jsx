/* global React, useStoreSlice, LaCabanaStore */

/* ============================================================
   AMENITIES STRIP — Wood plank with icon row + WhatsApp CTA
   ============================================================ */

const AMENITIES = [
  { id: "fam",   title: "Ambiente\nFamiliar",        icon: "family" },
  { id: "music", title: "Música\nen Vivo",           icon: "music" },
  { id: "kids",  title: "Área Infantil\npara los Pequeños", icon: "kids" },
  { id: "evt",   title: "Eventos y\nCelebraciones",  icon: "calendar" },
  { id: "wa",    title: "Reserva fácil\npor WhatsApp", icon: "dish" },
];

function AmenityIcon({ kind }) {
  const p = { width: 30, height: 30, viewBox: "0 0 24 24", fill: "none", stroke: "var(--ambar-glow)", strokeWidth: 1.4, strokeLinecap: "round", strokeLinejoin: "round" };
  if (kind === "family")   return <svg {...p}><circle cx="8" cy="8" r="3"/><circle cx="16" cy="8" r="3"/><path d="M3 21c0-3 3-5 5-5s5 2 5 5M11 21c0-3 3-5 5-5s5 2 5 5"/></svg>;
  if (kind === "music")    return <svg {...p}><path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/></svg>;
  if (kind === "kids")     return <svg {...p}><path d="M5 17l4-7 4 4 6-9v15z"/><circle cx="5" cy="17" r="1.5"/><circle cx="19" cy="20" r="1.5"/></svg>;
  if (kind === "calendar") return <svg {...p}><rect x="4" y="6" width="16" height="14" rx="2"/><path d="M4 10h16M8 3v4M16 3v4"/><circle cx="12" cy="14" r="1.6" fill="var(--ambar-glow)"/></svg>;
  if (kind === "dish")     return <svg {...p}><path d="M3 14h18M5 14a7 7 0 0114 0M12 4v3"/></svg>;
  return null;
}

function AmenityStrip() {
  const site = useStoreSlice("site", {});
  const phoneDisplay = site.phoneDisplay || "+52 55 5115 7248";
  const whatsapp = (site.whatsapp || "5215551157248").replace(/[^\d]/g, "");
  const waUrl = `https://wa.me/${whatsapp}?text=${encodeURIComponent("Hola, me interesa reservar una mesa en La Cabaña.")}`;
  return (
    <section style={{
      position: "relative",
      borderTop: "1px solid oklch(0.10 0.008 50)",
      borderBottom: "1px solid oklch(0.10 0.008 50)",
      padding: "clamp(40px, 5vw, 56px) 0",
      overflow: "hidden",
    }} className="wood wood--coffee grain">

      {/* faint amber glow */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at 50% 50%, oklch(0.55 0.13 50 / 0.18), transparent 60%)",
        pointerEvents: "none",
      }} />

      <div className="container" style={{ position: "relative" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr) auto",
          gap: 16,
          alignItems: "center",
        }} className="amen-grid">
          {AMENITIES.map((a) => (
            <div key={a.id} style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: 14,
              padding: "8px 12px",
              borderRight: "1px solid oklch(0.94 0.03 80 / 0.08)",
            }}>
              <AmenityIcon kind={a.icon} />
              <div style={{
                fontFamily: "var(--mono)",
                fontSize: 10.5,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "oklch(0.94 0.03 80 / 0.85)",
                lineHeight: 1.5,
                whiteSpace: "pre-line",
              }}>
                {a.title}
              </div>
            </div>
          ))}

          {/* WhatsApp CTA — opens WhatsApp directly */}
          <a href={waUrl} target="_blank" rel="noopener noreferrer" style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 14,
            padding: "16px 22px",
            borderRadius: 999,
            background: "oklch(0.52 0.16 145)",
            color: "var(--crema)",
            border: "2px solid oklch(0.62 0.16 145)",
            transition: "transform 0.25s ease, background 0.25s ease",
            textAlign: "left",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.background = "oklch(0.58 0.17 145)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.background = "oklch(0.52 0.16 145)"; }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.5 3.5A11 11 0 003.4 17.8L2 22l4.3-1.4A11 11 0 1020.5 3.5zM12 20.1a8.1 8.1 0 01-4.1-1.1l-.3-.2-2.6.8.8-2.5-.2-.3A8.1 8.1 0 1112 20.1zm4.5-6c-.3-.1-1.5-.7-1.7-.8s-.4-.1-.5.1-.6.8-.8 1c-.1.2-.3.2-.5.1-.3-.2-1.2-.4-2.2-1.3-.8-.7-1.4-1.7-1.5-1.9-.2-.3 0-.4.1-.6l.4-.4.2-.4c.1-.2 0-.3 0-.4l-.7-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4 0-.6.3-.2.2-.8.8-.8 2s.9 2.3 1 2.5c.1.2 1.7 2.7 4.2 3.8.6.2 1 .4 1.4.5.6.2 1.1.2 1.5.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1 .2-1.2-.1-.1-.3-.2-.6-.3z"/>
            </svg>
            <div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 9.5, letterSpacing: "0.22em", textTransform: "uppercase", opacity: 0.85 }}>
                ¡Reserva ahora!
              </div>
              <div style={{ fontFamily: "var(--serif)", fontSize: 20, marginTop: 2 }}>
                {phoneDisplay}
              </div>
            </div>
          </a>
        </div>
      </div>

      <style>{`
        @media (max-width: 1080px) {
          .amen-grid { grid-template-columns: repeat(5, 1fr) !important; }
          .amen-grid > a { grid-column: 1 / -1; justify-content: center; margin-top: 12px; }
        }
        @media (max-width: 720px) {
          .amen-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 460px) {
          .amen-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  );
}

window.AmenityStrip = AmenityStrip;
