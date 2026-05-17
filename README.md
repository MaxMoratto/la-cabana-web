# La Cabaña — Restaurante Familiar · Iztacalco

Sitio web del **Restaurante Familiar La Cabaña** en la colonia Agrícola Oriental, Iztacalco, CDMX. Panadería, cafetería y restaurante con terraza.

## Estructura

- `La Cabaña.html` — punto de entrada (sitio público y admin)
- `data-store.js` — capa de datos (hoy localStorage, migrable a Firestore)
- `admin-shell.jsx`, `admin-tabs.jsx` — panel administrativo (`?admin=1`)
- `section-*.jsx` — secciones del sitio
- `styles.css` — sistema de diseño (paleta cálida mexicana, oklch)
- `images/` — fotos del restaurante (hero, buffet, parrilla, textura)

## Cómo correrlo localmente

```bash
python -m http.server 8000
```

Abrir [http://localhost:8000/La%20Caba%C3%B1a.html](http://localhost:8000/La%20Caba%C3%B1a.html)

Admin: [http://localhost:8000/La%20Caba%C3%B1a.html?admin=1](http://localhost:8000/La%20Caba%C3%B1a.html?admin=1) — contraseña inicial `lacabana`.

## Deploy y configuración

Ver [SETUP.md](SETUP.md) para instrucciones detalladas de:

1. Conectar a Vercel (deploy automático desde main)
2. Conectar Firebase (Firestore + Storage + Auth)
3. Usar el panel admin

## Stack

- HTML + React 18 + Babel standalone (sin build paso por ahora)
- Hosting: Vercel
- Backend (pendiente de conectar): Firebase Firestore / Storage / Auth
