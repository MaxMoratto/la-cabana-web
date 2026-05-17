/* global React, Shot, Reveal, Arrow, Eyebrow, useStoreSlice */

/* ============================================================
   EVENTOS — Música en vivo, área infantil, temporadas
   ============================================================ */

const EVENTS_FALLBACK = [
  { id: "ev_1", day: "Viernes",   title: "Trío Los del Valle",      time: "20:00 — 23:00", desc: "Boleros y rancheras al fogón" },
  { id: "ev_2", day: "Sábado",    title: "Mariachi de Cocula",      time: "14:00 — 17:00", desc: "Buffet familiar de fin de semana" },
  { id: "ev_3", day: "Domingo",   title: "Cuenta-cuentos infantil", time: "12:00 — 14:00", desc: "Leyendas mexicanas para niños" },
  { id: "ev_4", day: "Miércoles", title: "Cata de mezcal",          time: "19:30 — 22:00", desc: "5 destilados de Oaxaca · cupo 24" },
  { id: "ev_5", day: "Sábado",    title: "Cumpleaños familiar",     time: "Todo el día",   desc: "Decoración papel picado · pastel" },
];

// Map first 3 letters of day to short label
function dayShort(d) {
  const s = (d || "").trim().toLowerCase();
  if (s.startsWith("lun")) return "Lun";
  if (s.startsWith("mar")) return "Mar";
  if (s.startsWith("mié") || s.startsWith("mie")) return "Mié";
  if (s.startsWith("jue")) return "Jue";
  if (s.startsWith("vie")) return "Vie";
  if (s.startsWith("sáb") || s.startsWith("sab")) return "Sáb";
  if (s.startsWith("dom")) return "Dom";
  return (d || "").slice(0, 3);
}

const FEATURES = [
  {
    icon: "music",
    title: "Música mexicana en vivo",
    body: "Tres noches a la semana: tríos, mariachi y boleros. Pide tu canción al maestro de ceremonias.",
  },
  {
    icon: "kids",
    title: "Área infantil familiar",
    body: "Jardín cercado a la vista, juegos de madera, papel picado y taller de tortillas para los pequeños los domingos.",
  },
  {
    icon: "fire",
    title: "Temporadas gastronómicas",
    body: "Cada estación traemos cocineras invitadas de Puebla, Oaxaca y Yucatán para residencias de seis semanas.",
  },
  {
    icon: "house",
    title: "Reservaciones por WhatsApp",
    body: "Habla directo con la anfitriona. Confirmamos en menos de diez minutos durante horario.",
  },
];

function EventIcon({ kind, color = "currentColor" }) {
  const props = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" };
  if (kind === "music") return <svg {...props}><circle cx="6" cy="18" r="3"/><circle cx="18" cy="15" r="3"/><path d="M9 18V5l12-2v13"/></svg>;
  if (kind === "kids")  return <svg {...props}><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>;
  if (kind === "fire")  return <svg {...props}><path d="M12 3c0 4-5 5-5 10a5 5 0 0010 0c0-2-1-3-1-3 1 2-1 4-2 4 1-2 0-4-2-6 0-3 0-5 0-5z"/></svg>;
  if (kind === "house") return <svg {...props}><path d="M3 11l9-8 9 8M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></svg>;
  return null;
}

function EventosSection() {
  const EVENTS = useStoreSlice("eventos", EVENTS_FALLBACK);
  return (
    <section id="eventos" className="section section--nogal wood wood--nogal grain" style={{ overflow: "hidden", position: "relative" }}>
      {/* texture */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at 80% 0%, oklch(0.55 0.13 50 / 0.18), transparent 55%)",
        pointerEvents: "none",
      }} />

      <div className="container">
        <div className="section-head">
          <div>
            <Eyebrow>Eventos & Experiencias</Eyebrow>
            <h2>
              La cabaña <em>vive</em><br/>
              de jueves a domingo.
            </h2>
          </div>
          <div className="lede">
            Música en vivo, área infantil familiar y eventos privados bajo las vigas de madera. <span style={{ color: "var(--olivo-soft)", fontFamily: "var(--mono)", fontSize: 12, letterSpacing: "0.14em" }}>(Días y tipo a confirmar)</span>
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "clamp(28px, 5vw, 64px)",
          alignItems: "start",
        }} className="eventos-grid">

          {/* Calendar */}
          <Reveal>
            <div>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: 22,
              }}>
                <h3 className="display" style={{ fontSize: "clamp(26px, 3vw, 34px)", margin: 0 }}>
                  Esta <em>semana</em>
                </h3>
                <span style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "oklch(0.94 0.03 80 / 0.5)" }}>
                  Mayo · 2026
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {EVENTS.length === 0 && (
                  <div style={{ padding: "40px 0", textAlign: "center", color: "oklch(0.94 0.03 80 / 0.55)", fontStyle: "italic" }}>
                    No hay eventos esta semana. Agrega desde el admin.
                  </div>
                )}
                {EVENTS.map((e, i) => (
                  <div key={e.id || i} style={{
                    display: "grid",
                    gridTemplateColumns: "auto 1fr auto",
                    gap: 20,
                    alignItems: "center",
                    padding: "20px 0",
                    borderTop: i === 0 ? "1px solid oklch(0.94 0.03 80 / 0.18)" : "none",
                    borderBottom: "1px solid oklch(0.94 0.03 80 / 0.18)",
                    transition: "padding 0.3s ease",
                  }}
                    onMouseEnter={(ev) => { ev.currentTarget.style.paddingLeft = "10px"; }}
                    onMouseLeave={(ev) => { ev.currentTarget.style.paddingLeft = "0"; }}
                  >
                    <div style={{
                      width: 64, height: 64,
                      border: "1px solid oklch(0.94 0.03 80 / 0.25)",
                      borderRadius: 2,
                      display: "flex", flexDirection: "column",
                      alignItems: "center", justifyContent: "center",
                    }}>
                      <div style={{ fontFamily: "var(--mono)", fontSize: 9.5, letterSpacing: "0.22em", color: "var(--terracota-soft)" }}>{dayShort(e.day)}</div>
                      <div style={{ fontFamily: "var(--serif)", fontSize: 14, lineHeight: 1, marginTop: 6, color: "oklch(0.94 0.03 80 / 0.7)" }}>·</div>
                    </div>

                    <div>
                      <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "oklch(0.94 0.03 80 / 0.55)" }}>
                        {e.day}{e.time ? ` · ${e.time}` : ""}
                      </div>
                      <div style={{ fontFamily: "var(--serif)", fontSize: 22, marginTop: 4 }}>{e.title}</div>
                      <div style={{ fontSize: 13.5, color: "oklch(0.94 0.03 80 / 0.65)", marginTop: 4 }}>{e.desc || e.note}</div>
                    </div>

                    <button style={{
                      width: 36, height: 36,
                      border: "1px solid oklch(0.94 0.03 80 / 0.25)",
                      borderRadius: 999,
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      color: "var(--crema)",
                    }} aria-label="Ver detalle">
                      <Arrow size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Features */}
          <Reveal delay={120}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 18,
            }} className="features-grid">
              {FEATURES.map((f, i) => (
                <div key={i} style={{
                  border: "1px solid oklch(0.94 0.03 80 / 0.15)",
                  padding: "26px 24px",
                  borderRadius: 4,
                  background: "oklch(0.10 0.008 50 / 0.4)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                  minHeight: 220,
                }}>
                  <div style={{
                    width: 44, height: 44,
                    borderRadius: 999,
                    background: "var(--terracota)",
                    color: "var(--crema)",
                    display: "inline-flex",
                    alignItems: "center", justifyContent: "center",
                  }}>
                    <EventIcon kind={f.icon} />
                  </div>
                  <div>
                    <h4 style={{ fontFamily: "var(--serif)", fontSize: 19, margin: "0 0 8px", fontWeight: 500 }}>{f.title}</h4>
                    <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.55, color: "oklch(0.94 0.03 80 / 0.7)" }}>{f.body}</p>
                  </div>
                </div>
              ))}

              {/* Instagram feed teaser */}
              <div style={{
                gridColumn: "span 2",
                marginTop: 8,
                padding: "22px 24px",
                background: "var(--terracota)",
                color: "var(--crema)",
                borderRadius: 4,
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: 18,
                alignItems: "center",
              }}>
                <div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "oklch(0.94 0.03 80 / 0.75)" }}>
                    Instagram · @lacabana.mx
                  </div>
                  <div style={{ fontFamily: "var(--serif)", fontSize: 22, marginTop: 6 }}>
                    Mira la cocina de cada día.
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {["images/insta-cocina1.png", "images/insta-cocina2.png", "images/insta-cocina3.png"].map((src, j) => (
                    <div key={j} style={{
                      width: 56, height: 56,
                      borderRadius: 4,
                      backgroundImage: `url("${src}")`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      border: "1px solid oklch(0.94 0.03 80 / 0.4)",
                      flexShrink: 0,
                    }} />
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      <style>{`
        @media (max-width: 980px) {
          .eventos-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 520px) {
          .features-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

window.EventosSection = EventosSection;
