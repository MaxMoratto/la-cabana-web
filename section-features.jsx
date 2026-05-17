/* global React, Shot, Reveal, Arrow, Eyebrow */

/* ============================================================
   FEATURE GRID — 4-panel intro overview
   ============================================================ */

const FEATS = [
  {
    id: "buffet",
    title: "Buffet de\nFin de Semana",
    blurb: "Disfruta nuestro buffet con lo mejor de la cocina mexicana.",
    href: "#buffet",
    atm: "fire",
    src: "images/parilla.png",
    label: "FOTO · PARRILLA · COSTILLAS",
    wood: "wood--terracota",
    icon: "fire",
  },
  {
    id: "promos",
    title: "Promociones\nde Temporada",
    blurb: "Chiles en nogada, pozole, pan de muerto, rosca de reyes y más.",
    href: "#promociones",
    atm: "clay",
    src: "images/chiles-nogada.png",
    label: "FOTO · CHILES EN NOGADA",
    wood: "wood--olivo",
    icon: "chile",
  },
  {
    id: "pan",
    title: "Panadería\nArtesanal",
    blurb: "Pan hecho con amor, recetas artesanales y los mejores ingredientes.",
    href: "#panaderia",
    atm: "flour",
    src: "images/conchas-artesanales.png",
    label: "FOTO · CONCHAS · CANASTO",
    wood: "wood--nogal",
    icon: "bread",
  },
  {
    id: "carta",
    title: "Comida\na la Carta",
    blurb: "Platillos mexicanos tradicionales con un toque único de la casa.",
    href: "#carta",
    atm: "wood",
    src: "images/molcajete-arrachera.png",
    label: "FOTO · MOLCAJETE · CALIENTE",
    wood: "wood--espresso",
    icon: "fork",
  },
];

function FeatIcon({ kind, color = "var(--terracota-soft)" }) {
  const p = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" };
  if (kind === "fire")  return <svg {...p}><path d="M12 3c0 4-5 5-5 10a5 5 0 0010 0c0-2-1-3-1-3 1 2-1 4-2 4 1-2 0-4-2-6 0-3 0-5 0-5z"/></svg>;
  if (kind === "chile") return <svg {...p}><path d="M5 14c4 4 11 5 14 1-1-4-7-5-10-4-2 1-3 2-4 3z"/><path d="M16 9c0-2 1-3 3-3"/></svg>;
  if (kind === "bread") return <svg {...p}><path d="M5 14a4 4 0 014-4h6a4 4 0 014 4v4H5z"/><path d="M8 14l1 4M12 14v4M16 14l-1 4"/></svg>;
  if (kind === "fork")  return <svg {...p}><path d="M6 3v8a2 2 0 002 2v8M6 3v6M9 3v6M18 3c-2 0-3 2-3 6 0 3 1 4 2 4l1 8"/></svg>;
  return null;
}

function FeatureGridSection() {
  const scroll = (id) => (e) => {
    e.preventDefault();
    const el = document.querySelector(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
  };
  return (
    <section className="section--linen" style={{
      padding: "clamp(56px, 8vw, 96px) 0 clamp(56px, 8vw, 96px)",
      borderTop: "1px solid oklch(0.22 0.025 40 / 0.08)",
    }}>
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: 48, maxWidth: 760, margin: "0 auto 48px" }}>
          <Eyebrow>Cuatro experiencias bajo un mismo techo</Eyebrow>
          <h2 className="display" style={{
            fontSize: "clamp(34px, 5vw, 56px)",
            margin: "14px 0 12px",
            color: "var(--espresso)",
          }}>
            Más que un <em>restaurante</em>,<br/>somos tu cabaña.
          </h2>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 18,
        }} className="feat-grid">
          {FEATS.map((f, i) => (
            <Reveal key={f.id} delay={i * 90}>
              <a href={f.href} onClick={scroll(f.href)} style={{
                display: "block",
                position: "relative",
                color: "var(--crema)",
                transition: "transform 0.4s cubic-bezier(0.2, 0.7, 0.2, 1)",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-6px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; }}
              >
                {/* Photo */}
                <Shot atm={f.atm} src={f.src} ratio="4 / 5" label={f.label} ref0={`PANEL · ${String(i + 1).padStart(2, "0")}`} style={{ minHeight: 280 }} />

                {/* Info block underneath */}
                <div className={`wood ${f.wood}`} style={{
                  padding: "22px 22px 26px",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  minHeight: 200,
                  boxShadow: "0 24px 36px -24px oklch(0.10 0.008 50 / 0.5)",
                }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 999,
                    background: "oklch(0.94 0.03 80 / 0.1)",
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    marginBottom: 4,
                  }}>
                    <FeatIcon kind={f.icon} color="var(--crema)" />
                  </div>
                  <h3 style={{
                    fontFamily: "var(--serif)",
                    fontWeight: 600,
                    fontSize: 22,
                    lineHeight: 1.1,
                    margin: 0,
                    whiteSpace: "pre-line",
                    textTransform: "uppercase",
                    letterSpacing: "0.01em",
                  }}>
                    {f.title}
                  </h3>
                  <p style={{
                    fontSize: 13,
                    lineHeight: 1.55,
                    color: "oklch(0.94 0.03 80 / 0.78)",
                    margin: 0,
                  }}>
                    {f.blurb}
                  </p>
                  <span style={{
                    marginTop: "auto",
                    fontFamily: "var(--mono)",
                    fontSize: 10.5,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: "var(--terracota-soft)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    paddingTop: 8,
                  }}>
                    Conocer más <Arrow size={12} />
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 1000px) {
          .feat-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 520px) {
          .feat-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

window.FeatureGridSection = FeatureGridSection;
