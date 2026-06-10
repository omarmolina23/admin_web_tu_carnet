# TuCarnet — Panel de administración (Web)

Aplicación web de administración del sistema de carnet estudiantil digital de la UFPS. Permite a los administradores gestionar usuarios admin, estudiantes (incluido el perfil biométrico) y las solicitudes de cambio de foto del carnet.

## Tecnologías

- **React 19** + **Vite** + **TypeScript**
- **TanStack Query** (datos) y **TanStack Table** (tablas)
- **Tailwind CSS** + componentes **shadcn/ui** (Radix)
- **Zustand** (estado de sesión), **React Router**, **Axios**, **Sonner** (toasts)

## Secciones

- **Usuarios** — administradores del sistema (SuperAdmin / Validador): listar y crear.
- **Estudiantes** — lista con **búsqueda** (código, correo o nombre) y **filtro por estado biométrico**. En el detalle de un estudiante:
  - Revertir el **perfil biométrico** (vuelve a `PENDIENTE`, el estudiante repite el liveness).
  - Ver y resolver **sus solicitudes de cambio de foto** con comparativa de foto actual vs. nueva.
- **Solicitudes** — cola de solicitudes de foto **pendientes**, con comparativa de imágenes y aprobar/rechazar.

## Requisitos previos

- Node.js 20+ y npm
- El **backend** (`tucarnet_be`) y el **servicio de liveness** (`liveness_tucarnet_service`) desplegados o corriendo en local.

## Variables de entorno

Crea un archivo **`.env.local`** en la raíz:

```env
VITE_API_URL=https://tucarnetbe-production.up.railway.app
VITE_LIVENESS_URL=https://livenesstucarnetservice-production.up.railway.app
VITE_SIGNED_URL_EXPIRATION=600
```

| Variable | Descripción |
|---|---|
| `VITE_API_URL` | Base del backend. Las rutas ya incluyen `/api`, así que **no** lleva `/api` al final. |
| `VITE_LIVENESS_URL` | Base del servicio de liveness (para URLs firmadas de fotos). |
| `VITE_SIGNED_URL_EXPIRATION` | Validez en segundos de las URLs firmadas (opcional, default 600). |

## Puesta en marcha (local)

```bash
npm install
# crea el .env.local (ver arriba)
npm run dev
```

Disponible en `http://localhost:5173`. Para iniciar sesión necesitas un usuario administrador (ver más abajo).

Otros scripts:
```bash
npm run build     # type-check + build de producción (dist/)
npm run preview   # sirve el build de producción
npm run lint      # ESLint
```

## Autenticación

El login (`/login`) usa el endpoint `POST /api/admin/login` del backend y guarda el JWT en `localStorage` vía Zustand. Las peticiones protegidas lo envían en el header `Authorization`.

> El **primer administrador** no se puede crear desde la app (crear admins requiere ser SuperAdmin). Se inserta directamente en la base de datos (ver el script `scripts/create-admin.js` del backend `tucarnet_be`).

## Estructura

```
src/
  components/        UI (shadcn), Table, sidebar, layouts, header
  config/axios.ts    Cliente HTTP (baseURL + interceptor de auth)
  context/           Stores de Zustand (auth, ui)
  hooks/             useUser, useStudent, usePhotoRequest, useLiveness
  pages/             users, students, requests, Dashboard, Login
  services/          Auth, User, Student, PhotoRequest, Liveness
```

## Despliegue (Vercel)

1. Importa el repositorio en tu cuenta de **Vercel** (framework **Vite**: build `npm run build`, output `dist`).
2. Configura las **Environment Variables** (las tres de arriba).
3. Deploy. El `vercel.json` incluye el rewrite para que el enrutado SPA funcione.
