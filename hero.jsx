/* global React, Shot, Reveal, Arrow, Eyebrow, PapelPicado */

/* ============================================================
   HERO — Real cabaña photo as backdrop
   ============================================================ */

function Hero({ onReserve, onMenu, onPromos, onLocation }) {
  return (
    <section id="top" style={{
      position: "relative",
      minHeight: "100vh",
      overflow: "hidden",
      color: "var(--crema)",
      paddingTop: 0,
      paddingBottom: 0,
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Photo backdrop */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0,
        backgroundImage: 'url("images/hero-cabana.png")',
        backgroundSize: "cover",
        backgroundPosition: "center 30%",
        backgroundRepeat: "no-repeat",
        zIndex: 0,
      }} />

      {/* Vignette + bottom gradient for text contrast */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0,
        background: `
          radial-gradient(ellipse 90% 70% at 50% 30%, transparent 0%, oklch(0.10 0.008 50 / 0.45) 100%),
          linear-gradient(180deg,
            oklch(0.10 0.008 50 / 0.55) 0%,
            oklch(0.10 0.008 50 / 0.20) 25%,
            oklch(0.10 0.008 50 / 0.10) 45%,
            oklch(0.10 0.008 50 / 0.65) 80%,
            oklch(0.10 0.008 50 / 0.90) 100%)
        `,
        zIndex: 1,
      }} />

      {/* Subtle warm glow for that fire/lantern feel */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 70% 50% at 50% 85%, oklch(0.55 0.13 50 / 0.20), transparent 65%)",
        mixBlendMode: "screen",
        zIndex: 2,
        pointerEvents: "none",
      }} />

      {/* Seals on top corners */}
      <SealOlive />
      <SealCream />

      {/* Spacer to push content to bottom half */}
      <div style={{ flex: 1, minHeight: "min(58vh, 460px)" }} />

      {/* Bottom content */}
      <div style={{
        position: "relative",
        zIndex: 5,
        textAlign: "center",
        padding: "0 var(--gutter) 56px",
      }}>
        <Reveal>
          <div style={{
            fontFamily: "var(--mono)",
            fontSize: "clamp(13px, 1.4vw, 16px)",
            letterSpacing: "0.42em",
            color: "var(--crema)",
            margin: "0 0 22px",
            fontWeight: 500,
            textShadow: "0 2px 8px oklch(0.10 0.008 50 / 0.7)",
          }}>
            RESTAURANTE FAMILIAR · IZTACALCO
          </div>
        </Reveal>

        <Reveal delay={150}>
          <h1 style={{
            fontFamily: "var(--serif)",
            fontStyle: "italic",
            fontWeight: 500,
            fontSize: "clamp(28px, 4.2vw, 52px)",
            lineHeight: 1.15,
            color: "var(--crema)",
            margin: "0 0 32px",
            textWrap: "balance",
            maxWidth: 860,
            marginLeft: "auto",
            marginRight: "auto",
            textShadow: "0 4px 18px oklch(0.10 0.008 50 / 0.65)",
          }}>
            Panadería, cafetería y restaurante con terraza —<br/>
            <span style={{ color: "var(--ambar-glow)" }}>todo en un mismo lugar.</span>
          </h1>
        </Reveal>

        <Reveal delay={300}>
          <Ribbon>Donde cada momento sabe a México</Ribbon>
        </Reveal>

        <Reveal delay={440}>
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: 12,
            flexWrap: "wrap",
            marginTop: 32,
          }}>
            <button onClick={onMenu} className="btn btn--primary">
              Ver Menú <Arrow />
            </button>
            <button onClick={onLocation} className="btn btn--olive">
              Cómo llegar
            </button>
            <button onClick={onReserve} className="btn btn--ghost">
              Reservar por WhatsApp
            </button>
          </div>
        </Reveal>
      </div>

      {/* Stats row at very bottom */}
      <Reveal delay={580}>
        <div style={{
          position: "relative",
          zIndex: 5,
          background: "oklch(0.10 0.008 50 / 0.72)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          borderTop: "1px solid oklch(0.94 0.03 80 / 0.18)",
          padding: "22px var(--gutter)",
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 24,
            maxWidth: 1200,
            margin: "0 auto",
          }} className="hero-stats">
            {[
              { k: "$100–300", v: "ticket promedio por persona", t: "Precio" },
              { k: "Terraza", v: "ambiente al aire libre", t: "Ambiente" },
              { k: "Bufet", v: "los fines de semana", t: "Especialidad" },
              { k: "Rappi", v: "pedido a domicilio", t: "Delivery" },
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", gap: 4, textAlign: "left" }}>
                <span style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--terracota-soft)" }}>{s.t}</span>
                <span style={{ fontFamily: "var(--serif)", fontWeight: 600, fontSize: "clamp(20px, 2.4vw, 28px)", lineHeight: 1, color: "var(--crema)" }}>{s.k}</span>
                <span style={{ fontSize: 12.5, color: "oklch(0.94 0.03 80 / 0.7)" }}>{s.v}</span>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <style>{`
        @media (max-width: 720px) {
          .hero-stats { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .hero-seal { transform: scale(0.7) rotate(-6deg) !important; }
          .hero-seal:last-of-type { transform: scale(0.7) rotate(6deg) !important; }
        }
      `}</style>
    </section>
  );
}

/* ---------- Olive seal (top-left) ---------- */
function SealOlive() {
  return (
    <div style={{
      position: "absolute",
      top: 110, left: "clamp(20px, 4vw, 56px)",
      zIndex: 5,
      width: 140, height: 140,
      borderRadius: 999,
      background: "var(--olivo)",
      color: "var(--crema)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      textAlign: "center",
      padding: "0 16px",
      border: "2px solid oklch(0.94 0.03 80 / 0.4)",
      boxShadow: "0 0 0 5px oklch(0.50 0.06 110 / 0.5), 0 18px 40px -10px oklch(0.10 0.008 50 / 0.7)",
      transform: "rotate(-6deg)",
    }} className="hero-seal">
      <div style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 17, fontWeight: 600, marginBottom: 4 }}>Tradición</div>
      <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", lineHeight: 1.5 }}>
        Sabor y familia<br/>en un solo lugar
      </div>
      <div style={{ marginTop: 6, fontSize: 12 }}>· · ·</div>
    </div>
  );
}

/* ---------- Cream seal (top-right) ---------- */
function SealCream() {
  return (
    <div style={{
      position: "absolute",
      top: 110, right: "clamp(20px, 4vw, 56px)",
      zIndex: 5,
      width: 124, height: 124,
      borderRadius: 999,
      background: "var(--crema)",
      color: "var(--espresso)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      textAlign: "center",
      border: "2px solid var(--terracota)",
      boxShadow: "0 0 0 5px oklch(0.94 0.03 80 / 0.25), 0 18px 40px -10px oklch(0.10 0.008 50 / 0.7)",
      transform: "rotate(7deg)",
    }} className="hero-seal">
      <div style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: 26, lineHeight: 1 }}>100%</div>
      <div style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", marginTop: 4, color: "var(--terracota)" }}>
        Mexicano
      </div>
      <svg width="14" height="14" viewBox="0 0 24 24" style={{ marginTop: 4 }} fill="var(--terracota)">
        <path d="M12 21s-7-4.35-9.5-9C0 7.5 3 4 6.5 4 8.5 4 11 5 12 7c1-2 3.5-3 5.5-3C21 4 24 7.5 21.5 12 19 16.65 12 21 12 21z"/>
      </svg>
    </div>
  );
}

/* ---------- Ribbon banner ---------- */
function Ribbon({ children }) {
  return (
    <div style={{
      position: "relative",
      display: "inline-block",
      maxWidth: "min(720px, 92%)",
    }}>
      <div style={{
        background: "linear-gradient(180deg, var(--terracota), var(--terracota-deep))",
        color: "var(--crema)",
        padding: "16px 56px",
        fontFamily: "var(--mono)",
        fontSize: "clamp(11px, 1.4vw, 14px)",
        letterSpacing: "0.32em",
        textTransform: "uppercase",
        fontWeight: 600,
        position: "relative",
        boxShadow: "0 14px 28px -10px oklch(0.10 0.008 50 / 0.7)",
      }}>
        {children}
        <span aria-hidden="true" style={{
          position: "absolute", top: 0, left: -18,
          width: 0, height: 0,
          borderTop: "26px solid transparent",
          borderBottom: "26px solid transparent",
          borderRight: "18px solid var(--terracota)",
        }}></span>
        <span aria-hidden="true" style={{
          position: "absolute", top: 0, right: -18,
          width: 0, height: 0,
          borderTop: "26px solid transparent",
          borderBottom: "26px solid transparent",
          borderLeft: "18px solid var(--terracota)",
        }}></span>
      </div>
    </div>
  );
}

window.Hero = Hero;
