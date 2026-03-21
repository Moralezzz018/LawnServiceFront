# LawnServiceFront

Landing page frontend para **Memphis Lawn Service**, generada inicialmente desde Figma Make y adaptada para ejecutarse como proyecto Vite + React.

## 1) ¿Qué tecnologías usa este proyecto?

### Núcleo de ejecución
- **Vite 6**: servidor de desarrollo y build de producción.
- **React 18** + **ReactDOM**: renderizado de la interfaz.
- **TypeScript 5**: tipado estático en archivos `.ts` y `.tsx`.

### Estilos y diseño
- **Tailwind CSS v4** (`@tailwindcss/vite`): utilidades CSS y pipeline integrado con Vite.
- **theme.css** con variables CSS (`:root`, `.dark`) para tokens de color, radios, tipografía y tema.
- **tw-animate-css**: utilidades de animación para componentes UI.

### UI y utilidades incluidas
- **lucide-react**: iconos.
- **Radix UI + utilidades shadcn/ui**: componentes accesibles base (actualmente muchos están en `src/app/components/ui` para uso futuro).
- Dependencias extra (MUI, recharts, react-hook-form, etc.) quedaron disponibles para evolución del proyecto.

---

## 2) ¿Cómo se relacionan entre sí?

Piensa el flujo así:

1. `index.html` crea el nodo raíz `#root`.
2. `src/main.tsx` monta React en `#root` y carga `src/styles/index.css`.
3. `src/styles/index.css` importa:
   - `fonts.css` (fuente Inter)
   - `tailwind.css` (motor Tailwind + escaneo de clases)
   - `theme.css` (tokens, capas base, variante dark)
4. `src/app/App.tsx` compone la landing con secciones:
   - `Navbar`
   - `Hero`
   - `Services`
   - `Gallery`
   - `Footer`
5. Cada sección vive en `src/app/components` y usa clases Tailwind + algunos iconos.

Resultado: **Vite sirve React**, React renderiza componentes, y Tailwind/theme.css definen el look final.

---

## 3) Estructura del frontend

```text
LawnServiceFront/
├─ index.html
├─ package.json
├─ vite.config.ts
├─ postcss.config.mjs
├─ tsconfig.json
├─ tsconfig.app.json
├─ tsconfig.node.json
└─ src/
   ├─ main.tsx
   ├─ app/
   │  ├─ App.tsx
   │  └─ components/
   │     ├─ Navbar.tsx
   │     ├─ Hero.tsx
   │     ├─ Services.tsx
   │     ├─ Gallery.tsx
   │     ├─ Footer.tsx
   │     ├─ figma/
   │     │  └─ ImageWithFallback.tsx
   │     └─ ui/ (librería de componentes para escalar)
   └─ styles/
      ├─ index.css
      ├─ fonts.css
      ├─ tailwind.css
      └─ theme.css
```

---

## 4) Scripts disponibles

- `npm run dev` → inicia el servidor local de desarrollo.
- `npm run build` → genera build de producción en `dist/`.
- `npm run preview` → levanta localmente la build de `dist/`.

---

## 5) Cómo levantar el proyecto localmente

1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Ejecutar en desarrollo:
   ```bash
   npm run dev
   ```
3. Abrir la URL que muestra Vite (normalmente `http://localhost:5173`).

Para probar build de producción:

```bash
npm run build
npm run preview
```

## Variables de entorno
- Usa `.env.example` para desarrollo local.
- Usa `.env.production.example` para despliegue.
- Variable requerida:
   - `VITE_API_URL` -> URL pública del backend, incluyendo `/api`.
   - Ejemplo: `https://api.tu-dominio.com/api`.

## Checklist previa a deploy
1. `VITE_API_URL` apunta al backend real.
2. Backend tiene `CORS_ORIGIN` con el dominio del frontend.
3. Ejecutar `npm run build` sin errores.
4. Validar en preview: login admin, módulo galería y dashboard análisis.

---

## 6) ¿Cómo “funciona completo” este frontend?

- Es un **frontend estático SPA simple** (single page) sin backend conectado.
- El contenido principal está hardcodeado en componentes (textos, imágenes, secciones).
- La navegación del menú usa anclas (`#home`, `#services`, etc.) dentro de la misma página.
- Cuando haces `build`, Vite empaqueta JS/CSS optimizado en `dist/assets` y deja `dist/index.html` listo para deploy estático.

Puedes desplegarlo en servicios estáticos como **Netlify, Vercel (modo static), GitHub Pages o Cloudflare Pages**.

---

## 7) Estado actual y próximos pasos sugeridos

Estado actual:
- Proyecto compila correctamente.
- Servidor local funcional.
- Base visual lista para iterar.

Próximos pasos típicos:
1. Conectar CTAs (`Get a Quote`) a formulario/WhatsApp.
2. Centralizar colores hardcodeados usando más tokens de `theme.css`.
3. Limpiar dependencias no usadas para reducir peso del proyecto.
4. Agregar SEO básico (meta description, OG tags, favicon, título por marca final).

---

## 8) Créditos

- Componentes de referencia desde Figma Make y shadcn/ui.
- Fotos de Unsplash (ver también `ATTRIBUTIONS.md`).
