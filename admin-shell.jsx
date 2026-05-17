/* global React, ReactDOM, LaCabanaStore */

/* ============================================================
   ADMIN — La Cabaña
   ------------------------------------------------------------
   Entrada: ?admin=1
   Auth temporal (localStorage). Cuando conectemos Firebase Auth
   se cambia el componente Login por signIn de Firebase.
   ============================================================ */

const { useState: useStateA, useEffect: useEffectA, useMemo: useMemoA } = React;

const ADMIN_PASSWORD = "lacabana"; // temporal — se reemplaza por Firebase Auth

function isAdminRoute() {
  const params = new URLSearchParams(window.location.search);
  return params.has("admin") || window.location.pathname.endsWith("/admin");
}

function AdminApp() {
  const [authed, setAuthed] = useStateA(() => sessionStorage.getItem("lc_admin") === "1");
  const [tab, setTab] = useStateA(() => localStorage.getItem("lc_admin_tab") || "sitio");
  const [savedAt, setSavedAt] = useStateA("");

  useEffectA(() => {
    localStorage.setItem("lc_admin_tab", tab);
  }, [tab]);

  // Toast on save
  useEffectA(() => {
    return LaCabanaStore.subscribe(() => {
      const ts = new Date().toLocaleTimeString();
      setSavedAt(ts);
    });
  }, []);

  if (!authed) {
    return <AdminLogin onAuthed={() => setAuthed(true)} />;
  }

  const TABS = [
    { id: "sitio",     label: "Sitio",     icon: "⚙" },
    { id: "galeria",   label: "Galería",   icon: "📷" },
    { id: "bufet",     label: "Bufet",     icon: "🍴" },
    { id: "menu",      label: "Menú",      icon: "📜" },
    { id: "promos",    label: "Promos",    icon: "★" },
    { id: "panaderia", label: "Panadería", icon: "🥖" },
    { id: "eventos",   label: "Eventos",   icon: "♬" },
    { id: "takeout",   label: "Para llevar", icon: "📦" },
    { id: "backup",    label: "Respaldo",  icon: "↓" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--crema)", color: "var(--espresso)" }}>
      <AdminHeader savedAt={savedAt} />
      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", minHeight: "calc(100vh - 64px)" }} className="admin-grid">
        <aside style={{
          background: "var(--espresso)",
          color: "var(--crema)",
          padding: "20px 0",
        }} className="admin-side">
          <nav>
            {TABS.map(t => (
              <button key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  width: "100%", textAlign: "left",
                  padding: "14px 22px",
                  fontFamily: "var(--sans)",
                  fontSize: 14,
                  letterSpacing: "0.04em",
                  color: tab === t.id ? "var(--crema)" : "oklch(0.94 0.03 80 / 0.6)",
                  background: tab === t.id ? "oklch(0.94 0.03 80 / 0.08)" : "transparent",
                  borderLeft: tab === t.id ? "3px solid var(--terracota)" : "3px solid transparent",
                  transition: "all 0.2s ease",
                }}>
                <span style={{ width: 20, textAlign: "center" }}>{t.icon}</span>
                {t.label}
              </button>
            ))}
          </nav>
          <div style={{ padding: "24px 22px", marginTop: 20, borderTop: "1px solid oklch(0.94 0.03 80 / 0.1)" }}>
            <a href="./La Cabaña.html"
              style={{ color: "var(--terracota-soft)", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "var(--mono)" }}>
              ← Ver sitio
            </a>
          </div>
        </aside>
        <main style={{ padding: "32px clamp(20px, 4vw, 56px)", overflowX: "auto" }}>
          {tab === "sitio"     && <TabSitio />}
          {tab === "galeria"   && <TabGaleria />}
          {tab === "bufet"     && <TabBufet />}
          {tab === "menu"      && <TabMenu />}
          {tab === "promos"    && <TabPromos />}
          {tab === "panaderia" && <TabPanaderia />}
          {tab === "eventos"   && <TabEventos />}
          {tab === "takeout"   && <TabTakeout />}
          {tab === "backup"    && <TabBackup />}
        </main>
      </div>
      <style>{`
        @media (max-width: 760px) {
          .admin-grid { grid-template-columns: 1fr !important; }
          .admin-side { padding: 8px 0 !important; }
          .admin-side nav { display: flex; overflow-x: auto; }
          .admin-side nav button { white-space: nowrap; padding: 10px 14px !important; border-left: none !important; border-bottom: 3px solid transparent; }
        }
        input, textarea, select {
          font-family: var(--sans);
          font-size: 14px;
          padding: 10px 12px;
          border: 1px solid oklch(0.30 0.02 40 / 0.2);
          border-radius: 4px;
          background: white;
          color: var(--espresso);
          width: 100%;
          box-sizing: border-box;
        }
        input:focus, textarea:focus, select:focus {
          outline: none;
          border-color: var(--terracota);
          box-shadow: 0 0 0 3px oklch(0.58 0.13 38 / 0.15);
        }
        label.field {
          display: block;
          font-family: var(--mono);
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: oklch(0.30 0.02 40 / 0.7);
          margin-bottom: 6px;
        }
        .card {
          background: white;
          border: 1px solid oklch(0.30 0.02 40 / 0.1);
          border-radius: 6px;
          padding: 22px;
          margin-bottom: 18px;
        }
        .card h3 {
          font-family: var(--serif);
          font-size: 22px;
          margin: 0 0 18px;
          color: var(--espresso);
        }
        .row { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
        .row-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
        @media (max-width: 640px) {
          .row, .row-3 { grid-template-columns: 1fr !important; }
        }
        .btn-admin {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: var(--terracota);
          color: var(--crema);
          border-radius: 999px;
          font-family: var(--sans);
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          cursor: pointer;
          border: none;
          transition: transform 0.2s ease, background 0.2s ease;
        }
        .btn-admin:hover { transform: translateY(-1px); background: var(--terracota-deep); }
        .btn-admin--ghost { background: transparent; color: var(--espresso); border: 1px solid oklch(0.30 0.02 40 / 0.3); }
        .btn-admin--ghost:hover { background: var(--espresso); color: var(--crema); }
        .btn-admin--danger { background: oklch(0.50 0.18 25); }
      `}</style>
    </div>
  );
}

function AdminLogin({ onAuthed }) {
  const [pw, setPw] = useStateA("");
  const [err, setErr] = useStateA("");
  const submit = (e) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem("lc_admin", "1");
      onAuthed();
    } else {
      setErr("Contraseña incorrecta");
    }
  };
  return (
    <div style={{
      minHeight: "100vh",
      display: "grid",
      placeItems: "center",
      background: "var(--negro-mate)",
      padding: 20,
    }}>
      <form onSubmit={submit} style={{
        background: "var(--crema)",
        color: "var(--espresso)",
        padding: "40px 36px",
        borderRadius: 6,
        width: "min(380px, 100%)",
        boxShadow: "0 30px 60px -20px oklch(0.10 0.008 50 / 0.6)",
      }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.24em", textTransform: "uppercase", color: "var(--terracota)", marginBottom: 8 }}>
          La Cabaña · Admin
        </div>
        <h1 style={{ fontFamily: "var(--serif)", fontSize: 32, margin: "0 0 22px", fontWeight: 500 }}>Iniciar sesión</h1>
        <label className="field">Contraseña</label>
        <input type="password" value={pw} onChange={e => { setPw(e.target.value); setErr(""); }} autoFocus />
        {err && <div style={{ color: "var(--rojo-quemado)", fontSize: 13, marginTop: 8 }}>{err}</div>}
        <button type="submit" className="btn-admin" style={{ marginTop: 18, width: "100%", justifyContent: "center" }}>
          Entrar
        </button>
        <div style={{ marginTop: 18, fontSize: 12, color: "oklch(0.30 0.02 40 / 0.6)" }}>
          Contraseña inicial: <code>lacabana</code>. Cuando conectemos Firebase será tu correo.
        </div>
      </form>
    </div>
  );
}

function AdminHeader({ savedAt }) {
  return (
    <header style={{
      height: 64,
      background: "var(--negro-mate)",
      color: "var(--crema)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 clamp(20px, 4vw, 32px)",
      borderBottom: "1px solid oklch(0.94 0.03 80 / 0.08)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 500 }}>
          La <em style={{ color: "var(--terracota-soft)", fontStyle: "italic" }}>Cabaña</em>
          <span style={{ marginLeft: 12, fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.22em", color: "oklch(0.94 0.03 80 / 0.5)" }}>
            ADMIN · v1.0
          </span>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {savedAt && (
          <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "oklch(0.94 0.03 80 / 0.6)" }}>
            Guardado · {savedAt}
          </span>
        )}
        <button onClick={() => { sessionStorage.removeItem("lc_admin"); location.reload(); }}
          style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "oklch(0.94 0.03 80 / 0.7)" }}>
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}

/* ---------- Hook: state synced to store ---------- */
function useStoreState() {
  const [snap, setSnap] = useStateA(() => LaCabanaStore.get());
  useEffectA(() => LaCabanaStore.subscribe(s => setSnap({ ...s })), []);
  return snap;
}

window.AdminApp = AdminApp;
window.useStoreState = useStoreState;
window.isAdminRoute = isAdminRoute;
