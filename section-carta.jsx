/* global React, Shot, Reveal, Arrow, Eyebrow */
const { useState: useStateMenu } = React;

/* ============================================================
   CARTA — Elegant gourmet à la carte menu
   ============================================================ */

const MENU_TABS = [
  { id: "desayunos",  label: "Desayunos" },
  { id: "sopas",      label: "Sopas y pastas" },
  { id: "antojitos",  label: "Antojitos mexicanos" },
  { id: "carnes",     label: "Carnes y cortes" },
  { id: "pollo",      label: "Pollo" },
  { id: "compartir",  label: "Para compartir" },
  { id: "cafeteria",  label: "Cafetería y crepas" },
  { id: "postres",    label: "Postres" },
  { id: "bebidas",    label: "Bebidas" },
  { id: "infantil",   label: "Menú infantil" },
];

const MENU = {
  desayunos: [
    { name: "Chilaquiles La Cabaña",       desc: "Tortilla recién hecha, salsa verde o roja, crema, queso fresco. Con huevo o pollo.", price: 145, tag: "Firma" },
    { name: "Huevos al gusto",             desc: "Dos huevos preparados como prefieras, frijoles refritos y tortillas hechas a mano.", price: 95 },
    { name: "Molletes de la abuela",       desc: "Pan rústico de la casa, frijoles refritos, queso manchego gratinado y pico de gallo.", price: 105 },
    { name: "Enfrijoladas",                desc: "Tortillas de maíz en frijol negro tatemado con epazote, queso fresco y crema.", price: 115 },
    { name: "Desayuno La Cabaña",          desc: "Jugo, café, fruta, plato fuerte a elegir y canasta de pan recién horneado.", price: 175, tag: "Completo" },
  ],
  sopas: [
    { name: "Sopa Azteca",                 desc: "Caldo de jitomate asado, tira de tortilla frita, aguacate y queso panela.", price: 95 },
    { name: "Caldo Tlalpeño",              desc: "Caldo de pollo claro con garbanzo, chipotle ahumado y aguacate maduro.", price: 105 },
    { name: "Crema del día",               desc: "Pregunta a tu mesero la crema de temporada — elote, hongo, calabaza o champiñón.", price: 85, tag: "Temporada" },
    { name: "Spaghetti a la boloñesa",     desc: "Pasta al dente con salsa de tomate cocida largo y carne molida de res.", price: 135 },
    { name: "Pasta al pesto",              desc: "Albahaca fresca, ajo, piñón, queso parmesano y aceite de oliva extra virgen.", price: 145 },
    { name: "Fettuccine Alfredo",          desc: "Pasta en crema con queso parmesano y un toque de mantequilla. Agrega pollo o camarón.", price: 155 },
  ],
  antojitos: [
    { name: "Quesadillas (3 pzas)",        desc: "Tortilla hecha a mano. A elegir: queso, flor de calabaza, huitlacoche, hongo o tinga.", price: 95 },
    { name: "Sopes (3 pzas)",              desc: "Sopes con frijoles, lechuga, crema, queso y la guarnición que elijas.", price: 105 },
    { name: "Tlacoyos",                    desc: "Maíz azul rellenos de haba o frijol, salsa verde, nopal y queso fresco.", price: 95 },
    { name: "Enchiladas (orden)",          desc: "Verdes, rojas o de mole. Pollo o queso. Tortilla recién hecha.", price: 135 },
    { name: "Tacos al pastor (4 pzas)",    desc: "Pastor marinado al carbón con piña tatemada, cebolla, cilantro y salsa de la casa.", price: 145, tag: "Casa" },
  ],
  carnes: [
    { name: "Arrachera La Cabaña 250g",    desc: "Marinada en cerveza y chile pasilla, servida con guacamole, frijoles y tortillas.", price: 285, tag: "Firma" },
    { name: "Rib Eye 350g",                desc: "Sellado al carbón, sal de Colima, mantequilla de epazote y guarnición a elegir.", price: 295 },
    { name: "Bistec encebollado",          desc: "Bistec a la plancha con cebolla acaramelada, frijoles, arroz y tortillas.", price: 185 },
    { name: "Tampiqueña",                  desc: "Cecina asada, enchilada de mole, frijoles, guacamole y rajas con queso.", price: 245 },
    { name: "Costillas BBQ",               desc: "Costilla de cerdo glaseada con piloncillo y chipotle, papas al horno y elote.", price: 225 },
  ],
  pollo: [
    { name: "Pollo asado al carbón",       desc: "Medio pollo de rancho marinado en achiote, tortillas hechas a mano y salsas.", price: 165 },
    { name: "Pollo a la plancha",          desc: "Pechuga marinada con limón y hierbas, arroz, ensalada y vegetales asados.", price: 155 },
    { name: "Mole poblano con pollo",      desc: "Mole de la casa, arroz blanco, frijoles negros y tortillas tibias.", price: 175 },
    { name: "Pollo en pipián verde",       desc: "Salsa de pepita verde tostada, arroz y vegetales de temporada.", price: 165 },
  ],
  compartir: [
    { name: "Molcajete La Cabaña",         desc: "Arrachera, cecina, queso fundido, cebollitas, nopal y chile toreado. Para 2.", price: 295, tag: "Para 2" },
    { name: "Parrillada familiar",         desc: "Arrachera, costilla, chorizo, pollo, cebollitas y panela. Para 4 personas.", price: 595, tag: "Para 4" },
    { name: "Botana mexicana",             desc: "Guacamole, queso fundido con chorizo, sopes, taquitos dorados y totopos.", price: 245 },
    { name: "Nachos La Cabaña",            desc: "Totopos cubiertos de queso, frijoles, carne, jalapeños, crema y guacamole.", price: 175 },
    { name: "Tabla de quesos artesanales", desc: "Quesos mexicanos, mermelada de la casa, nueces y pan rústico recién horneado.", price: 235 },
  ],
  cafeteria: [
    { name: "Crepa de la casa (salada)",   desc: "Jamón serrano, queso de cabra, espinaca y huevo poché.", price: 135 },
    { name: "Crepa dulce de cajeta",       desc: "Cajeta quemada, nuez y helado de vainilla.", price: 115 },
    { name: "Hot cakes con tocino",        desc: "Tres hot cakes esponjosos, tocino crocante y miel de maple.", price: 125 },
    { name: "Sandwich de jamón serrano",   desc: "Pan rústico, jamón serrano, queso manchego, jitomate y aceite de oliva.", price: 135 },
    { name: "Croissant con huevo",         desc: "Croissant tibio, huevo revuelto, queso fundido y aguacate.", price: 115 },
  ],
  postres: [
    { name: "Flan de cajeta tibio",        desc: "Cajeta quemada de Celaya, crema batida y nuez caramelizada.", price: 95 },
    { name: "Pastel de chocolate",         desc: "Tres capas de chocolate amargo, ganache y helado de vainilla.", price: 105 },
    { name: "Pay del día",                 desc: "Pregunta a tu mesero el pay del día — limón, manzana, queso o nuez.", price: 85, tag: "Temporada" },
    { name: "Buñuelos con piloncillo",     desc: "Buñuelos crocantes con miel de piloncillo, canela y helado de vainilla.", price: 95 },
    { name: "Helado artesanal (2 bolas)",  desc: "Sabores rotativos: vainilla, chocolate, mamey, fresa o nuez.", price: 75 },
  ],
  bebidas: [
    { name: "Agua de jamaica / horchata",  desc: "Aguas frescas preparadas a diario en la casa. Sin azúcar añadida disponible.", price: 45 },
    { name: "Café de olla",                desc: "Café tradicional con canela y piloncillo, servido en jarrito de barro.", price: 55 },
    { name: "Chocolate caliente",          desc: "Chocolate de metate batido con leche caliente o agua. Con piquete (opcional).", price: 65 },
    { name: "Limonada / naranjada",        desc: "Mineral o natural, con menta o jengibre. Pregunta por la del día.", price: 55 },
    { name: "Cerveza nacional",            desc: "Modelo, Victoria, Pacífico, Tecate, XX. Servida en tarro frío.", price: 65 },
    { name: "Margarita / Mezcal",          desc: "Cóctel de la casa o mezcal artesanal de Oaxaca, servido con sal de gusano.", price: 145 },
  ],
  infantil: [
    { name: "Dedos de pollo con papas",    desc: "Empanizados crocantes con papas a la francesa y catsup.", price: 95 },
    { name: "Mini hamburguesa",            desc: "Pan recién horneado, carne de res, queso amarillo y papas a la francesa.", price: 105 },
    { name: "Spaghetti con mantequilla",   desc: "Pasta sencilla con mantequilla y queso parmesano.", price: 75 },
    { name: "Quesadilla infantil",         desc: "Tortilla hecha a mano con queso manchego derretido.", price: 65 },
    { name: "Hot cake con plátano",        desc: "Un hot cake con plátano, miel y bola de helado.", price: 75 },
  ],
};

function CartaSection() {
  const cats = useStoreSlice("menu.categories", null);
  const categories = (cats && cats.length) ? cats : MENU_TABS.map(t => ({ ...t, items: MENU[t.id] || [] }));
  const [tab, setTab] = useStateMenu(categories[0]?.id || "desayunos");
  const activeCat = categories.find(c => c.id === tab) || categories[0];
  const items = activeCat?.items || [];

  return (
    <section id="carta" className="section section--biscuit grain" style={{ overflow: "hidden" }}>
      <div className="container">
        <div className="section-head">
          <div>
            <Eyebrow>Menú · A la carta</Eyebrow>
            <h2>
              Cocina mexicana,<br/>
              pastas, <em>cortes</em> y crepas.
            </h2>
          </div>
          <div className="lede">
            Más de cien platillos servidos todo el día. Ticket promedio entre $100 y $300 por persona, con bebidas y postre incluidos.
          </div>
        </div>

        {/* Tabs */}
        <Reveal>
          <div style={{
            display: "flex",
            gap: 4,
            overflowX: "auto",
            paddingBottom: 4,
            marginBottom: 48,
            borderBottom: "1px solid oklch(0.22 0.025 40 / 0.12)",
            scrollbarWidth: "none",
          }} className="menu-tabs">
            <style>{`.menu-tabs::-webkit-scrollbar { display: none; }`}</style>
            {categories.map((t) => {
              const isOn = t.id === tab;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  style={{
                    padding: "16px 22px",
                    fontFamily: "var(--serif)",
                    fontSize: 17,
                    fontStyle: isOn ? "italic" : "normal",
                    color: isOn ? "var(--terracota-soft)" : "oklch(0.22 0.025 40 / 0.6)",
                    borderBottom: isOn ? "2px solid var(--terracota)" : "2px solid transparent",
                    marginBottom: -1,
                    whiteSpace: "nowrap",
                    transition: "color 0.2s ease, border-color 0.2s ease",
                  }}
                  onMouseEnter={(e) => { if (!isOn) e.currentTarget.style.color = "var(--crema)"; }}
                  onMouseLeave={(e) => { if (!isOn) e.currentTarget.style.color = "oklch(0.22 0.025 40 / 0.6)"; }}
                >
                  {t.name || t.label}
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Two column dish layout */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "clamp(20px, 4vw, 60px) clamp(28px, 5vw, 80px)",
        }} className="menu-grid">
          {items.length === 0 && (
            <div style={{ gridColumn: "1 / -1", padding: "60px 0", textAlign: "center", color: "oklch(0.22 0.025 40 / 0.5)", fontStyle: "italic" }}>
              Esta sección del menú aún no tiene platillos. Agrégalos desde el admin.
            </div>
          )}
          {items.map((dish, i) => (
            <Reveal key={dish.id || dish.name} delay={i * 60}>
              <div style={{
                paddingBottom: 26,
                borderBottom: "1px dashed oklch(0.22 0.025 40 / 0.16)",
              }}>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: 18,
                  alignItems: "baseline",
                  marginBottom: 8,
                }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
                    <h3 style={{
                      fontFamily: "var(--serif)",
                      fontSize: 22,
                      margin: 0,
                      fontWeight: 500,
                      color: "var(--espresso)",
                    }}>
                      {dish.name}
                    </h3>
                    {dish.tag && (
                      <span style={{
                        fontFamily: "var(--mono)",
                        fontSize: 9.5,
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        color: "var(--terracota-soft)",
                        border: "1px solid var(--terracota-deep)",
                        padding: "3px 8px",
                        borderRadius: 999,
                      }}>
                        {dish.tag}
                      </span>
                    )}
                  </div>
                  <div style={{
                    fontFamily: "var(--serif)",
                    fontSize: 22,
                    color: "var(--terracota-soft)",
                    fontVariantNumeric: "tabular-nums",
                  }}>
                    ${dish.price}
                  </div>
                </div>
                <p style={{
                  margin: 0,
                  fontSize: 14.5,
                  lineHeight: 1.65,
                  color: "oklch(0.22 0.025 40 / 0.7)",
                  maxWidth: 56 + "ch",
                  textWrap: "pretty",
                }}>
                  {dish.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Foot note */}
        <div style={{
          marginTop: 64,
          display: "grid",
          gridTemplateColumns: "1fr auto auto",
          gap: 16,
          padding: "26px 32px",
          border: "1px solid oklch(0.22 0.025 40 / 0.12)",
          borderRadius: 4,
          alignItems: "center",
        }} className="menu-foot">
          <div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--terracota-soft)" }}>
              Servicio
            </div>
            <div style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 18, marginTop: 6, color: "oklch(0.22 0.025 40 / 0.82)" }}>
              Tortillas hechas a mano · cortesía. Precios en pesos, IVA incluido.
            </div>
          </div>
          <a href="#" className="btn btn--olive" onClick={(e) => e.preventDefault()}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v14M5 12l7 7 7-7M5 21h14"/></svg>
            Descargar menú PDF
          </a>
          <a href="#reservar" className="btn btn--primary">
            Reservar mesa <Arrow />
          </a>
        </div>
      </div>

      <style>{`
        @media (max-width: 820px) {
          .menu-grid { grid-template-columns: 1fr !important; }
          .menu-foot { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

window.CartaSection = CartaSection;
