/* global React, Shot, Reveal, Arrow, Eyebrow, useStoreSlice, LaCabanaStore */

/* ============================================================
   PANADERÍA ARTESANAL — Luxury bakery feature
   ============================================================ */

const BREADS_FALLBACK = [
  { id: "pan_1", name: "Concha Premium",      desc: "Vainilla de Papantla · cacao",          price: 38, image: "" },
  { id: "pan_2", name: "Chocolatín Mexicano", desc: "Chocolate Oaxaqueño · mantequilla",     price: 52, image: "" },
  { id: "pan_3", name: "Rol de Canela",       desc: "Piloncillo · nuez de castilla",         price: 48, image: "" },
  { id: "pan_4", name: "Pan Rústico",         desc: "Masa madre 36 hrs · corteza leñosa",    price: 95, image: "" },
  { id: "pan_5", name: "Cuerno de Hojaldre",  desc: "104 capas · mantequilla francesa",      price: 62, image: "" },
  { id: "pan_6", name: "Pan de Elote",        desc: "Elote tierno · queso fresco",           price: 45, image: "" },
];

// Cycle atmospheres for fallback styling
const BAKERY_ATMS = ["flour", "wood", "clay", "wood", "flour", "cream"];

function PanaderiaSection() {
  const BREADS = useStoreSlice("panaderia", BREADS_FALLBACK);
  return (
    <section id="panaderia" className="section section--cream grain" style={{ overflow: "hidden", position: "relative" }}>
      {/* flour dust decoration */}
      <div aria-hidden="true" style={{
        position: "absolute",
        top: 0, right: 0,
        width: 360, height: 360,
        background: "radial-gradient(circle, oklch(0.30 0.02 40 / 0.06), transparent 65%)",
        pointerEvents: "none",
      }} />

      <div className="container">
        <div className="section-head">
          <div>
            <Eyebrow>Panadería · Horno a leña</Eyebrow>
            <h2 style={{ color: "var(--espresso)" }}>
              La <em>panadería</em> abre<br/>
              a las cinco de la mañana.
            </h2>
          </div>
          <div className="lede">
            Reposamos las masas durante la noche. A las 5:00 se enciende el horno de leña. A las 8:00 sale el primer pan tibio para el desayuno.
          </div>
        </div>

        {/* Hero bakery image + paragraph */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr",
          gap: "clamp(28px, 5vw, 72px)",
          alignItems: "stretch",
          marginBottom: 88,
        }} className="pan-hero">
          <Reveal>
            <Shot atm="flour" src="images/horno-lena.png" ratio="16 / 11" label="FOTO · HORNO DE LEÑA · 4:50 AM" ref0="BAKERY · 01" style={{ height: "100%", minHeight: 420 }}>
              <div style={{
                position: "absolute",
                bottom: 32, right: 28,
                fontFamily: "var(--script)",
                fontSize: 52,
                color: "oklch(0.94 0.03 80 / 0.7)",
                transform: "rotate(-4deg)",
                zIndex: 3,
                textShadow: "0 4px 16px oklch(0.10 0.008 50 / 0.6)",
              }}>
                Recién horneado
              </div>
            </Shot>
          </Reveal>

          <Reveal delay={140}>
            <div style={{
              background: "var(--espresso)",
              color: "var(--crema)",
              padding: "clamp(28px, 4vw, 48px)",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: 420,
            }}>
              <div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--terracota-soft)" }}>
                  Bitácora del panadero
                </div>
                <p style={{
                  fontFamily: "var(--serif)",
                  fontStyle: "italic",
                  fontSize: "clamp(22px, 2.6vw, 28px)",
                  lineHeight: 1.4,
                  margin: "20px 0 0",
                  color: "var(--crema)",
                }}>
                  “La masa madre que usamos hoy es hija de la primera que mi abuela trajo de Coatepec, en 1998. La alimentamos cada noche con harina de Tlaxcala.”
                </p>
                <div style={{ fontFamily: "var(--sans)", fontSize: 13, marginTop: 22, color: "oklch(0.94 0.03 80 / 0.6)" }}>
                  — Don Ernesto · maestro panadero
                </div>
              </div>

              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 16,
                marginTop: 36,
                paddingTop: 28,
                borderTop: "1px solid oklch(0.94 0.03 80 / 0.15)",
              }}>
                {[
                  { k: "36h", v: "fermentación lenta" },
                  { k: "5:00", v: "se enciende el horno" },
                  { k: "8:00", v: "primera horneada" },
                ].map((s, i) => (
                  <div key={i}>
                    <div style={{ fontFamily: "var(--serif)", fontSize: 26, color: "var(--terracota-soft)" }}>{s.k}</div>
                    <div style={{ fontSize: 11.5, letterSpacing: "0.04em", color: "oklch(0.94 0.03 80 / 0.7)", marginTop: 4 }}>{s.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {/* Bread grid — artisan menu */}
        <Reveal>
          <div style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            marginBottom: 28,
            gap: 16,
            flexWrap: "wrap",
          }}>
            <h3 className="display" style={{ fontSize: "clamp(28px, 3.6vw, 42px)", margin: 0, color: "var(--espresso)" }}>
              Hoy en <em>el horno</em>
            </h3>
            <span style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "oklch(0.30 0.02 40 / 0.55)" }}>
              Hornada del 15 de mayo, 2026
            </span>
          </div>
        </Reveal>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 28,
        }} className="bread-grid">
          {BREADS.map((b, i) => {
            const img = LaCabanaStore.resolveImage(b.image || b.src);
            const atm = b.atm || BAKERY_ATMS[i % BAKERY_ATMS.length];
            return (
            <Reveal key={b.id || b.name} delay={i * 80}>
              <article style={{
                cursor: "pointer",
                transition: "transform 0.4s cubic-bezier(0.2, 0.7, 0.2, 1)",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-6px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; }}
              >
                {img ? (
                  <div role="img" aria-label={b.name} style={{
                    aspectRatio: "1 / 1",
                    backgroundImage: `url("${img}")`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    borderRadius: 4,
                  }} />
                ) : (
                  <Shot atm={atm} ratio="1 / 1" />
                )}
                <div style={{ paddingTop: 18, display: "grid", gridTemplateColumns: "1fr auto", gap: 10, alignItems: "baseline" }}>
                  <div>
                    <h4 style={{
                      fontFamily: "var(--serif)",
                      fontSize: 22,
                      margin: 0,
                      color: "var(--espresso)",
                      fontWeight: 500,
                    }}>
                      {b.name}
                    </h4>
                    <div style={{ fontSize: 13, color: "oklch(0.30 0.02 40 / 0.7)", marginTop: 4 }}>
                      {b.desc || b.note}
                    </div>
                  </div>
                  <div style={{
                    fontFamily: "var(--serif)",
                    fontSize: 22,
                    color: "var(--terracota-deep)",
                    fontVariantNumeric: "tabular-nums",
                  }}>
                    ${b.price}
                  </div>
                </div>
              </article>
            </Reveal>
          );})}
        </div>

        <Reveal>
          <div style={{
            marginTop: 64,
            display: "flex",
            justifyContent: "center",
            gap: 14,
            flexWrap: "wrap",
          }}>
            <a href="#reservar" className="btn btn--dark">
              Pedir caja artesanal <Arrow />
            </a>
            <a href="#eventos" className="btn btn--ghost" style={{ color: "var(--espresso)", borderColor: "oklch(0.30 0.02 40 / 0.35)" }}>
              Catering para eventos
            </a>
          </div>
        </Reveal>
      </div>

      <style>{`
        @media (max-width: 1000px) {
          .pan-hero { grid-template-columns: 1fr !important; }
          .bread-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 620px) {
          .bread-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

window.PanaderiaSection = PanaderiaSection;
