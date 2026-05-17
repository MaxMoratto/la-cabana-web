/* global React, Shot, Reveal, Arrow, Eyebrow, useStoreSlice, LaCabanaStore */
const { useState: useStatePromo, useEffect: useEffectPromo } = React;

/* ============================================================
   PROMOCIONES DE TEMPORADA — Editorial carousel
   ============================================================ */

const PROMO_IMAGES = {
  chiles:   "images/chiles-nogada.png",
  buffet:   "images/buffet-dominical.png",
  pozole:   "images/pozole-cazuela.png",
  muerto:   "images/pan-muerto.png",
  rosca:    "images/rosca-reyes.png",
  desayuno: "images/desayuno-familiar.png",
};

const PROMOS = [
  {
    id: "chiles",
    season: "Sep — Oct",
    title: "Temporada de Chiles en Nogada",
    sub: "Poblano · nuez de castilla · granada de Zacatlán",
    body: "Por seis semanas al año, traemos las nueces frescas y los chiles de Calpan. Se preparan a mano cada tarde, en lotes de 24.",
    cta: "Reservar temporada",
    atm: "clay",
    label: "FOTO · CHILES EN NOGADA · MOLCAJETE",
    ref: "REF · SEASON 01",
    price: "$ 385",
    badge: "Edición limitada",
  },
  {
    id: "buffet",
    season: "Sábado y Domingo",
    title: "Buffet Familiar de Fin de Semana",
    sub: "6 estaciones · parrilla en vivo · panadería abierta",
    body: "Café de olla recién hervido, parrilla a la vista, panadería con masa madre y mesa de antojitos. Niños hasta 6 años, cortesía.",
    cta: "Ver estaciones",
    atm: "fire",
    label: "FOTO · BUFFET DOMINICAL · CONTRAPICADA",
    ref: "REF · WKND 02",
    price: "$ 545 / persona",
    badge: "Más popular",
  },
  {
    id: "pozole",
    season: "Septiembre",
    title: "Pozole Patrio · Tres Olores",
    sub: "Rojo de Guerrero · verde de Puebla · blanco de Jalisco",
    body: "Cazuelas de barro recién destapadas, tostadas de maíz azul, lechuga finísima y aguacate. Servido como en casa de la abuela.",
    cta: "Apartar lugar",
    atm: "fire",
    label: "FOTO · POZOLE EN CAZUELA · TOP DOWN",
    ref: "REF · SEASON 03",
    price: "$ 295",
    badge: "Mes patrio",
  },
  {
    id: "muerto",
    season: "Octubre — Noviembre",
    title: "Pan de Muerto Artesanal",
    sub: "Masa madre · ralladura de naranja · azahar",
    body: "Reposamos la masa 18 horas. Se hornea a leña a primera hora. Lo entregamos tibio, espolvoreado a mano frente al cliente.",
    cta: "Pedir en línea",
    atm: "flour",
    label: "FOTO · PAN DE MUERTO · LUZ MAÑANA",
    ref: "REF · BAKERY 04",
    price: "$ 95 / pieza",
    badge: "Horno a leña",
  },
  {
    id: "rosca",
    season: "Enero",
    title: "Rosca de Reyes Premium",
    sub: "Ate de membrillo · higo · acitrón · 1.2 kg",
    body: "Se decora a mano una por una. Incluye chocolate de olla servido en cazuela individual para acompañar.",
    cta: "Reservar Rosca",
    atm: "flour",
    label: "FOTO · ROSCA DE REYES · DETALLE FRUTOS",
    ref: "REF · BAKERY 05",
    price: "Desde $ 690",
    badge: "Pre-venta",
  },
  {
    id: "desayuno",
    season: "Todos los días",
    title: "Desayunos Buffet Familiares",
    sub: "Chilaquiles a elegir · barra de fruta · panadería",
    body: "Abrimos el comal a las 8:00. Salsas martajadas frente al cliente, café de olla sin fondo y conchas recién horneadas.",
    cta: "Ver horario",
    atm: "cream",
    label: "FOTO · DESAYUNO · MESA FAMILIAR",
    ref: "REF · MORNING 06",
    price: "$ 325 / persona",
    badge: "8:00 — 12:30",
  },
];

// Map store promo (title/subtitle/dates) → legacy shape used by the layout
function normalizePromo(p, idx) {
  return {
    id: p.id || `p${idx}`,
    season: p.dates || p.season || "",
    title: p.title || "",
    sub: p.subtitle || p.sub || "",
    body: p.desc || p.body || "",
    cta: p.cta || "Reservar",
    atm: p.atm || ["clay", "fire", "fire", "flour", "flour", "cream"][idx % 6],
    label: p.label || "",
    ref: p.ref || `REF · ${String(idx + 1).padStart(2, "0")}`,
    price: p.price || "",
    badge: p.badge || "",
    image: p.image || "",
  };
}

function PromosSection({ onReserve }) {
  const storePromos = useStoreSlice("promos", null);
  const promosRaw = (storePromos && storePromos.length) ? storePromos : PROMOS;
  const ALL_PROMOS = promosRaw.map(normalizePromo);
  const [active, setActive] = useStatePromo(0);
  const [auto, setAuto] = useStatePromo(true);

  useEffectPromo(() => {
    if (!auto || ALL_PROMOS.length < 2) return;
    const id = setInterval(() => setActive((a) => (a + 1) % ALL_PROMOS.length), 6500);
    return () => clearInterval(id);
  }, [auto, ALL_PROMOS.length]);

  const activeIdx = Math.min(active, ALL_PROMOS.length - 1);
  const p = ALL_PROMOS[activeIdx] || ALL_PROMOS[0];
  if (!p) return null;

  return (
    <section id="promociones" className="section section--linen grain" style={{ overflow: "hidden" }}>
      <div className="container">
        <div className="section-head">
          <div>
            <Eyebrow>Promociones de Temporada</Eyebrow>
            <h2><em>Seis</em> experiencias<br/>que regresan cada año.</h2>
          </div>
          <div className="lede">
            Cocinas estacionales que se preparan solo unos días al año. Reserva con anticipación — algunas son una sola semana.
          </div>
        </div>
      </div>

      {/* Feature panel */}
      <div className="container">
        <div style={{
          display: "grid",
          gridTemplateColumns: "1.05fr 1fr",
          gap: "clamp(28px, 5vw, 72px)",
          alignItems: "stretch",
        }} className="promo-grid">
          <Reveal>
            {(() => {
              const img = LaCabanaStore.resolveImage(p.image || PROMO_IMAGES[p.id]);
              const Badge = p.badge ? (
                <div style={{
                  position: "absolute",
                  top: 18, left: 18,
                  display: "flex", gap: 8,
                  zIndex: 3,
                }}>
                  <span style={{
                    fontFamily: "var(--mono)",
                    fontSize: 10,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    background: "oklch(0.30 0.04 40 / 0.85)",
                    color: "var(--ambar-glow)",
                    padding: "6px 10px",
                    borderRadius: 999,
                    backdropFilter: "blur(6px)",
                  }}>● {p.badge}</span>
                </div>
              ) : null;
              return img ? (
                <div role="img" aria-label={p.title} style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "4 / 5",
                  minHeight: 500,
                  backgroundImage: `url("${img}")`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderRadius: 4,
                }}>
                  {Badge}
                </div>
              ) : (
                <Shot atm={p.atm} ratio="4 / 5" style={{ width: "100%", height: "100%", minHeight: 500 }}>
                  {Badge}
                </Shot>
              );
            })()}
          </Reveal>

          <Reveal delay={120}>
            <div style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: 32,
              height: "100%",
              padding: "clamp(20px, 4vw, 40px) 0",
            }}>
              <div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--terracota-soft)" }}>
                  {p.season}
                </div>
                <h3 className="display" style={{
                  fontSize: "clamp(32px, 4.5vw, 56px)",
                  margin: "16px 0 14px",
                }}>
                  {p.title}
                </h3>
                <p style={{
                  fontFamily: "var(--serif)",
                  fontStyle: "italic",
                  fontSize: 20,
                  color: "var(--terracota-soft)",
                  margin: "0 0 22px",
                }}>
                  {p.sub}
                </p>
                <p style={{ fontSize: 16, lineHeight: 1.65, color: "oklch(0.22 0.025 40 / 0.78)", maxWidth: 480 }}>
                  {p.body}
                </p>
              </div>

              <div>
                <div style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 18,
                  marginBottom: 24,
                  paddingTop: 24,
                  borderTop: "1px solid oklch(0.22 0.025 40 / 0.12)",
                }}>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "oklch(0.22 0.025 40 / 0.55)" }}>Desde</span>
                  <span style={{ fontFamily: "var(--serif)", fontSize: 32 }}>{p.price}</span>
                </div>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <button className="btn btn--primary" onClick={onReserve}>
                    {p.cta} <Arrow />
                  </button>
                  <button className="btn btn--ghost">
                    Compartir
                  </button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Promo strip — clickable */}
      <div style={{ marginTop: 64, position: "relative" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <span style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "oklch(0.22 0.025 40 / 0.55)" }}>
              {String(activeIdx + 1).padStart(2, "0")} / {String(ALL_PROMOS.length).padStart(2, "0")}
            </span>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => { setAuto(false); setActive((a) => (a - 1 + ALL_PROMOS.length) % ALL_PROMOS.length); }}
                aria-label="Anterior"
                style={{ width: 38, height: 38, borderRadius: 999, border: "1px solid oklch(0.22 0.025 40 / 0.22)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" stroke="currentColor" strokeWidth="1.6" fill="none"><path d="M13 7 H1 M6 2 L1 7 L6 12" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <button
                onClick={() => { setAuto(false); setActive((a) => (a + 1) % ALL_PROMOS.length); }}
                aria-label="Siguiente"
                style={{ width: 38, height: 38, borderRadius: 999, border: "1px solid oklch(0.22 0.025 40 / 0.22)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
              >
                <Arrow />
              </button>
            </div>
          </div>
        </div>

        <div style={{
          display: "flex",
          gap: 18,
          overflowX: "auto",
          padding: "0 var(--gutter) 24px",
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
        }} className="promo-strip">
          <style>{`.promo-strip::-webkit-scrollbar { display: none; }`}</style>
          {ALL_PROMOS.map((promo, i) => {
            const img = LaCabanaStore.resolveImage(promo.image || PROMO_IMAGES[promo.id]);
            return (
            <button
              key={promo.id}
              onClick={() => { setAuto(false); setActive(i); }}
              style={{
                flex: "0 0 280px",
                textAlign: "left",
                background: "transparent",
                padding: 0,
                scrollSnapAlign: "start",
                opacity: i === activeIdx ? 1 : 0.55,
                transition: "opacity 0.3s ease, transform 0.3s ease",
                transform: i === activeIdx ? "translateY(-4px)" : "none",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = i === activeIdx ? "1" : "0.55")}
            >
              {img ? (
                <div role="img" aria-label={promo.title} style={{
                  aspectRatio: "4 / 3",
                  backgroundImage: `url("${img}")`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderRadius: 4,
                }} />
              ) : (
                <Shot atm={promo.atm} ratio="4 / 3" />
              )}
              <div style={{ paddingTop: 14 }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--terracota-soft)" }}>{promo.season}</div>
                <div style={{ fontFamily: "var(--serif)", fontSize: 20, marginTop: 6, color: "var(--espresso)" }}>{promo.title}</div>
              </div>
            </button>
          );})}
        </div>
      </div>

      <style>{`
        @media (max-width: 880px) {
          .promo-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

window.PromosSection = PromosSection;
