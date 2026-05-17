/* global React, Shot, Reveal, Arrow, Eyebrow, LaCabanaStore */
const { useState: useStateBuffet, useEffect: useEffectBuffet } = React;

function useBuffetData() {
  const [snap, setSnap] = useStateBuffet(() => LaCabanaStore.get().buffet);
  useEffectBuffet(() => LaCabanaStore.subscribe(s => setSnap({ ...s.buffet })), []);
  return snap;
}

/* ============================================================
   BUFFET DE FINES DE SEMANA — Estaciones
   ============================================================ */

const STATIONS = [
  {
    id: "parrilla",
    n: "01",
    name: "Parrilla a la Vista",
    atm: "fire",
    image: "images/parilla.png",
    imagePosition: "center 45%",
    label: "FOTO · PARRILLA · CHEF EN VIVO",
    ref: "STN · 01",
    items: ["Arrachera marinada 24 hrs", "Cecina enchilada de Yecapixtla", "Costilla glaseada con piloncillo", "Chorizo verde de Toluca"],
  },
  {
    id: "antojitos",
    n: "02",
    name: "Antojitos Mexicanos",
    atm: "clay",
    image: "images/tlacoyos-comal.png",
    imagePosition: "center",
    label: "FOTO · COMAL · TLACOYOS",
    ref: "STN · 02",
    items: ["Tlacoyos de haba y requesón", "Quesadillas de flor de calabaza", "Sopes de cuitlacoche", "Tetelas de frijol"],
  },
  {
    id: "panaderia",
    n: "03",
    name: "Panadería Abierta",
    atm: "flour",
    image: "images/conchas-artesanales.png",
    imagePosition: "center",
    label: "FOTO · CONCHAS · HORNO LEÑA",
    ref: "STN · 03",
    items: ["Conchas tibias de vainilla y cacao", "Rol de canela con piloncillo", "Cochinitos de jengibre", "Pan rústico de masa madre"],
  },
  {
    id: "postres",
    n: "04",
    name: "Postres Artesanales",
    atm: "cream",
    image: "images/postres-artesanales.png",
    imagePosition: "center",
    label: "FOTO · POSTRES · TEXTURAS",
    ref: "STN · 04",
    items: ["Flan de cajeta tibio", "Buñuelos con miel de piloncillo", "Capirotada con queso añejo", "Helado de mamey con pinole"],
  },
  {
    id: "olla",
    n: "05",
    name: "Café de Olla y Atoles",
    atm: "wood",
    image: "images/cafe-olla.png",
    imagePosition: "center",
    label: "FOTO · CAFÉ DE OLLA · CAZUELA",
    ref: "STN · 05",
    items: ["Café de olla con canela y piloncillo", "Atole de guayaba", "Atole champurrado", "Té de hierbabuena del huerto"],
  },
  {
    id: "chocolate",
    n: "06",
    name: "Chocolate Caliente",
    atm: "night",
    image: "images/chocolate-oaxaqueno.png",
    imagePosition: "center",
    label: "FOTO · CHOCOLATE OAXAQUEÑO",
    ref: "STN · 06",
    items: ["Chocolate de metate de Oaxaca", "Champurrado de maíz azul", "Chocolate blanco con tequila", "Marshmallows de mezcal"],
  },
];

function BuffetSection() {
  const bufetData = useBuffetData();
  const stations = (bufetData?.stations && bufetData.stations.length) ? bufetData.stations : STATIONS;
  const [active, setActive] = useStateBuffet(0);
  const activeIdx = Math.min(active, stations.length - 1);
  const s = stations[activeIdx];
  const bannerImage = LaCabanaStore.resolveImage(LaCabanaStore.getPath("images.buffet")) || "images/buffet.png";

  return (
    <section id="buffet" className="section section--cream" style={{ overflow: "hidden" }}>
      <div className="container">
        {/* Hero banner — foto real del bufet (título estampado en la imagen) */}
        <Reveal>
          <div
            role="img"
            aria-label="Buffet de fin de semana en La Cabaña"
            style={{
              width: "100%",
              aspectRatio: "3 / 2",
              maxHeight: 560,
              backgroundImage: `url("${bannerImage}")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              borderRadius: 4,
              boxShadow: "0 24px 60px -24px oklch(0.10 0.008 50 / 0.45)",
              marginBottom: "clamp(48px, 7vw, 88px)",
            }}
          />
        </Reveal>

        <div className="section-head">
          <div>
            <Eyebrow>Buffet · Sábado y Domingo</Eyebrow>
            <h2 style={{ color: "var(--espresso)" }}>
              Seis <em>estaciones</em>,<br/>una sola mesa familiar.
            </h2>
          </div>
          <div className="lede">
            De 13:00 a 18:00. Pasa cuantas veces quieras. La cocina abre frente a ti — la parrilla, el comal, el horno y el metate.
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.2fr",
          gap: "clamp(28px, 5vw, 72px)",
          alignItems: "start",
        }} className="buffet-grid">

          {/* Left — station list */}
          <Reveal>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {stations.map((station, i) => {
                const isActive = i === activeIdx;
                return (
                  <button
                    key={station.id}
                    onClick={() => setActive(i)}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "auto 1fr auto",
                      gap: 20,
                      alignItems: "center",
                      padding: "22px 0",
                      borderTop: i === 0 ? "1px solid oklch(0.30 0.02 40 / 0.18)" : "none",
                      borderBottom: "1px solid oklch(0.30 0.02 40 / 0.18)",
                      textAlign: "left",
                      color: "var(--espresso)",
                      transition: "padding 0.3s ease",
                      paddingLeft: isActive ? 16 : 0,
                      width: "100%",
                    }}
                  >
                    <span style={{
                      fontFamily: "var(--mono)",
                      fontSize: 11,
                      letterSpacing: "0.2em",
                      color: isActive ? "var(--terracota)" : "oklch(0.30 0.02 40 / 0.45)",
                      transition: "color 0.3s ease",
                    }}>{station.n}</span>
                    <span style={{
                      fontFamily: "var(--serif)",
                      fontSize: "clamp(22px, 2.6vw, 30px)",
                      fontStyle: isActive ? "italic" : "normal",
                      color: isActive ? "var(--terracota-deep)" : "var(--espresso)",
                      transition: "color 0.3s ease",
                    }}>
                      {station.name}
                    </span>
                    <span style={{
                      width: 32, height: 32, borderRadius: 999,
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      border: isActive ? "1px solid var(--terracota)" : "1px solid oklch(0.30 0.02 40 / 0.25)",
                      background: isActive ? "var(--terracota)" : "transparent",
                      color: isActive ? "var(--crema)" : "var(--espresso)",
                      transition: "all 0.3s ease",
                    }}>
                      <Arrow size={12} />
                    </span>
                  </button>
                );
              })}
            </div>
          </Reveal>

          {/* Right — station detail */}
          <Reveal delay={140}>
            <div style={{ position: "sticky", top: 100 }}>
              {(() => {
                const resolved = LaCabanaStore.resolveImage(s.image);
                return resolved ? (
                  <div
                    role="img"
                    aria-label={s.name}
                    style={{
                      aspectRatio: "4 / 5",
                      minHeight: 480,
                      backgroundImage: `url("${resolved}")`,
                      backgroundSize: "cover",
                      backgroundPosition: s.imagePosition || "center",
                      backgroundRepeat: "no-repeat",
                      borderRadius: "4px 4px 0 0",
                    }}
                  />
                ) : (
                  <Shot atm={s.atm} ratio="4 / 5" label={s.label} ref0={s.ref} style={{ minHeight: 480 }} />
                );
              })()}
              <div style={{
                background: "var(--espresso)",
                color: "var(--crema)",
                padding: "28px 32px",
                marginTop: -1,
              }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--terracota-soft)" }}>
                  Estación {s.n}
                </div>
                <h3 className="display" style={{ fontSize: "clamp(26px, 3vw, 34px)", margin: "10px 0 22px", color: "var(--crema)" }}>
                  {s.name}
                </h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                  {s.items.map((it, j) => (
                    <li key={j} style={{
                      display: "grid",
                      gridTemplateColumns: "auto 1fr",
                      gap: 14,
                      alignItems: "baseline",
                      fontSize: 15,
                      color: "oklch(0.94 0.03 80 / 0.85)",
                      paddingBottom: 12,
                      borderBottom: "1px solid oklch(0.94 0.03 80 / 0.08)",
                    }}>
                      <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "oklch(0.94 0.03 80 / 0.5)" }}>
                        — {String(j + 1).padStart(2, "0")}
                      </span>
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>

        <div style={{
          marginTop: 64,
          padding: "28px 32px",
          background: "var(--espresso)",
          color: "var(--crema)",
          borderRadius: 4,
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr 1fr auto",
          gap: 28,
          alignItems: "center",
        }} className="buffet-banner">
          <div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--terracota-soft)" }}>Buffet Familiar</div>
            <div style={{ fontFamily: "var(--serif)", fontSize: 24, marginTop: 6 }}>{bufetData?.schedule || "Sábado y Domingo · 13:00 — 18:00"}</div>
          </div>
          <div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "oklch(0.94 0.03 80 / 0.5)" }}>
              Adultos {!bufetData?.priceConfirmed && <span style={{ color: "var(--olivo-soft)" }}>· a confirmar</span>}
            </div>
            <div style={{ fontFamily: "var(--serif)", fontSize: 28, marginTop: 4 }}>$ {bufetData?.priceAdult ?? 249}</div>
          </div>
          <div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "oklch(0.94 0.03 80 / 0.5)" }}>Niños 6-12</div>
            <div style={{ fontFamily: "var(--serif)", fontSize: 28, marginTop: 4 }}>$ {bufetData?.priceChild ?? 149}</div>
          </div>
          <a href="#reservar" className="btn btn--primary">Reservar buffet <Arrow /></a>
        </div>
      </div>

      <style>{`
        @media (max-width: 980px) {
          .buffet-grid { grid-template-columns: 1fr !important; }
          .buffet-banner { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </section>
  );
}

window.BuffetSection = BuffetSection;
