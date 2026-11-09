# Memphis Lawn Service — Frontend

Aplicación web React (Vite + TypeScript + Tailwind CSS) para Memphis Lawn Service.

## Inicio rápido

```bash
# Instalar dependencias
npm install

# Configurar API (copiar y editar)
cp .env.example .env
# → Editar VITE_API_URL con la URL del backend

# Desarrollo local
npm run dev
# → http://localhost:5173

# Build de producción
npm run build
# → Genera dist/

# Preview del build
npm run preview
```

## Variables de entorno

| Variable | Descripción | Ejemplo |
|---|---|---|
| `VITE_API_URL` | URL base del backend (incluye `/api`) | `https://lawnserviceback.onrender.com/api` |

## Secciones del sitio

| Sección | Descripción |
|---|---|
| **Hero** | Banner principal con llamada a la acción |
| **Services** | Catálogo de servicios ofrecidos |
| **Gallery** | Galería dinámica cargada desde la API con filtros por categoría |
| **Testimonials** | Carrusel de testimonios persistidos en la base de datos |
| **StatsBar** | Estadísticas clave del negocio |
| **Footer** | Información de contacto y redes sociales |

## Panel de administración

Accesible en `/admin`. Requiere credenciales de administrador.

Módulos disponibles: **Clientes**, **Galería**, **Análisis**, **Testimonios**.

## Stack

- React 18 + TypeScript
- Vite 6
- Tailwind CSS v4
- Radix UI / shadcn/ui
- Lucide React (iconos)
