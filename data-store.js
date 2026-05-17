/* ============================================================
   LA CABAÑA — Data Store
   ------------------------------------------------------------
   Abstracción sobre el backend de datos. Hoy usa localStorage.
   Cuando conectes Firebase, swap interno → resto del sitio
   no necesita cambiar.
   ============================================================ */

(function () {
  const KEY = "lacabana_content_v2";
  const IMG_KEY = "lacabana_images_v2";
  const listeners = new Set();

  /* ---------- Initial seed (current site content) ---------- */
  const SEED = {
    site: {
      name: "La Cabaña Restaurante Familiar",
      tagline: "Panadería, cafetería y restaurante con terraza",
      district: "Iztacalco",
      phone: "+525574558166",
      phoneDisplay: "+52 55 7455 8166",
      whatsapp: "525574558166",
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
          atm: "clay", image: "images/tlacoyos-comal.png", imagePosition: "center",
          items: ["Tlacoyos de haba y requesón", "Quesadillas de flor de calabaza", "Sopes de cuitlacoche", "Tetelas de frijol"],
        },
        {
          id: "panaderia", n: "03", name: "Panadería Abierta",
          atm: "flour", image: "images/conchas-artesanales.png", imagePosition: "center",
          items: ["Conchas tibias de vainilla y cacao", "Rol de canela con piloncillo", "Cochinitos de jengibre", "Pan rústico de masa madre"],
        },
        {
          id: "postres", n: "04", name: "Postres Artesanales",
          atm: "cream", image: "images/postres-artesanales.png", imagePosition: "center",
          items: ["Flan de cajeta tibio", "Buñuelos con miel de piloncillo", "Capirotada con queso añejo", "Helado de mamey con pinole"],
        },
        {
          id: "olla", n: "05", name: "Café de Olla y Atoles",
          atm: "wood", image: "images/cafe-olla.png", imagePosition: "center",
          items: ["Café de olla con canela y piloncillo", "Atole de guayaba", "Atole champurrado", "Té de hierbabuena del huerto"],
        },
        {
          id: "chocolate", n: "06", name: "Chocolate Caliente",
          atm: "night", image: "images/chocolate-oaxaqueno.png", imagePosition: "center",
          items: ["Chocolate de metate de Oaxaca", "Champurrado de maíz azul", "Chocolate blanco con tequila", "Marshmallows de mezcal"],
        },
      ],
    },
    menu: {
      categories: [
        { id: "desayunos", name: "Desayunos", items: [
          { id: "des_1", name: "Chilaquiles La Cabaña", desc: "Tortilla recién hecha, salsa verde o roja, crema, queso fresco. Con huevo o pollo.", price: 145, tag: "Firma", image: "" },
          { id: "des_2", name: "Huevos al gusto", desc: "Dos huevos preparados como prefieras, frijoles refritos y tortillas hechas a mano.", price: 95, tag: "", image: "" },
          { id: "des_3", name: "Molletes de la abuela", desc: "Pan rústico de la casa, frijoles refritos, queso manchego gratinado y pico de gallo.", price: 105, tag: "", image: "" },
          { id: "des_4", name: "Enfrijoladas", desc: "Tortillas de maíz en frijol negro tatemado con epazote, queso fresco y crema.", price: 115, tag: "", image: "" },
          { id: "des_5", name: "Desayuno La Cabaña", desc: "Jugo, café, fruta, plato fuerte a elegir y canasta de pan recién horneado.", price: 175, tag: "Completo", image: "" },
        ]},
        { id: "sopas", name: "Sopas y Pastas", items: [
          { id: "sop_1", name: "Sopa Azteca", desc: "Caldo de jitomate asado, tira de tortilla frita, aguacate y queso panela.", price: 95, tag: "", image: "" },
          { id: "sop_2", name: "Caldo Tlalpeño", desc: "Caldo de pollo claro con garbanzo, chipotle ahumado y aguacate maduro.", price: 105, tag: "", image: "" },
          { id: "sop_3", name: "Crema del día", desc: "Pregunta a tu mesero la crema de temporada — elote, hongo, calabaza o champiñón.", price: 85, tag: "Temporada", image: "" },
          { id: "sop_4", name: "Spaghetti a la boloñesa", desc: "Pasta al dente con salsa de tomate cocida largo y carne molida de res.", price: 135, tag: "", image: "" },
          { id: "sop_5", name: "Pasta al pesto", desc: "Albahaca fresca, ajo, piñón, queso parmesano y aceite de oliva extra virgen.", price: 145, tag: "", image: "" },
          { id: "sop_6", name: "Fettuccine Alfredo", desc: "Pasta en crema con queso parmesano y un toque de mantequilla. Agrega pollo o camarón.", price: 155, tag: "", image: "" },
        ]},
        { id: "antojitos", name: "Antojitos", items: [
          { id: "ant_1", name: "Quesadillas (3 pzas)", desc: "Tortilla hecha a mano. A elegir: queso, flor de calabaza, huitlacoche, hongo o tinga.", price: 95, tag: "", image: "" },
          { id: "ant_2", name: "Sopes (3 pzas)", desc: "Sopes con frijoles, lechuga, crema, queso y la guarnición que elijas.", price: 105, tag: "", image: "" },
          { id: "ant_3", name: "Tlacoyos", desc: "Maíz azul rellenos de haba o frijol, salsa verde, nopal y queso fresco.", price: 95, tag: "", image: "" },
          { id: "ant_4", name: "Enchiladas (orden)", desc: "Verdes, rojas o de mole. Pollo o queso. Tortilla recién hecha.", price: 135, tag: "", image: "" },
          { id: "ant_5", name: "Tacos al pastor (4 pzas)", desc: "Pastor marinado al carbón con piña tatemada, cebolla, cilantro y salsa de la casa.", price: 145, tag: "Casa", image: "" },
        ]},
        { id: "carnes", name: "Carnes y Cortes", items: [
          { id: "car_1", name: "Arrachera La Cabaña 250g", desc: "Marinada en cerveza y chile pasilla, servida con guacamole, frijoles y tortillas.", price: 285, tag: "Firma", image: "" },
          { id: "car_2", name: "Rib Eye 350g", desc: "Sellado al carbón, sal de Colima, mantequilla de epazote y guarnición a elegir.", price: 295, tag: "", image: "" },
          { id: "car_3", name: "Bistec encebollado", desc: "Bistec a la plancha con cebolla acaramelada, frijoles, arroz y tortillas.", price: 185, tag: "", image: "" },
          { id: "car_4", name: "Tampiqueña", desc: "Cecina asada, enchilada de mole, frijoles, guacamole y rajas con queso.", price: 245, tag: "", image: "" },
          { id: "car_5", name: "Costillas BBQ", desc: "Costilla de cerdo glaseada con piloncillo y chipotle, papas al horno y elote.", price: 225, tag: "", image: "" },
        ]},
        { id: "pollo", name: "Pollo", items: [
          { id: "pol_1", name: "Pollo asado al carbón", desc: "Medio pollo de rancho marinado en achiote, tortillas hechas a mano y salsas.", price: 165, tag: "", image: "" },
          { id: "pol_2", name: "Pollo a la plancha", desc: "Pechuga marinada con limón y hierbas, arroz, ensalada y vegetales asados.", price: 155, tag: "", image: "" },
          { id: "pol_3", name: "Mole poblano con pollo", desc: "Mole de la casa, arroz blanco, frijoles negros y tortillas tibias.", price: 175, tag: "", image: "" },
          { id: "pol_4", name: "Pollo en pipián verde", desc: "Salsa de pepita verde tostada, arroz y vegetales de temporada.", price: 165, tag: "", image: "" },
        ]},
        { id: "compartir", name: "Para Compartir", items: [
          { id: "com_1", name: "Molcajete La Cabaña", desc: "Arrachera, cecina, queso fundido, cebollitas, nopal y chile toreado. Para 2.", price: 295, tag: "Para 2", image: "" },
          { id: "com_2", name: "Parrillada familiar", desc: "Arrachera, costilla, chorizo, pollo, cebollitas y panela. Para 4 personas.", price: 595, tag: "Para 4", image: "" },
          { id: "com_3", name: "Botana mexicana", desc: "Guacamole, queso fundido con chorizo, sopes, taquitos dorados y totopos.", price: 245, tag: "", image: "" },
          { id: "com_4", name: "Nachos La Cabaña", desc: "Totopos cubiertos de queso, frijoles, carne, jalapeños, crema y guacamole.", price: 175, tag: "", image: "" },
          { id: "com_5", name: "Tabla de quesos artesanales", desc: "Quesos mexicanos, mermelada de la casa, nueces y pan rústico recién horneado.", price: 235, tag: "", image: "" },
        ]},
        { id: "cafeteria", name: "Cafetería y Crepas", items: [
          { id: "caf_1", name: "Crepa de la casa (salada)", desc: "Jamón serrano, queso de cabra, espinaca y huevo poché.", price: 135, tag: "", image: "" },
          { id: "caf_2", name: "Crepa dulce de cajeta", desc: "Cajeta quemada, nuez y helado de vainilla.", price: 115, tag: "", image: "" },
          { id: "caf_3", name: "Hot cakes con tocino", desc: "Tres hot cakes esponjosos, tocino crocante y miel de maple.", price: 125, tag: "", image: "" },
          { id: "caf_4", name: "Sandwich de jamón serrano", desc: "Pan rústico, jamón serrano, queso manchego, jitomate y aceite de oliva.", price: 135, tag: "", image: "" },
          { id: "caf_5", name: "Croissant con huevo", desc: "Croissant tibio, huevo revuelto, queso fundido y aguacate.", price: 115, tag: "", image: "" },
        ]},
        { id: "postres", name: "Postres", items: [
          { id: "pos_1", name: "Flan de cajeta tibio", desc: "Cajeta quemada de Celaya, crema batida y nuez caramelizada.", price: 95, tag: "", image: "" },
          { id: "pos_2", name: "Pastel de chocolate", desc: "Tres capas de chocolate amargo, ganache y helado de vainilla.", price: 105, tag: "", image: "" },
          { id: "pos_3", name: "Pay del día", desc: "Pregunta a tu mesero el pay del día — limón, manzana, queso o nuez.", price: 85, tag: "Temporada", image: "" },
          { id: "pos_4", name: "Buñuelos con piloncillo", desc: "Buñuelos crocantes con miel de piloncillo, canela y helado de vainilla.", price: 95, tag: "", image: "" },
          { id: "pos_5", name: "Helado artesanal (2 bolas)", desc: "Sabores rotativos: vainilla, chocolate, mamey, fresa o nuez.", price: 75, tag: "", image: "" },
        ]},
        { id: "bebidas", name: "Bebidas", items: [
          { id: "beb_1", name: "Agua de jamaica / horchata", desc: "Aguas frescas preparadas a diario en la casa. Sin azúcar añadida disponible.", price: 45, tag: "", image: "" },
          { id: "beb_2", name: "Café de olla", desc: "Café tradicional con canela y piloncillo, servido en jarrito de barro.", price: 55, tag: "", image: "" },
          { id: "beb_3", name: "Chocolate caliente", desc: "Chocolate de metate batido con leche caliente o agua. Con piquete (opcional).", price: 65, tag: "", image: "" },
          { id: "beb_4", name: "Limonada / naranjada", desc: "Mineral o natural, con menta o jengibre. Pregunta por la del día.", price: 55, tag: "", image: "" },
          { id: "beb_5", name: "Cerveza nacional", desc: "Modelo, Victoria, Pacífico, Tecate, XX. Servida en tarro frío.", price: 65, tag: "", image: "" },
          { id: "beb_6", name: "Margarita / Mezcal", desc: "Cóctel de la casa o mezcal artesanal de Oaxaca, servido con sal de gusano.", price: 145, tag: "", image: "" },
        ]},
        { id: "infantil", name: "Menú Infantil", items: [
          { id: "inf_1", name: "Dedos de pollo con papas", desc: "Empanizados crocantes con papas a la francesa y catsup.", price: 95, tag: "", image: "" },
          { id: "inf_2", name: "Mini hamburguesa", desc: "Pan recién horneado, carne de res, queso amarillo y papas a la francesa.", price: 105, tag: "", image: "" },
          { id: "inf_3", name: "Spaghetti con mantequilla", desc: "Pasta sencilla con mantequilla y queso parmesano.", price: 75, tag: "", image: "" },
          { id: "inf_4", name: "Quesadilla infantil", desc: "Tortilla hecha a mano con queso manchego derretido.", price: 65, tag: "", image: "" },
          { id: "inf_5", name: "Hot cake con plátano", desc: "Un hot cake con plátano, miel y bola de helado.", price: 75, tag: "", image: "" },
        ]},
      ],
    },
    promos: [
      { id: "promo_chiles",   image: "images/chiles-nogada.png",    title: "Temporada de Chiles en Nogada", subtitle: "Poblano · nuez de castilla · granada de Zacatlán", desc: "Por seis semanas al año, traemos las nueces frescas y los chiles de Calpan. Se preparan a mano cada tarde, en lotes de 24.", dates: "Sep — Oct", price: "$ 385", badge: "Edición limitada" },
      { id: "promo_buffet",   image: "images/buffet-dominical.png", title: "Buffet Familiar de Fin de Semana", subtitle: "6 estaciones · parrilla en vivo · panadería abierta", desc: "Café de olla recién hervido, parrilla a la vista, panadería con masa madre y mesa de antojitos. Niños hasta 6 años, cortesía.", dates: "Sábado y Domingo", price: "$ 545 / persona", badge: "Más popular" },
      { id: "promo_pozole",   image: "images/pozole-cazuela.png",   title: "Pozole Patrio · Tres Olores", subtitle: "Rojo de Guerrero · verde de Puebla · blanco de Jalisco", desc: "Cazuelas de barro recién destapadas, tostadas de maíz azul, lechuga finísima y aguacate. Servido como en casa de la abuela.", dates: "Septiembre", price: "$ 295", badge: "Mes patrio" },
      { id: "promo_muerto",   image: "images/pan-muerto.png",       title: "Pan de Muerto Artesanal", subtitle: "Masa madre · ralladura de naranja · azahar", desc: "Reposamos la masa 18 horas. Se hornea a leña a primera hora. Lo entregamos tibio, espolvoreado a mano frente al cliente.", dates: "Octubre — Noviembre", price: "$ 95 / pieza", badge: "Horno a leña" },
      { id: "promo_rosca",    image: "images/rosca-reyes.png",      title: "Rosca de Reyes Premium", subtitle: "Ate de membrillo · higo · acitrón · 1.2 kg", desc: "Se decora a mano una por una. Incluye chocolate de olla servido en cazuela individual para acompañar.", dates: "Enero", price: "Desde $ 690", badge: "Pre-venta" },
      { id: "promo_desayuno", image: "images/desayuno-familiar.png",title: "Desayunos Buffet Familiares", subtitle: "Chilaquiles a elegir · barra de fruta · panadería", desc: "Abrimos el comal a las 8:00. Salsas martajadas frente al cliente, café de olla sin fondo y conchas recién horneadas.", dates: "Todos los días", price: "$ 325 / persona", badge: "8:00 — 12:30" },
    ],
    panaderia: [
      { id: "pan_1", image: "images/conchas-artesanales.png", name: "Concha Premium",      price: 38, desc: "Vainilla de Papantla · cacao" },
      { id: "pan_2", image: "images/chocolatin-capas.png",    name: "Chocolatín Mexicano", price: 52, desc: "Chocolate Oaxaqueño · mantequilla" },
      { id: "pan_3", image: "images/rol-canela.png",          name: "Rol de Canela",       price: 48, desc: "Piloncillo · nuez de castilla" },
      { id: "pan_4", image: "images/pan-rustico.png",         name: "Pan Rústico",         price: 95, desc: "Masa madre 36 hrs · corteza leñosa" },
      { id: "pan_5", image: "images/cuerno-hojaldre.png",     name: "Cuerno de Hojaldre",  price: 62, desc: "104 capas · mantequilla francesa" },
      { id: "pan_6", image: "images/pan-elote.png",           name: "Pan de Elote",        price: 45, desc: "Elote tierno · queso fresco" },
    ],
    eventos: [
      { id: "ev_1", image: "images/musica-vivo.png",   title: "Trío Los del Valle",      day: "Viernes",    time: "20:00 — 23:00", desc: "Boleros y rancheras al fogón" },
      { id: "ev_2", image: "images/musica-vivo.png",   title: "Mariachi de Cocula",      day: "Sábado",     time: "14:00 — 17:00", desc: "Buffet familiar de fin de semana" },
      { id: "ev_3", image: "",                          title: "Cuenta-cuentos infantil", day: "Domingo",    time: "12:00 — 14:00", desc: "Leyendas mexicanas para niños" },
      { id: "ev_4", image: "",                          title: "Cata de mezcal",          day: "Miércoles",  time: "19:30 — 22:00", desc: "5 destilados de Oaxaca · cupo 24" },
      { id: "ev_5", image: "",                          title: "Cumpleaños familiar",     day: "Sábado",     time: "Todo el día",   desc: "Decoración papel picado · pastel" },
    ],
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
