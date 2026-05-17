/* global React, Reveal, Eyebrow, Arrow, Logo */

/* ============================================================
   FOOTER
   ============================================================ */

function Footer() {
  return (
    <footer style={{
      color: "var(--crema)",
      padding: "clamp(64px, 8vw, 96px) 0 36px",
      borderTop: "1px solid oklch(0.94 0.03 80 / 0.08)",
      position: "relative",
      overflow: "hidden",
    }} className="wood wood--coffee grain">

      {/* Mexican flag swatch accent — bottom-right corner */}
      <div aria-hidden="true" style={{
        position: "absolute",
        right: -30, bottom: -30,
        display: "flex",
        gap: 0,
        opacity: 0.85,
        transform: "rotate(-8deg)",
      }}>
        {[
          "oklch(0.50 0.10 145)",
          "oklch(0.94 0.03 80)",
          "oklch(0.50 0.16 30)",
        ].map((c, i) => (
          <div key={i} style={{
            width: 60, height: 180,
            background: `linear-gradient(180deg, ${c}, oklch(from ${c} calc(l - 0.05) c h))`,
            filter: "blur(0.5px)",
          }} />
        ))}
      </div>

      {/* Script tagline strip */}
      <div style={{
        textAlign: "center",
        marginBottom: 64,
        padding: "0 var(--gutter)",
        position: "relative",
      }}>
        <Reveal>
          <div style={{
            fontFamily: "var(--script)",
            fontSize: "clamp(34px, 5vw, 56px)",
            lineHeight: 1.1,
            color: "var(--ambar-glow)",
            textWrap: "balance",
            maxWidth: 760,
            margin: "0 auto",
          }}>
            Más que un restaurante,<br/>
            <span style={{ color: "var(--crema)" }}>somos tu cabaña.</span>
          </div>
        </Reveal>
      </div>

      <div className="container" style={{ position: "relative" }}>
        <Reveal>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr 1fr 1fr",
            gap: "clamp(20px, 4vw, 60px)",
            marginBottom: 72,
          }} className="footer-grid">

            <div>
              <Logo size={42} />
              <p style={{ fontSize: 14, lineHeight: 1.65, color: "oklch(0.94 0.03 80 / 0.65)", marginTop: 22, maxWidth: 42 + "ch" }}>
                Panadería, cafetería y restaurante con terraza en Iztacalco. Cocina casera mexicana, música en vivo y un mismo lugar para toda la familia.
              </p>

              <div style={{ marginTop: 24 }}>
                <div style={{
                  fontFamily: "var(--mono)",
                  fontSize: 10,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color: "var(--terracota-soft)",
                  marginBottom: 12,
                }}>
                  Síguenos
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  {[
                    { name: "Instagram", path: "M16 4H8a4 4 0 00-4 4v8a4 4 0 004 4h8a4 4 0 004-4V8a4 4 0 00-4-4zM12 9a3 3 0 100 6 3 3 0 000-6zm5-1a1 1 0 110-2 1 1 0 010 2z" },
                    { name: "Facebook",  path: "M13 9V7a1 1 0 011-1h2V3h-3a3 3 0 00-3 3v3H8v3h2v8h3v-8h2.5l.5-3H13z" },
                    { name: "TikTok",    path: "M16 3v3a4 4 0 003 3.9V13a7 7 0 01-3-.8V15a5 5 0 11-5-5h1v3h-1a2 2 0 102 2V3h3z" },
                  ].map((s, i) => (
                    <a key={i} href="#" aria-label={s.name} style={{
                      width: 40, height: 40, borderRadius: 999,
                      border: "1px solid oklch(0.94 0.03 80 / 0.18)",
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      transition: "all 0.2s ease",
                    }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "var(--terracota)"; e.currentTarget.style.borderColor = "var(--terracota)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "oklch(0.94 0.03 80 / 0.18)"; }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d={s.path} /></svg>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <FCol title="Visitar" items={["Promociones", "Buffet de fin de semana", "Carta a la carta", "Panadería artesanal"]} />
            <FCol title="Eventos" items={["Música mexicana en vivo", "Área infantil familiar", "Cumpleaños y bodas", "Catering corporativo"]} />

            <div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 10.5, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--terracota-soft)", marginBottom: 18 }}>
                Contacto
              </div>
              <div style={{ lineHeight: 1.85, fontSize: 14, color: "oklch(0.94 0.03 80 / 0.78)" }}>
                <div style={{ fontFamily: "var(--serif)", fontSize: 20, color: "var(--crema)", marginBottom: 8 }}>
                  +52 55 5115 7248
                </div>
                Sur 16 Núm. 233<br/>
                Col. Agrícola Oriental<br/>
                Iztacalco · CDMX · 08500<br/>
                <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--olivo-soft)" }}>
                  Junto al Mercado Agrícola Oriental
                </span>
              </div>

              <a
                href="https://www.rappi.com.mx"
                target="_blank" rel="noopener"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  marginTop: 22,
                  padding: "10px 16px",
                  borderRadius: 999,
                  background: "oklch(0.62 0.20 22)",
                  color: "var(--crema)",
                  fontFamily: "var(--sans)",
                  fontSize: 12.5,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  transition: "transform 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h6l1 2h9l-2 8H8L5 4H4zm5 13a2 2 0 100 4 2 2 0 000-4zm9 0a2 2 0 100 4 2 2 0 000-4z"/></svg>
                Pedir por Rappi
              </a>
            </div>
          </div>
        </Reveal>

        <div style={{
          paddingTop: 28,
          borderTop: "1px solid oklch(0.94 0.03 80 / 0.08)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
        }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.18em", color: "oklch(0.94 0.03 80 / 0.45)" }}>
            © 2026 La Cabaña Social House · Hecho en Iztacalco, CDMX
          </div>
          <div style={{ display: "flex", gap: 22, fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.16em", color: "oklch(0.94 0.03 80 / 0.45)" }}>
            <a href="#" style={{ color: "inherit" }}>Aviso de privacidad</a>
            <a href="#" style={{ color: "inherit" }}>Términos</a>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 880px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 540px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}

function FCol({ title, items }) {
  return (
    <div>
      <div style={{ fontFamily: "var(--mono)", fontSize: 10.5, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--terracota-soft)", marginBottom: 18 }}>
        {title}
      </div>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
        {items.map((it, i) => (
          <li key={i}>
            <a href="#" style={{ fontSize: 14, color: "oklch(0.94 0.03 80 / 0.78)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--terracota-soft)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "oklch(0.94 0.03 80 / 0.78)")}
            >
              {it}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

window.Footer = Footer;
