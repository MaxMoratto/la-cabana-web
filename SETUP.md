# La Cabaña — Guía de instalación y deploy

Este documento explica **paso a paso** cómo poner el sitio en internet y cómo conectar Firebase para que el admin guarde cambios para todos los visitantes.

---

## 1. Lo que ya está listo

- Sitio público en `La Cabaña.html` con todas las secciones
- Admin en `?admin=1` (contraseña inicial: `lacabana`)
- **Capa de datos** (`data-store.js`) abstraída — hoy guarda en el navegador (`localStorage`), mañana en Firebase con un cambio mínimo
- Secciones **Bufet** y **Ubicación** ya leen del store (cualquier edición desde el admin aparece al instante en el sitio)
- Carpeta lista para `git init` + `vercel deploy`

**Estado actual**: si abres `/?admin=1` y editas algo, **solo tú lo ves** porque está en tu navegador. Para que **todos los visitantes** vean los cambios necesitamos conectar Firebase (paso 4).

---

## 2. Subir el código a GitHub (5 minutos)

1. Crea un repo nuevo en [github.com/new](https://github.com/new), por ejemplo `la-cabana-web`. Déjalo **privado**.
2. En tu PC, abre PowerShell o Git Bash en esta carpeta y corre:
   ```bash
   git init
   git add .
   git commit -m "Sitio inicial + admin"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/la-cabana-web.git
   git push -u origin main
   ```

> Si no tienes Git instalado: descárgalo de [git-scm.com](https://git-scm.com/).

---

## 3. Desplegar en Vercel (3 minutos)

1. Entra a [vercel.com](https://vercel.com/) y conéctate con tu cuenta de GitHub.
2. **Add New → Project** → selecciona el repo `la-cabana-web` → **Import**.
3. Vercel detecta que es un sitio estático. **Framework Preset: Other**. Deja todo lo demás en automático y haz clic en **Deploy**.
4. En ~30 segundos te da una URL tipo `la-cabana-web.vercel.app`.

**Cada `git push` que hagas en `main` se despliega solo en menos de 1 minuto.**

Para el dominio real: en Vercel → **Settings → Domains** → agregas tu dominio (lacabana.com.mx o el que tengas) y te da los registros DNS para configurar.

---

## 4. Conectar Firebase (cuando estés listo)

Esto convierte el admin de "solo en mi navegador" a **"los cambios son visibles para todos"**.

### 4.1 Crear el proyecto Firebase

1. Entra a [console.firebase.google.com](https://console.firebase.google.com/) con tu cuenta de Google (hmaximo1@gmail.com).
2. **Agregar proyecto** → nómbralo `la-cabana-social-house` → desactiva Google Analytics → **Crear**.
3. En el proyecto, clic en el ícono web `</>` para **Agregar app web**:
   - Apodo de app: `web`
   - **No** marques Firebase Hosting
   - **Registrar app**
4. Te muestra un bloque de código con `firebaseConfig`. **Copia esos valores** (apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId).

### 4.2 Activar los 3 servicios que necesitamos

En el menú lateral del proyecto:

| Servicio | Cómo activarlo |
|---|---|
| **Firestore Database** | Build → Firestore Database → Create database → Production mode → región `us-central` (más cercana) → Enable |
| **Storage** | Build → Storage → Get started → Production mode → misma región → Done |
| **Authentication** | Build → Authentication → Get started → Sign-in method → Email/Password → habilítalo. Luego en **Users** agrega tu correo con una contraseña |

### 4.3 Pasarme los datos

Mándame:
- El bloque completo de `firebaseConfig` (los 6 valores)
- Confirmación de que activaste los 3 servicios

Con eso yo:
1. Cambio `data-store.js` para que use Firestore y Storage
2. Cambio el login del admin para que use Firebase Auth con tu correo
3. Configuro las reglas de seguridad (solo tu usuario puede escribir)
4. Hago `git push` y queda en producción

**No necesito tus contraseñas** — solo el `firebaseConfig`, que es público por diseño.

---

## 5. Mientras tanto: cómo usar el admin local

1. Abre `http://localhost:8000/La%20Caba%C3%B1a.html?admin=1` (o `/admin` en producción)
2. Contraseña: `lacabana` (la cambiamos al conectar Firebase Auth)
3. Edita lo que quieras. Cambios visibles **al instante** en tu navegador
4. Pestaña **Respaldo → Descargar respaldo**: baja un JSON con todo. Útil para no perder tu trabajo antes de conectar Firebase

---

## 6. Estructura del proyecto

```
lacabana/
├── La Cabaña.html       — entrada (sitio + admin con ?admin=1)
├── data-store.js        — capa de datos (localStorage hoy, Firestore mañana)
├── admin-shell.jsx      — login + layout del admin
├── admin-tabs.jsx       — las 9 pestañas del admin
├── styles.css           — sistema de diseño
├── app.jsx              — router site/admin
├── components.jsx       — Shot, Reveal, Logo, etc.
├── nav.jsx              — navegación pública
├── hero.jsx             — hero con foto cabaña
├── section-*.jsx        — secciones del sitio
├── images/              — fotos hardcoded (hero, buffet, parrilla, madera)
├── uploads/             — archivos auxiliares
├── package.json         — metadata
├── vercel.json          — config de hosting
└── .gitignore
```

---

## 7. Pendientes después de Firebase

Cuando ya estemos en Firestore, lo siguiente es:

- Cablear las secciones restantes al store (hero, nav, promos, panadería, eventos, footer leen su contenido del admin)
- **Carrito → WhatsApp** para "comida para llevar"
- Mensajes de WhatsApp con el pedido pre-llenado
- Optimización de imágenes (Firebase Storage redimensiona automáticamente)
- SEO básico (open graph, sitemap)
- Migración a Vite (build real, primer paint 10× más rápido)

---

## Soporte

Si algo falla, contexto útil para depurar:
- **No carga el admin**: abre la consola del navegador (F12), revisa errores en rojo
- **Las imágenes que subí se borraron**: localStorage tiene límite (~5 MB total). Por eso vamos a Firebase Storage — sin límite práctico
- **El sitio se ve diferente en mi celular**: localStorage es por dispositivo y navegador. Con Firebase, todo se sincroniza
