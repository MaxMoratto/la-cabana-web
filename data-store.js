/* ============================================================
   LA CABAÑA — Data Store
   ------------------------------------------------------------
   Abstracción sobre el backend de datos. Hoy usa localStorage.
   Cuando conectes Firebase, swap interno → resto del sitio
   no necesita cambiar.
   ============================================================ */

(function () {
  const KEY = "lacabana_content_v1";
  const IMG_KEY = "lacabana_images_v1";
  const listeners = new Set();

  /* ---------- Initial seed (current site content) ---------- */
  const SEED = {
    site: {
      name: "La Cabaña Social House",
      tagline: "Panadería, cafetería y restaurante con terraza",
      district: "Iztacalco",
      phone: "+525551157248",
      phoneDisplay: "+52 55 5115 7248",
      whatsapp: "5215551157248",
      address: "Sur 16 Núm. 233, Col. Agrícola Oriental, Iztacalco, 08500 CDMX",
      addressShort: "Sur 16 · Col. Agrícola Oriental",
      reference: "Frente al Mercado Agrícola Oriental",
      rappiUrl: "",
      menuPdfUrl: "",
      social: {
        instagram: "",
        facebook: "",
        tiktok: "",
      },
    },
    hours: [
      { d: "Lunes",     h: "8:00 — 22:00" },
      { d: "Martes",    h: "8:00 — 22:00" },
      { d: "Miércoles", h: "8:00 — 22:00" },
      { d: "Jueves",    h: "8:00 — 22:00" },
      { d: "Viernes",   h: "8:00 — 23:00" },
      { d: "Sábado",    h: "8:00 — 23:00", buffet: true },
      { d: "Domingo",   h: "8:00 — 22:00", buffet: true },
    ],
    images: {
      hero: "images/hero-cabana.png",
      buffet: "images/buffet.png",
      wood: "images/wood-texture.png",
    },
    buffet: {
      priceAdult: 249,
      priceChild: 149,
      schedule: "Sábado y Domingo · 13:00 — 18:00",
      priceConfirmed: false,
      stations: [
        {
          id: "parrilla", n: "01", name: "Parrilla a la Vista",
          atm: "fire", image: "images/parilla.png", imagePosition: "center 45%",
          items: ["Arrachera marinada 24 hrs", "Cecina enchilada de Yecapixtla", "Costilla glaseada con piloncillo", "Chorizo verde de Toluca"],
        },
        {
          id: "antojitos", n: "02", name: "Antojitos Mexicanos",
          atm: "clay", image: "", imagePosition: "center",
          items: ["Tlacoyos de haba y requesón", "Quesadillas de flor de calabaza", "Sopes de cuitlacoche", "Tetelas de frijol"],
        },
        {
          id: "panaderia", n: "03", name: "Panadería Abierta",
          atm: "flour", image: "", imagePosition: "center",
          items: ["Conchas tibias de vainilla y cacao", "Rol de canela con piloncillo", "Cochinitos de jengibre", "Pan rústico de masa madre"],
        },
        {
          id: "postres", n: "04", name: "Postres Artesanales",
          atm: "cream", image: "", imagePosition: "center",
          items: ["Flan de cajeta tibio", "Buñuelos con miel de piloncillo", "Capirotada con queso añejo", "Helado de mamey con pinole"],
        },
        {
          id: "olla", n: "05", name: "Café de Olla y Atoles",
          atm: "wood", image: "", imagePosition: "center",
          items: ["Café de olla con canela y piloncillo", "Atole de guayaba", "Atole champurrado", "Té de hierbabuena del huerto"],
        },
        {
          id: "chocolate", n: "06", name: "Chocolate Caliente",
          atm: "night", image: "", imagePosition: "center",
          items: ["Chocolate de metate de Oaxaca", "Champurrado de maíz azul", "Chocolate blanco con tequila", "Marshmallows de mezcal"],
        },
      ],
    },
    menu: {
      categories: [
        { id: "desayunos", name: "Desayunos", items: [] },
        { id: "sopas",     name: "Sopas y Pastas", items: [] },
        { id: "antojitos", name: "Antojitos", items: [] },
        { id: "carnes",    name: "Carnes y Cortes", items: [] },
        { id: "pollo",     name: "Pollo", items: [] },
        { id: "compartir", name: "Para Compartir", items: [] },
        { id: "cafeteria", name: "Cafetería y Crepas", items: [] },
        { id: "postres",   name: "Postres", items: [] },
        { id: "bebidas",   name: "Bebidas", items: [] },
        { id: "infantil",  name: "Menú Infantil", items: [] },
      ],
    },
    promos: [],
    panaderia: [],
    eventos: [],
    takeout: { enabled: false, items: [] },
  };

  /* ---------- Storage I/O ---------- */
  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return JSON.parse(JSON.stringify(SEED));
      const stored = JSON.parse(raw);
      return mergeDeep(JSON.parse(JSON.stringify(SEED)), stored);
    } catch (e) {
      console.warn("[store] load failed, using seed", e);
      return JSON.parse(JSON.stringify(SEED));
    }
  }

  function save(state) {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
      notify();
    } catch (e) {
      console.error("[store] save failed", e);
      if (e && e.name === "QuotaExceededError") {
        alert("Se llenó el espacio del navegador. Las fotos pesadas no caben en localStorage — vamos a tener que mover esto a Firebase Storage.");
      }
    }
  }

  function mergeDeep(base, override) {
    if (Array.isArray(override)) return override;
    if (override && typeof override === "object") {
      const out = { ...base };
      for (const k of Object.keys(override)) {
        out[k] = mergeDeep(base ? base[k] : undefined, override[k]);
      }
      return out;
    }
    return override === undefined ? base : override;
  }

  /* ---------- Images (object URLs from base64) ---------- */
  function loadImages() {
    try {
      const raw = localStorage.getItem(IMG_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  }
  function saveImages(images) {
    try { localStorage.setItem(IMG_KEY, JSON.stringify(images)); }
    catch (e) {
      alert("No cabe la imagen en el navegador. Para imágenes pesadas necesitamos Firebase Storage.");
      throw e;
    }
  }

  /* ---------- Public API ---------- */
  let state = load();

  function get() { return state; }
  function getPath(path) {
    const parts = path.split(".");
    let cur = state;
    for (const p of parts) {
      if (cur == null) return undefined;
      cur = cur[p];
    }
    return cur;
  }
  function set(path, value) {
    const parts = path.split(".");
    const last = parts.pop();
    let cur = state;
    for (const p of parts) {
      if (cur[p] == null || typeof cur[p] !== "object") cur[p] = {};
      cur = cur[p];
    }
    cur[last] = value;
    save(state);
  }
  function replace(newState) {
    state = newState;
    save(state);
  }
  function reset() {
    state = JSON.parse(JSON.stringify(SEED));
    save(state);
  }

  function resolveImage(idOrPath) {
    if (!idOrPath) return "";
    if (idOrPath.startsWith("images/") || idOrPath.startsWith("uploads/") || idOrPath.startsWith("data:") || idOrPath.startsWith("http")) {
      return idOrPath;
    }
    const all = loadImages();
    return all[idOrPath] || "";
  }

  async function uploadImage(file, id) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result;
        const images = loadImages();
        const finalId = id || `img_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        images[finalId] = dataUrl;
        try {
          saveImages(images);
          notify();
          resolve(finalId);
        } catch (e) { reject(e); }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
  function deleteImage(id) {
    const images = loadImages();
    delete images[id];
    saveImages(images);
    notify();
  }
  function listImages() {
    return loadImages();
  }

  /* ---------- Subscribe ---------- */
  function subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  }
  function notify() {
    listeners.forEach(fn => { try { fn(state); } catch (e) { console.error(e); } });
  }

  /* ---------- Export / Import (publishing) ---------- */
  function exportAll() {
    return {
      content: state,
      images: loadImages(),
      exportedAt: new Date().toISOString(),
      version: 1,
    };
  }
  function importAll(payload) {
    if (payload.content) replace(payload.content);
    if (payload.images) saveImages(payload.images);
    notify();
  }
  function downloadBackup() {
    const data = exportAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `la-cabana-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  /* ---------- Expose ---------- */
  window.LaCabanaStore = {
    get, getPath, set, replace, reset, subscribe,
    resolveImage, uploadImage, deleteImage, listImages,
    exportAll, importAll, downloadBackup,
    SEED,
  };
})();
