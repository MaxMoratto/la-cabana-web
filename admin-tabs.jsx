/* global React, LaCabanaStore, useStoreState */

const { useState: useStateT, useEffect: useEffectT, useRef: useRefT, useCallback: useCallbackT } = React;

/* ============================================================
   Shared widgets
   ============================================================ */

function Field({ label, value, onChange, placeholder, type = "text", textarea, rows = 3 }) {
  const Tag = textarea ? "textarea" : "input";
  return (
    <div style={{ marginBottom: 12 }}>
      <label className="field">{label}</label>
      <Tag
        type={type}
        value={value || ""}
        rows={textarea ? rows : undefined}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function ImageDrop({ value, onChange, idHint, height = 180, label = "Arrastra una imagen o haz clic" }) {
  const [over, setOver] = useStateT(false);
  const [busy, setBusy] = useStateT(false);
  const inputRef = useRefT(null);
  const resolved = LaCabanaStore.resolveImage(value);

  const handleFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Solo imágenes (JPG, PNG, WEBP).");
      return;
    }
    if (file.size > 6 * 1024 * 1024) {
      const ok = confirm("La imagen pesa más de 6 MB. Puede llenar el navegador. ¿Subir igual? (Recomendación: comprime antes en tinypng.com)");
      if (!ok) return;
    }
    setBusy(true);
    try {
      const id = await LaCabanaStore.uploadImage(file, idHint ? `${idHint}_${Date.now()}` : null);
      onChange(id);
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault(); setOver(false);
        const f = e.dataTransfer.files[0];
        handleFile(f);
      }}
      onClick={() => inputRef.current?.click()}
      style={{
        position: "relative",
        height,
        border: over ? "2px dashed var(--terracota)" : "2px dashed oklch(0.30 0.02 40 / 0.25)",
        borderRadius: 6,
        background: resolved ? `center/cover no-repeat url("${resolved}")` : "oklch(0.94 0.022 80)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "border 0.2s ease",
        overflow: "hidden",
      }}
    >
      <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }}
        onChange={(e) => handleFile(e.target.files[0])} />
      {!resolved && (
        <div style={{ textAlign: "center", color: "oklch(0.30 0.02 40 / 0.65)", fontSize: 13, padding: 12 }}>
          {busy ? "Subiendo..." : label}
        </div>
      )}
      {resolved && (
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, transparent 50%, oklch(0.10 0.008 50 / 0.7))",
          display: "flex", alignItems: "flex-end", justifyContent: "space-between",
          padding: 12,
        }}>
          <span style={{ color: "white", fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase" }}>
            {busy ? "Subiendo..." : "Arrastra otra para reemplazar"}
          </span>
          <button onClick={(e) => { e.stopPropagation(); onChange(""); }}
            style={{ color: "white", fontSize: 11, padding: "4px 10px", background: "oklch(0.50 0.18 25 / 0.8)", borderRadius: 999 }}>
            Quitar
          </button>
        </div>
      )}
    </div>
  );
}

function SectionHeader({ title, subtitle, action }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 22, gap: 20, flexWrap: "wrap" }}>
      <div>
        <h2 style={{ fontFamily: "var(--serif)", fontSize: 36, margin: 0, fontWeight: 600 }}>{title}</h2>
        {subtitle && <p style={{ margin: "6px 0 0", color: "oklch(0.30 0.02 40 / 0.7)" }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

/* ============================================================
   TAB · Sitio
   ============================================================ */
function TabSitio() {
  const state = useStoreState();
  const site = state.site;
  const hours = state.hours;

  const update = (k, v) => LaCabanaStore.set(`site.${k}`, v);
  const updateSocial = (k, v) => LaCabanaStore.set(`site.social.${k}`, v);
  const updateHour = (i, k, v) => {
    const next = hours.map((h, idx) => idx === i ? { ...h, [k]: v } : h);
    LaCabanaStore.set("hours", next);
  };

  return (
    <div>
      <SectionHeader title="Sitio" subtitle="Datos de contacto, dirección, horarios, redes sociales." />

      <div className="card">
        <h3>Contacto</h3>
        <div className="row">
          <Field label="Nombre del restaurante" value={site.name} onChange={(v) => update("name", v)} />
          <Field label="Subtítulo / categoría" value={site.tagline} onChange={(v) => update("tagline", v)} />
        </div>
        <div className="row-3">
          <Field label="Teléfono mostrado" value={site.phoneDisplay} onChange={(v) => update("phoneDisplay", v)} placeholder="+52 55 5115 7248" />
          <Field label="Teléfono (sin espacios, para llamar)" value={site.phone} onChange={(v) => update("phone", v)} placeholder="+525551157248" />
          <Field label="WhatsApp (formato wa.me)" value={site.whatsapp} onChange={(v) => update("whatsapp", v)} placeholder="5215551157248" />
        </div>
      </div>

      <div className="card">
        <h3>Dirección</h3>
        <Field label="Dirección completa" value={site.address} textarea onChange={(v) => update("address", v)} />
        <div className="row">
          <Field label="Dirección corta (para nav/footer)" value={site.addressShort} onChange={(v) => update("addressShort", v)} />
          <Field label="Referencia" value={site.reference} onChange={(v) => update("reference", v)} />
        </div>
      </div>

      <div className="card">
        <h3>Horarios</h3>
        <p style={{ marginTop: -10, color: "oklch(0.30 0.02 40 / 0.65)", fontSize: 13 }}>
          Pon "Cerrado" en el horario para marcar un día cerrado.
        </p>
        {hours.map((h, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "120px 1fr auto", gap: 12, alignItems: "center", marginBottom: 8 }}>
            <input value={h.d} onChange={e => updateHour(i, "d", e.target.value)} style={{ fontWeight: 600 }} />
            <input value={h.h} onChange={e => updateHour(i, "h", e.target.value)} placeholder="8:00 — 22:00" />
            <label style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
              <input type="checkbox" checked={!!h.buffet} onChange={e => updateHour(i, "buffet", e.target.checked)} style={{ width: "auto" }} />
              Bufet
            </label>
          </div>
        ))}
      </div>

      <div className="card">
        <h3>Redes y enlaces externos</h3>
        <div className="row">
          <Field label="Instagram (url)" value={site.social?.instagram} onChange={(v) => updateSocial("instagram", v)} placeholder="https://instagram.com/lacabana" />
          <Field label="Facebook (url)" value={site.social?.facebook} onChange={(v) => updateSocial("facebook", v)} />
        </div>
        <div className="row">
          <Field label="TikTok (url)" value={site.social?.tiktok} onChange={(v) => updateSocial("tiktok", v)} />
          <Field label="Rappi (url del restaurante)" value={site.rappiUrl} onChange={(v) => update("rappiUrl", v)} />
        </div>
        <Field label="PDF del menú (url para descarga)" value={site.menuPdfUrl} onChange={(v) => update("menuPdfUrl", v)} />
      </div>
    </div>
  );
}

/* ============================================================
   TAB · Galería
   ============================================================ */
function TabGaleria() {
  const state = useStoreState();
  const images = state.images;

  const updateSlot = (slot, value) => LaCabanaStore.set(`images.${slot}`, value);

  const SLOTS = [
    { key: "hero",   title: "Fachada / Hero",     hint: "Foto principal nocturna" },
    { key: "buffet", title: "Banner del Bufet",   hint: "Foto general del bufet (con título estampado)" },
    { key: "wood",   title: "Textura de madera",  hint: "Tile que se repite en secciones café" },
  ];

  const uploaded = LaCabanaStore.listImages();

  return (
    <div>
      <SectionHeader title="Galería" subtitle="Arrastra cualquier imagen al cuadro para reemplazarla. Se aplica al sitio al instante." />

      <div className="card">
        <h3>Imágenes principales del sitio</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 18 }}>
          {SLOTS.map(s => (
            <div key={s.key}>
              <div style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 6, color: "oklch(0.30 0.02 40 / 0.7)" }}>
                {s.title}
              </div>
              <ImageDrop value={images[s.key]} onChange={(v) => updateSlot(s.key, v)} idHint={s.key} height={200} />
              <div style={{ fontSize: 11, color: "oklch(0.30 0.02 40 / 0.55)", marginTop: 6 }}>{s.hint}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>Banco de imágenes subidas</h3>
        <p style={{ marginTop: -10, color: "oklch(0.30 0.02 40 / 0.65)", fontSize: 13 }}>
          Todas las imágenes que has subido. Puedes borrarlas si ya no se usan.
        </p>
        {Object.keys(uploaded).length === 0 ? (
          <div style={{ padding: 30, textAlign: "center", color: "oklch(0.30 0.02 40 / 0.5)", fontStyle: "italic" }}>
            Aún no hay imágenes subidas. Arrastra archivos arriba.
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 12 }}>
            {Object.entries(uploaded).map(([id, dataUrl]) => (
              <div key={id} style={{ position: "relative", aspectRatio: "1", borderRadius: 4, overflow: "hidden", background: `center/cover url("${dataUrl}")` }}>
                <button
                  onClick={() => { if (confirm("¿Borrar esta imagen?")) LaCabanaStore.deleteImage(id); }}
                  style={{ position: "absolute", top: 6, right: 6, background: "oklch(0.10 0.008 50 / 0.7)", color: "white", fontSize: 10, padding: "4px 8px", borderRadius: 999 }}>
                  Borrar
                </button>
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "4px 8px", background: "oklch(0.10 0.008 50 / 0.7)", color: "white", fontFamily: "var(--mono)", fontSize: 9, letterSpacing: "0.12em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {id}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   TAB · Bufet
   ============================================================ */
function TabBufet() {
  const state = useStoreState();
  const bufet = state.buffet;

  const upd = (path, v) => LaCabanaStore.set(`buffet.${path}`, v);

  const updateStation = (i, k, v) => {
    const next = bufet.stations.map((s, idx) => idx === i ? { ...s, [k]: v } : s);
    upd("stations", next);
  };
  const updateStationItem = (sIdx, iIdx, value) => {
    const next = bufet.stations.map((s, idx) => {
      if (idx !== sIdx) return s;
      const items = s.items.slice();
      items[iIdx] = value;
      return { ...s, items };
    });
    upd("stations", next);
  };
  const addItem = (sIdx) => {
    const next = bufet.stations.map((s, idx) => idx === sIdx ? { ...s, items: [...s.items, "Nuevo platillo"] } : s);
    upd("stations", next);
  };
  const removeItem = (sIdx, iIdx) => {
    const next = bufet.stations.map((s, idx) => idx === sIdx ? { ...s, items: s.items.filter((_, j) => j !== iIdx) } : s);
    upd("stations", next);
  };

  return (
    <div>
      <SectionHeader title="Bufet" subtitle="Edita las 6 estaciones del bufet de fin de semana. Cambios aplican al instante." />

      <div className="card">
        <h3>Datos generales</h3>
        <div className="row-3">
          <Field label="Horario" value={bufet.schedule} onChange={(v) => upd("schedule", v)} placeholder="Sábado y Domingo · 13:00 — 18:00" />
          <Field label="Precio adulto ($)" value={bufet.priceAdult} type="number" onChange={(v) => upd("priceAdult", Number(v))} />
          <Field label="Precio niños 6-12 ($)" value={bufet.priceChild} type="number" onChange={(v) => upd("priceChild", Number(v))} />
        </div>
        <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, fontSize: 13 }}>
          <input type="checkbox" checked={!!bufet.priceConfirmed} onChange={e => upd("priceConfirmed", e.target.checked)} style={{ width: "auto" }} />
          Precios confirmados (quita la etiqueta "a confirmar")
        </label>
      </div>

      {bufet.stations.map((s, i) => (
        <div key={s.id} className="card">
          <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 22 }} className="row">
            <div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.2em", color: "var(--terracota)", marginBottom: 6 }}>
                ESTACIÓN {s.n}
              </div>
              <ImageDrop value={s.image} onChange={(v) => updateStation(i, "image", v)} idHint={`bufet_${s.id}`} height={200} label="Foto de la estación" />
              <div style={{ marginTop: 10 }}>
                <label className="field">Encuadre vertical (top/center/bottom)</label>
                <input value={s.imagePosition || "center"} onChange={e => updateStation(i, "imagePosition", e.target.value)} placeholder="center 45%" />
              </div>
            </div>
            <div>
              <Field label="Nombre" value={s.name} onChange={v => updateStation(i, "name", v)} />
              <div style={{ marginTop: 10 }}>
                <label className="field">Platillos</label>
                {s.items.map((it, j) => (
                  <div key={j} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                    <input value={it} onChange={e => updateStationItem(i, j, e.target.value)} />
                    <button onClick={() => removeItem(i, j)} className="btn-admin btn-admin--ghost" style={{ padding: "6px 12px", fontSize: 11 }}>×</button>
                  </div>
                ))}
                <button onClick={() => addItem(i)} className="btn-admin btn-admin--ghost" style={{ marginTop: 4 }}>+ Agregar platillo</button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   TAB · Menú
   ============================================================ */
function TabMenu() {
  const state = useStoreState();
  const cats = state.menu.categories;
  const [activeCat, setActiveCat] = useStateT(cats[0]?.id || "");

  const upd = (newCats) => LaCabanaStore.set("menu.categories", newCats);

  const addItem = (catId) => {
    const next = cats.map(c => c.id === catId ? { ...c, items: [...c.items, { id: `item_${Date.now()}`, name: "Nuevo platillo", price: 0, desc: "", image: "", tag: "" }] } : c);
    upd(next);
  };
  const updateItem = (catId, itemId, key, value) => {
    const next = cats.map(c => c.id !== catId ? c : { ...c, items: c.items.map(it => it.id === itemId ? { ...it, [key]: value } : it) });
    upd(next);
  };
  const removeItem = (catId, itemId) => {
    const next = cats.map(c => c.id !== catId ? c : { ...c, items: c.items.filter(it => it.id !== itemId) });
    upd(next);
  };

  const cat = cats.find(c => c.id === activeCat) || cats[0];

  return (
    <div>
      <SectionHeader title="Menú" subtitle="Agrega y edita platillos por categoría. Precio en pesos, foto opcional." />

      <div className="card" style={{ padding: 12 }}>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {cats.map(c => (
            <button key={c.id} onClick={() => setActiveCat(c.id)}
              className={c.id === activeCat ? "btn-admin" : "btn-admin btn-admin--ghost"}
              style={{ padding: "8px 14px", fontSize: 12 }}>
              {c.name} <span style={{ opacity: 0.6, marginLeft: 6 }}>· {c.items.length}</span>
            </button>
          ))}
        </div>
      </div>

      {cat && (
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <h3 style={{ margin: 0 }}>{cat.name}</h3>
            <button onClick={() => addItem(cat.id)} className="btn-admin">+ Agregar platillo</button>
          </div>

          {cat.items.length === 0 ? (
            <div style={{ padding: 30, textAlign: "center", color: "oklch(0.30 0.02 40 / 0.5)", fontStyle: "italic" }}>
              Sin platillos. Haz clic en "Agregar platillo" para empezar.
            </div>
          ) : (
            cat.items.map(it => (
              <div key={it.id} style={{
                display: "grid", gridTemplateColumns: "160px 1fr auto", gap: 16,
                padding: "14px 0", borderTop: "1px solid oklch(0.30 0.02 40 / 0.08)",
              }} className="row">
                <ImageDrop value={it.image} onChange={(v) => updateItem(cat.id, it.id, "image", v)} idHint={`menu_${cat.id}_${it.id}`} height={130} label="Foto" />
                <div>
                  <div className="row">
                    <Field label="Nombre" value={it.name} onChange={v => updateItem(cat.id, it.id, "name", v)} />
                    <Field label="Precio ($)" type="number" value={it.price} onChange={v => updateItem(cat.id, it.id, "price", Number(v))} />
                  </div>
                  <Field label="Descripción" value={it.desc} textarea rows={2} onChange={v => updateItem(cat.id, it.id, "desc", v)} />
                  <Field label="Etiqueta (opcional: nuevo · favorito · vegetariano)" value={it.tag} onChange={v => updateItem(cat.id, it.id, "tag", v)} />
                </div>
                <button onClick={() => { if (confirm("¿Borrar este platillo?")) removeItem(cat.id, it.id); }}
                  className="btn-admin btn-admin--danger" style={{ alignSelf: "start", padding: "6px 12px", fontSize: 11 }}>
                  Borrar
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   TAB · Promos / Panadería / Eventos — patrón compartido
   ============================================================ */
function CrudListTab({ title, subtitle, path, fields, addLabel = "+ Agregar" }) {
  const state = useStoreState();
  const items = (path.split(".").reduce((o, k) => o?.[k], state)) || [];

  const setPath = (next) => LaCabanaStore.set(path, next);
  const add = () => {
    const blank = { id: `${path}_${Date.now()}` };
    fields.forEach(f => { blank[f.key] = f.type === "number" ? 0 : ""; });
    setPath([...items, blank]);
  };
  const update = (id, key, value) => setPath(items.map(it => it.id === id ? { ...it, [key]: value } : it));
  const remove = (id) => setPath(items.filter(it => it.id !== id));

  return (
    <div>
      <SectionHeader title={title} subtitle={subtitle} action={<button onClick={add} className="btn-admin">{addLabel}</button>} />
      {items.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: 40, color: "oklch(0.30 0.02 40 / 0.5)", fontStyle: "italic" }}>
          Nada por aquí. Haz clic en "{addLabel}".
        </div>
      ) : items.map(it => (
        <div key={it.id} className="card">
          <div style={{ display: "grid", gridTemplateColumns: fields.some(f => f.type === "image") ? "180px 1fr auto" : "1fr auto", gap: 16 }} className="row">
            {fields.filter(f => f.type === "image").map(f => (
              <ImageDrop key={f.key} value={it[f.key]} onChange={(v) => update(it.id, f.key, v)} idHint={`${path}_${it.id}`} height={150} />
            ))}
            <div>
              {fields.filter(f => f.type !== "image").map(f => (
                <Field key={f.key}
                  label={f.label}
                  value={it[f.key]}
                  type={f.type === "number" ? "number" : "text"}
                  textarea={f.type === "textarea"}
                  onChange={v => update(it.id, f.key, f.type === "number" ? Number(v) : v)}
                />
              ))}
            </div>
            <button onClick={() => { if (confirm("¿Borrar?")) remove(it.id); }}
              className="btn-admin btn-admin--danger" style={{ alignSelf: "start", padding: "6px 12px", fontSize: 11 }}>×</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function TabPromos() {
  return <CrudListTab
    title="Promociones"
    subtitle="Banners y promociones de temporada (chiles en nogada, pan de muerto, etc.)"
    path="promos"
    addLabel="+ Nueva promo"
    fields={[
      { key: "image", label: "Foto", type: "image" },
      { key: "title", label: "Título", type: "text" },
      { key: "subtitle", label: "Subtítulo", type: "text" },
      { key: "desc", label: "Descripción", type: "textarea" },
      { key: "dates", label: "Vigencia (texto libre)", type: "text" },
    ]} />;
}

function TabPanaderia() {
  return <CrudListTab
    title="Panadería"
    subtitle="Productos de la panadería artesanal."
    path="panaderia"
    addLabel="+ Nuevo producto"
    fields={[
      { key: "image", label: "Foto", type: "image" },
      { key: "name", label: "Nombre", type: "text" },
      { key: "price", label: "Precio ($)", type: "number" },
      { key: "desc", label: "Descripción", type: "textarea" },
    ]} />;
}

function TabEventos() {
  return <CrudListTab
    title="Eventos"
    subtitle="Música en vivo, eventos especiales, ocasiones temáticas."
    path="eventos"
    addLabel="+ Nuevo evento"
    fields={[
      { key: "image", label: "Foto", type: "image" },
      { key: "title", label: "Título", type: "text" },
      { key: "day", label: "Día / fecha", type: "text" },
      { key: "time", label: "Hora", type: "text" },
      { key: "desc", label: "Descripción", type: "textarea" },
    ]} />;
}

/* ============================================================
   TAB · Para llevar (takeout)
   ============================================================ */
function TabTakeout() {
  const state = useStoreState();
  const takeout = state.takeout || { enabled: false, items: [] };

  const upd = (path, v) => LaCabanaStore.set(`takeout.${path}`, v);
  const addItem = () => upd("items", [...takeout.items, { id: `to_${Date.now()}`, name: "Nuevo platillo", price: 0, desc: "", image: "", available: true }]);
  const updateItem = (id, k, v) => upd("items", takeout.items.map(it => it.id === id ? { ...it, [k]: v } : it));
  const removeItem = (id) => upd("items", takeout.items.filter(it => it.id !== id));

  return (
    <div>
      <SectionHeader
        title="Comida para llevar"
        subtitle="Menú reducido para pedidos por WhatsApp. Cuando alguien pide, llega un mensaje a tu número con el pedido pre-llenado."
        action={<button onClick={addItem} className="btn-admin">+ Agregar platillo</button>}
      />

      <div className="card">
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}>
          <input type="checkbox" checked={!!takeout.enabled} onChange={e => upd("enabled", e.target.checked)} style={{ width: "auto" }} />
          <strong>Pedidos para llevar activos hoy</strong>
        </label>
        <p style={{ marginTop: 8, color: "oklch(0.30 0.02 40 / 0.7)", fontSize: 13 }}>
          Desactiva esto si la cocina está saturada. El carrito desaparece del sitio.
        </p>
      </div>

      {takeout.items.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: 40, color: "oklch(0.30 0.02 40 / 0.5)", fontStyle: "italic" }}>
          Agrega los platillos disponibles para llevar.
        </div>
      ) : takeout.items.map(it => (
        <div key={it.id} className="card">
          <div style={{ display: "grid", gridTemplateColumns: "180px 1fr auto", gap: 16 }} className="row">
            <ImageDrop value={it.image} onChange={(v) => updateItem(it.id, "image", v)} idHint={`takeout_${it.id}`} height={130} />
            <div>
              <div className="row">
                <Field label="Nombre" value={it.name} onChange={v => updateItem(it.id, "name", v)} />
                <Field label="Precio ($)" type="number" value={it.price} onChange={v => updateItem(it.id, "price", Number(v))} />
              </div>
              <Field label="Descripción" value={it.desc} textarea rows={2} onChange={v => updateItem(it.id, "desc", v)} />
              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, marginTop: 6 }}>
                <input type="checkbox" checked={it.available !== false} onChange={e => updateItem(it.id, "available", e.target.checked)} style={{ width: "auto" }} />
                Disponible hoy
              </label>
            </div>
            <button onClick={() => { if (confirm("¿Borrar?")) removeItem(it.id); }}
              className="btn-admin btn-admin--danger" style={{ alignSelf: "start", padding: "6px 12px", fontSize: 11 }}>×</button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   TAB · Backup (export/import)
   ============================================================ */
function TabBackup() {
  const fileRef = useRefT(null);
  const importFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (!confirm("Esto reemplazará TODO el contenido del sitio con el archivo. ¿Continuar?")) return;
        LaCabanaStore.importAll(data);
        alert("Contenido importado.");
      } catch (e) {
        alert("Archivo inválido.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <SectionHeader title="Respaldo" subtitle="Exporta todo el contenido (textos + imágenes) como archivo. Útil para mover el sitio o restaurar." />

      <div className="card">
        <h3>Descargar respaldo</h3>
        <p style={{ color: "oklch(0.30 0.02 40 / 0.7)" }}>Baja un archivo JSON con todo el contenido del sitio y las imágenes en base64.</p>
        <button onClick={() => LaCabanaStore.downloadBackup()} className="btn-admin">Descargar respaldo</button>
      </div>

      <div className="card">
        <h3>Importar respaldo</h3>
        <p style={{ color: "oklch(0.30 0.02 40 / 0.7)" }}>Sube un archivo de respaldo para restaurar todo. Sobrescribe el contenido actual.</p>
        <input type="file" accept="application/json" ref={fileRef} onChange={importFile} />
      </div>

      <div className="card">
        <h3>Reiniciar a contenido original</h3>
        <p style={{ color: "oklch(0.30 0.02 40 / 0.7)" }}>Borra todos tus cambios y vuelve al contenido inicial sembrado.</p>
        <button onClick={() => { if (confirm("¿SEGURO? Esto borra todos tus cambios.")) LaCabanaStore.reset(); }}
          className="btn-admin btn-admin--danger">Reiniciar contenido</button>
      </div>
    </div>
  );
}

Object.assign(window, { TabSitio, TabGaleria, TabBufet, TabMenu, TabPromos, TabPanaderia, TabEventos, TabTakeout, TabBackup });
