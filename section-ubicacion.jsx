/* global React, Shot, Reveal, Arrow, Eyebrow, LaCabanaStore */
const { useState: useStateUbi, useEffect: useEffectUbi } = React;

/* ============================================================
   UBICACIÓN — Map + hours + parking + Cómo llegar
   ============================================================ */

const HOURS_FALLBACK = [
  { d: "Lunes",     h: "8:00 — 22:00" },
  { d: "Martes",    h: "8:00 — 22:00" },
  { d: "Miércoles", h: "8:00 — 22:00" },
  { d: "Jueves",    h: "8:00 — 22:00" },
  { d: "Viernes",   h: "8:00 — 23:00" },
  { d: "Sábado",    h: "8:00 — 23:00", buffet: true },
  { d: "Domingo",   h: "8:00 — 22:00", buffet: true },
];

function useUbicacionData() {
  const [s, setS] = useStateUbi(() => LaCabanaStore.get());
  useEffectUbi(() => LaCabanaStore.subscribe(next => setS({ ...next })), []);
  return s;
}

function UbicacionSection() {
  const store = useUbicacionData();
  const HOURS = (store.hours && store.hours.length) ? store.hours : HOURS_FALLBACK;
  const ADDRESS = store.site?.address || "Sur 16 233, Col. Agrícola Oriental, Iztacalco, 08500 CDMX";
  const GMAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`;
  const WAZE_URL = `https://waze.com/ul?q=${encodeURIComponent(ADDRESS)}`;
  return (
    <section id="ubicacion" className="section section--linen" style={{ overflow: "hidden", position: "relative" }}>
      <div className="container">
        <div className="section-head">
          <div>
            <Eyebrow>Ubicación y horarios</Eyebrow>
            <h2 style={{ color: "var(--espresso)" }}>
              Estamos en <em>Iztacalco</em>,<br/>
              junto al Mercado Agrícola Oriental.
            </h2>
          </div>
          <div className="lede">
            Si vienes en coche, marca el mercado en Waze y verás la entrada. Si vienes caminando, busca la fachada de madera oscura sobre la calle Sur 16.
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr",
          gap: "clamp(28px, 5vw, 56px)",
          alignItems: "start",
        }} className="ubic-grid">

          {/* Map */}
          <Reveal>
            <div style={{ position: "relative" }}>
              <Shot atm="herb" src="images/terraza-cabana.png" ratio="4 / 3" label="MAPA · IZTACALCO · COL. AGRÍCOLA ORIENTAL" ref0="MAP · 01" style={{ minHeight: 380 }}>
                {/* map roads (simple grid) */}
                <svg viewBox="0 0 400 300" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 2, opacity: 0.55 }}>
                  <g stroke="oklch(0.94 0.03 80 / 0.55)" strokeWidth="1.4" fill="none">
                    <line x1="0" y1="80" x2="400" y2="80" />
                    <line x1="0" y1="160" x2="400" y2="160" />
                    <line x1="0" y1="220" x2="400" y2="220" />
                    <line x1="100" y1="0" x2="100" y2="300" />
                    <line x1="200" y1="0" x2="200" y2="300" />
                    <line x1="300" y1="0" x2="300" y2="300" />
                  </g>
                  <g stroke="oklch(0.94 0.03 80 / 0.8)" strokeWidth="2.5" fill="none">
                    <line x1="0" y1="150" x2="400" y2="150" />
                  </g>
                  <text x="14" y="146" fontFamily="var(--mono)" fontSize="9" fill="oklch(0.94 0.03 80 / 0.75)" letterSpacing="0.18em">AV. RÍO CHURUBUSCO</text>
                  <text x="14" y="216" fontFamily="var(--mono)" fontSize="9" fill="oklch(0.94 0.03 80 / 0.55)" letterSpacing="0.18em">SUR 16</text>
                  {/* mercado box */}
                  <rect x="160" y="170" width="62" height="42" fill="oklch(0.94 0.03 80 / 0.18)" stroke="oklch(0.94 0.03 80 / 0.5)" />
                  <text x="166" y="194" fontFamily="var(--mono)" fontSize="8" fill="oklch(0.94 0.03 80 / 0.85)" letterSpacing="0.12em">MERCADO</text>
                </svg>

                {/* pin */}
                <div style={{
                  position: "absolute",
                  top: "62%", left: "58%",
                  transform: "translate(-50%, -100%)",
                  zIndex: 3,
                }}>
                  <div style={{
                    background: "var(--terracota)",
                    color: "var(--crema)",
                    padding: "10px 14px",
                    borderRadius: 999,
                    fontFamily: "var(--mono)",
                    fontSize: 10,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                    boxShadow: "0 12px 24px -8px oklch(0.10 0.008 50 / 0.55)",
                  }}>
                    La Cabaña Social House
                  </div>
                  <div style={{
                    width: 0, height: 0,
                    borderLeft: "8px solid transparent",
                    borderRight: "8px solid transparent",
                    borderTop: "10px solid var(--terracota)",
                    margin: "0 auto",
                  }} />
                  <div style={{
                    width: 16, height: 16, borderRadius: 999,
                    background: "var(--terracota)",
                    border: "3px solid var(--crema)",
                    boxShadow: "0 0 0 6px oklch(0.58 0.13 38 / 0.25)",
                    margin: "0 auto",
                  }} />
                </div>
              </Shot>

              {/* Buttons under map */}
              <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
                <a href={GMAPS_URL} target="_blank" rel="noopener" className="btn btn--primary">
                  Abrir en Google Maps <Arrow />
                </a>
                <a href={WAZE_URL} target="_blank" rel="noopener" className="btn btn--olive">
                  Abrir en Waze
                </a>
              </div>
            </div>
          </Reveal>

          {/* Hours + Parking */}
          <Reveal delay={140}>
            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>

              {/* Address card */}
              <div style={{
                padding: "24px 26px",
                background: "var(--crema)",
                border: "1px solid oklch(0.22 0.025 40 / 0.16)",
                borderRadius: 4,
              }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--terracota)" }}>
                  Dirección
                </div>
                <div style={{
                  fontFamily: "var(--serif)",
                  fontSize: 22,
                  fontWeight: 500,
                  marginTop: 10,
                  lineHeight: 1.3,
                  color: "var(--espresso)",
                }}>
                  Sur 16 Núm. 233
                </div>
                <div style={{ marginTop: 6, fontSize: 14, color: "oklch(0.22 0.025 40 / 0.75)", lineHeight: 1.55 }}>
                  Col. Agrícola Oriental<br/>
                  Iztacalco · CDMX · C.P. 08500
                </div>
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px dashed oklch(0.22 0.025 40 / 0.18)", display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "oklch(0.22 0.025 40 / 0.78)" }}>
                  <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: 999, background: "var(--olivo)" }}></span>
                  Junto al Mercado de Agrícola Oriental
                </div>
              </div>

              {/* Hours table */}
              <div style={{
                padding: "24px 26px",
                background: "var(--crema)",
                border: "1px solid oklch(0.22 0.025 40 / 0.16)",
                borderRadius: 4,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--terracota)" }}>
                    Horario
                  </div>
                  <span style={{
                    fontFamily: "var(--mono)",
                    fontSize: 9,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "var(--olivo)",
                    border: "1px solid var(--olivo)",
                    padding: "3px 8px",
                    borderRadius: 999,
                  }}>
                    · A confirmar
                  </span>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                  <tbody>
                    {HOURS.map((row, i) => (
                      <tr key={i} style={{ borderBottom: i < HOURS.length - 1 ? "1px dashed oklch(0.22 0.025 40 / 0.16)" : "none" }}>
                        <td style={{ padding: "10px 0", fontFamily: "var(--serif)", fontSize: 16, color: "var(--espresso)" }}>
                          {row.d}
                          {row.buffet && (
                            <span style={{
                              fontFamily: "var(--mono)",
                              fontSize: 9.5,
                              letterSpacing: "0.18em",
                              textTransform: "uppercase",
                              color: "var(--terracota)",
                              marginLeft: 10,
                              padding: "2px 8px",
                              borderRadius: 999,
                              background: "oklch(0.58 0.13 38 / 0.12)",
                            }}>Bufet</span>
                          )}
                        </td>
                        <td style={{ padding: "10px 0", textAlign: "right", fontFamily: "var(--mono)", color: "oklch(0.22 0.025 40 / 0.78)", letterSpacing: "0.04em" }}>
                          {row.h}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Parking + payments */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
              }} className="ubic-extras">
                <div style={{
                  padding: "18px 20px",
                  background: "var(--crema)",
                  border: "1px solid oklch(0.22 0.025 40 / 0.16)",
                  borderRadius: 4,
                }}>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--olivo)" }}>
                    Estacionamiento
                  </div>
                  <div style={{ marginTop: 8, fontFamily: "var(--serif)", fontSize: 17, color: "var(--espresso)", lineHeight: 1.4 }}>
                    Disponible en la zona
                  </div>
                  <div style={{ marginTop: 4, fontSize: 12, color: "oklch(0.22 0.025 40 / 0.65)" }}>
                    Política de cortesía a confirmar con el negocio.
                  </div>
                </div>

                <div style={{
                  padding: "18px 20px",
                  background: "var(--crema)",
                  border: "1px solid oklch(0.22 0.025 40 / 0.16)",
                  borderRadius: 4,
                }}>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--olivo)" }}>
                    Formas de pago
                  </div>
                  <div style={{ marginTop: 8, fontFamily: "var(--serif)", fontSize: 17, color: "var(--espresso)", lineHeight: 1.4 }}>
                    Efectivo · Tarjeta · NFC
                  </div>
                  <div style={{ marginTop: 4, fontSize: 12, color: "oklch(0.22 0.025 40 / 0.65)" }}>
                    Débito, crédito y pago contactless.
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      <style>{`
        @media (max-width: 980px) {
          .ubic-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .ubic-extras { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

window.UbicacionSection = UbicacionSection;
