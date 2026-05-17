/* global React, Logo, Arrow */
const { useState: useStateNav, useEffect: useEffectNav } = React;

/* ============================================================
   NAV — Sticky top navigation with scroll-spy
   ============================================================ */

const NAV_LINKS = [
  { id: "promociones", label: "Promociones" },
  { id: "buffet",      label: "Bufet" },
  { id: "carta",       label: "Menú" },
  { id: "panaderia",   label: "Panadería" },
  { id: "eventos",     label: "Eventos" },
  { id: "ubicacion",   label: "Ubicación" },
  { id: "reservar",    label: "Reservar" },
];

function Nav({ onReserve }) {
  const [scrolled, setScrolled] = useStateNav(false);
  const [active, setActive] = useStateNav("");
  const [open, setOpen] = useStateNav(false);

  useEffectNav(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      // scroll spy
      let current = "";
      for (const link of NAV_LINKS) {
        const el = document.getElementById(link.id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= 120 && rect.bottom > 120) {
          current = link.id;
          break;
        }
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id) => (e) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
    setOpen(false);
  };

  return (
    <nav style={{
      position: "fixed",
      top: 0, left: 0, right: 0,
      zIndex: 100,
      transition: "background 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease, padding 0.3s ease",
      background: scrolled ? "oklch(0.16 0.012 50 / 0.85)" : "transparent",
      backdropFilter: scrolled ? "blur(14px) saturate(140%)" : "none",
      WebkitBackdropFilter: scrolled ? "blur(14px) saturate(140%)" : "none",
      borderBottom: scrolled ? "1px solid oklch(0.94 0.03 80 / 0.08)" : "1px solid transparent",
    }}>
      <div className="container" style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: scrolled ? "14px 0" : "22px 0",
        transition: "padding 0.3s ease",
      }}>
        <a href="#top" onClick={go("top")} aria-label="La Cabaña — inicio">
          <Logo size={38} />
        </a>

        <ul style={{
          listStyle: "none",
          margin: 0, padding: 0,
          display: "flex",
          gap: 4,
          alignItems: "center",
        }} className="nav-list">
          {NAV_LINKS.map((l) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                onClick={go(l.id)}
                style={{
                  position: "relative",
                  padding: "10px 14px",
                  fontSize: 13,
                  letterSpacing: "0.06em",
                  color: active === l.id ? "var(--terracota-soft)" : "oklch(0.94 0.03 80 / 0.78)",
                  transition: "color 0.2s ease",
                  display: "inline-block",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--crema)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = active === l.id ? "var(--terracota-soft)" : "oklch(0.94 0.03 80 / 0.78)")}
              >
                {l.label}
                {active === l.id && (
                  <span style={{
                    position: "absolute",
                    bottom: 2, left: 14, right: 14,
                    height: 1,
                    background: "var(--terracota-soft)",
                  }} />
                )}
              </a>
            </li>
          ))}
        </ul>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }} className="nav-cta">
          <a
            href="#reservar"
            onClick={go("reservar")}
            className="btn btn--primary"
            style={{ padding: "11px 20px", fontSize: 12 }}
          >
            Reservar Mesa <Arrow size={12} />
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          aria-label="Abrir menú"
          onClick={() => setOpen(!open)}
          className="nav-burger"
          style={{
            display: "none",
            width: 40, height: 40,
            borderRadius: 999,
            border: "1px solid oklch(0.94 0.03 80 / 0.25)",
            alignItems: "center", justifyContent: "center",
          }}
        >
          <svg width="16" height="12" viewBox="0 0 16 12" stroke="currentColor" strokeWidth="1.6">
            <path d="M0 1 H16 M0 6 H16 M0 11 H10" />
          </svg>
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div style={{
          background: "var(--negro-mate)",
          borderTop: "1px solid oklch(0.94 0.03 80 / 0.08)",
          padding: "12px 0",
        }}>
          <ul style={{ listStyle: "none", margin: 0, padding: "0 var(--gutter)" }}>
            {NAV_LINKS.map((l) => (
              <li key={l.id}>
                <a href={`#${l.id}`} onClick={go(l.id)}
                  style={{ display: "block", padding: "14px 0", fontSize: 18, fontFamily: "var(--serif)", borderBottom: "1px solid oklch(0.94 0.03 80 / 0.08)" }}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <style>{`
        @media (max-width: 980px) {
          .nav-list { display: none !important; }
          .nav-cta { display: none !important; }
          .nav-burger { display: inline-flex !important; }
        }
      `}</style>
    </nav>
  );
}

window.Nav = Nav;
