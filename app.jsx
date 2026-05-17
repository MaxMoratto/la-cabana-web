/* global React, ReactDOM,
   Nav, Hero, PromosSection, BuffetSection, CartaSection,
   PanaderiaSection, EventosSection, ReservaSection, Footer, Toast,
   useTweaks, TweaksPanel, TweakSection, TweakSlider, TweakToggle, TweakRadio, TweakColor */

const { useState: useStateApp, useCallback: useCallbackApp, useEffect: useEffectApp } = React;

/* ============================================================
   LA CABAÑA — App root
   ============================================================ */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#B8553A",
  "embers": true,
  "grain": true,
  "displayFont": "Playfair Display"
}/*EDITMODE-END*/;

function App() {
  const [toast, setToast] = useStateApp("");
  const [t, setT] = useTweaks(TWEAK_DEFAULTS);

  const onToast = useCallbackApp((msg) => setToast(msg), []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  // Apply tweaks to CSS vars
  useEffectApp(() => {
    const root = document.documentElement;
    // Convert hex to oklch-ish via CSS color-mix or just set the var directly as hex (oklch supports hex via color())
    root.style.setProperty("--terracota", t.accent);
    root.style.setProperty("--terracota-soft", `color-mix(in oklab, ${t.accent} 75%, var(--crema))`);
    root.style.setProperty("--terracota-deep", `color-mix(in oklab, ${t.accent} 70%, black)`);

    // Display font
    const fontMap = {
      "Playfair Display": '"Playfair Display", Georgia, serif',
      "Cormorant Garamond": '"Cormorant Garamond", Georgia, serif',
      "DM Serif Display": '"DM Serif Display", Georgia, serif',
    };
    root.style.setProperty("--serif", fontMap[t.displayFont] || fontMap["Playfair Display"]);

    // Grain
    document.querySelectorAll(".grain").forEach((el) => {
      el.style.setProperty("--grain-opacity", t.grain ? "0.18" : "0");
    });
  }, [t.accent, t.displayFont, t.grain]);

  return (
    <>
      <Nav onReserve={() => scrollTo("reservar")} />
      <Hero
        onMenu={() => scrollTo("carta")}
        onPromos={() => scrollTo("promociones")}
        onLocation={() => scrollTo("ubicacion")}
        onReserve={() => scrollTo("reservar")}
      />
      <FeatureGridSection />
      <PromosSection onReserve={() => scrollTo("reservar")} />
      <BuffetSection />
      <AmenityStrip />
      <CartaSection />
      <PanaderiaSection />
      <EventosSection />
      <UbicacionSection />
      <ReservaSection onToast={onToast} />
      <Footer />
      <Toast message={toast} onDone={() => setToast("")} />

      <TweaksPanel title="Tweaks · La Cabaña">
        <TweakSection title="Color de marca">
          <TweakColor
            label="Acento (terracota)"
            value={t.accent}
            onChange={(v) => setT("accent", v)}
            options={["#B8553A", "#8B2E1F", "#C97A52", "#6B7239", "#5C3A28"]}
          />
        </TweakSection>
        <TweakSection title="Tipografía de display">
          <TweakRadio
            label="Familia"
            value={t.displayFont}
            onChange={(v) => setT("displayFont", v)}
            options={["Playfair Display", "Cormorant Garamond", "DM Serif Display"]}
          />
        </TweakSection>
        <TweakSection title="Atmósfera">
          <TweakToggle label="Brasas flotantes en hero" value={t.embers} onChange={(v) => setT("embers", v)} />
          <TweakToggle label="Grano cinematográfico" value={t.grain} onChange={(v) => setT("grain", v)} />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
const _isAdmin = (() => {
  try {
    const params = new URLSearchParams(window.location.search);
    return params.has("admin") || window.location.pathname.endsWith("/admin");
  } catch (e) { return false; }
})();

if (_isAdmin && window.AdminApp) {
  document.title = "Admin · La Cabaña";
  const AdminApp = window.AdminApp;
  root.render(<AdminApp />);
} else if (_isAdmin) {
  // Admin requested but admin scripts didn't load — show a friendly error
  root.render(
    <div style={{ padding: 40, fontFamily: "system-ui, sans-serif", background: "#1a1816", color: "#f5ede0", minHeight: "100vh" }}>
      <h1 style={{ fontFamily: "serif", color: "#d49174" }}>Admin no cargó</h1>
      <p>Los scripts del admin no se cargaron. Posibles causas:</p>
      <ul>
        <li>El navegador cacheó la versión vieja del HTML. Abre el navegador en modo incógnito o limpia caché (Ctrl+Shift+Delete).</li>
        <li>Hay un error en un archivo .jsx. Abre las herramientas de desarrollo (F12) → pestaña Console → manda screenshot del error.</li>
      </ul>
      <p><a href="./La Cabaña.html" style={{ color: "#d49174" }}>← Volver al sitio</a></p>
    </div>
  );
} else {
  root.render(<App />);
}
