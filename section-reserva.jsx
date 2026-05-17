/* global React, Shot, Reveal, Arrow, Eyebrow, LaCabanaStore */
const { useState: useStateRes, useMemo: useMemoRes } = React;

/* ============================================================
   RESERVACIÓN — Multi-step interactive form with validation
   ============================================================ */

function ReservaSection({ onToast }) {
  const [step, setStep] = useStateRes(1);
  const [form, setForm] = useStateRes({
    occasion: "",
    date: "",
    time: "",
    guests: 4,
    area: "",
    name: "",
    phone: "",
    notes: "",
  });
  const [errors, setErrors] = useStateRes({});
  const [submitted, setSubmitted] = useStateRes(false);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const today = new Date();
  const fmtDate = (d) => d.toISOString().slice(0, 10);
  const minDate = fmtDate(today);
  const maxDate = fmtDate(new Date(today.getTime() + 1000 * 60 * 60 * 24 * 60));

  const validate1 = () => {
    const e = {};
    if (!form.occasion) e.occasion = "Selecciona una ocasión";
    if (!form.date) e.date = "Elige una fecha";
    if (!form.time) e.time = "Elige un horario";
    if (!form.guests || form.guests < 1) e.guests = "Mínimo 1 comensal";
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  const validate2 = () => {
    const e = {};
    if (!form.name || form.name.length < 2) e.name = "Tu nombre, por favor";
    if (!form.phone || form.phone.replace(/\D/g, "").length < 10) e.phone = "Teléfono de 10 dígitos";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (step === 1 && !validate1()) return;
    if (step === 2 && !validate2()) return;
    setStep(step + 1);
  };
  const back = () => { setErrors({}); setStep(step - 1); };

  const submit = () => {
    setSubmitted(true);
    onToast && onToast("Hemos recibido tu solicitud. Te confirmamos en menos de 10 minutos.");
  };

  const whatsapp = () => {
    const number = (LaCabanaStore.getPath("site.whatsapp") || "5215551157248").replace(/[^\d]/g, "");
    const msg = encodeURIComponent(
      `Hola, soy ${form.name || "(nombre)"}. Quisiera reservar para ${form.guests} personas el ${form.date} a las ${form.time}. ${form.occasion ? "Ocasión: " + form.occasion + ". " : ""}${form.area ? "Área: " + form.area + ". " : ""}${form.notes ? "Notas: " + form.notes : ""}`
    );
    window.open(`https://wa.me/${number}?text=${msg}`, "_blank", "noopener");
    onToast && onToast("Abriendo WhatsApp con tu mensaje listo…");
  };

  const occasions = [
    { id: "familia",  label: "Comida familiar", emoji: "·" },
    { id: "cumple",   label: "Cumpleaños",      emoji: "·" },
    { id: "negocios", label: "Negocios",        emoji: "·" },
    { id: "pareja",   label: "Romántica",       emoji: "·" },
  ];
  const times = ["13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "20:00", "20:30", "21:00", "21:30"];
  const areas = [
    { id: "terraza", label: "Terraza con fogón",       sub: "Aire libre · vista al jardín" },
    { id: "salon",   label: "Salón principal",          sub: "Bajo vigas de madera" },
    { id: "huerto",  label: "Mesa del huerto",          sub: "Solo 2 mesas · íntimo" },
    { id: "barra",   label: "Barra de la cocina",       sub: "Frente al comal y la parrilla" },
  ];

  // Confirmation screen
  if (submitted) {
    return (
      <section id="reservar" className="section section--sand" style={{ overflow: "hidden" }}>
        <div className="container">
          <Reveal>
            <div style={{
              maxWidth: 720,
              margin: "0 auto",
              textAlign: "center",
              padding: "60px 20px",
            }}>
              <div style={{
                width: 80, height: 80,
                borderRadius: 999,
                background: "var(--terracota)",
                color: "var(--espresso)",
                display: "inline-flex",
                alignItems: "center", justifyContent: "center",
                marginBottom: 24,
              }}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 17 L13 24 L26 9"/></svg>
              </div>
              <Eyebrow>Solicitud recibida</Eyebrow>
              <h2 className="display" style={{ fontSize: "clamp(36px, 5vw, 56px)", margin: "16px 0 14px" }}>
                Te esperamos, <em>{form.name.split(" ")[0]}</em>.
              </h2>
              <p style={{ fontSize: 17, lineHeight: 1.6, color: "oklch(0.22 0.025 40 / 0.78)", maxWidth: 56 + "ch", margin: "0 auto" }}>
                Hemos recibido tu solicitud para el <strong>{form.date}</strong> a las <strong>{form.time}</strong>, mesa para <strong>{form.guests}</strong>. Una de nuestras anfitrionas te confirmará por teléfono en menos de diez minutos.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 36, flexWrap: "wrap" }}>
                <button className="btn btn--primary" onClick={whatsapp}>Continuar por WhatsApp</button>
                <button className="btn btn--ghost" onClick={() => { setSubmitted(false); setStep(1); setForm({ occasion: "", date: "", time: "", guests: 4, area: "", name: "", phone: "", notes: "" }); }}>Nueva reservación</button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    );
  }

  return (
    <section id="reservar" className="section section--sand" style={{ overflow: "hidden", position: "relative" }}>
      {/* warm glow */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at 80% 30%, oklch(0.55 0.13 50 / 0.18), transparent 50%)",
        pointerEvents: "none",
      }} />

      <div className="container" style={{ position: "relative" }}>
        <div className="section-head">
          <div>
            <Eyebrow>Reservaciones</Eyebrow>
            <h2>
              Aparta tu lugar<br/>
              <em>en la mesa.</em>
            </h2>
          </div>
          <div className="lede">
            Las reservaciones se confirman a mano. Recomendamos apartar con 24 horas de anticipación los fines de semana de buffet.
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1.05fr 1fr",
          gap: "clamp(28px, 5vw, 64px)",
          alignItems: "stretch",
        }} className="reserve-grid">

          {/* Form card */}
          <Reveal>
            <div style={{
              background: "oklch(0.94 0.03 80 / 0.45)",
              border: "1px solid oklch(0.22 0.025 40 / 0.14)",
              borderRadius: 4,
              padding: "clamp(28px, 4vw, 44px)",
              backdropFilter: "blur(6px)",
            }}>
              {/* Steps progress */}
              <div style={{ display: "flex", gap: 10, marginBottom: 32 }}>
                {[1, 2, 3].map((n) => (
                  <div key={n} style={{
                    flex: 1, height: 3,
                    background: n <= step ? "var(--terracota)" : "oklch(0.22 0.025 40 / 0.14)",
                    borderRadius: 2,
                    transition: "background 0.3s ease",
                  }} />
                ))}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 22 }}>
                <span style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--terracota-soft)" }}>
                  Paso {step} de 3
                </span>
                <span style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.18em", color: "oklch(0.22 0.025 40 / 0.55)" }}>
                  {step === 1 && "Cuándo & cuántos"}
                  {step === 2 && "Datos & área"}
                  {step === 3 && "Revisa & confirma"}
                </span>
              </div>

              {/* STEP 1 */}
              {step === 1 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                  <Field label="Ocasión" error={errors.occasion}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
                      {occasions.map((o) => (
                        <Chip key={o.id} active={form.occasion === o.id} onClick={() => update("occasion", o.id)}>
                          {o.label}
                        </Chip>
                      ))}
                    </div>
                  </Field>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }} className="res-trio">
                    <Field label="Fecha" error={errors.date}>
                      <Input type="date" value={form.date} min={minDate} max={maxDate} onChange={(v) => update("date", v)} />
                    </Field>
                    <Field label="Horario" error={errors.time}>
                      <Select value={form.time} onChange={(v) => update("time", v)} placeholder="Selecciona">
                        {times.map((t) => <option key={t} value={t}>{t}</option>)}
                      </Select>
                    </Field>
                    <Field label="Comensales" error={errors.guests}>
                      <Stepper value={form.guests} min={1} max={20} onChange={(v) => update("guests", v)} />
                    </Field>
                  </div>
                </div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                  <Field label="Área preferida (opcional)">
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      {areas.map((a) => (
                        <button key={a.id} type="button" onClick={() => update("area", a.id)}
                          style={{
                            textAlign: "left",
                            padding: "14px 16px",
                            border: form.area === a.id ? "1px solid var(--terracota)" : "1px solid oklch(0.22 0.025 40 / 0.14)",
                            background: form.area === a.id ? "oklch(0.46 0.13 35 / 0.18)" : "transparent",
                            borderRadius: 4,
                            transition: "all 0.2s ease",
                          }}>
                          <div style={{ fontFamily: "var(--serif)", fontSize: 17, color: "var(--espresso)" }}>{a.label}</div>
                          <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.14em", color: "oklch(0.22 0.025 40 / 0.6)", marginTop: 6 }}>{a.sub}</div>
                        </button>
                      ))}
                    </div>
                  </Field>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }} className="res-duo">
                    <Field label="Nombre completo" error={errors.name}>
                      <Input value={form.name} onChange={(v) => update("name", v)} placeholder="Ana López" />
                    </Field>
                    <Field label="Teléfono (WhatsApp)" error={errors.phone}>
                      <Input value={form.phone} onChange={(v) => update("phone", v.replace(/[^\d\s+()-]/g, ""))} placeholder="55 1234 5678" />
                    </Field>
                  </div>
                  <Field label="Notas (alergias, cumpleaños, etc.)">
                    <Textarea value={form.notes} onChange={(v) => update("notes", v)} placeholder="Mesa cerca de la ventana, pastel sorpresa, etc." />
                  </Field>
                </div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                  <Summary form={form} occasions={occasions} areas={areas} />
                </div>
              )}

              {/* Nav */}
              <div style={{ marginTop: 36, display: "flex", gap: 12, justifyContent: "space-between" }}>
                {step > 1 ? (
                  <button onClick={back} className="btn btn--ghost">
                    <svg width="14" height="14" viewBox="0 0 14 14" stroke="currentColor" strokeWidth="1.6" fill="none"><path d="M13 7 H1 M6 2 L1 7 L6 12" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Atrás
                  </button>
                ) : <span />}
                {step < 3 && (
                  <button onClick={next} className="btn btn--primary">Continuar <Arrow /></button>
                )}
                {step === 3 && (
                  <button onClick={submit} className="btn btn--primary">Confirmar reservación <Arrow /></button>
                )}
              </div>
            </div>
          </Reveal>

          {/* Side info: WhatsApp + restaurant info */}
          <Reveal delay={140}>
            <div style={{ display: "flex", flexDirection: "column", gap: 24, height: "100%" }}>

              {/* WhatsApp card */}
              <button onClick={whatsapp} style={{
                textAlign: "left",
                padding: "28px",
                background: "oklch(0.52 0.16 145)",
                color: "var(--crema)",
                borderRadius: 4,
                display: "grid",
                gridTemplateColumns: "auto 1fr auto",
                gap: 18,
                alignItems: "center",
                transition: "transform 0.25s ease",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; }}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 999,
                  background: "oklch(0.22 0.025 40 / 0.16)",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 3.5A11 11 0 003.4 17.8L2 22l4.3-1.4A11 11 0 1020.5 3.5zM12 20.1a8.1 8.1 0 01-4.1-1.1l-.3-.2-2.6.8.8-2.5-.2-.3A8.1 8.1 0 1112 20.1zm4.5-6c-.3-.1-1.5-.7-1.7-.8s-.4-.1-.5.1-.6.8-.8 1c-.1.2-.3.2-.5.1-.3-.2-1.2-.4-2.2-1.3-.8-.7-1.4-1.7-1.5-1.9-.2-.3 0-.4.1-.6l.4-.4.2-.4c.1-.2 0-.3 0-.4l-.7-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4 0-.6.3-.2.2-.8.8-.8 2s.9 2.3 1 2.5c.1.2 1.7 2.7 4.2 3.8.6.2 1 .4 1.4.5.6.2 1.1.2 1.5.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1 .2-1.2-.1-.1-.3-.2-.6-.3z"/></svg>
                </div>
                <div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 10.5, letterSpacing: "0.22em", textTransform: "uppercase", opacity: 0.85 }}>
                    Reservación por WhatsApp
                  </div>
                  <div style={{ fontFamily: "var(--serif)", fontSize: 22, marginTop: 6 }}>
                    +52 55 5115 7248
                  </div>
                </div>
                <Arrow />
              </button>

              {/* Hours / Address */}
              <div style={{
                padding: "28px",
                border: "1px solid oklch(0.22 0.025 40 / 0.14)",
                borderRadius: 4,
                flex: 1,
              }}>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 24,
                  marginBottom: 24,
                }}>
                  <div>
                    <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--terracota-soft)" }}>
                      Horario
                    </div>
                    <div style={{ marginTop: 10, lineHeight: 1.8, fontSize: 14, color: "oklch(0.22 0.025 40 / 0.82)" }}>
                      Lun — Vie · 8:00 a 22:00<br/>
                      Sáb — Dom · 8:00 a 23:00<br/>
                      <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--olivo)" }}>(Horario a confirmar)</span>
                    </div>
                  </div>
                  <div>
                    <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--terracota-soft)" }}>
                      Dirección
                    </div>
                    <div style={{ marginTop: 10, lineHeight: 1.6, fontSize: 14, color: "oklch(0.22 0.025 40 / 0.82)" }}>
                      Sur 16 Núm. 233<br/>
                      Col. Agrícola Oriental<br/>
                      Iztacalco · CDMX · 08500<br/>
                      <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--olivo)" }}>Junto al Mercado Agrícola Oriental</span>
                    </div>
                  </div>
                </div>

                {/* Mini map placeholder */}
                <Shot atm="herb" src="images/musica-vivo.png" ratio="16 / 9" label="MAPA · IZTACALCO · CDMX" ref0="LOCATION">
                  <div style={{
                    position: "absolute",
                    top: "50%", left: "50%",
                    transform: "translate(-50%, -60%)",
                    zIndex: 3,
                  }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: 999,
                      background: "var(--terracota)",
                      border: "3px solid var(--crema)",
                      boxShadow: "0 0 0 6px oklch(0.58 0.13 38 / 0.25)",
                    }} />
                  </div>
                </Shot>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      <style>{`
        @media (max-width: 980px) {
          .reserve-grid { grid-template-columns: 1fr !important; }
          .res-trio, .res-duo { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ---------- Form atoms ---------- */
function Field({ label, error, children }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <span style={{ fontFamily: "var(--mono)", fontSize: 10.5, letterSpacing: "0.2em", textTransform: "uppercase", color: error ? "oklch(0.62 0.17 25)" : "oklch(0.22 0.025 40 / 0.65)" }}>
        {label}{error && " · " + error}
      </span>
      {children}
    </label>
  );
}
const inputBase = {
  background: "oklch(0.94 0.03 80 / 0.4)",
  border: "1px solid oklch(0.22 0.025 40 / 0.14)",
  color: "var(--espresso)",
  fontFamily: "var(--sans)",
  fontSize: 15,
  padding: "13px 14px",
  borderRadius: 4,
  outline: "none",
  width: "100%",
  transition: "border-color 0.2s ease, background 0.2s ease",
};
function Input({ value, onChange, placeholder, type = "text", min, max }) {
  return (
    <input
      type={type} value={value} placeholder={placeholder} min={min} max={max}
      onChange={(e) => onChange(e.target.value)}
      onFocus={(e) => { e.target.style.borderColor = "var(--terracota)"; }}
      onBlur={(e) => { e.target.style.borderColor = "oklch(0.22 0.025 40 / 0.14)"; }}
      style={inputBase}
    />
  );
}
function Textarea({ value, onChange, placeholder }) {
  return (
    <textarea
      value={value} placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      onFocus={(e) => { e.target.style.borderColor = "var(--terracota)"; }}
      onBlur={(e) => { e.target.style.borderColor = "oklch(0.22 0.025 40 / 0.14)"; }}
      rows={3}
      style={{ ...inputBase, resize: "vertical", fontFamily: "var(--sans)" }}
    />
  );
}
function Select({ value, onChange, children, placeholder }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={(e) => { e.target.style.borderColor = "var(--terracota)"; }}
      onBlur={(e) => { e.target.style.borderColor = "oklch(0.22 0.025 40 / 0.14)"; }}
      style={{
        ...inputBase,
        appearance: "none",
        backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'><path d='M1 1 L6 6 L11 1' stroke='%23E8D9C0' stroke-width='1.4' fill='none' stroke-linecap='round'/></svg>\")",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 14px center",
        paddingRight: 36,
      }}
    >
      <option value="" disabled>{placeholder || "—"}</option>
      {children}
    </select>
  );
}
function Stepper({ value, onChange, min, max }) {
  return (
    <div style={{
      display: "flex", alignItems: "center",
      ...inputBase,
      padding: "4px",
    }}>
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))}
        style={{ width: 38, height: 38, borderRadius: 4, color: "var(--espresso)" }}>−</button>
      <div style={{ flex: 1, textAlign: "center", fontFamily: "var(--serif)", fontSize: 18 }}>{value}</div>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))}
        style={{ width: 38, height: 38, borderRadius: 4, color: "var(--espresso)" }}>+</button>
    </div>
  );
}
function Chip({ active, onClick, children }) {
  return (
    <button type="button" onClick={onClick} style={{
      padding: "13px 16px",
      borderRadius: 999,
      border: active ? "1px solid var(--terracota)" : "1px solid oklch(0.22 0.025 40 / 0.16)",
      background: active ? "oklch(0.46 0.13 35 / 0.22)" : "transparent",
      color: active ? "var(--crema)" : "oklch(0.22 0.025 40 / 0.8)",
      fontFamily: "var(--sans)",
      fontSize: 13.5,
      letterSpacing: "0.02em",
      transition: "all 0.2s ease",
      textAlign: "center",
    }}>
      {children}
    </button>
  );
}

function Summary({ form, occasions, areas }) {
  const rows = [
    ["Ocasión",    occasions.find((o) => o.id === form.occasion)?.label || "—"],
    ["Fecha",       form.date || "—"],
    ["Horario",     form.time || "—"],
    ["Comensales",  form.guests],
    ["Área",        areas.find((a) => a.id === form.area)?.label || "Sin preferencia"],
    ["Nombre",      form.name || "—"],
    ["Teléfono",    form.phone || "—"],
    ["Notas",       form.notes || "—"],
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      <div style={{
        fontFamily: "var(--serif)",
        fontSize: 22,
        marginBottom: 12,
        color: "var(--espresso)",
      }}>
        Revisa antes de confirmar
      </div>
      {rows.map(([k, v], i) => (
        <div key={i} style={{
          display: "grid",
          gridTemplateColumns: "140px 1fr",
          gap: 16,
          padding: "12px 0",
          borderBottom: "1px solid oklch(0.22 0.025 40 / 0.1)",
        }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "oklch(0.22 0.025 40 / 0.6)" }}>{k}</div>
          <div style={{ fontSize: 15, color: "var(--espresso)" }}>{v}</div>
        </div>
      ))}
    </div>
  );
}

window.ReservaSection = ReservaSection;
